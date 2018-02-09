/*
import AboutView from './components/AboutView'

// Sync route definition
export default {
  component : AboutView
}
*/

// import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : 'info',
  name:'platform-info-route',
  onEnter:()=>{ 
    localStorage.setItem('current-route',JSON.stringify({path:'info',name:'platform-info-route'}));
    console.log(this);
  },
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const SignInfo = require('./components/SignInfo').default

      /*  Return getComponent   */
      cb(null, SignInfo)

    /* Webpack named bundle   */
    }, 'SignInfo')
  }
})
