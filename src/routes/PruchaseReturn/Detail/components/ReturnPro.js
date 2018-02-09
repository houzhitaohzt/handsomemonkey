import React, { Component,PropTypes } from 'react';
import OnlyreadyRuleTemplate from  '../../../../components/OnlyreadyRuleTemplate';
import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,language,toDecimal} from "../../../../services/apiCall";

import { I18n } from '../../../../lib/i18n';

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
        window.addEventListener('resize', this.handleResize);
    }
    handleResize(){
        let padding = 250;
        let sch=document.body.offsetHeight-20-padding;
        this.setState({scrollHeight:sch+'px',scroll:scroll});
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }
	render(){
		let that = this;
		let {valueone = {},retrunList} = this.props;
		return (
			  	<div>
	               	<div style={{backgroundColor:'#f0f4f8',overflow:'hidden'}}>
		               	<div>
		                    <OnlyreadyRuleTemplate onCancel ={this.onCancel} title ={I18n.t(400127/*退货产品*/)}
			                    id={'return-pro'}
			                    showHeader ={true}
			                    columns ={
			                    	[{
										title : I18n.t(100379/*产品*/),
										dataIndex : 'mtl'+language,
										key : 'mtl'+language,
										width : '18%',
										render(data,row,index){
											return (<div title={data}>{data}</div>)
										}
									},{
										title : I18n.t(100382/*产品规格*/),
										dataIndex : "basSpeci",
										key : "basSpeci",
										width : "25%",
										render(data,row,index){
											return <div>{data}</div>;
										}
									},{
										title : I18n.t(500067/*包装*/),
										dataIndex : "packag"+language,
										key : "packag"+language,
										width : "18%",
										render(data,row,index){
											return data;
										}
									},{
										title : I18n.t(100319/*采购数量*/),
										dataIndex :"purQty",
										key :"purQty",
										width : "10%",
										render(data,row,index){
											return (<div>{data}</div>)
										}
									},{
										title : I18n.t(400101/*退货数量*/),
										dataIndex : "returnQty",
										key : "returnQty",
										width : "10%",
										render(data,row ,index){
											return <span style={{color:'red'}}>{data}</span>;
										}
									},{
										title : I18n.t(400035/*产品单位*/),
										dataIndex : "uom"+language,
										key : "uom"+language,
										width : "10%",
										render(data,row ,index){
											return data;
										}
									},{
										title : I18n.t(400063/*采购单价含税*/),
										dataIndex : 'purTaxPrc',
										key : "purTaxPrc",
										width : "12%",
										cny: valueone["cny"+language],
										render(data,row ,index){
											return <div>{data?(toDecimal(data) +' '+valueone["cny"+language]):''}</div>;
										}},{
										title : I18n.t(400103/*采购金额小计*/),
										dataIndex : 'setTaxAgg',
										key : "setTaxAgg",
										width : "12%",
                                        cny: valueone["cny"+language],
										render(data,row ,index){
											return <div>{data?(toDecimal(data)+' '+valueone["cny"+language]):''}</div>;
										}
									},{
										title : I18n.t(400128/*退货额小计*/),
										dataIndex : 'returnTaxAgg',
										key : "returnTaxAgg",
										width : "10%",
                                        cny: valueone["cny"+language],
										render(data,row ,index){
											return <div>{data?(toDecimal(data) + " "):'0 ' + valueone["cny"+language]}</div>;
										}
									}]
			                    }
			                    data={retrunList}
			                />
		                </div>
	               	</div>
               	</div>
			);
	}

}
export default ProductDetail;
