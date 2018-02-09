// import { injectReducer } from '../../store/reducers'

export default (store) => ({
    path: 'price_parameters',
    /*  Async getComponent is only invoked when route matches   */
    getComponent (nextState, cb) {
        /*  Webpack - use 'require.ensure' to create a split point
         and embed an async module loader (jsonp) when bundling   */
        require.ensure([], (require) => {
            /*  Webpack - use require callback to define
             dependencies for bundling   */
            const PriceParameters = require('./components/PriceParameters').default
            // const reducer = require('./modules/counter').default

            /*  Add the reducer to the store on key 'counter'  */
            // injectReducer(store, { key: 'about', null })

            /*  Return getComponent   */
            cb(null, PriceParameters)

            /* Webpack named bundle   */
        }, 'pricepaprice_parametersrameter')
    }
})


