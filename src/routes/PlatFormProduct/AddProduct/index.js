import { injectReducer } from '../../../lib/store/reducers'

export default (store) => ({
  path : 'platform/product/edit',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {

     /* const Counter = require('./containers/Container').default*/
      const productadd = require('./components/AddProduct').default

      /*  Add the reducer to the store on key 'counter'  */
      /*injectReducer(store, { key: 'login', reducer })*/

      /*  Return getComponent   */
      cb(null, productadd)

    /* Webpack named bundle   */
  }, 'product-add')
  }
})
