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
  name:'Businessregistration-detail-route',
  onEnter:()=>{
    localStorage.setItem('current-route',JSON.stringify({path:'detail',name:'Businessregistration-detail-route'}));
    console.log(this);
  },
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Businessregistration = require('./components/BusinessregistrationDetail').default

      /*  Return getComponent   */
      cb(null, Businessregistration)

    /* Webpack named bundle   */
    }, 'detail')
  }
})
