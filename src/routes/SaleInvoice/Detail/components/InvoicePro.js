import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import OnlyreadyRuleTemplate from  '../../../../components/OnlyreadyRuleTemplate';
import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,language,toDecimal} from "../../../../services/apiCall";
export class ProductDetail extends Component{
	constructor(props) {
        super(props);
        this.handleResize=this.handleResize.bind(this);
    }

    initState(){
        return {

        }
	}
    componentDidMount(){
        this.handleResize();
        window.addEventListener('resize', this.handleResize(20));
    }
    handleResize(height){
        let padding = 250;
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
		let that = this;
		let {valueone = {},invoiceList} = this.props;
		return (
			  	<div>
	               	<div style={{backgroundColor:'#f0f4f8',overflow:'hidden'}}>
		               	<div>
		                    <OnlyreadyRuleTemplate onCancel ={this.onCancel} title ={i18n.t(400061/*发票产品*/)}
			                    id={'return-pro'}
			                    showHeader ={true}
			                    columns ={
			                    	[{
										title : i18n.t(100379/*产品*/),
										dataIndex : 'mtl'+language,
										key : 'mtl'+language,
										width : '18%',
										render(data,row,index){
											return (<div title={data}>{data}</div>)
										}
									},{
										title : i18n.t(100382/*产品规格*/),
										dataIndex : "basSpeci",
										key : "basSpeci",
										width : "30%",
										render(data,row,index){
											return <div>{data}</div>;
										}
									},{
										title : i18n.t(400062/*开票数量*/),
										dataIndex : "qty",
										key : "qty",
										width : "10%",
										render(data,row,index){
											return data;
										}
									},{
										title : i18n.t(400035/*产品单位*/),
										dataIndex : "uom"+language,
										key : "uom"+language,
										width : "12%",
										render(data,row ,index){
											return data;
										}
									},{
										title : i18n.t(201043/*销售单价含税*/),
										dataIndex : 'taxPrc',
										key : "taxPrc",
										width : "12%",
										render(data,row ,index){
											return <div>{data?(toDecimal(data) +' '+row["uom"+language]):''}</div>;
										}},{
										title : i18n.t(400064/*开票金额小计*/),
										dataIndex : 'taxAgg',
										key : "taxAgg",
										width : "12%",
                                        cny: valueone["cny"+language],
										render(data,row ,index){
											return <div>{data?(toDecimal(data)+' '+valueone["cny"+language]):''}</div>;
										}
									}]
			                    }
			                    data={invoiceList}
			                />
		                </div>
	               	</div>
               	</div>
			);
	}

}
export default ProductDetail;
