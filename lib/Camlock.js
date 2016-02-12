'use strict'

class Camlock {

  constructor () {
    this._internalLockCounter = 1
    this._lockStore = new Map()
  }

  /**
   * Tries to engage a lock for "lockName", can throw
   * @param  {any} lockName a name for the lock
   * @return {object}       An opaque token to be used for releasing the lock
   */
  get (lockName) {
    if (this._lockStore.has(lockName)) {
      throw new Error(`Lock already enagaged for ${lockName}`)
    }

    // opaque value
    // NOTE: should really increment per key/lock
    const token = {
      counter: this._internalLockCounter++
    }

    this._lockStore.set(lockName, token)

    return token
  }

  /**
   * release a previously engaged lock, can throw
   * @param  {any} lockName the name of the lock to release
   * @param  {object} token    the token issues when the lock was engaged
   */
  release (lockName, token) {
    if (token === undefined || token.counter === undefined) {
      throw new TypeError('invalid token supplied')
    }

    // TODO: should we soft fail here?
    if (this._lockStore.has(lockName) === false) {
      throw new Error(`Lock not currently enagaged for ${lockName}`)
    }

    // fetch token and compare
    // TODO: although overkill, we could probably compare counters
    const storedToken = this._lockStore.get(lockName)

    // NOTE: should we just compare counters (even though the token should be the same object)
    if (storedToken !== token) {
      throw new Error('wrong token supplied for lock release')
    }

    this._lockStore.delete(lockName)
  }

  /**
   * see if lock is currently in place for a given name
   * @param  {[type]}  lockName the name of the lock to check
   * @return {Boolean}          is there a lock in place
   */
  has (lockName) {
    return this._lockStore.has(lockName)
  }

  /**
   * validate that a lock and it's token are valid
   * @param  {[type]} lockName [description]
   * @param  {[type]} token    [description]
   * @return {[type]}          [description]
   */
  validate (lockName, token) {
    return this._lockStore.has(lockName) && this._lockStore.get(lockName) === token
  }
}

module.exports = Camlock
