import i18n from './../../../lib/i18n';
import React, {Component, PropTypes} from "react";
import Page from "../../../components/Page";//分页
const {Table} = require("../../../components/Table");//Table表格

class ProductOne extends Component{
	constructor(props){
		super(props)
		this.state=this.initState();
	}

	initState(){
		return {
		}
	}
	getPages = (currentPage,size) => {
		this.props.getpages(currentPage,size);
	}
	render(){
		let that = this;
		const {columns,data} = this.props;
		return(<div>
			<div className={'client-body'}>
			<div className={'client-body-single'}>
			<div className='action-buttons'>
				<div className={'key-page'} style={{padding:0,margin:0}}>
					<Page 
						currentPage={that.props.currentPage}
						totalPages={that.props.totalPages} 
						sizeList={that.props.sizeList}
						currentSize={that.props.pageSize}
						pageSizeChange={(num)=>{	
							if(that.props.currentPage == num) return;							
							that.getPages(this.props.currentPage,num);
						}} 
						backClick={(num)=>{
							if(that.props.currentPage == num) return;
							that.getPages(null,num);
						}} 
						nextClick={(num)=>{
							if(that.props.currentPage == num) return;
							that.getPages(num);									
						}}
						goChange={(num)=>{
							if(that.props.currentPage == num) return;
							that.getPages(num);																				
						}}								
					/>
				</div>
				<Table 
					columns={[{
						title : i18n.t(100000/*代码*/),
						dataIndex : 'code',
						key : "code",
						width : '20%',
						render(data,row,index){
							return (<div className="text-ellipsis" style={{width:'100px'}}>{data}</div>);
						}
					},{
						title : i18n.t(100001/*名称*/),
						dataIndex : "localName",
						key : "localName",
						width : "25%",
						render(data,row,index){
							return data;
						}
					},{
						title : i18n.t(200557/*规格*/),
						dataIndex : "specTxt",
						key : "specTxt",
						width : "40%",
						render(data,row,index){
							return (<div className="text-ellipsis" style={{width:'500px'}}>{data}</div>);
						}
					}]}
					data={data}
					checkboxConfig={{show:false}}
					followConfig={{show:false}}
					scroll={{x:false,y:false}}
				/>
				</div>
				</div>
			</div>
		</div>)
	}
}
export default ProductOne;
