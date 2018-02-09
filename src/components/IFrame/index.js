
import IFrame from './IFrame';
export default IFrame;
export const Route = (store) => ({
    path : 'third/:name(/:id)',
    getComponent (nextState, cb) {
        require.ensure([], (require) => {
            cb(null, IFrame);
        }, 'IFrame')
    }
});
