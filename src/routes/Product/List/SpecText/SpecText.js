import React,{Component,PropTypes} from 'react';
import FreeScrollBar from "../../../Client/List/components/FreeScrollBar";
const {Table} = require("../../../../components/Table");//Table表格
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';

class SpecText extends Component{
	constructor(props){
		super(props)
		this.state = {
			mtlQaitems:[]
		}
	}

	initMtlQailtem = mtlId => {
		let that = this;
		if(!mtlId) return;
		apiGet(API_FOODING_DS,'/mtlQaitem/getPage',{mtlId:mtlId,order:'asc',column:'weight'},response => {
				that.setState({
					mtlQaitems:response.data.data || []
				})
			},error => {
				ServiceTips({text:error.message,type:'error'});
			}, {isLoading: false})
	}
	componentDidMount(){
		this.initMtlQailtem(this.props.id)
	}
	componentWillReceiveProps(nextProps){
		if(nextProps.id !== this.props.id){
			this.initMtlQailtem(nextProps.id);
		}
	}
	render(){
		let listDom = this.state.mtlQaitems.map((e,i) => {
			return (<ul  className={'spectext-card-single'} key={e.id || i} >
					<li className={'spectext-card-single-left'}>{e.qaItem && e.qaItem.localName || ''}</li>
					<li className={'spectext-card-single-right'}>{(e.calSymBol&&e.calSymBol.name || "") + (e.maxQaValue || "")}</li>
				</ul>)
		})
		return(<div className={'spectext-card'}>
			<div>
				<Table
						columns={[{
							title :" ",
							dataIndex : 'qaItem',
							key : "qaItem",
							className:'text-right',
							tooltip: false,
							render(data,row,index){
								return <div>{data?data.localName:''}</div>;
							}
						},{
							title :"",
							dataIndex : 'calSymBol',
							key : "calSymBol",
							tooltip: false,
							render(data,row,index){
								return <div>{data?data.name:''}</div>;
							}
						},{
							title : "",
							dataIndex : 'maxQaValue',
							key : "maxQaValue",
							className:'text-left',
							tooltip: false,
							render(data,row,index){
								return <div>{data}</div>;
							}
						}]}
						data={this.state.mtlQaitems||[]}
						checkboxConfig={{show:false}}
						showHeader={false}
						scroll={{x:false,y:0}}
					/>
			</div>

		</div>)
	}
}
export default SpecText;
