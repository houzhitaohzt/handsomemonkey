import React, { Component } from 'react';
const {Table} = require("../../../../../components/Table");
import NavConnect from '../../../../../components/NavigateTabs/containers/AddContainer';
import {createForm,FormWrapper} from '../../../../../components/Form';
// ajax
import {I18n} from '../../../../../lib/i18n';
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,language,pageSize,sizeList} from '../../../../../services/apiCall';
import ServiceTips from '../../../../../components/ServiceTips';
import Select, {Option ,ConstMiniSelect } from '../../../../../components/Select';
export  class  ActivityDetail extends Component{
	constructor(props){
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.onTableClick = this.onTableClick.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this); // 保存
		this.onCancel = this.onCancel.bind(this);
		this.cangkuClick= this.cangkuClick.bind(this); //仓库
		this.getInfo = this.getInfo.bind(this);
		this.onSelect=this.onSelect.bind(this);
		let that = this;
		this.columns = [
			{title :I18n.t(400025/*仓库*/),
				dataIndex : "sl"+language,
				key : "sl"+language,
				width : "5%",
				render(data,row ,index){
					return <div>{data}</div>
				}
			},{
				title : I18n.t(400026/*库区*/),
				dataIndex : "st"+language,
				key : "st"+language,
				width : "5%",
				render(data,row,index){
					return (<div className="text-ellipsis" title={data}>{data}</div>)
				}
			},{
				title :I18n.t(400027/*储位*/),
				dataIndex : "slsp"+language,
				key : "slsp"+language,
				width : "5%",
				render(data,row,index){
					return (<div className="text-ellipsis" title={data}>{data}</div>)
				}
			},{
				title : I18n.t(400012/*品牌*/),
				dataIndex : 'brand'+language,
				key : "brand"+language,
				width : "5%",
				render(data,row,index){
					return data;
				}
			},{
				title : I18n.t(400028/*原供应商*/),
				dataIndex : 'vndBe'+language,
				key : "vndBe"+language,
				width : "8%",
				render(data,row,index){
					return data;
				}
			},{
				title :  I18n.t(500151/*批次号*/),
				dataIndex : 'batchNo',
				key : 'batchNo',
				width : "5%",
				render(data,row,index){
					return data;
				}
			},{
				title : I18n.t(400029/*过期日期*/),
				dataIndex : "shelfEdate",
				key : "shelfEdate",
				width : "5%",
				render(data,row,index){
					return new Date(data).Format('yyyy-MM-dd')
				}
			},{
				title : I18n.t(400030/*物料状态*/),
				dataIndex : 'mStats'+language,
				key : "mStats"+language,
				width : "5%",
				render(data,row,index){
					return data;
				}
			},{
					title :I18n.t(500162/*锁定编号*/),
					dataIndex : 'lockingNo',
					key : "lockingNo",
					width : "7%",
					render(data,row,index){
						return data;
					}
			},{
					title : I18n.t(400031/*库存数量*/),
					dataIndex : 'baseQty',
					key : "baseQty",
					width : "5%",
					render(data,row,index){
						return data;
					}
			},{
					title : I18n.t(500163/*出库数量*/),
					dataIndex : 'stockingQty',
					key : "stockingQty",
					width : "5%",
					ignore_equals: true,
					render(data,row,index){
						return data;
					}
			}];

