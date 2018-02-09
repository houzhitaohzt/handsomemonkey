/*
import AboutView from './components/AboutView'

// Sync route definition
export default {
  component : AboutView
}
*/

// import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : 'product',
  name:'provider-product-route',
  onEnter:()=>{ 
    localStorage.setItem('current-route',JSON.stringify({path:'Product',name:'provider-product-route'}));
    console.log(this);
  },
  getComponent (nextState, cb) {    
    require.ensure([], (require) => {     
      const Products = require('./components/Product').default      

      /*  Return getComponent   */
      cb(null, Products)

    /* Webpack named bundle   */
    }, 'product')
  }
})
