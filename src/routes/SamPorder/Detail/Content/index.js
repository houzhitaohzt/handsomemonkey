/*
import AboutView from './components/AboutView'

// Sync route definition
export default {
  component : AboutView
}
*/

// import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : 'samporder/detail',
  name:'SamPorder-detail-route',
  onEnter:()=>{ 
    localStorage.setItem('current-route',JSON.stringify({path:'detail',name:'SamPorder-detail-route'}));
    console.log(this);
  },
  getComponent (nextState, cb) {    
    require.ensure([], (require) => {     
      const SamPorderDetail = require('./components/SamPorderDetail').default      

      /*  Return getComponent   */
      cb(null, SamPorderDetail)

    /* Webpack named bundle   */
    }, 'detail')
  }
})