		this.state = {
			inputValue:'',
			checked:0,
			paddingTop:0,
			scroll:0,
			scrollHeight:0,
			filter:null,
			selectArr:[],
			checkedRows:[],
			choised:false,
			data:{},
			info:[],
			MeunState:true,
			cangkuArray:[],
			chukuarray:[]
		}
	}
	handleChange(e){
	}
	// 保存
	onSaveAndClose(){
		let that = this;
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(errors){
			}else{
				if(value.outstock){
					apiPost(API_FOODING_ERP,'/noticestock/inStock',value,
						(response)=>{							
							ServiceTips({text:response.message,type:'success'});
							that.props.form.resetFields(); // 清除表单
							that.props.onSaveAndClose(); // 关闭弹框
							this.props.getList(); // 刷新列表
						},(errors)=>{
							ServiceTips({text:errors.message,type:'error'});
					});	
				}else{
					ServiceTips({text:'产品没有仓库请取消重试!',type:'error'});
				}
			}
		})
		
	}
	// 取消
	onCancel(){
		this.props.form.resetFields(); // 清除表单
		this.props.onSaveAndClose(); // 关闭弹框
	}
	onTableClick(value){
		if(this.state.checked == 0){
			this.setState({
				inputValue:value.business + '  '+ value.theme
			})
		}else if(this.state.checked == 1){
			this.setState({
				inputValue:value.business + '  '+ value.theme
			})
		}
	}
	cangkuClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.StorLocatn'},
			(response)=>{
				that.setState({
					cangkuArray:response.data
				})
		},(error)=>{

		});
	}
	//获取出入库操作明细
    getInfo(slId){
    	let {info} = this.props;
    	let data = this.props.data;
    	slId= slId || data.slId;
    	let that = this;
        apiGet(API_FOODING_ERP,'/stock/getPage',{ 
        	slId:slId,
        	mtlId:info.mtl.mtlId,
        	vndBeId:info.mtl.vndBeId,
        	brandId:info.mtl.brandId,
        	lockingNo:info.mtl.orderNo || -1,billId:data.billId,inventory:1,isPagable:false},(response)=>{
            that.setState({
                chukuarray:response.data.data
            });
        },(errors)=>{
        })
    }
    onSelect(slId,item){
		var that = this;
        that.getInfo(item.props.objValue.slId)

	}
	handleResize(height){
		this.setState({
  			paddingTop:!this.state.paddingTop
  		});
  		let padding = 80;
		let sch=document.body.offsetHeight-height-padding;
		let scroll = sch-135;

		this.setState({scrollHeight:sch+'px',scroll:scroll});
	}
	componentDidMount(){
        this.handleResize(0);
        this.getInfo();
		window.addEventListener('resize', this.handleResize(0));
    };
	componentWillUnmount() {
    	window.removeEventListener('resize', this.handleResize(0));
  	}
  	componentWillReceiveProps(nextProps){
  		this.handleResize(0);
		window.addEventListener('resize', this.handleResize(0));
  	}
	render(){
			let array = [];
			let {checkedData} = this.props;
			let info = this.props.info || {}
			let data = this.props.data;
			let content = <div></div>;
			const mingxiarray = this.state.mingxiarray || [];
			let {getNFieldProps,getFieldProps,getFieldError,getFieldValue }= this.props.form;
			getFieldProps('billId', {
							            	validateFirst: true,
						                    initialValue:data?data.billId:''
			})
			getFieldProps('billDtlId', {
							            	validateFirst: true,
						                    initialValue:info.mtl?info.mtl.billDtlId:''
			})
			getFieldProps('billType', {
							            	validateFirst: true,
						                    initialValue:info?info.billType:''
			})
			getFieldProps('eqBasnum', {
							            	validateFirst: true,
						                    initialValue:info?info.eqBasnum:''
			})
			let chukuarray = this.state.chukuarray;
			for (let i = 0; i < chukuarray.length; i++) {
	            let obj = Object.assign({}, chukuarray[i]);
	            //^([0-3](\.\d+)?|4)$
	            //验证0 - 4 的数字 [0.0, 4.0] 包含销售
	            obj.baseQty = obj.baseQty / info.eqBasnum;

	            let validate = (rule, value, callback) => {
	            	if(value.trim() === '') return callback([])
	                if(parseFloat(value) <= obj.baseQty && obj.baseQty > 0){
	                    callback([]);
	                } else callback([I18n.t(400102/*数量不能大于*/) + obj.baseQty]);
	            };
	            obj.stockingQty = <div key={i}>
	                <span hidden {... getNFieldProps('outstock[' + i + '].id', { initialValue: obj.id,  })} />
	                <input style={{width: 60}} className={getFieldError('outstock[' + i + '].nums')?"error-border":''}
	                       {...getFieldProps('outstock[' + i + '].nums', {
	                           validateFirst: true,
	                           rules: [{required: false}, validate],
	                           initialValue: '',
                               key: obj.id
	                       })}
	                />
	            </div>;
	            array.push(obj);
	        }

			if(this.props.DialogContent == 1){
	           content = (
	           <div className={'  girdlayout'}>
							  	<div className={'row'}>
									                <div className="form-group col-xs-3 col-md-3">
														<label className={'col-xs-4 col-md-4'}>{I18n.t(100379/*产品*/)}</label>
														<p className={'col-xs-8 col-md-8'}>{info.mtl?info.mtl['mtl'+language]:''}</p>
															
													</div>
													<div className="form-group col-xs-3 col-md-3">
														<label className={'col-xs-8 col-md-8'}>{I18n.t(500154/*入库数量/已操作数量*/)}</label>
														<p className={'col-xs-4 col-md-4'}>{info.mtl?info.mtl.qty:''}/{info.mtl?info.mtl.hasBeenQty:''}</p>
								
													</div>
													<div className="form-group col-xs-3 col-md-3">
														<label className={'col-xs-4 col-md-4'}>{I18n.t(400035/*产品单位*/)}</label>
														<p className={'col-xs-8 col-md-8'}>{info.mtl?info.mtl['uom'+language]:''}</p>
													</div>
													<div className="form-group col-xs-3 col-md-3">
													<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(400025/*仓库*/)}</label>
													<Select 
														{...getNFieldProps('slId',{
																                    rules: [{required:true}],
																                    initialValue:data["sl"+language]?{s_label:data["sl"+language], slId:data.slId, slLcName:data.slLcName, slEnName:data.slEnName}:undefined
																                })}
																                placeholder=''
																                optionLabelProp="children"							
																                className ={getFieldError('slId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}							
																                onClick={this.cangkuClick}
																                 onSelect={this.onSelect}
																                >
																                {this.state.cangkuArray.map((o,i)=>
																                	<Option key={i} 
																                	objValue={{
																                		s_label:o.localName, 
																                		slId: o.id, 
																                		slLcName :o.localName, 
																                		slEnName: o.name
																                	}} title={o.name}>{o.localName}</Option>)}
													</Select>
													
									</div>

								</div>
				</div>
				)
	       }
			return (
			<div className="package-action-buttons">
					<FormWrapper showFooter={true} buttonLeft = {this.props.buttonLeft} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
						{content}
						<Table
							columns={this.columns}
							data={array}
							checkboxConfig={{show:false,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
							colorFilterConfig={{show : false,dataIndex:'colorType'}}
							followConfig={{show:false}}
							scroll={{x:true,y:this.state.scroll}}
							onRowDoubleClick={this.onRowDoubleClick}
						/>
					</FormWrapper>
			</div>
			);

	}

}

export default NavConnect(createForm()(ActivityDetail));

