/*
import AboutView from './components/AboutView'

// Sync route definition
export default {
  component : AboutView
}
*/

// import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : 'provider/productdetail',
  name:'provider-product-productdetail',
  onEnter:()=>{ 
    localStorage.setItem('current-route',JSON.stringify({path:'detail',name:'provider-product-productdetail'}));
    console.log(this);
  },
  getComponent (nextState, cb) {    
    require.ensure([], (require) => {     
      const ProductDetail = require('./components/Productdetail').default      

      /*  Return getComponent   */
      cb(null, ProductDetail)

    /* Webpack named bundle   */
    }, 'productdetail')
  }
})

