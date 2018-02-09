import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import OnlyreadyRuleTemplate from  '../../../../../components/OnlyreadyRuleTemplate';
import Dialog  from '../../../../../components/Dialog';
import Confirm from '../../../../../components/Dialog/Confirm';
import Template1  from  '../../../../Client/Detail/Content/components/Template1';


// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,language,commonAjax,toDecimal} from '../../../../../services/apiCall';


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
                            <OnlyreadyRuleTemplate title ={i18n.t(600226/*属性列表*/)} openDialog={this.handleClick}
                                onSaveAndClose={this.onSaveAndClose}
                                onCancel = {this.onCancel}
                                id={'39'}
                                showHeader ={true}
                                columns ={
                                    [{
                                        title : i18n.t(600228/*属性名称*/),
                                        dataIndex : 'localName',
                                        key : "localName",
                                        width : '20%',
                                        render(data,row,index){
                                            return (<div className="text-ellipsis">{data}</div>);
                                        }
                                    },{
                                        title : i18n.t(600229/*属性标识*/),
                                        dataIndex : "attrIdentity",
                                        key : "attrIdentity",
                                        width : "20%",
                                        render(data,row,index){
                                            return (<div className="text-ellipsis">{data}</div>);
                                        }
                                    },{
                                        title : i18n.t(600230/*属性类型*/),
                                        dataIndex : "formObjectAttrType",
                                        key : "formObjectAttrType",
                                        width : "20%",
                                        render(data,row,index){
                                            return (<div className="text-ellipsis">{data ? data['name']:''}</div>);
                                        }
                                    },{
                                        title : i18n.t(600227/*取值*/),
                                        dataIndex : "formObject",
                                        key : "formObject",
                                        width : "20%",
                                        render(data,row,index){
                                            return (<div className="text-ellipsis">{data ? data['localName']:''}</div>);
                                        }
                                    },{
                                        title : i18n.t(600234/*参数*/),
                                        dataIndex : "queryParams",
                                        key : "queryParams",
                                        width : "20%",
                                        render(data,row,index){
                                            return (<div className="text-ellipsis">{data}</div>);
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
