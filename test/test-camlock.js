'use strict'

const tap = require('tap')
const Camlock = require('../lib/Camlock')

tap.test('can get and release a lock', function (t) {
  const myLock = new Camlock()
  const lockname = 'zzxxyy'
  const lockToken = myLock.get(lockname)
  myLock.release(lockname, lockToken)
  t.end()
})

tap.test('can get and release multiple different locks', function (t) {
  const myLock = new Camlock()
  const locknames = [
        {},
    555,
    'fluff'
  ]

  const lockTokens = locknames.map(function (lname) {
    return myLock.get(lname)
  })

  lockTokens.forEach(function (token, idx) {
    myLock.release(locknames[idx], token)
  })
  t.end()
})

tap.test('locking same lock twice throws', function (t) {
  const myLock = new Camlock()
  myLock.get('dingle')
  t.throws(function () {
    myLock.get('dingle')
  }, Error('Lock already enagaged for dingle'))

  t.end()
})

tap.test('calling release with no token throws', function (t) {
  const myLock = new Camlock()
  myLock.get('something')
  t.throws(function () {
    myLock.release('something')
  }, TypeError('invalid token supplied'))
  t.end()
})

tap.test('releasing a lock without getting it throws', function (t) {
  const myLock = new Camlock()
  t.throws(function () {
    myLock.release('spongebob', {counter: 1})
  }, Error('Lock not currently enagaged for spongebob'))
  t.end()
})

tap.test('releasing a lock with the wrong token throws', function (t) {
  const myLock = new Camlock()
  const ruffleslockToken = myLock.get('ruffles')
  const pantipsLockToken = myLock.get('pantip') // eslint-disable-line no-unused-vars
  t.throws(function () {
    myLock.release('pantip', ruffleslockToken)
  }, Error('wrong token supplied for lock release'))
  t.end()
})

tap.test('can check for the existence of locks', function (t) {
  const myLock = new Camlock()
  t.false(myLock.has('something'))
  myLock.get('something')
  t.true(myLock.has('something'))
  t.end()
})
/**
 * WRITE A TEST FOR VALIDATE
 */
tap.test('can validate valid locks', function (t) {
  const myLock = new Camlock()
  const timslockToken = myLock.get('tim')
  const sarshsLockToken = myLock.get('sarah')
  t.false(myLock.validate('tim', sarshsLockToken))
  t.true(myLock.validate('tim', timslockToken))
  myLock.release('tim',timslockToken)
  t.false(myLock.validate('tim', timslockToken))
  t.end()
})