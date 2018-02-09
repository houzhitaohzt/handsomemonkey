
export default (store) => ({
  path : 'detail(/:name)',
  name:'business-detail-route',
  onEnter:()=>{ 
    localStorage.setItem('current-route',JSON.stringify({path:'detail',name:'business-detail-route'}));
    console.log(this);
  },
  getComponent (nextState, cb) {    
    require.ensure([], (require) => {     
      const BusinessDetail = require('./components/BusinessOpportunityDetail').default      

      /*  Return getComponent   */
      cb(null, BusinessDetail)

    /* Webpack named bundle   */
    }, 'detail')
  }
})
