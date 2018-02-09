/*
import AboutView from './components/AboutView'

// Sync route definition
export default {
  component : AboutView
}
*/

// import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : 'groupe',
  name:'product-groupe-route',
  onEnter:()=>{ 
    localStorage.setItem('current-route',JSON.stringify({path:'Groupe',name:'product-groupe-route'}));
    console.log(this);
  },
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Groupe = require('./components/Groupe').default

      /*  Return getComponent   */
      cb(null, Groupe)

    /* Webpack named bundle   */
    }, 'groupe')
  }
})
