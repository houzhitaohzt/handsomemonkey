import React, { Component,PropTypes } from 'react';
import OnlyreadyRuleTemplate from  '../../../../../components/OnlyreadyRuleTemplate';
import Measurement from  '../../../../../components/RuleTemplate';
import Dialog  from '../../../../../components/Dialog';
import Confirm from '../../../../../components/Dialog/Confirm';
import Template1  from  '../../../../Client/Detail/Content/components/Template1';
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,language,pageSize,sizeList} from '../../../../../services/apiCall';
import ServiceTips from '../../../../../components/ServiceTips';
 import {I18n} from "../../../../../lib/i18n"; 
export class ProductDetail extends Component{
    constructor(props) {
        super(props);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
        this.onCancel=this.onCancel.bind(this);
        this.state=this.initState();
        //单个小列表初始化数据函数
        this.getPage = this.getPage.bind(this);
        //单个页面的保存函数
        this.saveFunc = this.saveFunc.bind(this);
        //获取详情里面的所有列表数据
        this.getDetailData =this.getDetailData.bind(this);
    }
    handleClick = (e, data, Template) => {
        if(data.number ==2){
            let id = [],tempString = I18n.t(100433/*删除后将无法恢复，您确定删除吗？*/);
            id = (data && data.record)? [data.record.id]:data.selectArr.map((o) => o.id);
            if(!(data && data.record || data.selectArr.length == 1)){
                tempString = I18n.t(100395/*已选中*/) + data.selectArr.length + I18n.t(100396/*条数据删除后将无法恢复，您确定删除吗？*/);
            }
            Confirm(tempString, {
                done: () => {
                  if(data.name && data.name.title == I18n.t(100195/*支付执行*/)){
                        this.deleteFunc(API_FOODING_DS,'/payTrmExecute/delete',{id:id},response => {
                            this.getPage(API_FOODING_DS,'/payTrmExecute/getPage',{paytrmId:data.record.paytrmId},response => {
                                ServiceTips({text:response.message,type:'success'});
                                this.setState({
                                    data:response.data.data
                                })
                            },error => {
                               ServiceTips({text:error.message,type:'error'});
                            })
                        })
                  }
                }
               })
            }else{
            let dialogTitle= data.action+data.name.title;
             this.setState({
                visible:true,
                dialogTitle:dialogTitle,
                dilogTelmp:Template
            });
        }
    }
    getData(){
        apiGet(API_FOODING_DS,'/payTrmExecute/getInit',{id:this.props.id},(response)=>{
            let {basDayTypes,exeNumTypes,fundTypes}  = response.data; 
            this.setState({
               basDayTypes:basDayTypes,
               exeNumTypes:exeNumTypes,
               fundTypes:fundTypes

            })
        },(error)=>{
           ServiceTips({text:error.message,type:'error'});
        })
    }
    onSaveAndClose(value,data){
       value = Object.assign({},value,{id:this.state.id})
        //data为空对象，表示是新增,否则表示是编辑        
        if(JSON.stringify(data) !== "{}"){
            value = Object.assign({},value,{id:data.id,optlock:data.optlock})
        }
        //apiPost 保存数据
        apiPost(API_FOODING_DS,'/payTrmExecute/save',value,response => {
           ServiceTips({text:response.message,type:'success'});
            //getPage 刷新单个模块数据
            this.getPage(API_FOODING_DS,'/payTrmExecute/getPage',{paytrmId:value.paytrmId},response => {
                this.setState({
                    data:response.data.data
                })
            },error => {
                ServiceTips({text:error.message,type:'error'});
            })
        },error => {
            ServiceTips({text:error.message,type:'error'});
        })
        this.setState({visible:false});
    }
    onCancel(){
        this.setState({visible:false});
    }
    //删除函数 deleteFunc
    /**
        API_Fooding : 请求地址
        params : 请求路径
        value :　所传的参数
    */
    deleteFunc(API_Fooding,params,value,resolve,reject){
        let that = this;
        apiForm(API_Fooding,params,value,resolve,reject);
    }

