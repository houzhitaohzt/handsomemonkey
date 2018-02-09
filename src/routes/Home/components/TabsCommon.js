import i18n from './../../../lib/i18n';
/*
**任务模块
**/
import React, { Component,PropTypes } from 'react';
import { Router, Route, IndexRoute, hashHistory ,Link} from 'react-router';
const lazyLoad = () => {  
    return new Promise(resolve => {
        require.ensure(['../../../components/Tabs/assets/index.less','../../../styles/bitlayer/PressView.less',
        	'../../../styles/bitlayer/TaskView.less'], () => {
            resolve({
                 Tabs: require('../../../components/Tabs').default,
                 TabPane:require('../../../components/Tabs').TabPane ,
                 TabContent:require('../../../components/Tabs').TabContent,
                 ScrollableInkTabBar:require('../../../components/Tabs').ScrollableInkTabBar
            });
        });
    });
};

const  TaskView = React.createClass({
	getInitialState() {
	    return {
	      start: 0,
	    };
  	},
	onTabClick(key) {
    	// console.log(`onTabClick ${key}`);
  	},
	onChange(key) {
    	// console.log(`onChange ${key}`);
  	},
	componentDidMount() {
		this.proms=lazyLoad();
	  	this.proms.then((comps)=>{
	  		this.setState(comps);
	  	});

	},
	render(){
    let {tabs} = this.props;
    const start = this.state.start;
    const {Tabs, TabPane ,TabContent,ScrollableInkTabBar} =this.state;
    let els = tabs.map((value,i)=>{
       if(TabPane){
            return (
                 <TabPane tab={value.title} key= {i} placeholder="loading">
                    {value.content}
                </TabPane>
              );

       }else{
          return (
            <div>{i18n.t(200639/*数据正在加载*/)}</div>
          );
       }
        
    });
    	let com;
	    if(Tabs){
	    	com=(
			   <Tabs
		        defaultActiveKey="0"
		        destroyInactiveTabPane
	          prefixCls = "fooding-tabs"
		        renderTabBar={() => <ScrollableInkTabBar onTabClick={this.onTabClick}/>}
		        renderTabContent={() => <TabContent/>}
		        onChange={this.onChange}
		      >
            {els}
		      </Tabs>
			   );
	    }else{
	    	com=(<div></div>);
	    }
		return(
			<div className = 'index-bd-box hh-radius hh-pd0  shadow'>
			  {com} 
			</div>
		);
	}

});

export default TaskView;
