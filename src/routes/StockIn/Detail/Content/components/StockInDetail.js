import React, { Component,PropTypes } from 'react';
import Template1  from  '../../../../Client/Detail/Content/components/Template1';
import MeasureCommon from  '../../../../../components/RuleTemplate';
import Dialog  from '../../../../../components/Dialog';
import Confirm from '../../../../../components/Dialog/Confirm';
import NormalDetail from "./NormalDetail";
import InboundDetail from "./InboundDetail";
import OrganDetail from "./OrganDetail";
import Ruku from "./Ruku";
import {I18n} from '../../../../../lib/i18n';
import NavConnect from '../../../../../components/NavigateTabs/containers/AddContainer';
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList} from '../../../../../services/apiCall';
import ServiceTips from '../../../../../components/ServiceTips';
export class SalesOrderDetail extends Component{
	constructor(props) {
        super(props);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
        this.state=this.initState();
        this.EditClick = this.EditClick.bind(this);
        this.PutClick = this.PutClick.bind(this);
        this.deleteClick = this.deleteClick.bind(this);
        this.shallClick = this.shallClick.bind(this);
        this.saveClick=this.saveClick.bind(this);
        this.getInfo= this.getInfo.bind(this);
        this.getInit = this.getInit.bind(this);
        this.getList = this.getList.bind(this);
        this.setGetOne = this.setGetOne.bind(this);
        this.qiehuan = this.qiehuan.bind(this);
    }
    handleClick = (e, data, Template) => {
        if(data.number ==2){
        	 Confirm( {
				  done: () => {
				    console.log('ok, got it');
				}
		   	});
        }else{
        	let dialogTitle= data.action+data.name.title;
        	 this.setState({
        	 	visible:true,
                dialogTitle:dialogTitle,
                dilogTelmp:Template
        	});
        }
    }
    //查询单条数据
    getInit(){
        var that = this;
        apiGet(API_FOODING_ERP,'/noticestock/getOne',{billId:this.state.id},(response)=>{
            that.setState({
                datas:response.data
            })
        },(error)=>{
            
        })
    }
    qiehuan(istrue){
         if(istrue){
                            this.setState({
                            visible : true,
                            showHeader:true,
                            buttonLeft:I18n.t(100429/*保存并关闭*/),
                            DialogContent:1,
                            dialogTitle:I18n.t(500148/*入库*/),
                            checkedData: {}
                        })
                    }else{
                            this.setState({
                            visible : true,
                            showHeader:true,
                            buttonLeft:I18n.t(100429/*保存并关闭*/),
                            DialogContent:1,
                            dialogTitle:I18n.t(500148/*入库*/),
                            checkedData: {}
                        })
                }
    }

