export default (store) => ({
    path : '*',
    getComponent (nextState, cb) {
    require.ensure([], (require) => {
        /*  Webpack - use require callback to define
         dependencies for bundling   */
        const About = require('./components/FileNotFound').default

        cb(null, About)
        /* Webpack named bundle   */
    }, 'error')
}
})

