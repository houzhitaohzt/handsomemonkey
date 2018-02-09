import i18n from './../../../../lib/i18n';
import React,{Component,PropTypes} from 'react';
import Page from "../../../../components/Page";//分页
import Dialog from '../../../../components/Dialog/Dialog';//弹层
const {Table} = require("../../../../components/Table");//Table表格
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
import {browserHistory} from 'react-router';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import FilterHeader from "./FilterHeader";
import FunctionKeys from "./FuncKeys";
import ProductPriceS from './ProductPriceS';
//引入提示
import Tooltip from 'antd/lib/tooltip';
import SpecTextCard from "../../../Product/List/SpecText/SpecText";
import {I18n} from '../../../../lib/i18n';
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList,toDecimal} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
class Check extends Component{
	constructor(props){
		super(props);
		this.handleResize = this.handleResize.bind(this);
		this.state=this.initState();
		this.delayClick=this.delayClick.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.getPage = this.getPage.bind(this);
		this.danbaojiaClick=this.danbaojiaClick.bind(this);
		this.duobaojiaClick=this.duobaojiaClick.bind(this);
		this.del = this.del.bind(this);
		var that = this;
		this.columns = [{
			title : i18n.t(100379/*产品*/),
			dataIndex : 'mtl'+language,
			key : "mtl"+language,
			width : "10%",
			sort:'mtlLcName',
			render(data,row,index){
				return <div onClick={that.onClickLink.bind(that,row)} className='link-color'>{data}</div>;
			}
		},{
			title : i18n.t(100382/*产品规格*/),
			dataIndex : 'basSpeci',
			key : 'basSpeci',
			width : "15%",
			tooltip: false,
			sort:false,
			render(data,row,index){
				if(data){
					return (<Tooltip
	                    placement="bottomLeft"
	                    mouseEnterDelay={0.5}
	                    arrowPointAtCenter={true}
	                    mouseLeaveDelay={0.2}
	                    prefixCls="spctext-toolip"
						trigger="click"
	                    overlay={<SpecTextCard id={row&&row.mtlId}/>}
	                >
	                    <div className="text-ellipsis mail-hover">{data}</div>
	                </Tooltip>)
				}
			}
		},{
			title : i18n.t(500067/*包装*/),
			dataIndex : 'packag'+language,
			key : "packag"+language,
			width : "15%",
			sort:false,
			render(data,row,index){
				return (<div title={data} className={'text-ellipsis'}>{data}</div>)
			}
		},{
			title : i18n.t(400012/*品牌*/),
			dataIndex : 'brand'+language,
			key : "brand"+language,
			width : "15%",
			sort:'brandId',
			render(data,row,index){
				return (<div title={data} className={'text-ellipsis'}>{data}</div>)
			}
		},{
			title : i18n.t(100297/*起运港*/),
			dataIndex : 'sStatn'+language,
			key : "sStatn"+language,
			width : "15%",
			sort:false,
			render(data,row,index){
				return (<div title={data} className={'text-ellipsis'}>{data}</div>)
			}
		},{
			title : "FOB成本价",
			dataIndex : 'fobPrice',
			key : "fobPrice",
			width : "20%",
			className:'text-right',
			sort:false,
			render(data,row,index){
				return (<div>
				{(data?toDecimal(data):0)+' '+'USD'+(row["uom"+language]?'/'+row["uom"+language]:'')+(row["contnrType"+language]?'/'+row["contnrType"+language]:'')}
					<i className='foddingicon fooding-ladder-price' style={{marginLeft:"5px"}} onClick={that.pingxiangClick.bind(that,row)}></i>
				</div>)
			}
		},{
			title : i18n.t(100287/*失效日期*/),
			dataIndex : 'eDate',
			key : 'eDate',
			width : "15%",
			sort:false,
			className:'text-center',
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title : i18n.t(400037/*采购员*/),
			dataIndex : 'purStaff'+language,
			key : "purStaff"+language,
			width : "10%",
			sort:false,
			className:'text-center',
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(200098/*操作*/),
			dataIndex : 'caozuo',
			key : "caozuo",
			width : '10%',
			sort:false,
			className:'text-center',
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>
						<i className='foddingicon fooding-quote' style={{paddingRight:30,fontSize:18}} onClick={that.danbaojiaClick.bind(that,row)} title={i18n.t(200116/*报价*/)}></i>

						<i className='foddingicon fooding-delay-quote' style={{fontSize:18}} onClick={that.duobaojiaClick.bind(that,row)} title={i18n.t(201056/*待报价*/)}></i>
					</div>)
			}
		}];
	}

	initState(){
		return {
			scrollHeight:0,
			filter:null,
			selectArr:[],
			selectData:[],
			checkedRows:[],
			choised:false,
			data:[],
			obj:{},
			pageSize:pageSize,
			currentPage:1,
			daifu:0
		}
	}
	onClickLink(row){
		let {navAddTab} =this.props;
 		navAddTab({id:7,name:i18n.t(100402/*产品详情*/),component:i18n.t(100402/*产品详情*/),url:'/product/detail'});
  		this.props.router.push({pathname:'/product/detail',query:{id:row.mtlId}});
	}
	delayClick(row,e){
		let numArr = this.refs.product.getSelectArr();
		let num = numArr.length;
		if(this.state.selectData.length>0){

	    	this.setState({
	    		daifu:1,
	    		showDilaog : true,
	    		title: i18n.t(200116/*报价*/),
	    		dialogContent:<div></div>
	    	})
		}else{
			Confirm(i18n.t(200832/*请选择1条数据进行操作*/));
		}

	}
	//单个报价
	danbaojiaClick(record){
		let numArr =[]; //this.refs.product.getSelectArr();
    	let tempString = I18n.t(100398/*自动报价*/);
    	numArr.push(record);
    	let num = numArr.length;
			let content=require('./ProductPrice').default;
			let element=React.createElement(content,{onSaveAndClose:this.onSaveAndClose,onCancel:this.onCancel,num:num,proArr:numArr,getPage:this.getPage});
    	this.setState({
    		daifu:0,
    		showDilaog : true,
    		title: tempString,
    		dialogContent: element
    	})
	}

	//列表多个报价总和的按钮
	duobaojiaClick(record){
		let selectArr = this.state.selectArr;
		let selectData = this.state.selectData;
		if(selectArr.indexOf(record.billId)>-1){
			 return
			for(var i=0;i<selectData.length;i++){
				if(selectData[i].billId == record.billId){
					selectData.splice(i,1);


				}
			}
		}else{
			if(selectData.length > 19){
				ServiceTips({text:"一次最多只能对20种产品进行报价!",type:'error'});
			}else{

				selectArr.push(record.billId);
				selectData.push(record);
		    }

		}
		this.setState({
			selectArr:selectArr,
			selectData:selectData


		});
	}

    pingxiangClick = (row, e) => {
        let content=require('./BoxListDailog').default;
        let element=React.createElement(content,{onCancel:this.onCancel, billId:row.billId, singleData:row});
        this.setState({
            showDilaog : true,
            title: "拼箱价格表",
            dialogContent: element
        })
	};

	onSaveAndClose(){
		this.setState({
			showDilaog:!this.state.showDilaog
		})
	}
	onCancel(){
		this.setState({
			showDilaog:false
		})
	}
	handleClick(e,data){
	}
	del(row,e){
		if(e){
			this.setState({
				selectArr:[]
			});
		}else{
			let selectArr = this.state.selectArr;
			if(selectArr.indexOf(row.billId)>-1){
				for(var i=0;i<selectArr.length;i++){
					if(selectArr[i] == row.billId){
						selectArr.splice(i,1);
					}
				}
			}
			this.setState({
				selectArr:selectArr
			});
		}

	}
	//请求列表  list
	getPage(currentPage,order){
		 this.columnSort = order = order || this.columnSort || {order:'asc',column:'mtlLcName'};
		let that = this;
		var sID = sID || '';
		 let currentP = !isNaN(currentPage) && currentPage? currentPage: 1;
		let object=Object.assign({},{pageSize: this.state.pageSize, currentPage: currentP},that.normalRef.getForm(),order);
		apiGet(API_FOODING_ERP,'/purquotation/getSalePage',object,
				(response)=>{
					that.setState({
						data: response.data.data,
						totalPages: response.data.totalPages,
						currentPage: response.data.currentPage,
						totalRecords:response.data.totalRecords
					});
				},(errors)=>{
		});
	}
	handleResize(e, height) {
        this.filterHeight = height || this.filterHeight || 50;
        let scroll = document.body.offsetHeight - 170 - this.filterHeight;
        this.setState({scroll: scroll});
    }
	componentDidMount(){
		var that = this;
		this.getPage();
		this.handleResize();
		window.addEventListener('resize', this.handleResize);
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize);
	}
	render(){
			const data = this.state.data || [];
			let {page,currentPage,daifu} =this.state;
			let com;
			let that = this;
		if(daifu==1){
	    	com = <ProductPriceS onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}
						selectData={this.state.selectData}
						selectArr={this.state.selectArr}
						del = {this.del}
						getPage={this.getPage}/>
	    }else{
	    	com = this.state.dialogContent;
	    }
		let count = this.state.selectArr.length;
		return(<div>
			<FilterHeader getPage ={this.getPage}  normalRef={no => this.normalRef = no} />
			<div className={'client-body'} style={{height: '100%', position: 'absolute'}}>
				<div className={'client-body-single'}>
				  <div className="action-buttons">
					<div className={'key-page'}>
						<div className={'oprate-btn'} onClick={this.delayClick}>
							<span className={'btn-group'} style={{fontSize:'20px'}}>
								<label style={{position: 'absolute', top: 0,fontSize: '12px',backgroundColor: 'red',padding: '1px',width:'30px',
    							color:' #fff',borderRadius: '10px',right: -11,textAlign:'center'}} className={count>0?'':'none'}>{count}</label>
								<i className={'foddingicon   fooding-delay-quote'}></i>
							</span>
						</div>
						<Page
							currentPage={this.state.currentPage}
							totalPages={this.state.totalPages}
							sizeList={sizeList}
							totalRecords={this.state.totalRecords}
							currentSize={this.state.pageSize}
							pageSizeChange={(num)=>{
								this.setState({ pageSize: Number.parseInt(num) },()=>this.getPage(currentPage, num));
							}}
							backClick={(num)=>{
								this.setState({ currentPage: Number.parseInt(num) },()=>this.getPage(num));
							}}
							nextClick={(num)=>{
								this.setState({ currentPage: Number.parseInt(num) },()=>this.getPage(num));
							}}
							goChange={(num)=>{
								this.setState({ currentPage: Number.parseInt(num) },()=>this.getPage(num));
							}}
						/>
					</div>
					<Table
						ref = "product"
						columns={this.columns}
						data={data}
						checkboxConfig={{show:false,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						colorFilterConfig={{show : false,dataIndex:'colorType'}}
						followConfig={{show:false}}
						scroll={{x:true,y:this.state.scroll}}
						onHeaderSortClick={this.getPage.bind(this, null)}

					/>
					<Dialog width={926} visible={this.state.showDilaog} title={this.state.title}>
						{com}
					</Dialog>
				</div>
				</div>
			</div>
		</div>)
	}
}
export default NavConnect(Check);
