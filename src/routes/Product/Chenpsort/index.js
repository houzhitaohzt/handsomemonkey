/*
import AboutView from './components/AboutView'

// Sync route definition
export default {
  component : AboutView
}
*/

// import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : 'chenpsort',
  name:'product-chenpsort-route',
  onEnter:()=>{ 
    localStorage.setItem('current-route',JSON.stringify({path:'Chenpsort',name:'product-chenpsort-route'}));
    console.log(this);
  },
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Chenpsort = require('./components/Chenpsort').default

      /*  Return getComponent   */
      cb(null, Chenpsort)

    /* Webpack named bundle   */
    }, 'chenpsort')
  }
})
