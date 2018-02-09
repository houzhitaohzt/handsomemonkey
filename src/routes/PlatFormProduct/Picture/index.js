/*
import AboutView from './components/AboutView'

// Sync route definition
export default {
  component : AboutView
}
*/

// import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : 'picture',
  name:'platformproduct-picture-route',
  onEnter:()=>{ 
    localStorage.setItem('current-route',JSON.stringify({path:'picture',name:'platformproduct-picture-route'}));
  },
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const PlatProPicture = require('./components/PlatProPicture').default

      /*  Return getComponent   */
      cb(null, PlatProPicture)

    /* Webpack named bundle   */
    }, 'picture')
  }
})
