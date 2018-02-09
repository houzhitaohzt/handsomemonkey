import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import OnlyreadyRuleTemplate from  '../../../../../components/OnlyreadyRuleTemplate';
import Dialog  from '../../../../../components/Dialog';
import Confirm from '../../../../../components/Dialog/Confirm';
import Template1  from  '../../../../Client/Detail/Content/components/Template1';
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,API_FOODING_ERP,language,commonAjax,toDecimal} from '../../../../../services/apiCall';
export class ProductDetail extends Component{
    constructor(props) {
        super(props);
        this.state=this.initState();
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
    initState(){
        return {
            visible:false, 
            dialogTitle:'',
            dilogTelmp:<div></div>
        }
    }

    render(){
        const commonForm = this.state.dilogTelmp;
        return (
                <div>
                    <div style={{backgroundColor:'#f0f4f8',overflow:'hidden'}}>
                        <div  style={{padding:'0'}}>
                            <OnlyreadyRuleTemplate onCancel ={this.onCancel} title ={i18n.t(500121/*费用名称*/)} openDialog={this.handleClick}
                                onSaveAndClose={this.onSaveAndClose}
                                onCancel = {this.onCancel}
                                id={'39'}
                                showHeader ={true}
                                columns ={
                                    [{
                                        title : i18n.t(500129/*源单编号*/),
                                        dataIndex : 'sourceNo',
                                        key : "sourceNo",
                                        width : '10%',
                                        render(data,row,index){
                                            return (<div title={data}>{data}</div>)
                                        }
                                    },{
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
                                    },{
                                        title : i18n.t(100230/*状态*/),
                                        dataIndex : "isConfirmed",
                                        key : "isConfirmed",
                                        width : "5%",
                                        render(data,row,index){
                                            return (<div>{data?i18n.t(201065/*已确认*/):i18n.t(300069/*未确认*/)}</div>)
                                        }
                                    }]
                                }
                                data={this.props.listData || []}
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