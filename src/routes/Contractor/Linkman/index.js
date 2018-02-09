/*
import AboutView from './components/AboutView'

// Sync route definition
export default {
  component : AboutView
}
*/

/*
import AboutView from './components/AboutView'

// Sync route definition
export default {
  component : AboutView
}
*/

// import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : 'linkman',
  name:'forwarder-linkman-route',
  onEnter:()=>{
    localStorage.setItem('current-route',JSON.stringify({path:'Linkman',name:'forwarder-linkman-route'}));
    console.log(this);
  },
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Linkman = require('./components/Linkman').default

      /*  Return getComponent   */
      cb(null, Linkman)

    /* Webpack named bundle   */
    }, 'linkman')
  }
})
