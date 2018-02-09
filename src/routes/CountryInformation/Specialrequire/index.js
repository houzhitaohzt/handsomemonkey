/*
import AboutView from './components/AboutView'

// Sync route definition
export default {
  component : AboutView
}
*/

// import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : 'specialrequire',
  name:'CountryInformation-specialrequire-route',
  onEnter:()=>{ 
    localStorage.setItem('current-route',JSON.stringify({path:'Specialrequire',name:'CountryInformation-specialrequire-route'}));
    console.log(this);
  },
  getComponent (nextState, cb) {    
    require.ensure([], (require) => {     
      const Specialrequire = require('./components/Specialrequire').default      

      /*  Return getComponent   */
      cb(null, Specialrequire)

    /* Webpack named bundle   */
    }, 'specialrequire')
  }
})
