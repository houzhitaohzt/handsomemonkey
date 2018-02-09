/*
import AboutView from './components/AboutView'

// Sync route definition
export default {
  component : AboutView
}
*/

// import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : 'strategy',
  name:'product-strategy-route',
  onEnter:()=>{ 
    localStorage.setItem('current-route',JSON.stringify({path:'Strategy',name:'product-strategy-route'}));
    console.log(this);
  },
  getComponent (nextState, cb) {    
    require.ensure([], (require) => {     
      const Strategy = require('./components/Strategy').default      

      /*  Return getComponent   */
      cb(null, Strategy)

    /* Webpack named bundle   */
    }, 'strategy')
  }
})
