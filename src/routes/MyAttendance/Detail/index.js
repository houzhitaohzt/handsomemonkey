
/*
import AboutView from './components/AboutView'

// Sync route definition
export default {
  component : AboutView
}
*/

// import { injectReducer } from '../../store/reducers'

export default (store) => ({
    path : '/myattendance/detail',
    getComponent (nextState, cb) {
        require.ensure([], (require) => {
            const MyAttendanceDetail = require('./components/MyAttendanceDetail').default

            /*  Return getComponent   */
            cb(null, MyAttendanceDetail)

            /* Webpack named bundle   */
        }, 'myattendance-detail')
    }
})
