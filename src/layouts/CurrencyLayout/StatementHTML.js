import React,{Component,PorpTypes} from "react"
import "./assets/index.less";

import i18n from '../../lib/i18n';


import {apiGet,apiPost,apiForm,API_FOODING_ES,language,getQueryString} from '../../services/apiCall';
import ServiceTips from '../../components/ServiceTips';


class Statement extends Component{
	constructor(props){
		super(props);

		this.state = {
			classT:"", // class
			data: [], // get one 
		}
	}


	// 关闭 
	handleClose = ()=> {
		this.setState({classT:"close-trs"});
	}

	// 打开 
	handleOpen = ()=> {
		this.setState({classT:"open-trs"});
		this.getOne(); 
	}

	openHandle = (o)=>{
		window.navTabs.open(o['localName'],o['url'],{},{refresh: true})
	}

	// getOne 
    getOne = ()=> {
		let ID = getQueryString('menuID');

        apiGet(API_FOODING_ES,'/menu/getMenuByMainId',{mainId: ID},
            (response)=>{
                this.setState({data: response['data'] || []});
            },(errors)=>{
                ServiceTips({text:errors.message,type:'error'});
        });	
    }	

	render(){
		let that = this;
		let {data,classT} = this.state;

		return <div className={`${classT} global-statement`}>
			<span title={i18n.t(700139/*展开*/)} onClick={this.handleOpen}>{i18n.t(600235/*相关报表*/)}</span>
			<div>
				<ul className="scroll">
					{ data['length'] ? 
						data.map((o,i)=>{
							return  <li key={i} onClick={this.openHandle.bind(this,o)}>
								<i className={'foddingicon fooding-statement'}></i>
								<span>{o['localName']}</span>
							</li>
						}) 
						:
						<span>{i18n.t(700016/*空*/)}</span>						
					}

								
				</ul>
				<p><i onClick={this.handleClose} className={'foddingicon fooding-cancal-p'} title={i18n.t(100432/*关闭*/)}></i></p>
			</div>
		</div>
	}
}


export default Statement

