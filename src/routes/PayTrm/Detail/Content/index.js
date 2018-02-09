/*
import AboutView from './components/AboutView'

// Sync route definition
export default {
  component : AboutView
}
*/

// import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : 'paytrm/detail',
  name:'paytrm-detail-route',
  onEnter:()=>{ 
    localStorage.setItem('current-route',JSON.stringify({path:'detail',name:'paytrm-detail-route'}));
    console.log(this);
  },
  getComponent (nextState, cb) {    
    require.ensure([], (require) => {     
      const PayTrmDetail = require('./components/PayTrmDetail').default      

      /*  Return getComponent   */
      cb(null, PayTrmDetail)

    /* Webpack named bundle   */
    }, 'detail')
  }
})

