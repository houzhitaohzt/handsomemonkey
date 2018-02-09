/*
import AboutView from './components/AboutView'

// Sync route definition
export default {
  component : AboutView
}
*/

// import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : 'documentrequire',
  name:'CountryInformation-documentrequire-route',
  onEnter:()=>{
    localStorage.setItem('current-route',JSON.stringify({path:'Documentrequire',name:'CountryInformation-documentrequire-route'}));
    console.log(this);
  },
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Documentrequire = require('./components/Documentrequire').default

      /*  Return getComponent   */
      cb(null, Documentrequire)

    /* Webpack named bundle   */
    }, 'documentrequire')
  }
})
