/*
import AboutView from './components/AboutView'

// Sync route definition
export default {
  component : AboutView
}
*/

// import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : '/client/productdetail',
  name:'/client/productdetail',
  onEnter:()=>{ 
    localStorage.setItem('client/productdetail',JSON.stringify({path:'client/productdetail',name:'client/productdetail'}));
    console.log(this);
  },
  getComponent (nextState, cb) {    
    require.ensure([], (require) => {     
      const ProviderDetail = require('./components/ClientProductDetail').default      

      /*  Return getComponent   */
      cb(null, ProviderDetail)

    /* Webpack named bundle   */
    }, 'client/productdetail')
  }
})
