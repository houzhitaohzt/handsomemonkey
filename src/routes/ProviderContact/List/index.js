import { injectReducer } from '../../../lib/store/reducers'

export default (store) => ({
  path : 'providercontact',

  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {

     /* const Counter = require('./containers/Container').default*/
      const providercontact = require('./components/ProviderContactList').default

      /*  Add the reducer to the store on key 'counter'  */
      /*injectReducer(store, { key: 'login', reducer })*/

      /*  Return getComponent   */
      cb(null, providercontact)

    /* Webpack named bundle   */
  }, 'providercontact')
  }
})

