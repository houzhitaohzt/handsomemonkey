// import { injectReducer } from '../../store/reducers'
export default (store) => ({
    path : 'shiftsettings/detail',
    name:'shiftsettings-detail-route',
    onEnter:()=>{
        localStorage.setItem('current-route',JSON.stringify({path:'detail',name:'shiftsettings-detail-route'}));
        console.log(this);
    },
    getComponent (nextState, cb) {
        require.ensure([], (require) => {
            const ShiftsettingsDetail = require('./components/ShiftsettingsDetail').default

            /*  Return getComponent   */
            cb(null, ShiftsettingsDetail)

            /* Webpack named bundle   */
        }, 'detail')
    }
})