    //获取出入库操作
    getInfo(){

        var that = this;
        console.log(this.refs.product.getData());
        apiGet(API_FOODING_ERP,'/noticestock/getOpt',{billId:this.state.id,id:this.refs.product.getData()[0].billDtlId},(response)=>{
            that.setState({
                info:response.data
            });
            if(response.data.isThirdMark==true){
                            this.setState({
                            visible : true,
                            showHeader:true,
                            buttonLeft:I18n.t(100429/*保存并关闭*/),
                            DialogContent:1,
                            dialogTitle:I18n.t(500148/*入库*/),
                            checkedData: {}
                        })
                    }else if(response.data.isThirdMark==false){
                            this.setState({
                            visible : true,
                            showHeader:true,
                            buttonLeft:I18n.t(100429/*保存并关闭*/),
                            DialogContent:1,
                            dialogTitle:I18n.t(500148/*入库*/),
                            checkedData: {}
                        })
                }
        },(errors)=>{
            ServiceTips({text:errors.message,type:'error'});
        })
    }
    PutClick(){
        let that = this;
        let select = this.refs.product.getData();

        // 删除 条件判断

            if( select.length == 0 ){
                ServiceTips({text:I18n.t(500157/*请选中一条入库记录？*/),type:'error'});
            }else if( select.length == 1 ){
                 this.getInfo();
                    
            }else if( select.length > 1 ){
                ServiceTips({text:I18n.t(500220/*不支持批量操作!*/),type:'error'});
            }
      
    }
    shallClick(){ //撤销入库
        var that = this;
        let {navAddTab,navRemoveTab} =this.props;
         Confirm(I18n.t(500156/*撤销后将无法恢复，您确定撤销吗？*/), {
                  done: () => {
                    apiForm(API_FOODING_ERP,'/noticestock/cancel',{billId:this.state.id},(response)=>{
                            ServiceTips({text:response.message,type:'sucess'});
                            navRemoveTab({name:I18n.t(500133/*入库通知单详情*/),component:I18n.t(500133/*入库通知单详情*/),url:'/stockin/detail'});
                            navRemoveTab({name:I18n.t(400041/*入库通知单*/),component:I18n.t(400041/*入库通知单*/),url:'/stockin/list'});
                            navAddTab({name:I18n.t(400041/*入库通知单*/),component:I18n.t(400041/*入库通知单*/),url:'/stockin/list'});
                            that.props.router.push('/stockin/list');
                    },(error)=>{
                            ServiceTips({text:error.message,type:'error'});
                    });
                }

        });
    }
   saveClick(){
     Confirm(I18n.t(500155/*您确定要提交此入库订单吗*/), {
              done: () => {
                    apiForm(API_FOODING_ERP,"/common/submitBill",{billId:this.props.location.query.id,billType:222},response => {
                        ServiceTips({text:response.message,type:"success"})
                        this.getInit()
                    },error => {
                        ServiceTips({text:error.message,type:'error'})
                    })
                },
                close:() => {
                    console.log('no, close')
                }
            });
   }
    deleteClick(){
        var that = this;
        let {navAddTab,navRemoveTab} =this.props;
         Confirm(I18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
                  done: () => {
                    apiForm(API_FOODING_ERP,'/noticestock/delete',{billId:this.state.id},(response)=>{
                            ServiceTips({text:response.message,type:'sucess'});
                            navRemoveTab({name:I18n.t(500133/*入库通知单详情*/),component:I18n.t(500133/*入库通知单详情*/),url:'/stockin/detail'});
                            navRemoveTab({name:I18n.t(400041/*入库通知单*/),component:I18n.t(400041/*入库通知单*/),url:'/stockin/list'});
                            navAddTab({name:I18n.t(400041/*入库通知单*/),component:I18n.t(400041/*入库通知单*/),url:'/stockin/list'});
                            that.props.router.push('/stockin/list');
                    },(error)=>{
                            ServiceTips({text:error.message,type:'error'});
                    });
                }
        });
    }
    EditClick(){
        let {navAddTab,navReplaceTab} =this.props;
        navReplaceTab({id:7,name:I18n.t(500134/*入库通知单编辑*/),component:I18n.t(400041/*入库通知单*/),url:'/stockin/add'});
        this.props.router.push({pathname:'/stockin/add',query:{id:this.state.id}});
    }
    onSaveAndClose(values){
        console.log(values);
        this.setState({visible:false});
    }
	onCancel(){
        this.setState({visible:false});
	}
    initState(){
        return {
            visible:false,
            dialogTitle:'',
            datas:{},
            id:this.props.location.query.id,
            dilogTelmp:<div></div>,
            mingxiArray:[]
        }
    }
    setGetOne(obj){
        this.setState({
            datas:obj
        });
    }
    getList(){
        var that = this;
        apiGet(API_FOODING_ERP,'/noticestock/mtl/getList',{billId:this.state.id},(response)=>{
            that.setState({
                mingxiArray:response.data
            });
        },(error)=>{

        });
    }
    componentDidMount(){
        this.handleResize();
        this.getList();
        this.getInit();
        window.addEventListener('resize', this.handleResize(20));
    }
    handleResize(height){
        let padding = 80;
        let sch=document.body.offsetHeight-height-padding;
        this.setState({scrollHeight:sch+'px',scroll:scroll});
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize(0));
    }
    componentWillReceiveProps(nextProps){
        this.handleResize(0);
        window.addEventListener('resize', this.handleResize(0));
    }
	render(){
		const commonForm = this.state.dilogTelmp;
		return (
			  <div className='activity-detail' style={{height:this.state.scrollHeight}}>
	               <NormalDetail  deleteClick={this.deleteClick} EditClick={this.EditClick} saveClick={this.saveClick} PutClick={this.PutClick} shallClick ={this.shallClick} id={this.state.id} datas={this.state.datas}/>
                   
                   <InboundDetail id={this.state.id} ref ="product" mingxiArray = {this.state.mingxiArray}/>
                   <OrganDetail id={this.state.id}/>
                   <Dialog visible={this.state.visible} title={this.state.dialogTitle} width={926}>
                       <Ruku DialogContent={this.state.DialogContent}
                         checkedData = {this.state.checkedData}
                         buttonLeft = {this.state.buttonLeft}
                         getInit={this.getInit}
                          onSaveAndClose ={this.onSaveAndClose}
                          contentDate = {this.state.contentDate}
                          onCancel = {this.onCancel}
                          getPage = {this.getPage}
                          info={this.state.info}
                          datas={this.state.datas}
                          getList = {this.getList}
                          setGetOne={this.setGetOne}
                          qiehuan= {this.qiehuan}
                          /> 
                    </Dialog>
               </div>
			);
	}

}
export default NavConnect(SalesOrderDetail);
