import { injectReducer } from '../../../lib/store/reducers'

export default (store) => ({
  path : 'paymentApplication/list',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {

     /* const Counter = require('./containers/Container').default*/
      const PAList = require('./components/PAList').default

      /*  Add the reducer to the store on key 'counter'  */
      /*injectReducer(store, { key: 'login', reducer })*/

      /*  Return getComponent   */
      cb(null, PAList)

    /* Webpack named bundle   */
  }, 'paymentApplication-list')
  }
})
