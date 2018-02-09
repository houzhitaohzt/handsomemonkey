/*
import AboutView from './components/AboutView'

// Sync route definition
export default {
  component : AboutView
}
*/

// import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : 'inventoryList',
  name:'product-inventory-list',
  onEnter:()=>{ 
    localStorage.setItem('current-route',JSON.stringify({path:'Inventory',name:'product-inventory-list'}));
    console.log(this);
  },
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Inventory = require('./components/InventoryList').default

      /*  Return getComponent   */
      cb(null, Inventory)

    /* Webpack named bundle   */
    }, 'inventoryList')
  }
})
