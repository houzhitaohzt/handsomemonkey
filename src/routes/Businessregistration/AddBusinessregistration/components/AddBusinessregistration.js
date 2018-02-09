import React, { Component } from 'react';
const {Table} = require("../../../../components/Table");
import AddNormal from "./AddNormal";
// common
import ServiceTips from '../../../../components/ServiceTips'; // 提示
import Select, { Option } from '../../../../components/Select'; // 下拉
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';//引入
// ajax
import {
    apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS, API_FOODING_ERP, language, commonAjax, API_FOODING_HR,
    toDecimal
} from '../../../../services/apiCall';
import i18n, {I18n} from "../../../../lib/i18n";
import Measurement from  '../../../../components/RuleTemplate';
import Dialog  from '../../../../components/Dialog';
import Confirm from "../../../../components/Dialog/Confirm";
import {createForm} from "../../../../components/Form";
class ActivityDetail extends Component{
	constructor(props){
		super(props);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.getOne = this.getOne.bind(this);
        this.columns=[{
            title : i18n.t(500121/*费用名称*/),
            dataIndex : "costlvtr"+language,
            key : "costlvtr"+language,
            width : "10%",
            render(data,row,index){
                return data;
            }
        },{
            title : i18n.t(200246/*金额*/),
            dataIndex : "chargeAmt",
            key : "chargeAmt",
            width : "7%",
            render(data,row,index){
                return (<div>{data?toDecimal(data):''}</div>)
            }
        },{
            title : i18n.t(100336/*备注*/),
            dataIndex : "remark",
            key : "remark",
            width : "10%",
            render(data,row,index){
                return (<div>{data}</div>)
            }
        }];
        this.billId = this.props.location.query.id ? this.props.location.query.id : null;
		this.state = {
            visible:false,
            dialogTitle:'',
            dilogTelmp:<div></div>,
			scroll:0,
			id:this.props.location.query.id,
			getOneData: {},
			billId: this.props.location.query['id'] || '',
			data : []
		}
	}

    handleClick = (e, data, Template) => {
        let that = this;
        if(data.number == 2){
            // 删除
            if(data.selectArr.length>1){
                ServiceTips({text:i18n.t(500220/*不支持批量操作!*/),type:'error'});
            } else{
                Confirm(i18n.t(500093/*删除后无法撤回,你确定要删除此订单吗？*/), {
                    done: () => {
                        apiForm(API_FOODING_HR,'/evecregister/dtl/delete',{id: data.selectArr[0].billDtlId},
                            (response)=>{
                                ServiceTips({text:response.message,type:'success'});
                                that.getFeiyongPage();
                                that.getOne();
                            },(errors)=>{
                                ServiceTips({text:errors.message,type:'error'});
                            });
                    }
                });
            }
        } else if( data.number == 1 ){
            // 新增
            let dialogTitle= data.action+data.name.title;
            this.setState({
                visible:true,
                dialogTitle:dialogTitle,
                dilogTelmp:Template,
            });
        } else{
            // 编辑
            apiGet(API_FOODING_HR,'/evecregister/dtl/getOne',{id:data.record.billDtlId},
                (response)=>{
                    let dialogTitle= data.action+data.name.title;
                    this.setState({
                        visible:true,
                        dialogTitle:dialogTitle,
                        dilogTelmp:Template,
                    });
                },(errors)=>{
                    ServiceTips({text:errors.message,type:'error'});
                });
        }
    }

	handleResize(height){
		this.setState({
  			paddingTop:!this.state.paddingTop
  		});
  		let padding = 80;
		let sch=document.body.offsetHeight-height-padding;
		let scroll = sch-135;

		this.setState({scrollHeight:sch+'px',scroll:scroll});
	}
	componentDidMount(){
        this.handleResize(0);
		window.addEventListener('resize', this.handleResize(0));
		this.getOne();
        this.getFeiyongPage();
    };	
	componentWillUnmount() {
    	window.removeEventListener('resize', this.handleResize(0));
  	}
  	componentWillReceiveProps(nextProps){
  		this.handleResize(0);
		window.addEventListener('resize', this.handleResize(0));
  	}

	// 页面 刷新
	getOne = () => {
		let that = this;
		apiGet(API_FOODING_HR,'/evecregister/getOne',Object.assign({billId:that.props.location.query.id || that.state.billId},),
			(response)=>{	
				that.setState({ getOneData: response.data || {}});
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});		
	}

