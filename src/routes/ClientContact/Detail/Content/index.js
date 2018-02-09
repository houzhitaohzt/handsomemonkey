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
  name:'clientcontact-detail-route',
  onEnter:()=>{ 
    localStorage.setItem('current-route',JSON.stringify({path:'detail',name:'ClientContact-detail-route'}));
    console.log(this);
  },
  getComponent (nextState, cb) {    
    require.ensure([], (require) => {     
      const ProviderDetail = require('./components/ProviderDetail').default      

      /*  Return getComponent   */
      cb(null, ProviderDetail)

    /* Webpack named bundle   */
    }, 'detail')
  }
})

