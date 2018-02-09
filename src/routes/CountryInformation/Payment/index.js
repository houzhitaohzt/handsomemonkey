/*
import AboutView from './components/AboutView'

// Sync route definition
export default {
  component : AboutView
}
*/

// import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : 'payment',
  name:'CountryInformation-payment-route',
  onEnter:()=>{ 
    localStorage.setItem('current-route',JSON.stringify({path:'Payment',name:'CountryInformation-payment-route'}));
    console.log(this);
  },
  getComponent (nextState, cb) {    
    require.ensure([], (require) => {     
      const Payment = require('./components/Payment').default      

      /*  Return getComponent   */
      cb(null, Payment)

    /* Webpack named bundle   */
    }, 'payment')
  }
})
