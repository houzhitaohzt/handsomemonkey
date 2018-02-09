/*
import AboutView from './components/AboutView'

// Sync route definition
export default {
  component : AboutView
}
*/

// import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : 'gather/detail',
  name:'Gather-detail-route',
  onEnter:()=>{ 
    localStorage.setItem('current-route',JSON.stringify({path:'detail',name:'Gather-detail-route'}));
    console.log(this);
  },
  getComponent (nextState, cb) {    
    require.ensure([], (require) => {     
      const GatherDetail = require('./components/GatherDetail').default      

      /*  Return getComponent   */
      cb(null, GatherDetail)

    /* Webpack named bundle   */
    }, 'detail')
  }
})

