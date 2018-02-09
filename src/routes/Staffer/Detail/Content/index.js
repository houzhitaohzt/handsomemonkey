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
  name:'Staffer-detail-route',
  onEnter:()=>{
    localStorage.setItem('current-route',JSON.stringify({path:'detail',name:'Staffer-detail-route'}));
    console.log(this);
  },
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const StafferDetail = require('./components/ProviderDetail').default

      /*  Return getComponent   */
      cb(null, StafferDetail)

    /* Webpack named bundle   */
    }, 'detail')
  }
})

