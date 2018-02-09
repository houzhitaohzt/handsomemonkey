/*
import AboutView from './components/AboutView'

// Sync route definition
export default {
  component : AboutView
}
*/

// import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : 'stockout/detail',
  name:'StockOut-detail-route',
  onEnter:()=>{ 
    localStorage.setItem('current-route',JSON.stringify({path:'detail',name:'StockOut-detail-route'}));
    console.log(this);
  },
  getComponent (nextState, cb) {    
    require.ensure([], (require) => {     
      const StockOutDetail = require('./components/StockOutDetail').default      

      /*  Return getComponent   */
      cb(null, StockOutDetail)

    /* Webpack named bundle   */
    }, 'detail')
  }
})

