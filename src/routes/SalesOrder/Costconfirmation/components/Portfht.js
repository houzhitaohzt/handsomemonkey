import i18n from './../../../../lib/i18n';
import React,{Component,PropTypes} from 'react';
import Page from "../../../../components/Page";//分页
import Dialog from '../../../../components/Dialog/Dialog';//弹层
const {Table} = require("../../../../components/Table");//Table表格
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
import {browserHistory} from 'react-router';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import FunctionKeys from "./FuncKeys";
import {getQueryString,permissionsBtn,apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList, API_FOODING_ERP} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips'; // 提示
class Portfht extends Component{
	constructor(props){
		super(props);
        props.costconfirmation && props.costconfirmation(this);
		this.handleResize = this.handleResize.bind(this);
		this.addClick=this.addClick.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.confirmClick = this.confirmClick.bind(this);
		this.tuihuiClick = this.tuihuiClick.bind(this);
		var that = this;
			this.columns = [{
			title : i18n.t(500121/*费用名称*/),
			dataIndex : 'costName',
			key : "costName",
			width : '10%',
			render(data,row,index){
				return (<div title={data} className={'text-ellipsis'}>{data}</div>)
			}
		},{
			title : i18n.t(200321/*实际金额*/),
			dataIndex : "amt",
			key : "amt",
			width : "20%",
			className:'text-right',
			render(data,row,index){
				return data+' ' + row["cny"];
			}
		},{
			title : i18n.t(100336/*备注*/),
			dataIndex : "remark",
			key : "remark",
			width : "20%",
			className:'text-center',
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(100230/*状态*/),
			dataIndex : "status",
			key : "status",
			width : "15%",
			render(data,row,index){

				if( data == 1 ) return <div>{i18n.t(600184/*销售确认*/)}</div>;
				if( data == 2 ) return <div>{i18n.t(600185/*经理确认*/)}</div>;
				if( data == 10 ) return <div>{i18n.t(600186/*主管确认*/)}</div>;

				return <div>{' '}</div>;				
			}
		},{
			title : i18n.t(200098/*操作*/),
			dataIndex : "actAgg",
			key : "actAgg",
			width : "15%",
			className:'text-center',
			render(data,row,index){
				return <div style={{fontSize: '18px',color: '#b39595'}}>
						{/*{row.isConfirmed ?'':
							//<i onClick={that.confirmClick.bind(that,row)} style={{marginRight:'10px'}} className='foddingicon fooding-confirm' title={i18n.t(201066*//*确认费用*//*)}></i>
						//}*/}

						{ permissionsBtn('sorder.salesconfirmation') ? <i onClick={that.affirmClick.bind(that,1,row)} style={{marginRight:'10px'}} className='foddingicon fooding-affirm-I' title={i18n.t(600184/*销售确认*/)}></i> : ''}
						{ permissionsBtn('sorder.mangerconfirmation') ? <i onClick={that.affirmClick.bind(that,2,row)} style={{marginRight:'10px'}} className='foddingicon fooding-affirm-II' title={i18n.t(600185/*经理确认*/)}></i> : ''}
						{ permissionsBtn('sorder.executiveconfirmation') ? <i onClick={that.affirmClick.bind(that,3,row)} style={{marginRight:'10px'}} className='foddingicon fooding-affirm-III' title={i18n.t(600186/*主管确认*/)}></i> : ''}
				</div>;
			}
		}];
		this.state = {
			scrollHeight:0,
			filter:null,
			rodalShow:false,
			pageSize:pageSize,
			currentPage:1,
			id:this.props.location.query.id,
			buttonLeft:i18n.t(100429/*保存并关闭*/),
			contentTemplate:<div></div>,
			checkedData:'',
			data : [],
			cnyArray:[],
			saleNo:this.props.location.query.saleNo
		}
		this.getPage= this.getPage.bind(this);
		this.pdFunction = this.pdFunction.bind(this);

	}
	pdFunction(cnyArray,data){
		let that = this;
		for(var j=0;j<cnyArray.length;j++){
			if(cnyArray[j].cny==data){
				 return j;
			}
		}
		return false;
	}
	confirmClick(row,e){
		let that = this;
		e.stopPropagation();
		let billIds=[];
		billIds.push(row.billId);
		Confirm(i18n.t(300068/*您确定要确认费用吗？*/), {
			  done: () => {
				   	apiForm(API_FOODING_ERP,'/costconfirmation/confirm',{billIds:billIds.join(',')},(response)=>{
						that.getPage();
						ServiceTips({text:response.message,type:'success'});
						},(error)=>{
										ServiceTips({text:error.message,type:'error'});
						})
				},
				close:() => {
					console.log('no, close')
				}
			});

	}
	tuihuiClick(){
		let that = this;
		let numArr = this.refs.protfht.getSelectArr();
		let billIds = [];
		numArr.map((e)=>{
			billIds.push(e.billId);
		})
		if(numArr.length == 0){
			ServiceTips({text:i18n.t(200328/*请选择一条数据进行操作*/),type:'error'});
		}else {
			Confirm(i18n.t(500324/*你确定执行费用退回操作吗?*/), {
			  done: () => {
				    apiForm(API_FOODING_ERP,'/costconfirmation/back',{billIds:billIds.join(',')},(response)=>{
						that.getPage();
						ServiceTips({text:response.message,type:'success'});
					},(error)=>{
						ServiceTips({text:error.message,type:'error'});
					})
				},
				close:() => {
					console.log('no, close')
				}
			});

		}

	}
	addClick(){
		let that = this;
		let numArr = this.refs.protfht.getSelectArr();
		let billIds = [];
		numArr.map((e)=>{
			billIds.push(e.billId);
		})
		if(numArr.length == 0){
			ServiceTips({text:i18n.t(200328/*请选择一条数据进行操作*/),type:'error'});
		}else {
			Confirm(i18n.t(300068/*您确定要确认费用吗？*/), {
			  done: () => {
				    apiForm(API_FOODING_ERP,'/costconfirmation/confirm',{billIds:billIds.join(',')},(response)=>{
						that.getPage();
						ServiceTips({text:response.message,type:'success'});
					},(error)=>{
						ServiceTips({text:error.message,type:'error'});
					})
				},
				close:() => {
					console.log('no, close')
				}
			});

		}
	}
	onSaveAndClose(){
		this.getPage();
		this.onCancel();
	}
	onCancel(that){
		this.setState({
			rodalShow:false
		})
	}
	getPage(sID){
		  let that = this;
			let object=Object.assign({},{saleNo:that.props.getOne.no});
			apiGet(API_FOODING_ERP,'/costconfirmation/getList',object,
				(response)=>{
						var clone = require('clone');
					let dd = clone(response.data)||[];
					let data = clone(response.data);
					let cnyArray = [];
					for(var i = 0 ;i < dd.length;i++){
						  if(that.pdFunction(cnyArray,dd[i].cny) === false){
									cnyArray.push(dd[i]);
							}else{
								  cnyArray[that.pdFunction(cnyArray,dd[i].cny)]["amt"] +=dd[i].amt;
							}
					}
					that.setState({
						data: response.data || [],
						cnyArray:cnyArray
					});
				},(errors)=>{
			});
	}
	handleResize(height){
		let sch=document.body.offsetHeight-326;
        let scroll = sch;
		this.setState({scrollHeight:sch+'px',scroll:scroll});
	}
	componentDidMount(){
		if(!this.props.isDetail){
            this.getPage();
		}
		window.addEventListener('resize', this.handleResize(47));
    };
	componentWillUnmount() {
		// window.removeEventListener('resize', this.handleResize(47));
	}

