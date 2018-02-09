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
  path : 'sample(/:name)',
  name:'businessOpportunity-sample-route',
  onEnter:()=>{
    localStorage.setItem('current-route',JSON.stringify({path:'sample',name:'businessOpportunity-sample-route'}));
    console.log(this);
  },
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Sample = require('./components/SampleList').default

      /*  Return getComponent   */
      cb(null, Sample)

    /* Webpack named bundle   */
    }, 'sample')
  }
})
