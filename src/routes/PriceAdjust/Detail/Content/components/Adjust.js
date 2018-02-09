import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import OnlyreadyRuleTemplate from  '../../../../../components/OnlyreadyRuleTemplate';
import Dialog  from '../../../../../components/Dialog';
import Confirm from '../../../../../components/Dialog/Confirm';
import Template1  from  '../../../../Client/Detail/Content/components/Template1';
import {toDecimal} from '../../../../../services/apiCall';
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
                        <div>
                            <OnlyreadyRuleTemplate onCancel ={this.onCancel} title ={i18n.t(200902/*调整明细*/)} openDialog={this.handleClick}
                                onSaveAndClose={this.onSaveAndClose}
                                showHeader ={true}
                                columns ={
                                    [{
                                        title : i18n.t(400026/*库区*/),
                                        dataIndex : "name",
                                        key : "name",
                                        width : "10%",
                                        render(data,row,index){
                                            return data;
                                        }
                                    },{
                                        title : i18n.t(400027/*储位*/),
                                        dataIndex : "direction",
                                        key : "direction",
                                        width : "5%",
                                        render(data,row,index){
                                            return <div>{data}</div>;
                                        }
                                    },{
                                        title : i18n.t(400012/*品牌*/),
                                        dataIndex : "brand",
                                        key : "brand",
                                        width : "5%",
                                        render(data,row,index){
                                            return <div>{data}</div>;
                                        }
                                    },{
                                        title : i18n.t(400029/*过期日期*/),
                                        dataIndex : "date",
                                        key : "date",
                                        width : "10%",
                                        render(data,row,index){
                                            return <div>{data}</div>;
                                        }
                                    },{
                                        title : i18n.t(400030/*物料状态*/),
                                        dataIndex : "sign",
                                        key : "sign",
                                        width : "7%",
                                        render(data,row,index){
                                            return <div>{data}</div>;
                                        }
                                    },{
                                        title : i18n.t(200903/*基础数量*/),
                                        dataIndex : "amount",
                                        key : "amount",
                                        width : "5%",
                                        render(data,row,index){
                                            return <div>{data}</div>;
                                        }
                                    },{
                                        title : i18n.t(500141/*采购单价*/),
                                        dataIndex : "price",
                                        key : "price",
                                        width : "7%",
                                        render(data,row,index){
                                            return data?toDecimal(data):'';
                                        }
                                    },{
                                        title : i18n.t(100319/*采购数量*/),
                                        dataIndex : "ments",
                                        key : "ments",
                                        width : "7%",
                                        render(data,row,index){
                                            return data;
                                        }
                                    }]
                                }
                                data={[{'name':i18n.t(200177/*样品库*/),'direction':i18n.t(200177/*样品库*/),'brand':i18n.t(200904/*福德牌*/),'date':'2016-12-29','sign':'良品','amount':'790MT','price':'117.09CNY','ments':'790MT'}]}
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
