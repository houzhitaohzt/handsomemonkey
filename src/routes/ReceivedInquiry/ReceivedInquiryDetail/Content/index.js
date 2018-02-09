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
  name:'receivedinquiry-detail-route',
  onEnter:()=>{ 
    localStorage.setItem('current-route',JSON.stringify({path:'detail',name:'receivedinquiry-detail-route'}));
    console.log(this);
  },
  getComponent (nextState, cb) {    
    require.ensure([], (require) => {     
      const ReceivedQuotationDetail = require('./components/ReceivedInquiryDetail').default      

      /*  Return getComponent   */
      cb(null, ReceivedQuotationDetail)

    /* Webpack named bundle   */
    }, 'detail')
  }
})

