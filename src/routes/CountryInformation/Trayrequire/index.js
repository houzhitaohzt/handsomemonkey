/*
import AboutView from './components/AboutView'

// Sync route definition
export default {
  component : AboutView
}
*/

// import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : 'trayrequire',
  name:'CountryInformation-trayrequire-route',
  onEnter:()=>{ 
    localStorage.setItem('current-route',JSON.stringify({path:'Trayrequire',name:'CountryInformation-trayrequire-route'}));
    console.log(this);
  },
  getComponent (nextState, cb) {    
    require.ensure([], (require) => {     
      const Trayrequire = require('./components/Trayrequire').default      

      /*  Return getComponent   */
      cb(null, Trayrequire)

    /* Webpack named bundle   */
    }, 'trayrequire')
  }
})
