/*
import AboutView from './components/AboutView'

// Sync route definition
export default {
  component : AboutView
}
*/

// import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : 'shipmark',
  name:'CountryInformation-shipmark-route',
  onEnter:()=>{ 
    localStorage.setItem('current-route',JSON.stringify({path:'Shipmark',name:'CountryInformation-shipmark-route'}));
    console.log(this);
  },
  getComponent (nextState, cb) {    
    require.ensure([], (require) => {     
      const Shipmark = require('./components/Shipmark').default      

      /*  Return getComponent   */
      cb(null, Shipmark)

    /* Webpack named bundle   */
    }, 'shipmark')
  }
})
