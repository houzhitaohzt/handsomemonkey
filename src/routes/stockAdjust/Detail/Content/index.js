/*
import AboutView from './components/AboutView'

// Sync route definition
export default {
  component : AboutView
}
*/

// import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : 'stockadjust/detail',
  name:'stockAdjust-detail-route',
  onEnter:()=>{ 
    localStorage.setItem('current-route',JSON.stringify({path:'detail',name:'stockAdjust-detail-route'}));
    console.log(this);
  },
  getComponent (nextState, cb) {    
    require.ensure([], (require) => {     
      const stockAdjustDetail = require('./components/stockAdjustDetail').default      

      /*  Return getComponent   */
      cb(null, stockAdjustDetail)

    /* Webpack named bundle   */
    }, 'detail')
  }
})

