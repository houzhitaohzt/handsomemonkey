/*
import AboutView from './components/AboutView'

// Sync route definition
export default {
  component : AboutView
}
*/

// import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : 'detail',
  name:'paymentApplication-detail-route',
  onEnter:()=>{ 
    localStorage.setItem('current-route',JSON.stringify({path:'detail',name:'paymentApplication-detail-route'}));
    console.log(this);
  },
  getComponent (nextState, cb) {    
    require.ensure([], (require) => {     
      const PADetail = require('./components/PADetail').default      

      /*  Return getComponent   */
      cb(null, PADetail)

    /* Webpack named bundle   */
    }, 'detail')
  }
})

