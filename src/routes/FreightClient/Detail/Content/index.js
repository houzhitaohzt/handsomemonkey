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
  name:'client-detail-route',
  onEnter:()=>{
    localStorage.setItem('current-route',JSON.stringify({path:'cdetail',name:'client-detail-route'}));
    console.log(this);
  },
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const CDetailsContent = require('./components/CDetailsContent').default

      /*  Return getComponent   */
      cb(null, CDetailsContent)

    /* Webpack named bundle   */
    }, 'cdetail')
  }
})
