/*
import AboutView from './components/AboutView'

// Sync route definition
export default {
  component : AboutView
}
*/

// import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : 'priceadjust/detail',
  name:'priceadjust-detail-route',
  onEnter:()=>{ 
    localStorage.setItem('current-route',JSON.stringify({path:'detail',name:'priceadjust-detail-route'}));
    console.log(this);
  },
  getComponent (nextState, cb) {    
    require.ensure([], (require) => {     
      const PriceAdjustDetail = require('./components/PriceAdjustDetail').default      

      /*  Return getComponent   */
      cb(null, PriceAdjustDetail)

    /* Webpack named bundle   */
    }, 'detail')
  }
})

