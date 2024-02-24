const InvariantError = require('../../Commons/exceptions/InvariantError')
const AddedLike = require('../../Domains/likes/entities/AddedLike')
const LikeRepository = require('../../Domains/likes/LikeRepository')

class LikeRepositoryPostgres extends LikeRepository {
  constructor (pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addLike (newLike) {
    const { commentId, owner } = newLike
    const id = `like-${this._idGenerator()}`

    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3) RETURNING id, owner, comment_id',
      values: [id, owner, commentId]
    }

    const response = await this._pool.query(query)

    return new AddedLike({ ...response.rows[0] })
  }

  async getByCommentAndOwner (commentId, ownerId) {
    const query = {
      text: 'SELECT * FROM likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, ownerId]
    }

    const result = await this._pool.query(query)

    return result.rows[0]
  }

  async getCountLikeByThreadId (threadId) {
    const query = {
      text: `
        SELECT likes.comment_id, COUNT(likes.id) AS like_count
        FROM likes JOIN comments ON likes.comment_id = comments.id 
        WHERE comments.thread_id = $1
        GROUP BY likes.comment_id
      `,
      values: [threadId]
    }

    const result = await this._pool.query(query)

    return result.rows
  }

  async deleteLike (likeId) {
    const query = {
      text: 'DELETE FROM likes WHERE id = $1 RETURNING id, owner, comment_id',
      values: [likeId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('like tidak ditemukan')
    }

    return result.rows[0]
  }
}

module.exports = LikeRepositoryPostgres
