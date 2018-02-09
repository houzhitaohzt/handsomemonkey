import React,{Component,PropTypes} from 'react';
import Page from "../../../../components/Page";//分页
import Table from "../../../../components/Table";//Table表格
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import FilterHeader from "./FilterHeader";
import FunctionKeys from "./FuncKeys";


import {apiGet,apiPost,apiForm,API_FOODING_HR,API_FOODING_ES,API_FOODING_DS,pageSize,sizeList} from '../../../../services/apiCall';
import Loading from "../../../../components/Loading";//加载动画
import ServiceTips from "../../../../components/ServiceTips";//提示框
import {I18n} from "../../../../lib/i18n";
import Checkbox from '../../../../components/CheckBox';


class StafferList extends Component{
	constructor(props){
		super(props);
		var that = this;

		this.state = {
			scrollHeight:0,
			data : [],
			pageSize:pageSize,
			currentPage:1,
			selectRecode:[], // 选中数据
		}

		this.columns = [{
			title: I18n.t(600250/*职员工号*/),
			dataIndex : 'id',
			key : "id",
			width : '15%',
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);
			}
		},{
			title : I18n.t(600251/*职员名称*/),
			dataIndex : "vendor",
			key : "vendor",
			width : "15%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);				
			}
		},{
			title: I18n.t(600252/*考勤卡号*/),
			dataIndex : "hscode",
			key : "hscode",
			width : "15%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);								
			}
		},{
			title: I18n.t(600253/*工作日*/),
			dataIndex : "enterDate",
			key : "enterDate",
			width : "10%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title: I18n.t(600254/*实际上班时间*/),
			dataIndex : "leaveDate",
			key : "leaveDate",
			width : "10%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title: I18n.t(600255/*实际下班时间*/),
			dataIndex : "leaveDate1",
			key : "leaveDate1",
			width : "10%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);								
				//return new Date(data).Format('yyyy-MM-dd');
			}
		}];

	}

	componentDidMount(){
		var that = this;
		this.getPage();
		this.handleResize();
		window.addEventListener('resize', this.handleResize);
    }

	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize);
	}

	handleResize = (e, height)=> {
        this.filterHeight = height || this.filterHeight || 50;
		let scroll = document.body.offsetHeight - 160 - this.filterHeight;
       	let scrollHeight = scroll + 10;
       	this.setState({scroll: scroll,scrollHeight:scrollHeight});
    }





	onSaveAndClose = (value,data,isAdd)=> {
		var that = this;
		this.getPage();
		this.onCancel();
	}

	onCancel = (that)=> {
		this.setState({
			rodalShow:false
		})
	}

	// checkbox 获取选中数据
	onChange = (row,target)=>{
		let that = this;
		let {selectRecode} = this.state;

		target.target['checked'] ? 
			that.setState({selectRecode:selectRecode.concat(row)}) 
			: 
			that.setState({selectRecode:selectRecode.filter(o=>o['id'] != row['id'])});
	}

	//请求列表  list
	getPage = (currentPage,order)=> {
		let that = this;	

		let currentP = currentPage || 1;
		let object=Object.assign({},{pageSize:this.state.pageSize,currentPage:currentP},that.normalRef.getForm());
		apiGet(API_FOODING_HR,'/attendResult/getPage',object,
			(response)=>{
				that.setState({
					data: response.data.data,
					totalPages: response.data.totalPages,
					totalRecords:response.data.totalRecords,
					currentPage: response.data.currentPage
				});
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});
	}


	render(){
		let that = this;
		let {active,page,currentPage,scroll} =this.state;
		
		return(<div>
			<FilterHeader normalRef={no => this.normalRef = no} getPage ={this.getPage}  expandFilter= {this.handleResize} info={this.state.info}/>
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				  <div className="action-buttons">
					<div className={'key-page'}>
						<FunctionKeys 
							that={this} 
							getPage={this.getPage} 

						/>						 
						<Page
							currentPage={this.state.currentPage}
							totalPages={this.state.totalPages}
							totalRecords={this.state.totalRecords}
							sizeList={sizeList}
							currentSize={this.state.pageSize}
							pageSizeChange={(num)=>{
								this.setState({ pageSize: Number.parseInt(num) },()=>this.getPage(1,num));
							}}
							backClick={(num)=>{
								this.setState({ currentPage: Number.parseInt(num) },()=>this.getPage(num));
							}}
							nextClick={(num)=>{
								this.setState({ currentPage: Number.parseInt(num) },()=>this.getPage(num));
							}}
							goChange={(num)=>{
								this.setState({ currentPage: Number.parseInt(num) },()=>this.getPage(num));
							}}
						/>
					</div>

					<div className="line"></div>
					<div className="train-action-buttons scroll" style={{height:this.state.scroll}}>
						{
							this.state.data.map((dataItem,i)=>{
								return(
								<div className="train" key={i}>
									<div className="top">
										<Checkbox className="terms-checkbox" style={{marginLeft:'20px'}} onChange={this.onChange.bind(that,dataItem)}/>
										<span className="font-hide" style={{flex:2,marginLeft:'20px'}}>
											<span style={{paddingRight:'5px'}}>{I18n.t(600257/*所属部门*/)}</span>
											<span style={{color:'#747d89'}} title={dataItem.depmnt ? dataItem.depmnt["localName"]:''} >{dataItem.depmnt ? dataItem.depmnt["localName"]:''}</span>
										</span>
										<span className="font-hide" style={{flex:2}}>
											<span style={{paddingRight:'5px'}}>{I18n.t(600250/*职员工号*/)}</span>
											<span style={{color:'#747d89'}} title={dataItem.emp ? dataItem.emp["code"] :''} >{dataItem.emp ? dataItem.emp["code"] :''}</span>
										</span>
										<span className="font-hide" style={{flex:2,marginLeft:'50px'}}>
											<span style={{paddingRight:'5px'}}>{I18n.t(600251/*职员名称*/)}</span>
											<span style={{color:'#747d89'}} title={dataItem.emp ? dataItem.emp["localName"] :''} >{dataItem.emp ? dataItem.emp["localName"] :''}</span>
										</span>
										<span className="font-hide" style={{flex:2}}>
											<span style={{paddingRight:'5px'}}>{I18n.t(600253/*工作日*/)}</span>
											<span style={{color:'#747d89'}} title={new Date(dataItem["scheduleDate"]).Format('yyyy-MM-dd')} >{new Date(dataItem["scheduleDate"]).Format('yyyy-MM-dd')}</span>
										</span>	
										<span className="font-hide" style={{flex:2}}>
											<span style={{paddingRight:'5px'}}>{I18n.t(600254/*实际上班时间*/)}</span>
											<span style={{color:'#747d89'}} title={dataItem["id"]} >{dataItem["officeTime"] || ''}</span>
										</span>
										<span className="font-hide" style={{flex:2,marginLeft:'50px'}}>
											<span style={{paddingRight:'5px'}}>{I18n.t(600255/*实际下班时间*/)}</span>
											<span style={{color:'#747d89'}} title={dataItem["id"]} >{dataItem["closingTime"] || ''}</span>
										</span>
										<span className="font-hide" style={{flex:2}}>
											<span style={{paddingRight:'5px'}}>{I18n.t(600272/*异常情况*/)}</span>
											<span style={{color:'#FF0000'}} title={dataItem["id"]} >{dataItem["valid"] ? I18n.t(100141/*是*/):I18n.t(100142/*否*/)}</span>
										</span>	
										<span className="font-hide" style={{flex:2}}>
										</span>																												
									</div>
									<div className="bottom">
										<span className="font-hide" style={{flex:2,marginLeft:'50px'}}>
											<span style={{paddingRight:'5px'}}>{I18n.t(600252/*考勤卡号*/)}</span>
											<span style={{color:'#747d89'}} title={dataItem["attendCard"]} >{dataItem["attendCard"]}</span>
										</span>
										<span className="font-hide" style={{flex:2}}>
											<span style={{paddingRight:'5px'}}>{I18n.t(600260/*班次*/)}</span>
											<span style={{color:'#747d89'}} title={dataItem.schedule ? dataItem.schedule["localName"]:''} >{dataItem.schedule ? dataItem.schedule["localName"]:''}</span>
										</span>									
										<span className="font-hide" style={{flex:2}}>
											<span style={{paddingRight:'5px'}}>{I18n.t(600261/*计划上班时间*/)}</span>
											<span style={{color:'#747d89'}} title={dataItem["plantOfficeTime"]} >{dataItem["plantOfficeTime"]}</span>
										</span>									
										<span className="font-hide" style={{flex:2}}>
											<span style={{paddingRight:'5px'}}>{I18n.t(600262/*计划下班时间*/)}</span>
											<span style={{color:'#747d89'}} title={dataItem["plantClosingTime"]} >{dataItem["plantClosingTime"]}</span>
										</span>
										<span className="font-hide" style={{flex:2}}>
											<span style={{paddingRight:'5px'}}>{`${I18n.t(600266/*迟到*/)}(M)`}</span>
											<span style={{color:'#747d89'}} title={dataItem["beLate"]} >{dataItem["beLate"]}</span>
										</span>
										<span className="font-hide" style={{flex:2}}>
											<span style={{paddingRight:'5px'}}>{`${I18n.t(600267/*早退*/)}(M)`}</span>
											<span style={{color:'#747d89'}} title={dataItem["leaveEarly"]} >{dataItem["leaveEarly"]}</span>
										</span>
										<span className="font-hide" style={{flex:2}}>
											<span style={{paddingRight:'5px'}}>{`${I18n.t(600268/*旷工*/)}(H)`}</span>
											<span style={{color:'#747d89'}} title={dataItem["absenteeism"]} >{dataItem["absenteeism"]}</span>
										</span>	
									</div>
									<div className="bottom">
										<span className="font-hide" style={{flex:2,marginLeft:'50px'}}>
											<span style={{paddingRight:'5px'}}>{`${I18n.t(600265/*加班时间*/)}(H)`}</span>
											<span style={{color:'#747d89'}} title={dataItem['overTime']} >{dataItem['overTime']}</span>
										</span>
										<span className="font-hide" style={{flex:2}}>
											<span style={{paddingRight:'5px'}}>{`${I18n.t(600269/*请假*/)}(H)`}</span>
											<span style={{color:'#747d89'}} title={dataItem["leaveTime"]} >{dataItem["leaveTime"]}</span>
										</span>																										
										<span className="font-hide" style={{flex:2}}>
											<span style={{paddingRight:'5px'}}>{`${I18n.t(600270/*标准工时*/)}(H)`}</span>
											<span style={{color:'#747d89'}} title={dataItem.schedule ? dataItem.schedule["manHour"]:''} >{dataItem.schedule ? dataItem.schedule["manHour"]:''}</span>
										</span>
										<span className="font-hide" style={{flex:2}}>
											<span style={{paddingRight:'5px'}}>{`${I18n.t(600271/*实际工时*/)}(H)`}</span>
											<span style={{color:'#747d89'}} title={dataItem["attendanceHour"]} >{dataItem["attendanceHour"]}</span>
										</span>	
										<span className="font-hide" style={{flex:2}}>
										</span>	
										<span className="font-hide" style={{flex:2}}>
										</span>	
										<span className="font-hide" style={{flex:2}}>
										</span>																																																									
									</div>								
								</div>
									)
							})
						}
					</div>
				</div>
				</div>
			</div>
		</div>)
	}
}
export default NavConnect(StafferList);

