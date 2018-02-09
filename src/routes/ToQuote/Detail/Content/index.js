/*
import AboutView from './components/AboutView'

// Sync route definition
export default {
  component : AboutView
}
*/

// import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : 'purchasequote/detail',
  name:'Purchasequote-detail-route',
  onEnter:()=>{ 
    localStorage.setItem('current-route',JSON.stringify({path:'detail',name:'Purchasequote-detail-route'}));
    console.log(this);
  },
  getComponent (nextState, cb) {    
    require.ensure([], (require) => {     
      const PurchasequoteDetail = require('./components/PurchasequoteDetail').default      

      /*  Return getComponent   */
      cb(null, PurchasequoteDetail)

    /* Webpack named bundle   */
    }, 'detail')
  }
})

