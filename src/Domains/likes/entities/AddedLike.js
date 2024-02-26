class AddedLike {
  constructor (payload) {
    this._verifyPayload(payload)

    this.id = payload.id
    this.owner = payload.owner
  }

  _verifyPayload (payload) {
    const { id, owner } = payload

    if (!owner || !id) {
      throw new Error('ADDED_LIKE.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof id !== 'string' || typeof owner !== 'string') {
      throw new Error('ADDED_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = AddedLike