	// 判断 选中 
	selectRow = (row)=>{

		if( row['length'] < 1 ) {
			ServiceTips({text:i18n.t(100434/*请选择一条数据！*/),type:'error'});
			return false;
		}

		return true;
	}

	// 通知上级 
	informClick = ()=>{
		let that = this;

		Confirm(i18n.t(500327/*你确定通知上级吗?*/), {
			done: () => {
				apiForm(API_FOODING_ERP,'/saleorder/confirmNotice',{billId:getQueryString('id')},
					(response)=>{
						ServiceTips({text:response.message,type:'success'});
						that.getPage();
					},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
				});	
			},
			close:() => {
				// console.log('no, close');
			}
		});

	}

	// 销售确认 经理确认 主管确认
	affirmClick = (num,record)=>{
		let that = this;
		let row = record['billId'] ? Array.of(record) : this.refs.protfht.getSelectArr();

		if( !this.selectRow(row) ) return; // 判断选中数据

		switch (num) {
			case 1: // 销售确认
				var title = i18n.t(600184/*销售确认*/);
				var param = {status:1};
			break;
			case 2: // 经理确认
				var title = i18n.t(600185/*经理确认*/);
				var param = {status:2};
			break; 
			case 3: // 主管确认
				var title = i18n.t(600186/*主管确认*/);
				var param = {status:10};
			break;					
			default:
				break;
		}

		Confirm(i18n.t(600182/*您确认要*/)+ title, {
			done: () => {
				apiForm(API_FOODING_ERP,'/costconfirmation/confirm',Object.assign({billIds:row.map((o)=>o['billId'])},param),
					(response)=>{
						ServiceTips({text:response.message,type:'success'});
						that.getPage();
					},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
				});	
			},
			close:() => {
				// console.log('no, close')
			}
		});
	}



	render(){
		let  that = this;
		let {scroll} = this.state;

		return(<div>
			<div style={{height:this.state.scrollHeight}}>
				<div className='content-margin'></div>
				<div className={'client-body'}>
				  <div className="action-buttons">
					<div className={'key-page'}>
						<FunctionKeys addClick={this.addClick} tuihuiClick ={this.tuihuiClick} informClick={this.informClick} affirmIClick={this.affirmClick.bind(this,1)} affirmIIClick={this.affirmClick.bind(this,2)} affirmIIIClick={this.affirmClick.bind(this,3)}/>
						{
							this.state.cnyArray.map((e,i)=>{
								 return <span key={i} style={{marginRight:'15px',lineHeight:'40px'}}>{e.amt+' '+e.cny}</span>
							})
						}
					</div>

					<Table
					    ref ='protfht'
						columns={this.columns}
						data={this.state.data}
						checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						colorFilterConfig={{show : false,dataIndex:'colorType'}}
						followConfig={{show:false}}
						scroll={{x:true,y:scroll}}
						//singleSelect ={true}
						contextMenuConfig={{
								enable:true,
								contextMenuId:'SIMPLE_TABLE_MENU'
						}}
					/>

				</div>
			</div>
		</div>
		</div>
	)
	}
}
export default NavConnect(Portfht);
