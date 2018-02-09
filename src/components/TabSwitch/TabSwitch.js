/**
create by houzhitao
use by very simple Tabs switch
*/

import React, {Component, PropTypes} from "react";
import "./tabswitch.less";

class TabSwith extends Component{
	constructor(props){
		super(props);
		this.state=this.initState();
	}
	static propTypes = {
		onTabClick:React.PropTypes.func,
		prefixCls:React.PropTypes.string,
		TabSwitchArray:React.PropTypes.array,
		requireAddIcon:React.PropTypes.bool,
		onRequierAddClick:React.PropTypes.func,
		onCloseClick:React.PropTypes.func,
		requireCloseIcon:React.PropTypes.bool,
		onTabClick:React.PropTypes.func
	}
	static defaultProps = {
			activeTab:0,
			prefixCls:'rc-tabswitch',
			TabSwitchArray:[],
			requireAddIcon:false, //是否需要添加icon
			onRequierAddClick:() => {}, //添加函数
			onCloseClick:() => {}, //每一个标签关闭
			requireCloseIcon:false,  //是否要关闭标签
			onTabClick:() => {}
	}
	initState(){
		return {
			activeTab:0
		}
	}
	onTabClick(i,obj){
		let {activeTab} = this.state, currentTab;
		currentTab = i;
		if(currentTab == activeTab) return false;
		this.setState({
			activeTab:currentTab
		})
		this.props.onTabClick();
	}
	onCloseClick = (index, event, a) => {
		event.preventDefault();
		event.stopPropagation();
		this.props.onCloseClick(index);
	}
	componentWillReceiveProps(nextProps){
		let activeTab = this.state.activeTab;
		if(nextProps.TabSwitchArray.length < 1) return false;
		if(parseInt(activeTab + 1) > nextProps.TabSwitchArray.length) this.setState({activeTab:parseInt(activeTab - 1)});

    }
	render(){
		const prefixCls = this.props.prefixCls;
		let activeTab = this.state.activeTab;
		return(<div className={`${prefixCls}`}>
			<ul className={`${prefixCls}-title`}>
				{
					this.props.TabSwitchArray.map((value,i) => {
						return (<li onClick={this.onTabClick.bind(this,i,value)} key={value.index || i} className={activeTab==i?`${prefixCls}-title-single active`:`${prefixCls}-title-single`}>{value.title}
								<span className={this.props.requireCloseIcon ? ( i !== 0 ? "close" : "close-none" ) : "close-none" } onClick={this.onCloseClick.bind(this,i)}>x</span>
							</li>)
					})
				}
				{
					this.props.requireAddIcon?<li onClick={this.props.onRequierAddClick} className={`${prefixCls}-title-single-add`}><i className={"foddingicon fooding-add-icon3"} title={"add"}></i></li>:<div></div>	
				}
				
			</ul>
			<div className={`${prefixCls}-content`}>
				{
					this.props.TabSwitchArray.map((value,i) => 
						<div key={value.index || i} style={{display: i === activeTab ? 'inherit' : 'none'}}>
							{value.content}
						</div>
					)
				}
				
			</div>
		</div>)
	}
}
export default TabSwith;
