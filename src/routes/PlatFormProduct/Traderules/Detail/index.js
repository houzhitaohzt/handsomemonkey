
export default (store) => ({
  path : '/platform/product/traderules/detail',
  name:'product-traderules-detail',
  onEnter:()=>{ 
    localStorage.setItem('current-route',JSON.stringify({path:'Traderules',name:'product-traderules-detail'}));
    console.log(this);
  },
  getComponent (nextState, cb) {    
    require.ensure([], (require) => {     
      const Traderules = require('./components/TraderulesDetail').default      

      /*  Return getComponent   */
      cb(null, Traderules)

    /* Webpack named bundle   */
    }, 'traderulesdetail')
  }
})
