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
  name:'receivedquotation-detail-route',
  onEnter:()=>{ 
    localStorage.setItem('current-route',JSON.stringify({path:'detail',name:'receivedquotation-detail-route'}));
    console.log(this);
  },
  getComponent (nextState, cb) {    
    require.ensure([], (require) => {     
      const ReceivedQuotationDetail = require('./components/ReceivedQuotationDetail').default      

      /*  Return getComponent   */
      cb(null, ReceivedQuotationDetail)

    /* Webpack named bundle   */
    }, 'detail')
  }
})

