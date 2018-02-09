export default (store) => ({
  path : 'receivedinquiry',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {

     /* const Counter = require('./containers/Container').default*/
      const ReceivedInquiry = require('./components/ReceivedInquiry').default

      /*  Add the reducer to the store on key 'counter'  */
      /*injectReducer(store, { key: 'login', reducer })*/

      /*  Return getComponent   */
      cb(null, ReceivedInquiry)

    /* Webpack named bundle   */
  }, 'receivedinquiry')
  }
})

