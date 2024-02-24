const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const NewLike = require('../../../Domains/likes/entities/NewLike');
const AddedLike = require('../../../Domains/likes/entities/AddedLike');
const pool = require('../../database/postgres/pool');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');

describe('LikeRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});
    await CommentsTableTestHelper.addComment({});
  });

  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addLike function', () => {
    it('should persist like and return added like correctly', async () => {
      // Arrange
      const newLike = new NewLike({
        commentId: 'comment-123',
        owner: 'user-123'
      });
      const fakeIdGenerator = () => '123'; // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedLike = await likeRepositoryPostgres.addLike(newLike);

      // Assert
      expect(addedLike).toStrictEqual(new AddedLike({
        id: 'like-123',
        owner: 'user-123',
      }));

      const likes = await LikesTableTestHelper.findLikesById('like-123');
      expect(likes).toHaveLength(1);
      expect(likes[0].id).toBe('like-123');
      expect(likes[0].owner).toBe('user-123');
    });
  });

  describe('getByCommentAndOwner function', () => {
    it('should throw InvariantError when like not found', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action & Assert
      like = await likeRepositoryPostgres.getByCommentAndOwner('comment-123', 'user-123')
      expect(like).toBeFalsy();
    });

    it('should return object when like is found', async () => {
      // Arrange
      const fakeIdGenerator = () => '123'; // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      await LikesTableTestHelper.addLike({
        id: 'like-123',
        owner: 'user-123',
        commentId: 'comment-123',
      });

      // Action & Assert
      const like = await likeRepositoryPostgres.getByCommentAndOwner('comment-123', 'user-123');
      expect(like).toBeInstanceOf(Object);
      expect(like.id).toBe('like-123');
      expect(like.owner).toBe('user-123');
    });
  });

  describe('getCountLikeByThreadId function', () => {
    it('should return 0 rows when thread id not found', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action & Assert
      const like = await likeRepositoryPostgres.getCountLikeByThreadId('thread-1234');
      expect(Array.isArray(like)).toBe(true);
      expect(like.length).toBe(0);
    });

    it('should return 1 rows when thread id found, and there is exactly 1 like in an comment', async () => {
      // Arrange
      const fakeIdGenerator = () => '123'; // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      await LikesTableTestHelper.addLike({
        id: 'like-123',
        owner: 'user-123',
        commentId: 'comment-123',
      });

      // Action & Assert
      const like = await likeRepositoryPostgres.getCountLikeByThreadId('thread-123');
      expect(Array.isArray(like)).toBe(true);
      expect(like.length).toBe(1);
      expect(+like[0].like_count).toBe(1);
    });
  });

  describe('deleteLike function', () => {
    it('should throw NotFound when likeId not found', () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(likeRepositoryPostgres.deleteLike(''))
        .rejects
        .toThrowError(InvariantError);
    });

    it('should success when like is found', async () => {
      // Arrange
      const fakeIdGenerator = () => '123'; // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      await LikesTableTestHelper.addLike({
        id: 'like-123',
        owner: 'user-123',
        commentId: 'comment-123',
      });

      // Action & Assert
      await likeRepositoryPostgres.deleteLike('like-123')
      like = await likeRepositoryPostgres.getByCommentAndOwner('comment-123', 'user-123')
      expect(like).toBeFalsy();
    });
  });
});
