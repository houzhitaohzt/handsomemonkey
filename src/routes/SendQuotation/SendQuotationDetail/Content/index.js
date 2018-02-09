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
  name:'sendquotation-detail-route',
  onEnter:()=>{ 
    localStorage.setItem('current-route',JSON.stringify({path:'detail',name:'sendquotation-detail-route'}));
    console.log(this);
  },
  getComponent (nextState, cb) {    
    require.ensure([], (require) => {     
      const SendQuotationDetail = require('./components/SendQuotationDetail').default      

      /*  Return getComponent   */
      cb(null, SendQuotationDetail)

    /* Webpack named bundle   */
    }, 'detail')
  }
})

