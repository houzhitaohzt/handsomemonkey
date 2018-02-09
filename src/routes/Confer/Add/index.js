import { injectReducer } from '../../../lib/store/reducers'

export default (store) => ({
  path : 'confer/add',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const ContDateAddEdit = require('./components/ContDateAddEdit').default
      // const reducer = require('./modules/counter').default

      /*  Add the reducer to the store on key 'counter'  */
      // injectReducer(store, { key: 'about', null })

      /*  Return getComponent   */
      cb(null, ContDateAddEdit)

    /* Webpack named bundle   */
  }, 'confer-add')
  }
})
