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
  name:'Overtimeregister-detail-route',
  onEnter:()=>{
    localStorage.setItem('current-route',JSON.stringify({path:'detail',name:'Overtimeregister-detail-route'}));
    console.log(this);
  },
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Overtimeregister = require('./components/OvertimeregisterDetail').default

      /*  Return getComponent   */
      cb(null, Overtimeregister)

    /* Webpack named bundle   */
    }, 'detail')
  }
})
