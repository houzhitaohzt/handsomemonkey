/*
import AboutView from './components/AboutView'

// Sync route definition
export default {
  component : AboutView
}
*/

// import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : 'detail',
  name:'Booking-detail-route',
  onEnter:()=>{ 
    localStorage.setItem('current-route',JSON.stringify({path:'detail',name:'Booking-detail-route'}));
    console.log(this);
  },
  getComponent (nextState, cb) {    
    require.ensure([], (require) => {     
      const BookingDetail = require('./components/BookingDetail').default      

      /*  Return getComponent   */
      cb(null, BookingDetail)

    /* Webpack named bundle   */
    }, 'detail')
  }
})

