/*
import AboutView from './components/AboutView'

// Sync route definition
export default {
  component : AboutView
}
*/

// import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : 'stockin/detail',
  name:'StockIn-detail-route',
  onEnter:()=>{ 
    localStorage.setItem('current-route',JSON.stringify({path:'detail',name:'StockIn-detail-route'}));
    console.log(this);
  },
  getComponent (nextState, cb) {    
    require.ensure([], (require) => {     
      const StockInDetail = require('./components/StockInDetail').default      

      /*  Return getComponent   */
      cb(null, StockInDetail)

    /* Webpack named bundle   */
    }, 'detail')
  }
})

