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
  name:'onlineorderseller-detail-route',
  onEnter:()=>{ 
    localStorage.setItem('current-route',JSON.stringify({path:'detail',name:'onlineorderseller-detail-route'}));
    console.log(this);
  },
  getComponent (nextState, cb) {    
    require.ensure([], (require) => {     
      const OnlineOrderSellerDetail = require('./components/OnlineOrderSellerDetail').default        

      /*  Return getComponent   */
      cb(null, OnlineOrderSellerDetail)

    /* Webpack named bundle   */
    }, 'detail')
  }
})