    // 页面 刷新
    getFeiyongPage = () => {
        let that = this;
        let billId = that.state.getOneData.billId || that.props.location.query.id || '';
        if(!billId) return;
        apiGet(API_FOODING_HR,'/evecregister/dtl/getList',{billId},
            (response)=>{
                that.setState({
                    data: response.data,
                });
            },(errors)=>{
                ServiceTips({text:errors.message,type:'error'});
            });
    };

    onSaveAndClose = (values) => {
        //this.setState({visible:false});
        this.getFeiyongPage();
        this.getOne(); // 刷新主表
    };

    onCancel = () => {
        this.setState({visible:false});
    }

    addBeforeSaveClick = (callback) => {
        if(!this.billId){
            const {form} = this.props;
            form.validateFields((error, value) => {
                if(error){
                    callback(I18n.t(100497/*填写不完整*/))
                }else{
                    let params = this.props.form.getFieldsValue();
                    apiPost(API_FOODING_HR,'/evecregister/save',params, response =>{
                        this.billId = response.data;
                        this.props.router.push({pathname: '/businessregistration/add', query: {id: this.billId}, state: {refresh: false}});
                        callback(null, this.billId)
                    }, error => {
                        callback(error.message)
                    })
                }
            })
        }else{
            callback(null,this.billId)
        }
	};

    onSaveClick = () => {
        const {form} = this.props;
        let {navReplaceTab} = this.props;
        form.validateFields((error, value) => {
            if(error){

            }else{
                let params = this.props.form.getFieldsValue();
                let sourceId = this.state.getOneData.billId || this.props.location.query.id || '';
                let optlock = this.state.getOneData.optlock || '';
                let value = Object.assign({},params, {billId:sourceId,optlock:optlock,billType:this.state.getOneData.billType});
                apiPost(API_FOODING_HR,'/evecregister/save',value, response =>{

                    navReplaceTab({id:13,name:i18n.t(500373/*出差单详情*/),component:i18n.t(500373/*出差单详情*/),url:'/businessregistration/detail'});
                    this.props.router.push({pathname: '/businessregistration/detail', query: {id: response.data}, state: {refresh: false}});
                }, error => {
                    ServiceTips({text:error.message,type:'error'});
                })
            }
        })
	};

    // 返回
    onBack = () => {
        let billId = this.props.location.query.id;
        if(billId){
            this.props.navReplaceTab({name:I18n.t(500373/*出差单详情*/),component:I18n.t(500373/*出差单详情*/),url:'/businessregistration/detail'});
            this.props.router.push({pathname: '/businessregistration/detail', query: {id:billId}});
        } else {
            this.props.navReplaceTab({name:I18n.t(500421/*出差单*/),component:I18n.t(500421/*出差单*/),url:'/businessregistration'});
            this.props.router.push({pathname: '/businessregistration'});
        }
    }

	render(){
		let {getOneData} = this.state;
		let {form} = this.props;
		return (
			<div className='activity-detail scroll' style={{height:this.state.scrollHeight}}>
				<AddNormal 
						normalRef={no => this.normalRef = no}
                        onSaveClick={this.onSaveClick}
						backClick={this.onBack}
						getOne={this.getOne}
						getOneData={this.state.getOneData}
						form={form}
					/>
                <div style={{backgroundColor:'#f0f4f8',marginTop:'10px'}}>
                    <div className='col'>
                        <Measurement
                            menuList={[
                                {type:'add'},
                                {type:'delete'},
                                {type:'edit'}
                            ]}
                            title ={i18n.t(500121/*费用名称*/)}
                            openDialog={this.handleClick}
                            onSaveAndClose={this.onSaveAndClose}
                            onCancel = {this.onCancel}
                            DialogTempalte={require('./confirm').default}
                            id={'39'}
                            Zindex={2}
                            showHeader ={true}
                            columns ={this.columns}
                            data={this.state.data}
                            otherData={{sourceId:this.props.location.query.id || this.state.getOneData.billId}}
                            addBeforeSaveClick={this.addBeforeSaveClick}
                        />
                    </div>
                </div>
                <Dialog visible={this.state.visible} title={this.state.dialogTitle} width={926}>
                    {this.state.dilogTelmp}
                </Dialog>
			</div>
		);

	}

}
export default NavConnect(createForm()(ActivityDetail));

