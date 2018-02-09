import React, { Component,PropTypes } from 'react';
import Template1  from  '../../../../Client/Detail/Content/components/Template1';
import MeasureCommon from  '../../../../../components/RuleTemplate';
import Dialog  from '../../../../../components/Dialog';
import Confirm from '../../../../../components/Dialog/Confirm';
import NormalDetail from "./NormalDetail";
import OutboundDetail from "./OutboundDetail";
import OrganDetail from "./OrganDetail";
import Chuku from "./Chuku";
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
        this.deleteClick = this.deleteClick.bind(this);
        this.saveClick = this.saveClick.bind(this);
        this.stockClick = this.stockClick.bind(this);
        this.getInit = this.getInit.bind(this);
        this.getInfo= this.getInfo.bind(this);
        this.getList = this.getList.bind(this);
        this.shallClick =this.shallClick.bind(this);
    }
    //详情请求
    getInit(){
        var that = this;
        apiGet(API_FOODING_ERP,'/noticestock/getOne',{billId:this.state.id},(response)=>{
            that.setState({
                data:response.data
            })
        },(error)=>{

        })
    }
    //子表请求
    getList(){
        var that = this;
        apiGet(API_FOODING_ERP,'/noticestock/mtl/getList',{billId:this.state.id},(response)=>{
            that.setState({
                mingxiArray:response.data
            });
        },(error)=>{

        });
    }
    //获取出入库操作明细
    getInfo(){
        var that = this;
        apiGet(API_FOODING_ERP,'/noticestock/getOpt',{billId:this.state.id,id:this.refs.product.getData()[0].billDtlId},
            (response)=>{
            that.setState({
                info:response.data,
                visible : true,
                showHeader:true,
                buttonLeft:I18n.t(100429/*保存并关闭*/),
                DialogContent:1,
                dialogTitle:I18n.t(500167/*出库*/),
                checkedData: {}
            });
        },(errors)=>{
                 ServiceTips({text:errors.message,type:'error'});
        })
    }
    handleClick = (e, data, Template) => {
        if(data.number ==2){
             Confirm(I18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
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
    deleteClick(){
        var that = this;
        let {navAddTab,navRemoveTab} =this.props;
         Confirm(I18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
                  done: () => {
                    apiForm(API_FOODING_ERP,'/noticestock/delete',{billId:this.state.id},(response)=>{
                            ServiceTips({text:response.message,type:'sucess'});
                            navRemoveTab({name:I18n.t(500160/*出库通知单详情*/),component:I18n.t(500160/*出库通知单详情*/),url:'/stockout/detail'});
                            navRemoveTab({name:I18n.t(400042/*出库通知单*/),component:I18n.t(400042/*出库通知单*/),url:'/stockout/list'});
                            navAddTab({name:I18n.t(400042/*出库通知单*/),component:I18n.t(400042/*出库通知单*/),url:'/stockout/list'});
                            that.props.router.push('/stockout/list');
                    },(error)=>{
                            ServiceTips({text:error.message,type:'error'});
                    });
                }
        });
    }
    //提交
    saveClick(){
        Confirm(I18n.t(500169/*您确定要提交此出库订单吗*/), {
              done: () => {
                    apiForm(API_FOODING_ERP,"/common/submitBill",{billId:this.props.location.query.id,billType:223},response => {
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
    //出库
    stockClick(){
        let that = this;
        let select = this.refs.product.getData();

        // 删除 条件判断

            if( select.length == 0 ){
                
                ServiceTips({text:I18n.t(500221/*请选中一条出库记录？*/),type:'error'});
            }else if( select.length == 1 ){
                 this.getInfo();
            }else if( select.length > 1 ){
                ServiceTips({text:I18n.t(500220/*不支持批量操作!*/),type:'error'});
            }
    }
    //撤销
    shallClick(){
        var that = this;
        let {navAddTab,navRemoveTab} =this.props;
         Confirm(I18n.t(500156/*撤销后将无法恢复，您确定撤销吗？*/), {
                  done: () => {
                    apiForm(API_FOODING_ERP,'/noticestock/cancel',{billId:this.state.id},(response)=>{
                            ServiceTips({text:response.message,type:'sucess'});
                            navRemoveTab({name:I18n.t(500160/*出库通知单详情*/),component:I18n.t(500160/*出库通知单详情*/),url:'/stockout/detail'});
                            navRemoveTab({name:I18n.t(400042/*出库通知单*/),component:I18n.t(400042/*出库通知单*/),url:'/stockout/list'});
                            navAddTab({name:I18n.t(400042/*出库通知单*/),component:I18n.t(400042/*出库通知单*/),url:'/stockout/list'});
                            that.props.router.push('/stockout/list');
                    },(error)=>{
                            ServiceTips({text:error.message,type:'error'});
                    });
                }

        });
    }
    EditClick(){
        let {navAddTab,navReplaceTab} =this.props;
        navReplaceTab({id:7,name:I18n.t(500171/*出库通知单编辑*/),component:I18n.t(500171/*出库通知单编辑*/),url:'/stockout/add'});
        this.props.router.push({pathname:'/stockout/add',query:{id:this.state.id}});
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
            data:{},
            id:this.props.location.query.id,
            dilogTelmp:<div></div>,
            mingxiArray:[],
            chukuarray:[],
            currentPage:1, // 当前页
            totalPages: 1, // 总页数
            pageSize: pageSize, // 每页 多少条
        }
    }
    componentDidMount(){
        this.handleResize();
        this.getInit();
        this.getList();
        window.addEventListener('resize', this.handleResize(20));
    }
    
     handleResize(height){
        this.setState({
            // paddingTop:!this.state.paddingTop
        });
        let padding = this.props.paddingTop;
        let sch=document.body.offsetHeight-height-padding;
        this.setState({scrollHeight:sch+'px',scroll:scroll});
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize(20));
    }

    componentWillReceiveProps(nextProps){
        this.handleResize(0);
        window.addEventListener('resize', this.handleResize(0));
    }
    render(){
        const commonForm = this.state.dilogTelmp;
        return (
              <div className='scroll' style={{backgroundColor:'#f0f4f8',
                height:this.state.scrollHeight,overflow:'auto'}}>
                   <NormalDetail  deleteClick={this.deleteClick} saveClick={this.saveClick} stockClick={this.stockClick} EditClick={this.EditClick} shallClick={this.shallClick} id={this.state.id} data={this.state.data}/>
                   <OutboundDetail id={this.state.id} ref ="product" mingxiArray = {this.state.mingxiArray}/>
                   <OrganDetail id={this.state.id}  data={this.state.data}/>
                   <Dialog visible={this.state.visible} title={this.state.dialogTitle} width={926}>
                       <Chuku DialogContent={this.state.DialogContent}
                         checkedData = {this.state.checkedData}
                         buttonLeft = {this.state.buttonLeft}
                          onSaveAndClose ={this.onSaveAndClose}
                          contentDate = {this.state.contentDate}
                          onCancel = {this.onCancel}
                          getPage = {this.getPage}
                          info={this.state.info}
                          data={this.state.data}
                          chukuarray={this.state.chukuarray}
                          getList = {this.getList}
                          /> 
                    </Dialog>
               </div>
            );
    }

}
export default NavConnect(SalesOrderDetail);
