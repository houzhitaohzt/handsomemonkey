/*
import AboutView from './components/AboutView'

// Sync route definition
export default {
  component : AboutView
}
*/

// import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : '/attendancecard/detail',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const AttendanceCard = require('./components/AttendanceCardDetail').default

      /*  Return getComponent   */
      cb(null, AttendanceCard)

    /* Webpack named bundle   */
    }, 'detail')
  }
})
