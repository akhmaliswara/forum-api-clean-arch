const InvariantError = require('../../Commons/exceptions/InvariantError');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const { threadId, content, owner } = newComment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, owner, thread_id, content, is_deleted',
      values: [id, owner, threadId, content, false, new Date()],
    };

    const response = await this._pool.query(query);

    return new AddedComment({ ...response.rows[0] });
  }

  async getById(commentId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('comment tidak ditemukan');
    }

    return result.rows[0];
  }

  async getByThreadId(threadId) {
    const query = {
      text: `
        SELECT comments.id, owner, thread_id, content, is_deleted, date, username
        FROM comments JOIN users ON comments.owner = users.id
        WHERE thread_id = $1
      `,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async deleteComment(commentId) {
    const query = {
      text: 'UPDATE comments SET is_deleted = true WHERE id = $1',
      values: [commentId],
    }

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('comment tidak ditemukan');
    }

    return result.rows[0];
  }
}

module.exports = CommentRepositoryPostgres;
