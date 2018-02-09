/*
import AboutView from './components/AboutView'

// Sync route definition
export default {
  component : AboutView
}
*/

/*
import AboutView from './components/AboutView'

// Sync route definition
export default {
  component : AboutView
}
*/

// import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : 'purchaseorder',
  name:'provider-purchaseorder-route',
  onEnter:()=>{
    localStorage.setItem('current-route',JSON.stringify({path:'Purchaseorder',name:'provider-purchaseorder-route'}));
    console.log(this);
  },
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Purchaseorder = require('./components/Purchaseorder').default

      /*  Return getComponent   */
      cb(null, Purchaseorder)

    /* Webpack named bundle   */
    }, 'purchaseorder')
  }
})
