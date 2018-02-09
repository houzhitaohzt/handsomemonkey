/*
import AboutView from './components/AboutView'

// Sync route definition
export default {
  component : AboutView
}
*/

/*
import AboutView from './components/AboutView'

// Sync route definition
export default {
  component : AboutView
}
*/

// import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : 'salesOrder(/:name)',
  name:'businessOpportunity-salesOrder-route',
  onEnter:()=>{
    localStorage.setItem('current-route',JSON.stringify({path:'salesOrder',name:'businessOpportunity-salesOrder-route'}));
    console.log(this);
  },
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const SalesOrder = require('./components/BODetailSalesOrder').default

      /*  Return getComponent   */
      cb(null, SalesOrder)

    /* Webpack named bundle   */
    }, 'salesOrder')
  }
})
