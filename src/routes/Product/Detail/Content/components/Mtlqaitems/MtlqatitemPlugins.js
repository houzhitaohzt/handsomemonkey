import React, { Component,PropTypes } from 'react';

import DraggableList from "react-draggable-list";
import MtlQatitemPlSingle from "./MtlqatitemPlSingle";
import "./mtl.less";
import {permissionsBtn,apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,language,pageSize,sizeList} from '../../../../../../services/apiCall';
import ServiceTips from '../../../../../../components/ServiceTips';
import i18n from './../../../../../../lib/i18n';
import Dialog  from '../../../../../../components/Dialog';
import Confirm from '../../../../../../components/Dialog/Confirm';//删除弹层

class MtlqatitemPlugins extends Component{
    constructor(props){
        super(props)
        this.state = {
            mtlQaitems:[],
            visible:false,
            dialogTitle:"",
            commonForm:<div></div>,
            dataTyId:this.props.dataTyId

        }
    }
    initList = mtlId => {
        apiGet(API_FOODING_DS,'/mtlQaitem/getPage',{mtlId:mtlId,dataTyId:this.state.dataTyId,pageSize:1000},response => {
            this.setState({
                mtlQaitems:response.data.data || []
            })
        },error => {
            ServiceTips({text:error.message,type:'error'});
        })
    }
    componentDidMount(){
        this.initList(this.props.id)
    }
    componentWillReceiveProps(nextProps){
        if(this.props.id !== nextProps.id){
            this.initList(nextProp.id)
        }
        if(this.props.dataTyId !== nextProps.dataTyId){
            this.setState({dataTyId:nextProps.dataTyId})
        }
    }
    //拖拽之后改变函数
    _onListChange = (list,current) => {
        let that = this,time;
        let targetList = list.map((e,i) => ({id:e.id,weight:i}));
        apiPost(API_FOODING_DS,"/mtlQaitem/updateWeight",{beanArray:targetList},response => {
            ServiceTips({text:response.message,type:'success'});
            clearTimeout(time);
             time = setTimeout(() => {that.initList(that.props.id)},500)            
        },error => ServiceTips({text:error.message,type:'error'}))
    }
    onSaveAndClose = () => {
        this.setState({visible:false},() => {this.initList(this.props.id);this.props.initMtlQailtem()})
    }
    onCancel = () => {
        this.setState({visible:false})
    }
    //右键的handleClick
    handleClick = (e,data) => {
        let that = this;
        if(data.action == 1){
            let id = data.action == 1?"":data.name.id;
            let title = data.action == 1 ? i18n.t(100392/*新增*/) + i18n.t(100601/*产品规格细分*/):i18n.t(100439/*编辑*/) + i18n.t(100601/*产品规格细分*/);
            let valueone = Object.assign({},{dataTyId:this.state.dataTyId,id:id});
            // apiGet(API_FOODING_DS,'/mtlQaitem/getInit',valueone,response => {
            //     let initData = response.data;
                let content=require('./MtlQatitemDailog').default;
                let element=React.createElement(content,{onSaveAndClose:this.onSaveAndClose,onCancel:this.onCancel,
                    initData:{},type:data.action,mtlId:this.props.id,dataTyId:this.state.dataTyId});
                this.setState({
                    visible : true,
                    dialogTitle: title,
                    commonForm: element
                })
            // },error => console.log(error.message))
        }else if(data.action== 2){
            let id = data.action == 1?"":data.name.id;
            let title = data.action == 1 ? i18n.t(100392/*新增*/) + i18n.t(100601/*产品规格细分*/):i18n.t(100439/*编辑*/) + i18n.t(100601/*产品规格细分*/);
            let valueone = Object.assign({},{dataTyId:this.state.dataTyId,id:id});
            apiGet(API_FOODING_DS,'/mtlQaitem/getOne',valueone,response => {
                let initData = response.data;
                let content=require('./MtlQatitemDailog').default;
                let element=React.createElement(content,{onSaveAndClose:this.onSaveAndClose,onCancel:this.onCancel,
                    initData:initData,type:data.action,mtlId:this.props.id,dataTyId:this.state.dataTyId});
                this.setState({
                    visible : true,
                    dialogTitle: title,
                    commonForm: element
                })
            },error => console.log(error.message))
        }
        else{
           Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/),{
               done:() => {
                   apiForm(API_FOODING_DS,'/mtlQaitem/delete',{id:data.name.id},response => {
                       ServiceTips({text:response.message,type:'success'});
                       that.initList(this.props.id);
                       that.props.initMtlQailtem();
                   },error => ServiceTips({text:error.message,type:'error'}))
               }
           }) 
        }        
    }
    render(){
        const {menuObj} = this.props;
        let {mtlQaitems} = this.state;
        return (<div className={'mtlqtitem'}>
            <div className={'mtlqtitem-title'}> 
                <span className={'mtlqtitem-title-one'}>{i18n.t(100601/*产品规格细分*/)}</span>
                {
                   permissionsBtn(menuObj.permissionsAdd) ?<span className={'mtlqtitem-title-two'} onClick={this.handleClick.bind(this,null,{action:1})}><i className={'foddingicon fooding-add-icon3'}></i></span>:""
                }
                         
            </div>
            {
                mtlQaitems.length == 0?"":

                <ul className={'mtlqtitem-ul scroll'} style={{maxHeight:"300px",overflowY:"auto",overflowX:'auto'}}>
                    <li className={'mtlqtitem-ul-single'}>
                        <span className={'mtlqtitem-ul-single-drag'}></span>
                        <span className={'mtlqtitem-ul-single-main'}>{i18n.t(100602/*主要*/)}</span>
                        <span className={'mtlqtitem-ul-single-name'}>{i18n.t(100001/*名称*/)}</span>
                        <span className={'mtlqtitem-ul-content-calsymbol'}></span>
                        <span className={'mtlqtitem-ul-single-target'}>{i18n.t(100605/*指标*/)}</span>
                        <span className={'mtlqtitem-ul-single-testmethod'}>{i18n.t(100606/*测试方法*/)}</span>
                        <span className={'mtlqtitem-ul-single-operate'}></span>
                    </li>
                    <DraggableList 
                        itemKey="id"
                        template={MtlQatitemPlSingle}
                        list={this.state.mtlQaitems}
                        onMoveEnd={this._onListChange}
                        handleClick={this.handleClick}
                        commonProps={{handleClick:this.handleClick,menuObj:menuObj}}
                        padding={1}
                    />
                </ul>
            }
            <Dialog visible={this.state.visible} title={this.state.dialogTitle} width={926}>
                {this.state.commonForm}
            </Dialog>
        </div>)
    }
}
export default MtlqatitemPlugins;