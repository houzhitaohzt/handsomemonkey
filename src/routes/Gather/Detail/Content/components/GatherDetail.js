import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import Template1  from  '../../../../Client/Detail/Content/components/Template1';
import MeasureCommon from  '../../../../../components/RuleTemplate';
import NavConnect from '../../../../../components/NavigateTabs/containers/AddContainer';
import Dialog  from '../../../../../components/Dialog';
import Confirm from '../../../../../components/Dialog/Confirm';
import NormalDetail from "./NormalDetail";
import BankDetail from "./BankDetail";
import ShoukuanDetail from "./ShoukuanDetail";
import Organ from "./Organ";
import Jilu from "./Jilu";
import Tiaozheng from "./Tiaozheng"
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList} from '../../../../../services/apiCall';
import ServiceTips from '../../../../../components/ServiceTips';
export class GatherDetail extends Component{
  constructor(props) {
        super(props);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
    this.onCancel=this.onCancel.bind(this);
        this.state=this.initState();
        this.getOne=this.getOne.bind(this);
        this.getBank=this.getBank.bind(this);
        this.getShou =  this.getShou.bind(this);
        this.handleClick= this.handleClick.bind(this);//结单
        this.guanbiClick = this.guanbiClick.bind(this);//反结单
        this.EditClick = this.EditClick.bind(this); //编辑
        this.collenctionClick = this.collenctionClick.bind(this); //收款记录
        this.tiaozhengClick = this.tiaozhengClick.bind(this); //费用调整

    }
     initState(){
        return {
            visible:false,
            showSaveClose:true,
            title:'',
            scrollHeight:0,
            dilogTelmp:<div></div>,
            id:this.props.location.query.id,
            data:{}
        }
    }
     getOne(){
        var that = this;
        apiGet(API_FOODING_ERP,'/receipt/getOne',{billId:this.props.location.query.id},(response)=>{
            that.setState({
                data:response.data || {}
            })
        },(error)=>{

        })
    }
    EditClick(){
        let select = this.refs.product.getData();
        if( select.length == 0 ){
                Confirm('请选中一条收款计划数据？');
        }else if( select.length == 1 ){
            let content=require('./Jihua').default;
           
             apiGet(API_FOODING_ERP,'/receipt/plan/getOne',{id:this.refs.product.getData()[0].billDtlId},(response)=>{
                 let element=React.createElement(content,{onCancel:this.onCancel,onSaveAndClose:this.onSaveAndClose, getShou:this.getShou,info:response.data});
                this.setState({
                    dilogTelmp:element
                });
            },(errors)=>{

             })
            this.setState({
                visible : true,
                title:i18n.t(200596/*收款计划*/),
                dilogTelmp: <div></div>,
                dialogFile:'./Jihua'
            })
        }
        
    }
     //核销
    hexiaoClick = () => {
        let {data = {}} = this.state;
        apiPost(API_FOODING_ERP,'/invoiceverification/getVeriInfo',{billId:data.billId,billType:data.billType}, response => {
            let content=require('./HexiaoDialog').default;
            let element=React.createElement(content,{onCancel:this.onCancel,data:response.data||{},valueone:data,onSaveAndClose:this.onhexiaoClick});
            this.setState({
                visible:true,
                title:i18n.t(200597/*核销*/),
                dilogTelmp:element,
            });
        },error => ServiceTips({text:error.message,type:'error'}))
    }
    onhexiaoClick = () => {
        this.setState({visible:false},() => this.getOne());
    }
    //查看发票核销
    approveClick = () => {
        let {data = {}} = this.state;
        let content=require('./ApprovialDialog').default;
        let element=React.createElement(content,{onCancel:this.onCancel,billId:data.billId,data:data});
        this.setState({
            visible:true,
            title:i18n.t(200598/*核销记录*/),
            dilogTelmp:element,
        });         
    }
    handleClick(){
      var that = this;
        let {navAddTab,navRemoveTab} =this.props;
         Confirm("你确定要结单吗?", {
              done: () => {
                    apiForm(API_FOODING_ERP,"/receipt/settle",{billId:this.state.id},response => {
                        ServiceTips({text:response.message,type:"success"})
                        this.getOne()
                        this.getBank()
                        this.getShou()
                    },error => {
                        ServiceTips({text:error.message,type:'error'})
                    })
                },
                close:() => {
                    console.log('no, close')
                }
            });
    }
    guanbiClick(){
        Confirm("你确定要反结单吗?", {
              done: () => {
                    apiForm(API_FOODING_ERP,"/receipt/unSettle",{billId:this.state.id},response => {
                        ServiceTips({text:response.message,type:"success"})
                        this.getOne()
                        this.getBank()
                        this.getShou()
                    },error => {
                        ServiceTips({text:error.message,type:'error'})
                    })
                },
                close:() => {
                    console.log('no, close')
                }
            });
    }
    collenctionClick(){
        let that = this;
        let select = this.refs.product.getData();
        // 条件判断
        if( select.length == 0 ){
                Confirm('请选中一条数据？');
            }else if( select.length == 1 ){

                apiGet(API_FOODING_ERP,'/receipt/getRecordList',{id:this.refs.product.getData()[0].billDtlId},(response)=>{
                     this.setState({
                            visible : true,
                            showHeader:true,
                            buttonLeft:i18n.t(200267/*保存并且关闭*/),
                            showSaveClose:false,
                            title:i18n.t(200599/*收款记录*/),
                            checkedData: {},
                                dilogTelmp: <Jilu DialogContent={this.state.DialogContent}
                             checkedData = {this.state.checkedData}
                             buttonLeft = {this.state.buttonLeft}
                              contentDate = {this.state.contentDate}
                              onCancel = {this.onCancel}
                              data={this.state.data}
                              getShou = {this.getShou}
                              getBank ={this.getBank}
                              jihuaArray={response.data}
                              /> 
                },(error)=>{

                })
                           
            })
        }else{
          Confirm('请选中一条数据？');
        }
    }
    tiaozhengClick(){
        let that = this;
        that.setState({
              visible : true,
              showHeader:true,
              buttonLeft:i18n.t(200267/*保存并且关闭*/),
              checkedData: {},
              dilogTelmp: <Tiaozheng DialogContent={this.state.DialogContent}
                             checkedData = {this.state.checkedData}
                             buttonLeft = {this.state.buttonLeft}
                              onSaveAndClose ={this.onSaveAndClose}
                              showSaveClose={this.state.showSaveClose}
                              contentDate = {this.state.contentDate}
                              onCancel = {this.onCancel}
                              zhubiao={this.state.data}
                              getShou = {this.getShou}
                              getOne={this.getOne}
                              getBank={this.getBank}
                              shoukuanArray={this.state.shoukuanArray}
                              /> 
                
            });
    }
    onSaveAndClose(values){
        this.setState({visible:false});
    }
  onCancel(){
        this.setState({visible:false});
  }
    getBank(){
       apiGet(API_FOODING_ERP,'/receipt/getCostList',{billId:this.state.id},(response)=>{
            this.setState({
               BankArray:response.data
            });
        },(error)=>{

        }) 
    }
    getShou(){
        apiGet(API_FOODING_ERP,'/receipt/plan/getList',{billId:this.state.id},(response)=>{
            this.setState({
               shoukuanArray:response.data
            });
        },(error)=>{

        }) 
    }
    componentDidMount(){
        this.handleResize();
        this.getOne();
        this.getBank();
        this.getShou();
        window.addEventListener('resize', this.handleResize(20));
        

    }
    handleResize(e, height) {
        let sch=document.body.offsetHeight-100;
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
    console.log(this.state.scrollHeight);
    return (
        <div className='scroll' style={{backgroundColor:'#f0f4f8',
        height:'578px',overflow:'auto'}}>
              
                 <NormalDetail collenctionClick={this.collenctionClick} guanbiClick = {this.guanbiClick} tiaozhengClick = {this.tiaozhengClick} handleClick = {this.handleClick}  hexiaoClick = {this.hexiaoClick}
                   approveClick = {this.approveClick} EditClick={this.EditClick} id={this.state.id} data={this.state.data}/>
                
                 <Organ id={this.state.id} data={this.state.data}/>
                   <ShoukuanDetail id={this.state.id}  ref ="product" zhubiao={this.state.data} shoukuanArray={this.state.shoukuanArray}/>
                   <BankDetail id={this.state.id}   id={this.state.id} BankArray={this.state.BankArray}/>
                   <Dialog width={926} visible={this.state.visible} title={this.state.title}>
                  {this.state.dilogTelmp}
                   </Dialog>
               </div>
      );
  }

}
export default NavConnect(GatherDetail);
                                      