import React,{Component,PropTypes} from 'react';
import Page from "../../../components/Page";//分页
import Dialog from '../../../components/Dialog/Dialog';//弹层
const {Table} = require("../../../components/Table");//Table表格
import Confirm from '../../../components/Dialog/Confirm';//删除弹层
import {browserHistory} from 'react-router';
import NavConnect from '../../../components/NavigateTabs/containers/AddContainer';
import FilterHeader from "./FilterHeader";
import FunctionKeys from "./FuncKeys";
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,pageSize,sizeList} from '../../../services/apiCall';
import Loading from "../../../components/Loading";//加载动画
import ServiceTips from "../../../components/ServiceTips";//提示框
import {I18n} from "../../../lib/i18n";

import Card from "../../Common_confirm/Card.js";

class Clientsrc extends Component{
	constructor(props){
		super(props);

		var that = this;


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
			buttonLeft:I18n.t(100429/*保存并关闭*/),
			contentTemplate:<div></div>,
			checkedData:'',
			data : [],


			pageSize:pageSize,
			currentPage:1,
			colorType: '',	// 颜色过滤
			followMark: false, // 过滤收藏			
			
		}


        this.columns = [{
            title: I18n.t(100244/*企业*/),
            dataIndex: "company",
            key: "company",
            width: "10%",
            render(data, row, index){
                let value = data;
                return (<div className="text-ellipsis">{value}</div>);
            }
        },{
            title: I18n.t(100238/*部门*/),
            dataIndex: "department",
            key: "department",
            width: "6%",
            render(data, row, index){
                let value = data;
                return (<div className="text-ellipsis">{value}</div>);
            }
        },{
            title: I18n.t(100354/*客户代码*/),
            dataIndex: 'code',
            key: "code",
            width: '7%',
            render(data, row, index){
                let value = data == null ? null : data;
                return (<div className="text-ellipsis" title={value}>{value}</div>)
            }
        },{
            title: I18n.t(100355/*客户名称*/),
            dataIndex: 'localName',
            key: "localName",
            sort: 'name',
            width: '10%',
            render(data, row, index){
                let value = data == null ? null : data;
                return (<div className="text-ellipsis" title={value}>{value}</div>)
            }
        },{
            title: I18n.t(100087/*国家*/),
            dataIndex: "country",
            key: "country",
            width: "6%",
            render(data, row, index){
                let value = data;
                return data;
            }
        }, {
            title: I18n.t(100359/*客户等级*/),
            dataIndex: "level",
            key: "level",
            sort: 'cstmLevel',
            width: "7%",
            render(data, row, index){
                return data;
            }
        },{
            title: I18n.t(100360/*客户类型*/),
            dataIndex: "type",
            key: "type",
            sort:'cstmTypeId',
            width: "6%",
            render(data, row, index){
                let value = data;
                return (<div className="text-ellipsis">{value}</div>);
            }
        },{
            title: I18n.t(100372/*主联系人*/),
            dataIndex: "defaultContact",
            key: "defaultContact",
            sort: 'defaultEntContact',
            width: "7%",
            tooltip: false,
            render(data, row, index){
                return <Card type="userLinkMan" data={row['defaultContact']} router={that.props.router}/>;
            }
        }, {
            title: I18n.t(100374/*最近联系时间*/),
            dataIndex: 'contactTime',
            key: "contactTime",
            width: "10%",
            render(data, row, index){
                if (data) {
                    return new Date(data).Format("yyyy-MM-dd hh:mm:ss");
                }
                return null;
            }
        }, {
            title: I18n.t(100230/*状态*/),
            dataIndex: 'irowSts',
            key: "irowSts",
            sort: 'rowSts',
            width: "5%",
            tooltip: false,
            render(data, row, index){
                return data.name;
            }
        }];


	}

	handleResize = (e, height)=> {
        this.filterHeight = height || this.filterHeight || 50;
        let scroll = document.body.offsetHeight - 170 - this.filterHeight;
        let scrollHeight = scroll + 70;
        this.setState({scroll: scroll,scrollHeight:scrollHeight});
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

	onSaveAndClose =()=> {
		this.onCancel();
		this.getPage();
	}

	onCancel = (that)=> {
		this.setState({
			rodalShow:false
		})
		if(that){
			that.props.form.resetFields();
		}
	}


    onRowDoubleClick = (record, index, checked)=> {

        let {navAddTab} = this.props;
        let name = I18n.t(100311/*客户*/) + `(${record.localName})`;
        navAddTab({id: 3, name: name, component: name, url: '/client/detail/' + record.id});
        this.props.router.push({pathname:'/client/detail/' + record.id,query:{id:record.id,index:'detail'}, state: {refresh: true}});
    }

	// 领取客户 
	getClient = ()=> {
		let that = this;
        let IDs = this.refs.product.getSelectArr().map(o => o.id);

        if (!IDs.length) {
			ServiceTips({text:I18n.t(100434/*请选择一条数据！*/),type:'error'});
			return;
		}

		Confirm(I18n.t(600290/*您确定要领取客户吗？*/), {
			done: () => {
				apiPost(API_FOODING_DS,'/customer/public/convert',{ids:IDs,publicFlag:false},
					(response)=>{
						ServiceTips({text:response.message,type:'success'});
						that.getPage();
					},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
				});
			},
			close:() => {
			}
		});		
	}

	// 分配客户 
	allocationClient = ()=> {


        let IDs = this.refs.product.getSelectArr().map(o => o.id);

        if (!IDs.length) {
			ServiceTips({text:I18n.t(100434/*请选择一条数据！*/),type:'error'});
			return;
		}
                        

        let content = require('./ClientCommon').default;
        let ele = React.createElement(content, {
            onSaveAndClose: this.onSaveAndClose,
            onCancel: this.onCancel,
            data: {IDs:IDs}
        });
        this.setState({
			rodalShow : true,
			showHeader:true,
			showSaveAdd:true,
			showSaveClose:true,
            title: I18n.t(600289/*分配客户*/),
            dialogContent: ele,
            dialogWidth:926
        });  			
	}

	// 过滤颜色
	searchColor = (color)=> {
		this.setState({colorType: color}, function(){
			this.getPage();
		});
	}

	// 过滤 收藏
	searchFollow = (result)=> {
		this.setState({followMark: result}, function(){
			this.getPage();
		});
	}

	// 选择颜色
	savePrefers = (color,row)=> {
		let that = this;
		apiForm(API_FOODING_DS,'/customer/savePrefers',{custId:row.id, colorType:color, optlock:row.optlock},
			(response)=>{
				that.getPage();
				ServiceTips({text: response.message,type: 'success'});
			},(errors)=>{
				ServiceTips({text: errors.message,type: 'error'});
		});
	}

	// 收藏
	saveFollow = (row,index,result)=> {

		let that = this;
		apiForm(API_FOODING_DS,'/customer/savePrefers',{custId:row.id, followMark:result, optlock:row.optlock},
			(response)=>{
				that.getPage();
				ServiceTips({text: response.message,type: 'success'});
			},(errors)=>{
				ServiceTips({text: errors.message,type: 'error'});
		});
	}

	//请求列表  list
	getPage = (currentPage,objValue)=> {
		let that = this;
		let {colorType,followMark} = this.state;
		var sID = sID || '';
		let currentP = !isNaN(currentPage)?currentPage:1;
		let object=Object.assign({},{colorType:colorType,followMark:followMark,pageSize:this.state.pageSize,currentPage:currentP},that.normalRef.getForm());
		apiGet(API_FOODING_DS,'/customer/public/getPage',object,
				(response)=>{	
					that.setState({	
						data: response.data.data || [],
						totalPages: response.data.totalPages,
						totalRecords:response.data.totalRecords,
						currentPage: response.data.currentPage 	
					});
				},(errors)=>{
		});
	}

	render(){
		let {page,currentPage} =this.state;
		return(<div>
			<FilterHeader normalRef={no => this.normalRef = no} getPage ={this.getPage} expandFilter= {this.handleResize}/>
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				  <div className="action-buttons">
					<div className={'key-page'}>
						<FunctionKeys getClient={this.getClient} allocationClient={this.allocationClient}/> 
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
					
					<Table
					    ref ="product"
						columns={this.columns}
						data={this.state.data}
						checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						colorFilterConfig={{show : true, dataIndex:'colorType', onSelect: this.savePrefers, onHeaderSelect: this.searchColor}}
						followConfig={{show:true, onClick:this.saveFollow, dataIndex:'followMark', onHeaderClick: this.searchFollow}}						
						onRowDoubleClick={this.onRowDoubleClick}
						scroll={{x:true,y:this.state.scroll}}
						onHeaderCellClick={this.onHeaderCellClick}
						onRowClick={this.onRowClick}

					/>
					<Dialog width={926} visible={this.state.rodalShow} title={this.state.title} showHeader ={this.state.showHeader}>
						{this.state.dialogContent}
					</Dialog>
				</div>
			</div>
		</div>
		</div>
	)
	}
}
export default NavConnect(Clientsrc);

