/*
import AboutView from './components/AboutView'

// Sync route definition
export default {
  component : AboutView
}
*/

// import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : 'check/detail',
  name:'Check-detail-route',
  onEnter:()=>{ 
    localStorage.setItem('current-route',JSON.stringify({path:'detail',name:'Check-detail-route'}));
    console.log(this);
  },
  getComponent (nextState, cb) {    
    require.ensure([], (require) => {     
      const CheckDetail = require('./components/CheckDetail').default      

      /*  Return getComponent   */
      cb(null, CheckDetail)

    /* Webpack named bundle   */
    }, 'detail')
  }
})

