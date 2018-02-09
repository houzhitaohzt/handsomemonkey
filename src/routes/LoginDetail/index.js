import { injectReducer } from '../../lib/store/reducers'

export default (store) => ({
  path : 'user/logindetail',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {

      const LoginDetail = require('./components/LoginDetail').default
      /*const reducer = require('./modules/login').default*/

      /*  Add the reducer to the store on key 'counter'  */
     /* injectReducer(store, { key: 'login', reducer })*/

      /*  Return getComponent   */
      cb(null, LoginDetail)

    /* Webpack named bundle   */
    }, 'logindetail')
  }
})



