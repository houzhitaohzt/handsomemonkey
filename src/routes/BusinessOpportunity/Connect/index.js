export default (store) => ({
  path : '/businessOpportunity/contact(/:name)',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {

     /* const Counter = require('./containers/Container').default*/
      const BusinOppoContact = require('./components/BusinOppoContact').default

      /*  Add the reducer to the store on key 'counter'  */
      /*injectReducer(store, { key: 'login', reducer })*/

      /*  Return getComponent   */
      cb(null, BusinOppoContact)

    /* Webpack named bundle   */
  }, 'businessOpportunity-contact')
  }
})