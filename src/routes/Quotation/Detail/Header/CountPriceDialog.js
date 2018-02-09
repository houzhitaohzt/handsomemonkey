import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../components/Form';
import Measurement from  '../../../../components/RuleTemplate';

import {Table} from '../../../../components/Table';

// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,language} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
import xt from "../../../../common/xt";


export class  CountPrice extends Component{

	constructor(props){
		super(props);

		// state 
		this.state = {
			data: {params:{}},
			ResultData: {params:{}},
			saveData: {},
			
			dataPrice: [{},{},{}],
			detailPrice: [],
			

			// 不可混装 
			unMixedList: [{ title: ''}], 
			unMixedData: [], 

			// 可混装 
			mixedList: [{ title: ''}], 
			mixedData: [],

			// 产品 
			productList: [{ title: ''}], 
			productData: [],			
		};

		// 产品 价格 
		this.columnsPrice = [
			{
				title : i18n.t(500061/*产品名称*/),
				dataIndex : "mtl"+language,
				key : "mtl"+language, 
				width : "30%",
				render(data,row,index){
					return (<div className="text-ellipsis">{data}</div>);
				}
			},
			{
				title : i18n.t(500065/*需求数量*/),
				dataIndex : "salQty",
				key : "salQty",
				width : "20%",
				render(data,row,index){
					return (<div className="text-ellipsis">{data || 0}{' '}{row['uomEnName']}</div>);
				}
			},
			// {
			// 	title : i18n.t(200009/*目标价*/),
			// 	dataIndex : "salQty",
			// 	key : "saleStaff1",
			// 	width : "5%",
			// 	render(data,row,index){
			// 		return (<div className="text-ellipsis">{data}</div>);
			// 	}
			// },
			{
				title : 'FOB成本价',
				dataIndex : "costPrc",
				key : "costPrc",
				width : "20%",
				render(data,row,index){
					return (<div className="text-ellipsis">{data}</div>);
				}
			},
			{
				title : i18n.t(200071/*销售价*/),
				dataIndex : "customPrice",
				key : "customPrice",
				width : "20%",
				render(data,row,index){
					return (<div className="text-ellipsis">{data}</div>);
				}
			}												
		];

		// 费用 详情
		this.columnsDetail = [
			{
				title : i18n.t(200074/*费用类型*/),
				dataIndex : "costlvtr"+language,
				key : "costlvtr"+language,
				width : "50%",
				render(data,row,index){
					return (<div className="text-ellipsis">{data}</div>);
				}
			},
			{
				title : i18n.t(200075/*费用*/),
				dataIndex : "taxAgg",
				key : "taxAgg",
				width : "50%",
				render(data,row,index){
					return (<div className="text-ellipsis">{parseFloat(Number(data).toFixed(6))}{' '}{row['cny'+language]}</div>);
				}
			}			
		];
	}

	componentDidMount(){
		this.getInit();		
    };
	componentWillUnmount() {
	}	

	// 初始化
	getInit = ()=>{
		let that = this;
		let {getOne} = this.props;
		this.setState({ 
			data: getOne['data'],
			ResultData: getOne['ResultData'],  
			dataPrice: getOne.data.params.mtls
		},()=>that.listFor());
	}

