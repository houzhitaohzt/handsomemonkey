/*
import AboutView from './components/AboutView'

// Sync route definition
export default {
  component : AboutView
}
*/

// import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : 'detail',
  name:'platform-detail-route',
  onEnter:()=>{ 
    localStorage.setItem('current-route',JSON.stringify({path:'detail',name:'platform-detail-route'}));
    console.log(this);
  },
  getComponent (nextState, cb) {    
    require.ensure([], (require) => {     
      const ProCustomer = require('./components/ProCustomer').default      

      /*  Return getComponent   */
      cb(null, ProCustomer)

    /* Webpack named bundle   */
    }, 'ProCustomer')
  }
})

