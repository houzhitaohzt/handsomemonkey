export default (store) => ({
    path: 'report/tools(/:id)',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            const Report = require('./components/Report').default;
            cb(null, Report)
        }, 'retrieve')
    }
})
