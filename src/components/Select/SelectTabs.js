import React, { Component,PropTypes } from 'react';
import './assets/SelectTabs.less'

const lazyLoad = () => {
    return new Promise(resolve => {
        require.ensure([], () => {
            resolve({
                 Tabs: require('../Tabs').default,
                 TabPane:require('../Tabs').TabPane ,
                 TabContent:require('../Tabs').TabContent,
                 ScrollableInkTabBar:require('../Tabs').ScrollableInkTabBar
            });
        });
    });
};
class TabCon extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps() {
  }

  render() {
  	let {liOnChange} = this.props;
    const count = [1, 1, 1, 1,1,1,1];// new Array(4) skip forEach ....
    const els = count.map((c, i) => {
      return <li key={i} onClick = {liOnChange} value = {'CYY'+i}>
      			CYY{i}
      		 </li>;
    });
    return (<div className ='ul_content'>
         	<ul>
         		{els}
         	</ul>
        </div>);
  }
}

const SelectTabs = React.createClass({
	getInitialState() {
	    return ({
	    	inputValue:'CNY',
	    	start:0,
	    	visbled:false
	    })	
	},
	onTabClick(key) {
    	console.log(`onTabClick ${key}`);
    	this.setState({
			visbled:true
		});
  	},
	onChange(key) {
    	console.log(`onChange ${key}`);
    	this.setState({
			visbled:true
		});
  	},
	componentDidMount(){
		this.proms=lazyLoad();
	  	this.proms.then((comps)=>{
	  		this.setState(comps);
	  	});
	},
	onBlur(e){
		this.setState({
			visbled:false
		});
	},
	onFocus(num,event){
		this.setState({
			visbled:!this.state.visbled
		},()=>{
			document.getElementById("cc"+num).focus();
		});	
	},
	liOnChange(eve,that){
		this.setState({
			inputValue:eve.target.getAttribute("value"),
			visbled:false
		});
		this.props.change(eve.target.getAttribute("value"),this.props.num);
	},
	render(){
		const start = this.state.start;
		let {num,change} = this.props;
    	const {Tabs, TabPane ,TabContent,ScrollableInkTabBar} =this.state;
    	let com;
	    if(Tabs){
	    	com=(
			   <Tabs
		        defaultActiveKey="1"
		        destroyInactiveTabPane
	          prefixCls = "fooding-tabs"
		        renderTabBar={() => <ScrollableInkTabBar onTabClick={this.onTabClick}/>}
		        renderTabContent={() => <TabContent/>}
		        onChange={this.onChange}
		      >
		        <TabPane tab={`热门`} key="1"  placeholder="loading 1">
		          <TabCon id={start} liOnChange= {this.liOnChange}/>
		        </TabPane>
		        <TabPane tab={`ABCD`} key="2" placeholder="loading 2">
		          <TabCon id={start + 1} liOnChange= {this.liOnChange}/>
		        </TabPane>
		      </Tabs>
			   );
	    }else{
	    	com=(<div></div>);
	    }

		return (
			<div className = "select_tabs">
				<i onClick={this.onFocus.bind(this,this.props.num)} className = {this.state.visbled ? "ic-Pull":"foddingicon fooding-inputbox_arrow_16"}></i>
				<p onClick={this.onFocus.bind(this,this.props.num)} id = {"value"+num}>
					{this.state.inputValue}
				</p>
				<div tabIndex="-1" id = {"cc"+ this.props.num} className={this.state.visbled ?"content" :"content none"} 
				onBlur = {this.onBlur}>{com}</div>
			</div>
			);
	}
});

export default SelectTabs
