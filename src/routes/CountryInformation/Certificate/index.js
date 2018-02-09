/*
import AboutView from './components/AboutView'

// Sync route definition
export default {
  component : AboutView
}
*/

// import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : 'certificate',
  onEnter:()=>{ 
    localStorage.setItem('current-route',JSON.stringify({path:'Chenpsort',name:'countryinformation-certificate-route'}));
    console.log(this);
  },
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Certificate = require('./components/Certificate').default

      /*  Return getComponent   */
      cb(null, Certificate)

    /* Webpack named bundle   */
    }, 'certificate')
  }
})
