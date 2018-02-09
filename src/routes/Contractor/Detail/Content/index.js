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
  name:'servbe-detail-route',
  onEnter:()=>{ 
    localStorage.setItem('current-route',JSON.stringify({path:'detail',name:'servbe-detail-route'}));
  },
  getComponent (nextState, cb) {    
    require.ensure([], (require) => {     
      const ProviderDetail = require('./components/ServBeDetail').default      

      /*  Return getComponent   */
      cb(null, ProviderDetail)

    /* Webpack named bundle   */
    }, 'detail')
  }
})

