import { injectReducer } from '../../lib/store/reducers'

export default (store) => ({
  path : 'storagetransacttype',

  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {

     /* const Counter = require('./containers/Container').default*/
      const StorageTransactType = require('./components/StorageTransactType').default

      /*  Add the reducer to the store on key 'counter'  */
      /*injectReducer(store, { key: 'login', reducer })*/

      /*  Return getComponent   */
      cb(null, StorageTransactType)

    /* Webpack named bundle   */
  }, 'storagetransacttype')
  }
})

