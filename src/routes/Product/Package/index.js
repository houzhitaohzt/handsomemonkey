/*
import AboutView from './components/AboutView'

// Sync route definition
export default {
  component : AboutView
}
*/

// import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : 'package',
  name:'product-package-route',
  onEnter:()=>{ 
    localStorage.setItem('current-route',JSON.stringify({path:'Package',name:'product-package-route'}));
    console.log(this);
  },
  getComponent (nextState, cb) {    
    require.ensure([], (require) => {     
      const Package = require('./components/Package').default      

      /*  Return getComponent   */
      cb(null, Package)

    /* Webpack named bundle   */
    }, 'package')
  }
})
