/*
import AboutView from './components/AboutView'

// Sync route definition
export default {
  component : AboutView
}
*/

// import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : 'pan/detail',
  name:'Check-detail-route',
  onEnter:()=>{ 
    localStorage.setItem('current-route',JSON.stringify({path:'detail',name:'Check-detail-route'}));
  },
  getComponent (nextState, cb) {    
    require.ensure([], (require) => {     
      const PanDetail = require('./components/PanDetail').default      

      /*  Return getComponent   */
      cb(null, PanDetail)

    /* Webpack named bundle   */
    }, 'detail')
  }
})

