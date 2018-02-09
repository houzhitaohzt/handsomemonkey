/*
import AboutView from './components/AboutView'

// Sync route definition
export default {
  component : AboutView
}
*/

// import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : 'confer/detail',
  name:'Confer-detail-route',
  onEnter:()=>{ 
    localStorage.setItem('current-route',JSON.stringify({path:'detail',name:'Confer-detail-route'}));
  },
  getComponent (nextState, cb) {    
    require.ensure([], (require) => {     
      const ExpenseAccountDetail = require('./components/ConferDetail').default      

      /*  Return getComponent   */
      cb(null, ExpenseAccountDetail)

    /* Webpack named bundle   */
    }, 'confer')
  }
})

