import React, { Component,PropTypes } from 'react';
const {Table} =  require("../Table");
export class OnlyreadyRuleTemplate extends Component{
	constructor(props) {
		super(props);
		this.state=this.initState();
	}
	initState(){
		return{
			data:[]
		}
	}
	render(){
		let {array,title, tableRef}= this.props;
		if(this.props.data.length == 0){
			return (
				<div style={{width: '100%',overflow:'hidden',backgroundColor: '#fff',borderRadius: '6px',
				boxShadow: '0px 2px 0px #dadada',marginBottom:10}} className='product-measurement'>
					<div className='item-title'><span className='title'>{title}</span>
					</div>
				</div>)
		}else{
		    let checkboxConfig = this.props.checkboxConfig || {show:false};
			return (
			<div style={{width: '100%',backgroundColor: '#fff',borderRadius: '6px',zIndex:this.props.Zindex,
			boxShadow: '0px 2px 0px #dadada',marginBottom:10,position:"relative"}} className='product-measurement readyRuleTemplate'>
				<div>
					<div className='item-title'>
						<span className='title'>{title}</span>
					</div>
				</div>
				<Table showHeader ={this.props.showHeader} ref={tableRef}
					 checkboxConfig={checkboxConfig}
							columns={this.props.columns}
							data={this.props.data}
							 scroll={{x: true, y: 200}}
						/>
			</div>
			)
		}
	}
}

export default OnlyreadyRuleTemplate;
