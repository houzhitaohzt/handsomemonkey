import i18n from './../../../../lib/i18n';
import React,{Component, PropTypes} from "react";
import CheckBox from '../../../../components/CheckBox';
import FilterHead from './FilterHead';
import Table  from '../../../../components/Table';
import Page from "../../../../components/Page";
import Tabs from "../../Tabs";
class System extends Component{
	constructor(props){
		super(props);
		this.columns = [{
			title : i18n.t(200755/*标题*/),
			dataIndex : "direction",
			key : "direction",
			width : "11%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(200753/*重要级别*/),
			dataIndex : "theme",
			key : "theme",
			width : "49%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(200756/*日期*/),
			dataIndex : "starttime",
			key : "starttime",
			width : "16%",
			render(data,row,index){
				return (<div>{data}</div>)
			}
		}];
		this.state ={
			data:[{creatdate:i18n.t(200758/*张三*/),direction:'弘昊化工',theme:'AA',starttime:'2017-03-17'},
			{creatdate:i18n.t(200758/*张三*/),direction:'弘昊化工',theme:'AA',starttime:'2017-03-17'}]
		}
	}
	render(){
		return (<div className='message' style={{paddingRight:0}}>
			   <Tabs />
			  <div style={{flex:1}}>
			  	 <FilterHead />
			 	<div className="contact-body" style = {{height:document.body.offsetHeight - 155}}>
					<Page totalPages={10}/>
				<div className="action-contact-buttons">
					<Table
							columns={this.columns}
							scroll={{x:true,y:document.body.offsetHeight - 200}}
							data={this.state.data}
							onRowDoubleClick={this.onRowDoubleClick}
							checkboxConfig={{show:false}}
							colorFilterConfig={{show : false}}
							followConfig={{show:false}}
							style={{width:'100%'}}
					/>
				</div>
				</div>
			 </div>
		</div>)
	}

}
export default System;