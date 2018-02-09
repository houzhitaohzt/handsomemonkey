import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import Template1  from  '../../../../Client/Detail/Content/components/Template1';
import MeasureCommon from  '../../../../../components/RuleTemplate';
import Dialog  from '../../../../../components/Dialog';
import Confirm from '../../../../../components/Dialog/Confirm';
import NormalDetail from "./NormalDetail";
import InboundDetail from "./InboundDetail";
import OrganDetail from "./OrganDetail";
import Ruku from "./Ruku";
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
        this.FOBClick = this.FOBClick.bind(this);
        this.cancalClick = this.cancalClick.bind(this);
        this.deleteClick = this.deleteClick.bind(this);
        this.saveClick=this.saveClick.bind(this);
        this.getInfo= this.getInfo.bind(this);
        this.getInit = this.getInit.bind(this);
        this.getList = this.getList.bind(this);
    }
    handleClick = (e, data, Template) => {
        if(data.number ==2){
        	 Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
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
        apiGet(API_FOODING_ERP,'/purquotation/getOne',{billId:this.state.id},(response)=>{
            that.setState({
                data:response.data
            })
        },(error)=>{

        })
    }
    //获取出入库操作
    getInfo(){
        var that = this;
        console.log(this.refs.product.getData());
        apiGet(API_FOODING_ERP,'/noticestock/getOpt',{billId:this.state.id,id:this.refs.product.getData()[0].billDtlId},(response)=>{
            that.setState({
                info:response.data
            });
        },(errors)=>{

        })
    }
    PutClick(){
        let that = this;
        let select = this.refs.product.getData();

        // 删除 条件判断

            if( select.length == 0 ){
                Confirm('请选中一条数据？');
            }else if( select.length == 1 ){
                 this.getInfo();
                    if(this.state.data.thirdMark==true){
                            this.setState({
                            visible : true,
                            showHeader:true,
                            buttonLeft:i18n.t(200267/*保存并且关闭*/),
                            DialogContent:1,
                            dialogTitle:i18n.t(500148/*入库*/),
                            checkedData: {}
                        })
                    }else if(this.state.data.thirdMark==false){
                            this.setState({
                            visible : true,
                            showHeader:true,
                            buttonLeft:i18n.t(200267/*保存并且关闭*/),
                            DialogContent:2,
                            dialogTitle:i18n.t(500148/*入库*/),
                            checkedData: {}
                        })
                }
            }

      
    }
   saveClick(){
     Confirm(i18n.t(201013/*你确定执行提交吗*/), {
              done: () => {
                    apiForm(API_FOODING_ERP,"/purquotation/release",{billId:this.props.location.query.id},response => {
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
        let {navAddTab} =this.props;
        apiForm(API_FOODING_ERP,'/purquotation/delete',{billId:this.state.id},(response)=>{
                ServiceTips({text:response.message,type:'sucess'});
                navAddTab({name: i18n.t(200022/*供应商报价*/), component: i18n.t(200022/*供应商报价*/), url: '/purchasequote/list'});
                that.props.router.push('/purchasequote/list');
        },(error)=>{
                ServiceTips({text:error.message,type:'error'});
        });
    }
    EditClick(){
        let {navAddTab,navReplaceTab} =this.props;
        navReplaceTab({id:7,name:i18n.t(201014/*供应商报价详情编辑*/),component:i18n.t(201014/*供应商报价详情编辑*/),url:'/purchasequote/add'});
        this.props.router.push({pathname:'/purchasequote/add',query:{id:this.state.id}});
    }
    FOBClick(){
        Confirm(i18n.t(201015/*你确定计算FOB价吗*/), {
              done: () => {
                    apiForm(API_FOODING_ERP,"/purquotation/calculate",{billId:this.props.location.query.id},response => {
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
    cancalClick(){
        Confirm(i18n.t(201013/*你确定执行提交吗*/), {
              done: () => {
                    apiForm(API_FOODING_ERP,"/purquotation/drop",{billId:this.props.location.query.id},response => {
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
            mingxiArray:[]
        }
    }
    getList(){
        var that = this;
        apiGet(API_FOODING_ERP,'/purquotation/price/getList',{billId:this.state.id},(response)=>{
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
			  <div className='activity-detail  scroll' style={{height:this.state.scrollHeight}}>
	               <NormalDetail  deleteClick={this.deleteClick} FOBClick={this.FOBClick} cancalClick ={this.cancalClick} EditClick={this.EditClick} saveClick={this.saveClick} PutClick={this.PutClick} id={this.state.id} data={this.state.data}/>
                   <OrganDetail id={this.state.id} data={this.state.data}/>
                   <InboundDetail id={this.state.id} ref ="product" mingxiArray = {this.state.mingxiArray}/>
                   <Dialog visible={this.state.visible} title={this.state.dialogTitle} width={926}>
                       <Ruku DialogContent={this.state.DialogContent}
                         checkedData = {this.state.checkedData}
                         buttonLeft = {this.state.buttonLeft}
                          onSaveAndClose ={this.onSaveAndClose}
                          contentDate = {this.state.contentDate}
                          onCancel = {this.onCancel}
                          getPage = {this.getPage}
                          info={this.state.info}
                          data={this.state.data}
                          getList = {this.getList}
                          /> 
                    </Dialog>
               </div>
			);
	}

}
export default NavConnect(SalesOrderDetail);
