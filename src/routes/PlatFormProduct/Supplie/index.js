/*
import AboutView from './components/AboutView'

// Sync route definition
export default {
  component : AboutView
}
*/

// import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : 'supplie',
  name:'product-supplie-route',
  onEnter:()=>{ 
    localStorage.setItem('current-route',JSON.stringify({path:'Supplie',name:'product-supplie-route'}));
    console.log(this);
  },
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Supplie = require('./components/Supplie').default

      /*  Return getComponent   */
      cb(null, Supplie)

    /* Webpack named bundle   */
    }, 'supplie')
  }
})
