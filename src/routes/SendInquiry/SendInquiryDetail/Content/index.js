/*
import AboutView from './components/AboutView'

// Sync route definition
export default {
  component : AboutView
}
*/

// import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : 'detail(/:name)',
  name:'sendinquiry-detail-route',
  onEnter:()=>{ 
    localStorage.setItem('current-route',JSON.stringify({path:'detail',name:'sendquotation-detail-route'}));
    console.log(this);
  },
  getComponent (nextState, cb) {    
    require.ensure([], (require) => {     
      const SendInquiryDetail = require('./components/SendInquiryDetail').default      

      /*  Return getComponent   */
      cb(null, SendInquiryDetail)

    /* Webpack named bundle   */
    }, 'detail')
  }
})

