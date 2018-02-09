import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import Template1  from  '../../../../Client/Detail/Content/components/Template1';
import MeasureCommon from  '../../../../../components/RuleTemplate';
import Dialog  from '../../../../../components/Dialog';
import Confirm from '../../../../../components/Dialog/Confirm';
import NormalDetail from "./NormalDetail";
import StrategyDetail from "./StrategyDetail";
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
        this.FOBClick = this.FOBClick.bind(this);
        this.cancalClick = this.cancalClick.bind(this);
        this.deleteClick = this.deleteClick.bind(this);
        this.saveClick=this.saveClick.bind(this);
        this.fabuClick = this.fabuClick.bind(this);
        this.getOne = this.getOne.bind(this);

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
    getOne(){
        var that = this;
        apiGet(API_FOODING_ERP,'/purquotation/getOne',{billId:this.state.id},(response)=>{
            that.setState({
                data:response.data
            })
        },(error)=>{

        })
    }
   saveClick(){
    let that = this;
    let data =this.state.data;
     Confirm(i18n.t(201013/*你确定执行提交吗*/), {
              done: () => {
                    apiForm(API_FOODING_ERP,"/common/submitBill",{billId:data.billId,billType:data.billType},response => {
                        ServiceTips({text:response.message,type:"success"})
                        that.getOne()
                    },error => {
                        ServiceTips({text:error.message,type:'error'})
                    })
                },
                close:() => {
                    console.log('no, close')
                }
            });
   }
    fabuClick(){
     Confirm("确定发布吗?", {
              done: () => {
                    apiForm(API_FOODING_ERP,"/purquotation/release",{billIds:[this.props.location.query.id]},response => {
                        ServiceTips({text:response.message,type:"success"})
                        this.getOne()
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
         Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
                  done: () => {
                    apiForm(API_FOODING_ERP,'/purquotation/delete',{billId:this.state.id},(response)=>{
                            window.navTabs.replace(i18n.t(200022/*供应商报价*/), "/purchasequote/list", {}, {refresh: true});
                            ServiceTips({text:response.message,type:'sucess'});
                    },(error)=>{
                            ServiceTips({text:error.message,type:'error'});
                    });
                }
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
                        this.getOne()
                    },error => {
                        ServiceTips({text:error.message,type:'error'})
                    })
                },
                close:() => {
                    console.log('no, close')
                }
            });
    }
    //作废操作
    cancalClick(){
         var that = this;
        let {navAddTab,navRemoveTab} =this.props;
         Confirm(i18n.t(500178/*你确定执行作废操作吗?*/), {
                  done: () => {
                    apiForm(API_FOODING_ERP,"/purquotation/drop",{billId:this.state.id},(response)=>{
                            ServiceTips({text:response.message,type:'sucess'});
                             //this.getOne()
                            navRemoveTab({name:i18n.t(201010/*供应商报价详情*/),component:i18n.t(201010/*供应商报价详情*/),url:'/purchasequote/detail'});
                            navAddTab({name: i18n.t(200022/*供应商报价*/), component: i18n.t(200022/*供应商报价*/), url: '/purchasequote/list'});
                            navAddTab({name: i18n.t(200022/*供应商报价*/), component: i18n.t(200022/*供应商报价*/), url: '/purchasequote/list'});
                            that.props.router.push('/purchasequote/list');
                    },(error)=>{
                            ServiceTips({text:error.message,type:'error'});
                    });
                }
        });
    }
    onSaveAndClose(values){
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
            dilogTelmp:<div></div>
        }
    }

    componentDidMount(){
        this.handleResize();
        this.getOne();
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
			  <div className='scroll' style={{backgroundColor:'#f0f4f8',
                height:this.state.scrollHeight,overflow:'auto'}}>
	               <NormalDetail  deleteClick={this.deleteClick} FOBClick={this.FOBClick} fabuClick ={this.fabuClick} cancalClick ={this.cancalClick} EditClick={this.EditClick} saveClick={this.saveClick} id={this.state.id} data={this.state.data}/>
                   <StrategyDetail id={this.state.id} ref ="product"  getOne={this.state.data}/>
                   <OrganDetail id={this.state.id} data={this.state.data}/>
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

                          /> 
                    </Dialog>
               </div>
			);
	}

}
export default NavConnect(SalesOrderDetail);
