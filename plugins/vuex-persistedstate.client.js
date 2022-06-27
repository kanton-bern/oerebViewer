import merge from 'deepmerge'

/**
 * this plugin is based on vuex-persistedstate package.
 * as it is not maintained anymore, we have to use our own implementation.
 */

// https://github.com/robinvdvleuten/shvl
const shvl = {
  get(object, path, def) {
    return (object = (path.split ? path.split('.') : path).reduce(function (
      obj,
      p
    ) {
      return obj && obj[p]
    },
    object)) === undefined
      ? def
      : object
  },
  set(object, path, val, obj) {
    return (
      ((path = path.split ? path.split('.') : path.slice(0))
        .slice(0, -1)
        .reduce(function (obj, p) {
          return !/^(__proto__|constructor|prototype)$/.test(p)
            ? (obj[p] = obj[p] || {})
            : {}
        }, (obj = object))[path.pop()] = val),
      object
    )
  },
}

// https://github.com/robinvdvleuten/vuex-persistedstate
const createPersistedState = (options) => {
  options = options || {}

  const storage = options.storage || (window && window.localStorage)
  const key = options.key || 'vuex'

  function getState(key, storage) {
    const value = storage.getItem(key)

    try {
      return typeof value === 'string'
        ? JSON.parse(value)
        : typeof value === 'object'
        ? value
        : undefined
    } catch (err) {}

    return undefined
  }

  function filter() {
    return true
  }

  function setState(key, state, storage) {
    return storage.setItem(key, JSON.stringify(state))
  }

  function reducer(state, paths) {
    return Array.isArray(paths)
      ? paths.reduce(function (substate, path) {
          return shvl.set(substate, path, shvl.get(state, path))
        }, {})
      : state
  }

  function subscriber(store) {
    return function (handler) {
      return store.subscribe(handler)
    }
  }

  const assertStorage =
    options.assertStorage ||
    (() => {
      storage.setItem('@@', 1)
      storage.removeItem('@@')
    })

  assertStorage(storage)

  const fetchSavedState = () => (options.getState || getState)(key, storage)

  let savedState

  if (options.fetchBeforeUse) {
    savedState = fetchSavedState()
  }

  return function (store) {
    if (!options.fetchBeforeUse) {
      savedState = fetchSavedState()
    }

    if (typeof savedState === 'object' && savedState !== null) {
      store.replaceState(
        options.overwrite
          ? savedState
          : merge(store.state, savedState, {
              arrayMerge:
                options.arrayMerger ||
                function (store, saved) {
                  return saved
                },
              clone: false,
            })
      )
      ;(options.rehydrated || function () {})(store)
    }

    ;(options.subscriber || subscriber)(store)(function (mutation, state) {
      if ((options.filter || filter)(mutation)) {
        ;(options.setState || setState)(
          key,
          (options.reducer || reducer)(state, options.paths),
          storage
        )
      }
    })
  }
}

export default ({ store }) => {
  createPersistedState({
    key: 'history',
    paths: ['history.properties'],
  })(store)
}
