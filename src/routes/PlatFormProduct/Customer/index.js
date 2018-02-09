/*
import AboutView from './components/AboutView'

// Sync route definition
export default {
  component : AboutView
}
*/

// import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : 'customer',
  name:'product-customer-route',
  onEnter:()=>{ 
    localStorage.setItem('current-route',JSON.stringify({path:'Customer',name:'product-customer-route'}));
    console.log(this);
  },
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Customer = require('./components/Customer').default

      /*  Return getComponent   */
      cb(null, Customer)

    /* Webpack named bundle   */
    }, 'customer')
  }
})
