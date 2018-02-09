/*
import AboutView from './components/AboutView'

// Sync route definition
export default {
  component : AboutView
}
*/

// import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : 'inspection',
  onEnter:()=>{
    localStorage.setItem('current-route',JSON.stringify({path:'inspection',name:'countryinformation-inspection-route'}));
    console.log(this);
  },
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Inspection = require('./components/Inspection').default

      /*  Return getComponent   */
      cb(null, Inspection)

    /* Webpack named bundle   */
    }, 'inspection')
  }
})
