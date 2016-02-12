# camlock
a basic in-process lock for nodejs V5+ (and maybe also v4)

I wrote this primarily for mucking about and trying a few things so it's
usefulness to you may vary but feel free to use it however you want to.

It's primarily designed for creating locks when you want to prevent concurrent 
execution of blocks of code, most likely during/around asychronous calls such 
as network/disk i/o. If code incorrectly tries to get/release a lock this module
will throw, so this is probably useful when you just want to guard against
incorrect behaviour in fairly bang sort of way.

## Installation

This is a scoped packaged so you need to be using a recent-ish version of `npm` (probably v2 at minimum)

```
npm install [--save] @sandfox/camlock
```

## Usage

A simple example:

```
const Camlock = require('@sandfox/camlock')

const myLockManager = new Camlock()

const myLockToken = myLockManager.get('update-xy')

// Do things etc
myLockManager.release('update-xy', myLockToken)
```

__Acquire a lock__

```
const Camlock = require('@sandfox/camlock')
const myLockManager = new Camlock()
const myLockToken = myLockManager.get('some-key')
```

`Camlock#get` takes anything as first argument to be used as the lock key. The underlying storage system is a `Map`
so keep that in mind wit regards to equality comparision. The function returns an _opaque_ token represented by an object, don't interefer with it, you'll need this exact token later to release the lock.

__Release a lock__

```
const Camlock = require('@sandfox/camlock')
const myLockManager = new Camlock()
const myLockToken = myLockManager.get('db-write')
myLockManager.release('db-write', myLockToken)
```

`Camlock#release` takes whatever value was used to get the lock (or anything equal to that as far as `Map` thinks) as the first arguement, and the token returned when getting the lock. Trying to release a lock on a key that has no lock will throw, as will not supplying the token, or supplying an incorrect token / expired.

__See if a lock exists__

```
const Camlock = require('@sandfox/camlock')
const myLockManager = new Camlock()
myLockManager.has('db-write') // returns false
const myLockToken = myLockManager.get('db-write')
myLockManager.has('db-write') // returns true
myLockManager.release('db-write', myLockToken)
myLockManager.has('db-write') // returns false
```

`Camlock#has` takes the lockname as the first argument. returns boolean.


__See if a lock token is valid__

```
const Camlock = require('@sandfox/camlock')
const myLockManager = new Camlock()
const myLockToken = myLockManager.get('db-write')
myLockManager.validate('db-write') // returns false
myLockManager.validate('db-write', {}) // returns false
myLockManager.validate('db-write', myLockToken) // returns true
myLockManager.release('db-write', myLockToken)
myLockManager.validate('db-write', myLockToken) // returns false
```

`Camlock#validate` takes the lockname as the first argument, token as the second and validates that the token is valid for the lockname. returns boolean.

# License

See the 'LICENSE' file
