import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import Template1  from  '../../../../Client/Detail/Content/components/Template1';
import MeasureCommon from  '../../../../../components/RuleTemplate';
import Dialog  from '../../../../../components/Dialog';
import Confirm from '../../../../../components/Dialog/Confirm';
import NormalDetail from "./NormalDetail";
import RequireDetail from "./RequireDetail";
import NavConnect from '../../../../../components/NavigateTabs/containers/AddContainer';
import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,
    pageSize,sizeList,language} from "../../../../../services/apiCall";
import ServiceTips from '../../../../../components/ServiceTips';
export class SalesOrderDetail extends Component{
	constructor(props) {
        super(props);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
        this.state=this.initState();
        this.getOne = this.getOne.bind(this);
        this.Edit = this.Edit.bind(this);
        this.deleteClick = this.deleteClick.bind(this);
        this.shenpiClick = this.shenpiClick.bind(this);
        this.chukuClick = this.chukuClick.bind(this);
        this.FOBClick = this.FOBClick.bind(this);
        this.commitClick = this.commitClick.bind(this);
    }
    shenpiClick(){
        let {getOne = {}} = this.state;
        let billId = getOne.billId,billType = getOne.billType;
        let content = require('../../../../PruchaseOrder/Detail/Content/components/ApprovalDialog').default;
        let element = React.createElement(content, {onCancel: this.onCancel,billType:billType,billId:billId});
        this.setState({
                visible: true,
                title: i18n.t(100470/*查看审批*/),
                dialogContent: element,
                showHeader:false
        })
    }
    //提交
    commitClick(){
        let that = this;
        let {getOne = {}} = this.state;
        let billId = getOne.billId,billType = getOne.billType;
        Confirm(i18n.t(200369/*您确定要提交此订单吗*/), {
              done: () => {
                    apiForm(API_FOODING_ERP,"/common/submitBill",{billId:billId,billType:billType},response => {
                        //刷新当前页面
                        this.getOne();
                        ServiceTips({text:response.message,type:"success"})
                    },error => {
                        ServiceTips({text:error.message,type:'error'})
                    })
                },
                close:() => {
                    console.log('no, close')
                }
        });
    }
    chukuClick(){
        let that = this;
        Confirm(i18n.t(300033/*您确定要执行作废操作吗？*/), {
                done: () => {
                    apiForm(API_FOODING_ERP,'/productpricing/drop',{billId:this.state.id},(response)=>{
                        ServiceTips({text:response.message,type:'sucess'});
                        this.props.navRemoveTab({name: i18n.t(200950/*产品定价详情*/), component: i18n.t(200950/*产品定价详情*/), url: '/productpricing/detail'});
                        this.props.navReplaceTab({name:i18n.t(200959/*产品定价*/),component:i18n.t(200959/*产品定价*/),url:'/productpricing/list'});
                        this.props.router.push({ pathname: '/productpricing/list'});
                    },(error)=>{
                        ServiceTips({text:error.message,type:'error'});
                    });
                }
        });
    }
    Edit(){
        let that = this;
        let {navAddTab,navRemoveTab,navReplaceTab} =this.props;
        navReplaceTab({name:i18n.t(200960/*产品定价编辑*/),component:i18n.t(200960/*产品定价编辑*/),url:'/productpricing/addEidt'});
        this.props.router.push({pathname:'/productpricing/addEidt',query:{id:this.state.id}});
    }
    deleteClick(){
        let that =this;
        Confirm(i18n.t(300035/*删除后将无法恢复，您确定要删除吗？*/), {
                done: () => {
                    apiForm(API_FOODING_ERP,'/productpricing/delete',{billId:this.state.id},(response)=>{
                        ServiceTips({text:response.message,type:'sucess'});
                        this.props.navRemoveTab({name: i18n.t(200950/*产品定价详情*/), component: i18n.t(200950/*产品定价详情*/), url: '/productpricing/detail'});
                        this.props.navReplaceTab({name:i18n.t(200959/*产品定价*/),component:i18n.t(200959/*产品定价*/),url:'/productpricing/list'});
                        this.props.router.push({ pathname: '/productpricing/list'});
                    },(error)=>{
                        ServiceTips({text:error.message,type:'error'});
                    });
                }
        });
    }
    FOBClick(){
        Confirm(i18n.t(201015/*你确定计算FOB价吗*/), {
              done: () => {
                    apiForm(API_FOODING_ERP,"/productpricing/calculate",{billId:this.props.location.query.id},response => {
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
    onSaveAndClose(values){
        this.setState({visible:false});
    }
	onCancel(){
        this.setState({visible:false});
	}
    initState(){
        return {
            visible:false,
            title:'',
            dilogTelmp:<div></div>,
            getOne:{},
            id:this.props.location.query.id,
            dialogContent:<div></div>
        }
	}
    componentDidMount(){
        this.handleResize();
        this.getOne();
        window.addEventListener('resize', this.handleResize(20));
    }
    getOne(){
          apiGet(API_FOODING_ERP,'/productpricing/getOne',{billId:this.state.id},(response)=>{
                this.setState({
                    getOne:response.data
                });
          },(error)=>{

          })
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
			  <div className='activity-detail scroll' style={{height:this.state.scrollHeight}}>
	               <NormalDetail  getOne={this.state.getOne} id={this.state.id}
                    Edit ={this.Edit}  deleteClick = {this.deleteClick}
                    shenpiClick ={this.shenpiClick}
                    chukuClick = {this.chukuClick}
                    FOBClick={this.FOBClick}
                    commitClick={this.commitClick}
                   />
                   <RequireDetail getOne={this.state.getOne} id={this.state.id}/>
                   <Template1
                       menuList={[
                         {type:i18n.t(100439/*编辑*/),child:<div><i className='foddingicon fooding-alter_icon2'></i>{i18n.t(100439/*编辑*/)}</div>}
                       ]}
                   onCancel ={this.onCancel}  openDialog={this.handleClick} id={'4'}
                    title={i18n.t(100140/*组织*/)} isShowMenu={false} isShowIcon={false}
                      tempArray={[{key:i18n.t(500143/*集团组织*/),value:this.state.getOne["cluster"+language]},
                      {key:i18n.t(100244/*企业*/),value:this.state.getOne["cc"+language]},
                      {key:i18n.t(200937/*发布人*/),value:this.state.getOne["purStaff"+language]}
                    ]}/>
                   <Dialog visible={this.state.visible} title={this.state.title} width={926}>
                        {this.state.dialogContent}
                   </Dialog>
               </div>
			);
	}

}
export default NavConnect(SalesOrderDetail);
