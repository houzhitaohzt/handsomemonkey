import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import OnlyreadyRuleTemplate from  '../../../../../components/OnlyreadyRuleTemplate';
import Dialog  from '../../../../../components/Dialog';
import Confirm from '../../../../../components/Dialog/Confirm';
import Template1  from  '../../../../Client/Detail/Content/components/Template1';
import  System from "./System";


// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,API_FOODING_ERP,language,commonAjax,toDecimal} from '../../../../../services/apiCall';


export class ProductDetail extends Component{
    constructor(props) {
        super(props);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
        this.onCancel=this.onCancel.bind(this);
        this.state=this.initState();
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
            dilogTelmp:<div></div>
        }
    }
    componentDidMount(){
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
        return (
                <div>
                    <div style={{backgroundColor:'#f0f4f8',overflow:'hidden'}}>
                        <div className='col' style={{padding:'0'}}>
                            <OnlyreadyRuleTemplate title ={i18n.t(500121/*费用名称*/)} openDialog={this.handleClick}
                                onSaveAndClose={this.onSaveAndClose}
                                onCancel = {this.onCancel}
                                id={'39'}
                                showHeader ={true}
                                columns ={
                                    [{
                                        title : i18n.t(500129/*源单编号*/),
                                        dataIndex : 'sourceNo',
                                        key : "sourceNo",
                                        width : '20%',
                                        render(data,row,index){
                                            return (<div title={data}>{data}</div>)
                                        }
                                    },{
                                        title : i18n.t(500121/*费用名称*/),
                                        dataIndex : "costlvtr"+language,
                                        key : "costlvtr"+language,
                                        width : "25%",
                                        render(data,row,index){
                                            return data;
                                        }
                                    },{
                                        title : i18n.t(200404/*报销金额*/),
                                        dataIndex : "actCost",
                                        key : "actCost",
                                        width : "20%",
                                        render(data,row,index){
                                            return (<div>{data?(toDecimal(data)+' '+row['cny'+language]):''}</div>)
                                        }
                                    },{
                                        title : i18n.t(100336/*备注*/),
                                        dataIndex : "remark",
                                        key : "remark",
                                        width : "30%",
                                        render(data,row,index){
                                            return data;
                                        }
                                    }]
                                }
                                data={this.props.listData || []}
                            />
                        </div>
                        <div className='col' style={{backgroundColor:'#f0f4f8',overflow:'hidden',padding:'0'}}>
                            <System getOneData={this.props.getOneData}/>
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
