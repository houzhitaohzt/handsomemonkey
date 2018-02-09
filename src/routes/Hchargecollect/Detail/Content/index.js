/*
import AboutView from './components/AboutView'

// Sync route definition
export default {
  component : AboutView
}
*/

// import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : 'hchargecollect/detail',
  name:'hchargecollect-detail-route',
  onEnter:()=>{ 
    localStorage.setItem('current-route',JSON.stringify({path:'detail',name:'hchargecollect-detail-route'}));
  },
  getComponent (nextState, cb) {    
    require.ensure([], (require) => {     
      const ExpenseAccountDetail = require('./components/ChargeDetail').default      

      /*  Return getComponent   */
      cb(null, ExpenseAccountDetail)

    /* Webpack named bundle   */
    }, 'detail')
  }
})

