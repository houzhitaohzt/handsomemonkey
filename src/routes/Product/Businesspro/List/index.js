/*
import AboutView from './components/AboutView'

// Sync route definition
export default {
  component : AboutView
}
*/

// import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : 'businessprolist',
  name:'product-businesspro-list',
  onEnter:()=>{ 
    localStorage.setItem('current-route',JSON.stringify({path:'Businesspro',name:'product-businesspro-list'}));
    console.log(this);
  },
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Businesspro = require('./components/BusinessList').default

      /*  Return getComponent   */
      cb(null, Businesspro)

    /* Webpack named bundle   */
    }, 'businessprolist')
  }
})
