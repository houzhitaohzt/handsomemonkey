import { injectReducer } from '../../lib/store/reducers'

export default (store) => ({
  path : 'user/loginold',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure(['../../lib/i18n'], (require) => {

      const Counter = require('./containers/Container').default
      const reducer = require('./modules/login').default

      /*  Add the reducer to the store on key 'counter'  */
      injectReducer(store, { key: 'loginold', reducer })

      /*  Return getComponent   */
      cb(null, Counter)

    /* Webpack named bundle   */
    }, 'loginold')
  }
})



