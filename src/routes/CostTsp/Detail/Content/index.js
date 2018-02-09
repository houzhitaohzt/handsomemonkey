/*
import AboutView from './components/AboutView'

// Sync route definition
export default {
  component : AboutView
}
*/

// import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : 'costtsp/detail',
  name:'CostTsp-detail-route',
  onEnter:()=>{ 
    localStorage.setItem('current-route',JSON.stringify({path:'detail',name:'CostTsp-detail-route'}));
    console.log(this);
  },
  getComponent (nextState, cb) {    
    require.ensure([], (require) => {     
      const CostTspDetail = require('./components/CostTspDetail').default      

      /*  Return getComponent   */
      cb(null, CostTspDetail)

    /* Webpack named bundle   */
    }, 'costtsp-detail')
  }
})

