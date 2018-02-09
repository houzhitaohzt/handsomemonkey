/*
import AboutView from './components/AboutView'

// Sync route definition
export default {
  component : AboutView
}
*/

/*
import AboutView from './components/AboutView'

// Sync route definition
export default {
  component : AboutView
}
*/

// import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : 'price(/:name)',
  name:'businessOpportunity-price-route',
  onEnter:()=>{
    localStorage.setItem('current-route',JSON.stringify({path:'price',name:'businessOpportunity-price-route'}));
    console.log(this);
  },
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Price = require('./components/BODetailPrice').default

      /*  Return getComponent   */
      cb(null, Price)

    /* Webpack named bundle   */
    }, 'price')
  }
})