    //保存函数 saveFunc
    /**
        API_Fooding : 请求地址
        params : 请求路径
        value :　所传的参数
    */
    saveFunc(API_FOODING,params,value){
        let that = this;
        apiForm(API_FOODING,params,value,response => {
           ServiceTips({text:response.message,type:'error'});
        }, error => {
            ServiceTips({text:error.message,type:'error'})
        })
    }
    //更新单个列表模块的页面
    /*
        由于每个列表模块的页面数据比较少，最多也就50多条，因此将每次拉取的数据写死
    */
    getPage(API_FOODING,params,value,resolve,reject){
        value = Object.assign({},value,{pageSize:100,currentPage:1,column:'id',order:'desc'})
        apiGet(API_FOODING,params,value,resolve,reject);
    }
    initState(){
        return {
            visible:false, 
            dialogTitle:'',
            dilogTelmp:<div></div>
        }
    }
    //进入详情初始化数据
    getDetailData(API_FOODING,params,value,resolve,reject){
       var that = this;
         this.getPage(API_FOODING_DS,'/payTrmExecute/getPage',{paytrmId:this.props.id},(response)=>{
                        let {basDayTypes,exeNumTypes,fundTypes}=response.data;
                        that.setState({data:response.data.data,page:{basDayTypes:basDayTypes,exeNumTypes:exeNumTypes,fundTypes:fundTypes}});
                    },(errors)=>{

        });
    };
    componentDidMount(){
        this.getData();//初始化常规Select选择数据
        this.getDetailData();//初始化详情列表数据
        this.handleResize();
        window.addEventListener('resize', this.handleResize(20));
    }
    handleResize(height){
        this.setState({
            paddingTop:!this.state.paddingTop
        });
        let padding = this.state.paddingTop ? 173:262;
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
        let data = this.props.data;
        return (
                <div>
                    <div style={{backgroundColor:'#f0f4f8'}}>
                        <div>
                            <Measurement 
                                menuList={[
                                    {type:'add'},
                                    {type:'delete'},
                                    {type:'edit'}                                        
                                ]}                            
                                onCancel ={this.onCancel} title ={I18n.t(100195/*支付执行*/)} openDialog={this.handleClick}
                                onSaveAndClose={this.onSaveAndClose}
                                otherData={this.props.id}
                                showHeader ={true}
                                AjaxInit={true}
                                API_FOODING={API_FOODING_DS}
                                 portname={'/payTrmExecute/getInit'}
                                 id={'44'}
                                 params={{}}
                                columns ={
                                    [{
                                        title : I18n.t(100196/*付款顺序*/),
                                        dataIndex : "exeSN",
                                        key : "exeSN",
                                        width : "10%",
                                        render(data,row,index){
                                            return data;
                                        }
                                    },{
                                        title : I18n.t(100197/*金额计算模式*/),
                                        dataIndex : "exeNumType",
                                        key : "exeNumType",
                                        width : "5%",
                                        render(data,row,index){
                                            return <div>{data?data.name:''}</div>;
                                        }
                                    },{
                                        title : I18n.t(100198/*百分比%*/),
                                        dataIndex : "exePer",
                                        key : "exePer",
                                        width : "5%",
                                        render(data,row,index){
                                            return <div>{data}</div>;
                                        }
                                    },{
                                        title : I18n.t(100199/*指定金额*/),
                                        dataIndex : "exeNumb",
                                        key : "exeNumb",
                                        width : "10%",
                                        render(data,row,index){
                                            return <div>{data}</div>;
                                        }
                                    },{
                                        title : I18n.t(100200/*天数*/),
                                        dataIndex : "aftDays",
                                        key : "aftDays",
                                        width : "7%",
                                        render(data,row,index){
                                            return <div>{data}</div>;
                                        }
                                    },{
                                        title : I18n.t(100201/*附加月份*/),
                                        dataIndex : "exeAddMth",
                                        key : "exeAddMth",
                                        width : "5%",
                                        render(data,row,index){
                                            return <div>{data}</div>;
                                        }
                                    }]
                                }
                                data={this.state.data}
                            />
                        </div>  
                    </div>
                    <Dialog visible={this.state.visible} title={this.state.dialogTitle} width={926}>
                        {commonForm}
                    </Dialog>
                </div>
            );
    }

}
export default ProductDetail;