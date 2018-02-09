import i18n from './../../../../lib/i18n';
import React,{Component,PropTypes} from 'react';
import Page from "../../../../components/Page";//分页
import Dialog from '../../../../components/Dialog/Dialog';//弹层
const {Table} = require("../../../../components/Table");//Table表格
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
import {browserHistory} from 'react-router';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import FilterHeader from "./FilterHeader";
import FunctionKeys from "./FuncKeys";
import MyAttendanceDetailPlug from './MyAttendanceDetailPlug';
import Checkbox from '../../../../components/CheckBox';
// ajax
import {permissionsBtn,apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_HR,language,pageSize,sizeList,copy,toDecimal} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
class MyAttendanceDetail extends Component{
	constructor(props){
		super(props);
		this.columns = [];
		this.state = {
			scrollHeight:0,
			filter:null,
			selectArr:[],
			checkedRows:[],
			choised:false,
			MeunState:true,
			rodalShow:false,
			showSaveAdd:false,
			showSaveClose:true,
			buttonLeft:i18n.t(100429/*保存并关闭*/),
			contentTemplate:<div></div>,
			checkedData:{},
			currentPage:1, // 当前页
			pageSize: pageSize, // 每页 多少条
			data : [],
			seaMeasure:[],
			seaBox:[],
			getTermModes:{},
			obj:{}

		}
		this.handleResize = this.handleResize.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.getPage = this.getPage.bind(this);
		this.getXiang = this.getXiang.bind(this);

	}

