
export default (store) => ({
    path: 'report/list',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            const Report = require('./components/ReportList').default;
            cb(null, Report)
        }, 'ReportList')
    }
})
