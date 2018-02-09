import i18n from './../../../lib/i18n';
import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../../components/Form";


//引入弹层
import Dialog from '../../../components/Dialog/Dialog';
import Confirm from '../../../components/Dialog/Confirm';//删除弹层
//引入select插件
import Select, { Option } from 'rc-select';
//引入table
import Page from "../../../components/Page"; 
import Table from "../../../components/Table";
// ajax
import {permissionsBtn,apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList,toDecimal} from '../../../services/apiCall';
import ServiceTips from '../../../components/ServiceTips';
class Record extends Component{
	constructor(props){
		super(props)
		this.onCancel=this.onCancel.bind(this);
		this.state=this.initState();
		this.getPage = this.getPage.bind(this);
		var that = this;
		 this.onClickLink = this.onClickLink.bind(this);
	}

	static propTypes={
		data: PropTypes.object,
		form: PropTypes.object,
		onCancel: PropTypes.func,
		columns_party:PropTypes.array,
		searchParty:PropTypes.func
	}
	initState(){
		var that = this;
		return {

		initData: [], // 初始化 数据
		currentPage:1, // 当前页
		totalPages: 1, // 总页数
		pageSize: pageSize, // 每页 多少条
		billId: '',	
		ccId: '',
		sData:{},
		data:{},



		columns_party:[{
			title : i18n.t(400028/*原供应商*/),
			dataIndex : 'vndBeLcName',
			key : "vndBeLcName",
			width : '10%',
			render(data,row,index){
				return <div title={data} className={'text-ellipsis'}>{data}</div>;
			}
		},{
			title : i18n.t(500151/*批次号*/),
			dataIndex : "batchNo",
			key : "batchNo",
			width : "10%",
			render(data,row,index){
				return <div title={data} className={'text-ellipsis'}>{data}</div>;
			}
		},{
			title : i18n.t(200903/*基础数量*/),
			dataIndex : "outNum",
			key : "outNum",
			width : "10%",
			render(data,row,index){
				return <div>{data?(toDecimal(data) + ' ' + row.uomLcName):''}</div>;
			}
		},{
			title : i18n.t(500331/*采购单价*/),
			dataIndex : "purTaxPrc",
			key : "purTaxPrc",
			width : "10%",
			render(data,row,index){
				return <div>{data?(toDecimal(data)+'USD'):''}</div>;
			}
		},{
			title : i18n.t(600060/*销售成本*/),
			dataIndex : "saleUnitPrc",
			key : "saleUnitPrc",
			width : "10%",
			render(data,row,index){
                return <div>{data?(toDecimal(data))+'USD':''}</div>;
			}
		},{
			title : i18n.t(500330/*原始采购订单*/),
			dataIndex : "purNoList",
			key : "purNoList",
			width : "10%",
			render(data,row,index){
                return row.purNoList.map( (o,i)=>
                    <div onClick={that.onClickLink.bind(that,data,row,o)} className='link-color' key={i}><span style={{marginRight:30}}>{o}</span></div>
                );

			}
		}],
		
		tableSources:[],
		}
	}

	componentDidMount(){
		this.getPage();		
    };
	componentWillUnmount() {
	}

	onCancel(){
		const {onCancel} = this.props;
		if(onCancel){
			onCancel();
		}
	}



    onClickLink(row,o,index){
       let that = this;
        apiGet(API_FOODING_ERP,'/common/findByNo',{no:index},
            (response)=>{
                that.setState({
                    data:response.data,

                });
                let billId = that.state.data.billId;
                window.navTabs.open(i18n.t(200990/*采购订单详情*/),`/pruchaseorder/detail/`,{id:billId},{refresh:true});
            },(errors)=>{

            });
    }
	// 页面 刷新
	getPage(){
		let that = this;
		apiGet(API_FOODING_ERP,'/purorder/getStockout',Object.assign({mtlId:that.props.data.mtlId,no:that.props.data.no}),
			(response)=>{				
				that.setState({	
					tableSources: response.data || [],	
				});
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});		
	}

	render(){

		let that = this;
		const {form,data} = this.props;
		const { getFieldProps, getFieldError } = this.props.form;
		const disabled = form.isFieldsValidating() || form.isSubmitting();
		const inputStar=(<span className={''}>*</span>);
		
		return (<FormWrapper showFooter={true} showSaveClose={false} onCancel={this.onCancel} >
					<div className="common-party" style={{height:'320px'}}>
						<div className="common-party-table">
							<div className={'keys-page'}>
							</div>							
							<Table
								columns={this.state.columns_party}
								data={this.state.tableSources}
								checkboxConfig={{show:false,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
								colorFilterConfig={{show : false,dataIndex:'colorType'}}
								followConfig={{show:false}}
								scroll={{x:true, y:230}}
							/>
						</div>
					</div>
			</FormWrapper>);
	}
}

Record = createForm()(Record);

export default Record;


