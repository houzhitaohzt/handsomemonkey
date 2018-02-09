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
  name:'pruchaseorder-detail-route',
  onEnter:()=>{ 
    localStorage.setItem('current-route',JSON.stringify({path:'detail',name:'pruchaseorder-detail-route'}));
    console.log(this);
  },
  getComponent (nextState, cb) {    
    require.ensure([], (require) => {     
      const PruchaseOrderDetail = require('./components/PruchaseOrderDetail').default      

      /*  Return getComponent   */
      cb(null, PruchaseOrderDetail)

    /* Webpack named bundle   */
    }, 'detail')
  }
})

