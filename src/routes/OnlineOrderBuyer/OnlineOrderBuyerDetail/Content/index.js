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
  name:'onlineorderbuyer-detail-route',
  onEnter:()=>{ 
    localStorage.setItem('current-route',JSON.stringify({path:'detail',name:'onlineorderbuyer-detail-route'}));
    console.log(this);
  },
  getComponent (nextState, cb) {    
    require.ensure([], (require) => {     
      const OnlineOrderBuyerDetail = require('./components/OnlineOrderBuyerDetail').default      

      /*  Return getComponent   */
      cb(null, OnlineOrderBuyerDetail)

    /* Webpack named bundle   */
    }, 'detail')
  }
})