	// listFor
	listFor = ()=>{
		let that = this;
		let {data} = this.state;
		let {getNFieldProps,getFieldProps,getFieldError } = this.props.form;


		// 不可混装
		let unMixedData = data['unMixedList'].map(o=>Object.assign({},o,{pageList: data.params.pakgs.filter(j=>o['billDtlId'] == j['sdMtlId'])}));		
		let unMixedList = [{title:'',dataIndex: 'mtl'+language,key: 'mtl'+language, width: '20%'}].concat(data.colList.map(o=>{
			return {
				title: o['localName'],
				dataIndex: o['id'],
				key: o['id'],
				ignore_equals: true,
				render(data, row, index){
					let result = row['pageList'].filter(o=>o['contnrTyId'] == index['key'])[0];
					if(!result) return;
					for(let [k,v] of Object.entries(result)) {
						if(k == 'contQty') continue;
						getFieldProps('unMixed'+result['sdMtlId']+result['contnrTyId']+'.'+k,{initialValue: v });
					};
					return (<input type="text" 
								{...getFieldProps('unMixed'+result['sdMtlId']+result['contnrTyId']+'.contQty',{
									rules: [{required:true, pattern: /^[1-9]\d*$|0{1}$/}],
									initialValue: result['contQty'] || 0
								})}	 
								className ={getFieldError('unMixed'+result['sdMtlId']+result['contnrTyId']+'.contQty')?'error-border':''}													
								style={{height:'65%',width:'70%'}}
					/>); 
				}
			}
		}));
		
		// 可混装 
		let mixedData = [{pageList: data.params.pakgs.filter(o=>!o['sdMtlId'])}];   
		let mixedList = [{title:'',dataIndex: 'mtl'+language,key: 'mtl'+language, width: '20%',render(data, row, index){ return i18n.t(201020/*混装*/) }}].concat(data.colList.map(o=>{
			return {
				title: o['localName'],
				dataIndex: o['id'],
				key: o['id'],
				ignore_equals: true,
				render(data, row, index){
					let result = row['pageList'].filter(o=>o['contnrTyId'] == index['key'])[0];
					if(!result) return;
					
					for(let [k,v] of Object.entries(result)) {
						if(k == 'contQty') continue;
						getFieldProps('mixed'+result['contnrTyId']+'.'+k,{initialValue: v });
					};


					return (<input type="text" 
								{...getFieldProps('mixed'+result['contnrTyId']+'.contQty',{
									rules: [{required:true, pattern: /^[1-9]\d*$|0{1}$/}],
									initialValue: result['contQty'] || (o['localName'].includes('20') ? 1:0)
								})}	
								onKeyUp={that.mixedHandle.bind(this,result)}
								className ={getFieldError('mixed'+result['contnrTyId']+'.contQty')?'error-border':''}													
								style={{height:'65%',width:'70%'}}
					/>); 
				}
			}
		}));

		// 产品  
		let productData = data['mixedList'].map(o=>Object.assign({},o,{pageList: data.params.pakgMtls.filter(j=>o['billDtlId'] == j['sdMtlId'])}));		
		let productList = [{title:i18n.t(500061/*产品名称*/),dataIndex:'mtl'+language,key:'mtl'+language, width:'25%',render(data, row, index){ return (<div title={data} className={'text-ellipsis'}>{data}</div>) }},{title:i18n.t(200846/*销售数量*/),dataIndex:'salQty',key:'salQty', width:'25%',render(data, row, index){ return data+' '+row['uomEnName'] }}].concat(data.colList.map(o=>{
			return {
				title: o['localName'],
				dataIndex: o['id'],
				key: o['id'],
				ignore_equals: true,
				render(data, row, index){
				
					let result = row['pageList'].filter(o=>o['contnrTyId'] == index['key'])[0];
					if(!result) return;

					for(let [k,v] of Object.entries(result)) {
						if(k == 'loadQty') continue;
						getFieldProps('product'+result['sdMtlId']+result['contnrTyId']+'.'+k,{initialValue: v });
					};

					return (<input type="text" 
								{...getFieldProps('product'+result['sdMtlId']+result['contnrTyId']+'.loadQty',{
									rules: [{required:true, pattern: /^[1-9]\d*(\.\d+)?$|0\.\d*[1-9]\d*$|0{1}$/}],
									initialValue: result['loadQty'] || (o['localName'].includes('20') ? row['salQty']:0)
								})}	 
								disabled={!result['disable'] ? true : false}
								onKeyUp={that.productHandle.bind(this,row)}
								className ={getFieldError('product'+result['sdMtlId']+result['contnrTyId']+'.loadQty')?'error-border':''}													
								style={{height:'65%',width:'70%'}}
					/>); 
				}
			}
		}));


		
		// 数据 更新
		this.setState({ 
			unMixedList: unMixedList, 
			mixedList: mixedList, 
			productList: productList			
		},()=>{
			that.setState({
				unMixedData: unMixedData || [],
				mixedData: mixedData[0].pageList.length ? mixedData : [],
				productData: productData || []				
			});
		});


	}

	// 混装 验证
	mixedHandle = (row,e)=>{
		let that = this;
		let {form} = this.props;
		let {data} = this.state;		
		let {contnrTyId,salQty,billDtlId} = row;
		let v = e.target.value;

		
		if( /^[1-9]\d*$|0{1}$/.test(v)) {
			if(v >= 1) {
				var tem = data.params.pakgMtls.map(o=>{ return (o['contnrTyId']==contnrTyId) ? Object.assign({},o,{disable:true}) : o });
				
			} else{
				var tem = data.params.pakgMtls.map(o=>{ return (o['contnrTyId']==contnrTyId) ? Object.assign({},o,{disable:false,loadQty:'0'}) : o });
			
			}
			data.params.pakgMtls = tem;
			this.setState({ data: data },this.listFor());
		}
		
	}
	// 产品 输入验证 
	productHandle = (row,e)=>{
		let that = this;
		let {form} = this.props;		
		let {salQty,billDtlId} = row;
		let v = e.target.value;

		form.validateFields((errors, value) => {
			if( Object.keys(errors).length > 1 ) return;

			let sum = Object.entries(value).filter(([k,v])=>k.includes('product') && v['sdMtlId'] == row['billDtlId']).map(([k,v])=>Number(v['loadQty'])).reduce((a,b)=>a+b);
			if(sum > Number(salQty)) ServiceTips({text:'‘和’不能大于销售数量！',type:'info'})
		}) 
		
		
	}
  
