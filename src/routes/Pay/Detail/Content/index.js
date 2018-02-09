/*
import AboutView from './components/AboutView'

// Sync route definition
export default {
  component : AboutView
}
*/

// import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : 'pay/detail',
  name:'Pay-detail-route',
  onEnter:()=>{ 
    localStorage.setItem('current-route',JSON.stringify({path:'detail',name:'Pay-detail-route'}));
    console.log(this);
  },
  getComponent (nextState, cb) {    
    require.ensure([], (require) => {     
      const PayDetail = require('./components/PayDetail').default      

      /*  Return getComponent   */
      cb(null, PayDetail)

    /* Webpack named bundle   */
    }, 'detail')
  }
})

