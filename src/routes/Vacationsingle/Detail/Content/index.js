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
  name:'vacationsingle-detail-route',
  onEnter:()=>{
    localStorage.setItem('current-route',JSON.stringify({path:'detail',name:'vacationsingle-detail-route'}));
    console.log(this);
  },
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const VacationsingleDetail = require('./components/VacationsingleDetail').default

      /*  Return getComponent   */
      cb(null, VacationsingleDetail)

    /* Webpack named bundle   */
    }, 'detail')
  }
})