	handleResize(e, height) {
		 this.filterHeight = height || this.filterHeight || 50;
        let scroll = document.body.offsetHeight - 170 - this.filterHeight;
        this.setState({scroll: scroll});
	}
	// ajax list
	getPage(currentPage,objValue){
		let that = this;
		var sID = sID || '';
		let currentP = !isNaN(currentPage)?currentPage:1;
		let object=Object.assign({},{type:10, pageSize: this.state.pageSize, currentPage: currentP},this.normalRef.getForm());
		apiGet(API_FOODING_HR,'/attendResult/getOneself',object,
				(response)=>{
					that.setState({
						data: response.data.data,
						totalPages: response.data.totalPages,
						totalRecords:response.data.totalRecords,
						currentPage: response.data.currentPage
					});
				},(errors)=>{
		});


	}
	onSaveAndClose(value,checkedData,isAdd,call){
		var that = this;

		if(this.state.DialogContent == 3){
			value=Object.assign({},checkedData,value);
		}else {

		}
		apiPost(API_FOODING_ERP,'/termsfreight/cc/save',value,(response)=>{
				that.getPage();
				this.setState({
			rodalShow:!!isAdd
		})
				ServiceTips({text:response.message,type:'sucess'});
				if(isAdd){
					call();
				}
		},(message)=>{
				ServiceTips({text:message.message,type:'error'});
		});
	}
	// 取消
	onCancel(that){
		this.setState({
			rodalShow:false
		})
	}
    editClick(record,e){
       var that = this;
        e.stopPropagation && e.stopPropagation();
        apiGet(API_FOODING_HR,'/explainRegister/getOne',{billId:record.record.id},
            (response)=>{
                that.setState({
                    rodalShow : true,
                    showHeader:true,
                    DialogContent:3,
                    title:'申诉',
                    checkedData:response.data
                });
            },(errors)=>{
            });
    }
	getXiang(){
		var that = this;
		apiGet(API_FOODING_ERP,'/common/getTermModes',{},(response)=>{
			that.setState({
				seaMeasure:response.data.seaMeasure,
				seaBox:response.data.seaBox,
				getTermModes:response.data
			});
		},(error)=>{

		})
	}
	componentDidMount(){
		this.getPage();
		this.getXiang();
		window.addEventListener('resize', this.handleResize(47));
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize(47));
	}

	render(){
		let {page,currentPage} =this.state;
		let  iconArray = [{type:'add',onClick:this.addClick}];
		let that = this;
		return(<div>
			<FilterHeader  getPage ={this.getPage}  normalRef={no => this.normalRef = no} expandFilter={this.handleResize}/>
			<div className={'clientcontact-list-body'} style={{height:this.state.scrollHeight}}>
				<div className={'clientcontact-list-body-single'}>
					<div className={'keys-page'}>
						{/*<FunctionKeys deleteClick={this.deleteClick} />*/}
						<Page
							currentPage={this.state.currentPage}
							totalPages={this.state.totalPages}
							totalRecords={this.state.totalRecords}
							sizeList={sizeList}
							currentSize={this.state.pageSize}
							pageSizeChange={(num)=>{
								this.setState({ pageSize: Number.parseInt(num) },()=>this.getPage(currentPage, num));
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
									{/*<Checkbox className="terms-checkbox" style={{marginLeft:'20px'}} onChange={this.onChange}/>*/}
									<span style={{flex:2,marginLeft:'20px'}}>
										<span style={{paddingRight:'20px'}}>{i18n.t(600257/*所属部门*/)}</span>
										<span style={{color:'#747d89'}}>{dataItem["shipdate"]}</span>
									</span>
									<span style={{flex:2}}>
										<span style={{marginRight:'20px'}}>{i18n.t(600250/*职员工号*/)}</span>
										<span style={{color:'#747d89'}}>{dataItem["voyNums"]}</span>
									</span>
									<span style={{flex:2,marginLeft:'50px'}}>
										<span style={{paddingRight:'20px'}}>{i18n.t(600251/*职员名称*/)}</span>
										<span style={{color:'#747d89'}}>{dataItem["shipdate"]}</span>
									</span>
									<span style={{flex:2}}>
										<span style={{marginRight:'20px'}}>{i18n.t(600253/*工作日*/)}</span>
										<span style={{color:'#747d89'}}>{dataItem["voyNums"]}</span>
									</span>
									<span style={{flex:2}}>
										<span style={{marginRight:'20px'}}>{i18n.t(600254/*实际上班时间*/)}</span>
										<span style={{color:'#747d89'}}>{dataItem["voyNums"]}</span>
									</span>
									<span style={{flex:2,marginLeft:'50px'}}>
										<span style={{paddingRight:'20px'}}>{i18n.t(600255/*实际下班时间*/)}</span>
										<span style={{color:'#747d89'}}>{dataItem["shipdate"]}</span>
									</span>
									<span style={{flex:2}}>
										<span style={{marginRight:'20px'}}>{i18n.t(600272/*异常情况*/)}</span>
										<span style={{color:'#747d89'}}>{dataItem["voyNums"]}</span>
									</span>
                                    <span style={{flex:2}}>
										<span onClick={that.editClick.bind(event)} style={{marginRight:'20px',textDecoration:'underline',color:' #0066cc',cursor:'pointer'}}>申诉</span>
										<span style={{color:'#747d89'}}></span>
									</span>
								</div>
								<div className="bottom">
									<span style={{flex:2,marginLeft:'50px'}}>
										<span style={{paddingRight:'20px'}}>{i18n.t(600252/*考勤卡号*/)}</span>
										<span style={{color:'#747d89'}}>{dataItem["shipdate"]}</span>
									</span>
									<span style={{flex:2}}>
										<span style={{marginRight:'20px'}}>{i18n.t(500398/*考勤方式*/)}</span>
										<span style={{color:'#747d89'}}>{dataItem["voyNums"]}</span>
									</span>
									<span style={{flex:1}}>
										<span style={{marginRight:'20px'}}>{i18n.t(600259/*星期*/)}</span>
										<span style={{color:'#747d89'}}>{dataItem["voyNums"]}</span>
									</span>
									<span style={{flex:2}}>
										<span style={{marginRight:'20px'}}>{i18n.t(600260/*班次*/)}</span>
										<span style={{color:'#747d89'}}>{dataItem["voyNums"]}</span>
									</span>
									<span style={{flex:2}}>
										<span style={{marginRight:'20px'}}>{i18n.t(600261/*计划上班时间*/)}</span>
										<span style={{color:'#747d89'}}>{dataItem["voyNums"]}</span>
									</span>
									<span style={{flex:2}}>
										<span style={{marginRight:'20px'}}>{i18n.t(600262/*计划下班时间*/)}</span>
										<span style={{color:'#747d89'}}>{dataItem["voyNums"]}</span>
									</span>
									<span style={{flex:2}}>
										<span style={{marginRight:'20px'}}>{i18n.t(600263/*上班IP地址*/)}</span>
										<span style={{color:'#747d89'}}>{dataItem["voyNums"]}</span>
									</span>
									<span style={{flex:2}}>
										<span style={{marginRight:'20px'}}>{i18n.t(600264/*下班IP地址*/)}</span>
										<span style={{color:'#747d89'}}>{dataItem["voyNums"]}</span>
									</span>
								</div>
								<div className="bottom">
									<span style={{flex:2,marginLeft:'50px'}}>
										<span style={{paddingRight:'20px'}}>{`${i18n.t(600265/*加班时间*/)}(H)`}</span>
										<span style={{color:'#747d89'}}>{dataItem["shipdate"]}</span>
									</span>
									<span style={{flex:2}}>
										<span style={{marginRight:'20px'}}>{`${i18n.t(600266/*迟到*/)}(M)`}</span>
										<span style={{color:'#747d89'}}>{dataItem["voyNums"]}</span>
									</span>
									<span style={{flex:2}}>
										<span style={{marginRight:'20px'}}>{`${i18n.t(600267/*早退*/)}(M)`}</span>
										<span style={{color:'#747d89'}}>{dataItem["voyNums"]}</span>
									</span>
									<span style={{flex:2}}>
										<span style={{marginRight:'20px'}}>{`${i18n.t(600268/*旷工*/)}(H)`}</span>
										<span style={{color:'#747d89'}}>{dataItem["voyNums"]}</span>
									</span>
									<span style={{flex:2}}>
										<span style={{marginRight:'20px'}}>{`${i18n.t(600269/*请假*/)}(H)`}</span>
										<span style={{color:'#747d89'}}>{dataItem["voyNums"]}</span>
									</span>
									<span style={{flex:2}}>
										<span style={{marginRight:'20px'}}>{`${i18n.t(600270/*标准工时*/)}(H)`}</span>
										<span style={{color:'#747d89'}}>{dataItem["voyNums"]}</span>
									</span>
									<span style={{flex:2}}>
										<span style={{marginRight:'20px'}}>{`${i18n.t(600271/*实际工时*/)}(H)`}</span>
										<span style={{color:'#747d89'}}>{dataItem["voyNums"]}</span>
									</span>
								</div>
							</div>
								)
						})
					}
					<Dialog width={926} visible={this.state.rodalShow} title={this.state.title} showHeader ={this.state.showHeader}>
						<MyAttendanceDetailPlug DialogContent={this.state.DialogContent}
						getTermModes ={this.state.getTermModes}
						 checkedData = {this.state.checkedData}
						 buttonLeft = {this.state.buttonLeft}
						  onSaveAndClose ={this.onSaveAndClose}
						  contentDate = {this.state.contentDate}
						  showSaveAdd ={this.state.showSaveAdd}
						  showSaveClose={this.state.showSaveClose}
						  onCancel = {this.onCancel}/>
					</Dialog>
				</div>
			</div>
		</div>
		</div>
	)
	}
}
export default NavConnect(MyAttendanceDetail);
