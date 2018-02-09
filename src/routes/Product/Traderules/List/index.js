/*
import AboutView from './components/AboutView'

// Sync route definition
export default {
  component : AboutView
}
*/

// import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : 'traderules',
  name:'product-traderules-route',
  onEnter:()=>{ 
    localStorage.setItem('current-route',JSON.stringify({path:'Traderules',name:'product-traderules-route'}));
    console.log(this);
  },
  getComponent (nextState, cb) {    
    require.ensure([], (require) => {     
      const Traderules = require('./components/Traderules').default      

      /*  Return getComponent   */
      cb(null, Traderules)

    /* Webpack named bundle   */
    }, 'traderules')
  }
})
