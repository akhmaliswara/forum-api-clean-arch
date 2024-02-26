class NewLike {
  constructor (payload) {
    this._verifyPayload(payload)

    this.commentId = payload.commentId
    this.owner = payload.owner
  }

  _verifyPayload (payload) {
    const { commentId, owner } = payload

    if (!commentId || !owner) {
      throw new Error('NEW_LIKE.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof commentId !== 'string' || typeof owner !== 'string') {
      throw new Error('NEW_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = NewLike
