import { injectReducer } from '../../lib/store/reducers'

export default (store) => ({
  path : 'user/loginonestep',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {

      const LoginOneStep = require('./components/LoginOneStep').default
      /*const reducer = require('./modules/login').default*/

      /*  Add the reducer to the store on key 'counter'  */
     /* injectReducer(store, { key: 'login', reducer })*/

      /*  Return getComponent   */
      cb(null, LoginOneStep)

    /* Webpack named bundle   */
    }, 'loginonestep')
  }
})



