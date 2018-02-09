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
  name:'SalesOrder-detail-route',
  onEnter:()=>{ 
    localStorage.setItem('current-route',JSON.stringify({path:'detail',name:'SalesOrder-detail-route'}));
    console.log(this);
  },
  getComponent (nextState, cb) {    
    require.ensure([], (require) => {     
      const SalesOrderDetail = require('./components/SalesOrderDetail').default      

      /*  Return getComponent   */
      cb(null, SalesOrderDetail)

    /* Webpack named bundle   */
    }, 'detail')
  }
})

