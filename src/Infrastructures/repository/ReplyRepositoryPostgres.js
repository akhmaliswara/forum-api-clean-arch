const InvariantError = require('../../Commons/exceptions/InvariantError')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const AddedReply = require('../../Domains/replies/entities/AddedReply')
const ReplyRepository = require('../../Domains/replies/ReplyRepository')

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor (pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addReply (newReply) {
    const { commentId, content, owner } = newReply
    const id = `reply-${this._idGenerator()}`

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6) RETURNING id, owner, comment_id, content, is_deleted',
      values: [id, owner, commentId, content, false, new Date()]
    }

    const response = await this._pool.query(query)

    return new AddedReply({ ...response.rows[0] })
  }

  async getById (replyId) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [replyId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('reply tidak ditemukan')
    }

    return result.rows[0]
  }

  async getByThreadId (threadId) {
    const query = {
      text: `
        SELECT replies.id, replies.owner, replies.comment_id, thread_id, replies.content, replies.is_deleted, replies.date, username
        FROM replies JOIN users ON replies.owner = users.id JOIN comments ON replies.comment_id = comments.id
        WHERE thread_id = $1
        ORDER BY replies.date
      `,
      values: [threadId]
    }

    const result = await this._pool.query(query)

    return result.rows
  }

  async verifyAvailableReplyId (replyId) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1',
      values: [replyId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('reply tidak tersedia')
    }
  }

  async deleteReply (replyId) {
    const query = {
      text: 'UPDATE replies SET is_deleted = true WHERE id = $1 RETURNING id, owner, comment_id, content, is_deleted',
      values: [replyId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('reply tidak ditemukan')
    }

    return result.rows[0]
  }
}

module.exports = ReplyRepositoryPostgres
