// import { injectReducer } from '../../store/reducers'
export default (store) => ({
    path : 'pinfakesingle/detail',
    name:'pinfakesingle-detail-route',
    onEnter:()=>{
        localStorage.setItem('current-route',JSON.stringify({path:'detail',name:'pinfakesingle-detail-route'}));
        console.log(this);
    },
    getComponent (nextState, cb) {
        require.ensure([], (require) => {
            const PinfakesingleDetail = require('./components/PinfakesingleDetail').default

            /*  Return getComponent   */
            cb(null, PinfakesingleDetail)

            /* Webpack named bundle   */
        }, 'detail')
    }
})