	// 计算价格 
	countHandle = ()=>{
		let that = this;
		let {ResultData} = this.state;
		const {form} = this.props;

		form.validateFields((errors, value) => {
			if(errors){
			}else{
				let pakgs = [];
				let pakgMtls = [];
				
				
				// 数据 拼接
				for(let [k,v] of Object.entries(value)) {
					if( k.includes('unMixed') || k.includes('mixed') ) pakgs.push(v);
					if( k.includes('product') ) pakgMtls.push(v);					
				};

				ResultData.params['orderRate'] = value['orderRate'];
				ResultData.params['pakgs'] = pakgs;
				ResultData.params['pakgMtls'] = pakgMtls;
				
					
				apiPost(API_FOODING_ERP,'/calculationmode/calculate',ResultData,
					(response)=>{
						let dataPrice = response.data.mtlCosts.map( (o)=>Object.assign({},ResultData.params['mtls'].filter((j)=>o['billDtlId']==j['billDtlId'])[0],o) );
						
						that.setState({
							saveData: response.data,
							dataPrice: dataPrice, 
							detailPrice: response.data.costlvtrs,
						});
					},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
				});
			}
		})
	}

	// 保存
	onSaveAndClose = ()=>{
		let that = this;
		let {saveData} = this.state;
		const {form, onSaveAndClose} = this.props;

		if( !Object.entries(saveData).length ) {
			ServiceTips({text:i18n.t(600160/*未计算价格*/),type:'info'});
			return;
		}

		form.validateFields((errors, value) => {
			if(errors){
			}else{
				// 数据 拼接
				let pakgs = [];
				for(let [k,v] of Object.entries(value)) {
					if( k.includes('unMixed') || k.includes('mixed') ) pakgs.push(v);
				};
		
				apiPost(API_FOODING_ERP,'/saleoffer/saveCalculation',Object.assign({},saveData,{pakgs:pakgs}),
					(response)=>{	
						that.props.onCancel();  
						window.navTabs.open(i18n.t(201019/*销售报价详情*/),`/quotation/detail`,{id: response['data']},{refresh: true});
					},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
				});
			}
		})

	}

	// 
	onCancel = ()=>{
		this.props.onCancel(); 
	}
    
	render(){
		let that = this;
		let {dataPrice,detailPrice} = this.state;
		let { getFieldProps, getFieldError } = this.props.form;
		let {data,unMixedList,unMixedData,mixedList,mixedData,productList,productData} = this.state;

		return(<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} width={976}>
					<div className="addnormal girdlayout scroll" style={{margin:0,height:390,overflow:'auto'}}>
						<div className={'row'}>
							<div className="col-md-4">
								<label className={'col-md-4'}><span>*</span>{i18n.t(200067/*成本利用率*/)}</label>
								<input type="text"
									{...getFieldProps('orderRate',{
										rules: [{required:true, pattern: /^([1-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])$/}],
										initialValue: data.params['loadQty'] || ''
									})}	 
									className ={getFieldError('orderRate')?'col-md-7 text-input-nowidth error-border':'col-md-7 text-input-nowidth'}													
									
								/>
								<span className ={'col-md-1'}>&nbsp;&nbsp;%</span>
							</div>
							<div className="col-md-1">
								<div className="col-md-2">
									<button onClick={this.countHandle} style={{background:"#0066cc"}}  type="button" className="btn btn-info btn-md" title={i18n.t(200062/*计算价格*/)}>&nbsp;<i className="foddingicon fooding-count-cost" title={i18n.t(200062/*计算价格*/)}></i>&nbsp;</button>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-md-6">
								<Measurement 						
									title ={i18n.t(201022/*计算装箱-可混装*/)} 
									showHeader ={true}
									showKey={false}
									showCheck={false}
									columns={mixedList} 
									data={mixedData}							
								/>
							</div>
							<div className="col-md-6">
								<Measurement 						
									title ={i18n.t(100379/*产品*/)} 
									showHeader ={true}
									showKey={false}
									showCheck={false}
									columns={productList} 
									data={productData}							
								/>							
							</div>						
		
						</div>	
						<div className="row">
							<div className="col-md-6">
								<Measurement 						
									title ={i18n.t(201023/*计算装箱-不可混装*/)} 
									showHeader ={true}
									showKey={false}
									showCheck={false}
									columns={unMixedList} 
									data={unMixedData}							
								/>
							</div>						
						</div>	
						<div className="row">	
							<Measurement 						
								title ={i18n.t(200070/*产品价格*/)} 
								showHeader ={true}
								showKey={false}
								showCheck={false}
								columns={this.columnsPrice} 
								data={dataPrice}							
							/>										
						</div>	
						<div className="row">
							<Measurement 						
								title ={i18n.t(200073/*费用详情*/)} 
								showHeader ={true}
								showKey={false}
								showCheck={false}
								columns={this.columnsDetail} 
								data={detailPrice}							
							/>										
						</div>
					</div>
				</FormWrapper>
			);
	}

}

const CountPriceFrom =createForm()(CountPrice);
export default CountPriceFrom;
