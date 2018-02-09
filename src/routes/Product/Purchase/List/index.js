/*
import AboutView from './components/AboutView'

// Sync route definition
export default {
  component : AboutView
}
*/

// import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : 'purchaseList',
  name:'product-purchase-list',
  onEnter:()=>{ 
    localStorage.setItem('current-route',JSON.stringify({path:'Purchase',name:'product-purchase-list'}));
    console.log(this);
  },
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Purchase = require('./components/PurchaseList').default

      /*  Return getComponent   */
      cb(null, Purchase)

    /* Webpack named bundle   */
    }, 'purchaseList')
  }
})
