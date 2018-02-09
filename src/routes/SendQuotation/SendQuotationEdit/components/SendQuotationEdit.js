import i18n from './../../../../lib/i18n';
import React, {Component} from 'react';
import Template1 from '../../../Client/Detail/Content/components/Template1';
import OnlyreadyRuleTemplate from '../../../../components/OnlyreadyRuleTemplate';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import xt from '../../../../common/xt';
import Dialog from '../../../../components/Dialog';
import Confirm from '../../../../components/Dialog/Confirm';
import ClientInformation from "./ClientInformation"; //客户信息
import CommerceClause from "../../SendQuotationDetail/Content/components/CommerceClause"; //商务条款
import {API_FOODING_ERP, apiGet, apiPost} from '../../../../services/apiCall';
import {errorTips} from "../../../../components/ServiceTips";
import createForm from "../../../../components/Form/createForm";

//提示框

export  class  SendQuotationEdit extends Component{
	constructor(props){
		super(props);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.calculationPriceClick=this.calculationPriceClick.bind(this);
		this.backClick=this.backClick.bind(this);
		this.sendQuotClick=this.sendQuotClick.bind(this);
		this.confirmClick=this.confirmClick.bind(this);
		this.saveClick=this.saveClick.bind(this);
            this.state={
            paddingTop:0,
			visible:false,
            productData: [],
            businessOne: {},
            cardData: [],
            shipData: [],
            testData: []
		}
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
	singleChange(row,e){
		let tempArray = this.state.onChangeArray;
		for(let i = 0; i < tempArray.length; i++){
			if(row.id == tempArray[i].id){
				tempArray[i].targetValue = e.target.value;
			}
		}
		this.setState({
			onChangeArray:tempArray
		})
	}
    onSaveAndClose(){
		this.setState({showDilaog:!this.state.visible});
	}
	onCancel(){
		this.setState({visible:false});
	}
	calculationPriceClick(){
		let content =require('./QuotationCalculationDialog').default;
		let element=React.createElement(content,{onSaveAndClose:this.onSaveAndClose,onCancel:this.onCancel});
    	this.setState({
    		visible : true,
    		title:i18n.t(200058/*报价计算*/),
    		dialogContent : element
    	})
	}

	backClick(){
        let {navReplaceTab} = this.props;
        let billId = this.props.location.query.id;
        if (billId) {
            navReplaceTab({name: i18n.t(200053/*发出的报价详情*/), component: i18n.t(200053/*发出的报价详情*/), url: '/sendquotation/detail'});
            this.props.router.push({pathname: '/sendquotation/detail', query: {id: billId}});
        } else {
            navReplaceTab({name: i18n.t(200059/*发出的报价*/), component: i18n.t(200059/*发出的报价*/), url: '/sendquotation/list'});
            this.props.router.push({pathname: '/sendquotation/list'});
        }
	}

	sendQuotClick(){
        let {navAddTab, navReplaceTab} =this.props;
        this.props.form.validateFields((error, values) => {
            if(!error){
                Confirm('你确定要变更此报价吗 ？', {
                    done: () => {
                        ///nooquotation/changeVersion replace /inquiryquote/changeVersion
                        apiPost(API_FOODING_ERP, '/inquiryquote/changeVersion', {
                                billId: this.state.businessOne.billId,
                                mtls: values.mtls,
                            },
                            response => {
                                navReplaceTab({name:i18n.t(200053/*发出的报价详情*/),component:i18n.t(200053/*发出的报价详情*/),url:'/sendquotation/detail'});
                                this.props.router.push({pathname: '/sendquotation/detail', query: {id: response.data}});
                            }, error => {
                                errorTips(error.message);
                            });
                    }
                });
            }
        });

	}
	confirmClick(){
		console.log(i18n.t(100460/*确认*/))
	}
	saveClick(){
        const {form} = this.props;
		form.validateFields((error, value) => {
		    if( !error){
		        apiPost(API_FOODING_ERP, '/nooquotation/mtl/save', value,
                    response => {
		                let msg = this.state.businessOne.status === 1 ? i18n.t(200121/*保存成功*/): i18n.t(200060/*变更报价成功*/);
                        let done = ()=>{
                            this.props.navReplaceTab({name:i18n.t(200053/*发出的报价详情*/),component:i18n.t(200053/*发出的报价详情*/),url:'/sendquotation/detail'});
                            this.props.router.push({pathname: '/sendquotation/detail', query: {id: this.state.businessOne.billId}});
                        };

                        Confirm(msg + ", 是否返回到详情界面", { timing: 5, done });
                    }, error => {
                        errorTips(error.message);
                    })
            }
        });
	}
	componentDidMount(){
        this.handleResize(0);
		window.addEventListener('resize', this.handleResize(0));
        this.getEditOne(this.props.location.query.id);
    };
	componentWillUnmount() {
    	window.removeEventListener('resize', this.handleResize(0));
  	}
  	componentWillReceiveProps(nextProps){
  		this.handleResize(0);
		window.addEventListener('resize', this.handleResize(0));

        let billId = nextProps.location.query.id;
        if (billId !== this.props.location.query.id) {
            this.getEditOne(billId);
        }
  	}

    getEditOne = billId => {
        ///nooquotation/getOne replace /inquiryquote/getOne
        apiGet(API_FOODING_ERP, '/inquiryquote/getOne', {
            billDtlId: billId
        }, response => {
            this.setState({businessOne: response.data});
            let enquiryId = response.data.enquiryId;
            if (enquiryId) {
                this.getListCard(enquiryId);
                this.getListShip(enquiryId);
                this.getListTest(enquiryId);
            }
        }, error => {
            errorTips(error.message);
        });
        this.getListMtl(billId);
    };


    /**
     * 报价产品
     * @param billId
     */
    getListMtl = billId => {
        billId = billId || this.state.businessOne.billId;
        apiGet(API_FOODING_ERP, '/nooquotation/mtl/getList', {billId},
            response => {
                this.setState({productData: response.data});
            }, error => {
                errorTips(error.message);
            });
    };

    /**
     * 报价证书
     * @param billId
     */
    getListCard = billId => {
        billId = billId || this.state.businessOne.enquiryId;
        // /enquiry/card/getList replace /inquiry/card/getList
        apiGet(API_FOODING_ERP, '/inquiry/card/getList', {billId},
            response => {
                this.setState({cardData: response.data});
            }, error => {
                errorTips(error.message);
            });
    };

    /**
     * 报价 船公司要求
     * @param billId
     */
    getListShip = billId => {
        billId = billId || this.state.businessOne.enquiryId;
        // /enquiry/ship/getList replace /inquiry/ship/getList
        apiGet(API_FOODING_ERP, '/inquiry/ship/getList', {billId},
            response => {
                this.setState({shipData: response.data});
            }, error => {
                errorTips(error.message);
            });
    };

    /**
     * 报价 检验要求
     * @param billId
     */
    getListTest = billId => {
        billId = billId || this.state.businessOne.enquiryId;
        ///enquiry/test/getList replace /inquiry/test/getList
        apiGet(API_FOODING_ERP, '/inquiry/test/getList', {billId},
            response => {
                this.setState({testData: response.data});
            }, error => {
                errorTips(error.message);
            });
    };

	render(){
		let that = this;
		const {businessOne} = this.state;
		const {getFieldProps, getFieldError, getNFieldProps, getFieldErrorStyle} = this.props.form;
		let onChangeArray = this.state.onChangeArray;
		let cnyLcName = businessOne.cnyLcName;
		return (
			<div className='activity-detail scroll' style={{height:this.state.scrollHeight}}>
				<div className={'addnormal'} style={{marginBottom:'10px'}}>
					<div className={'addnormal-title'}>
						<span>{i18n.t(100138/*常规*/)}</span>
						<span onClick={this.backClick} title={i18n.t(100431/*返回*/)}><i className={'foddingicon fooding-back'}/></span>
                        {
                            this.props.params.type === 'change' ?
                                <span onClick={this.sendQuotClick} title={i18n.t(200061/*变更报价*/)}><i className={'foddingicon fooding-send-price'}/></span>
                                :
                                <span onClick={this.saveClick} title={i18n.t(100430/*保存*/)}><i className={'foddingicon fooding-save'}/></span>
                        }

					</div>
					<div className={'  girdlayout'}>
						<div className={'row'}>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(200028/*报价编号*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{businessOne.no}</p>
								</div>
							</div>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(200063/*收到询盘*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{businessOne.enquiryNo}</p>
								</div>
							</div>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(200029/*报价状态*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{businessOne.statusName}</p>
								</div>
							</div>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(200064/*报价版本*/)}</label>
								<div className={'col-md-8 col-lg-8'} style={{position:'relative'}}>
									<p className={'paragraph'}>{businessOne.versionNo}</p>
									{/*<MoreVersions iconArray={[{data:'v1'},{data:'v2'}]}/>*/}
								</div>
							</div>
						</div>
					</div>
				</div>
			    <ClientInformation businessOne={this.state.businessOne}/>
                <CommerceClause businessOne={this.state.businessOne}/>
                <OnlyreadyRuleTemplate onCancel ={this.onCancel} title ={i18n.t(200021/*询价产品*/)} 
                     Zindex ={4}
                     showHeader ={true}
                     checkedRowsArray={[]}
                     id={'sendquotation-detail-01'}
                     columns ={
                        [{
                            title : i18n.t(100377/*产品编码*/),
                            dataIndex : 'code',
                            key : "code",
                            width : '7%',
                            render(data,row,index){
                                return (<div title={data}>{data}</div>)
                            }
                        },
                        {
                            title : i18n.t(500061/*产品名称*/),
                            dataIndex : 'mtlLcName',
                            key : "mtlLcName",
                            width : '10%',
                            render(data,row,index){
                                return (<div title={data}>{data}</div>)
                            }
                        },
                        {
                            title : i18n.t(100382/*产品规格*/),
                            dataIndex : 'basSpeci',
                            key : "basSpeci",
                            width : '12%',
                            render(data,row,index){
                                return (<div title={data} className={'text-ellipsis'}>{data}</div>)
                            }
                        },
                        {
                            title : i18n.t(400012/*品牌*/),
                            dataIndex : 'brandLcName',
                            key : "brandLcName",
                            width : '6%',
                            render(data,row,index){
                                return (<div title={data}>{data}</div>)
                            }
                        },
                        {
                            title : i18n.t(500065/*需求数量*/),
                            dataIndex : 'requireQty',
                            key : "requireQty",
                             width : '6%',
                            render(data,row,index){
                                return (<div>{data}{row.uomLcName}</div>)
                            }
                        },
                        {
                            title : i18n.t(200009/*目标价*/),
                            dataIndex : "aimPrc",
                            key : "aimPrc",
                            width : "6%",
                            cnyLcName: {cnyLcName},
                            render(data,row,index){
                                return data + " " + cnyLcName;
                            }
                        },{
                            title : i18n.t(200065/*价格*/),
                            dataIndex : "calPrc",
                            key : "calPrc",
                            width : "10%",
                            ignore_equals: true,
                            render(data,row,{index}){
                                return (<div><input type='text' style={{width: 80}}
                                                    className={getFieldErrorStyle(`mtls[${index}].calPrc`, 'error-border', 'text-input-nowidth')}
                                                    value={data}
                                               {...getFieldProps(`mtls[${index}].calPrc`, {
                                                   validateFirst:true,
                                                   rules:[{required:true, pattern: xt.pattern.positiveNonZero}],
                                                    initialValue: xt.isEmpty(data) ? '': data
                                               })}
                                /><span {...getNFieldProps(`mtls[${index}].billDtlId`, {
                                    initialValue: {
                                        billDtlId: row.billDtlId,
                                        mtlId: row.mtlId,
                                        s_label: row.billDtlId
                                    }
                                })}> {cnyLcName}</span></div>);
                            }
                        },{
                            title : i18n.t(500067/*包装*/),
                            dataIndex : "packagLcName",
                            key : "packagLcName",
                            width : "15%",
                            render(data,row,index){
                                return data;
                            }
                        },{
                            title : i18n.t(500068/*托盘*/),
                            dataIndex : "salvrLcName",
                            key : "salvrLcName",
                            width : "8%",
                            render(data,row,index){
                                return data;
                            }
                        },{
                            title : i18n.t(500069/*可否混装*/),
                            dataIndex : "isMixed",
                            key : "isMixed",
                            width : "8%",
                            render(data,row,index){
                                return data ? i18n.t(100141/*是*/) : i18n.t(100142/*否*/);
                            }
                        }]
                    }
                                       data={this.state.productData}
                />
                <div className={'col'}>
                    <OnlyreadyRuleTemplate onCancel ={this.onCancel} title ={i18n.t(500078/*证书要求*/)} 
                            Zindex ={4}
                             showHeader ={true}
                             checkedRowsArray={[]}
                             id={'sendquotation-detail-02'}
                             columns ={
                                 [
                                     {
                                         title: i18n.t(500070/*证书名称*/),
                                         dataIndex: 'cardLcName',
                                         key: "cardLcName",
                                         width: '50%',
                                         render(data, row, index){
                                             return (<div title={data}>{data}</div>)
                                         }
                                     },
                                     {
                                         title: i18n.t(500071/*是否加急*/),
                                         dataIndex: 'gentMark',
                                         key: "gentMark",
                                         width: '25%',
                                         render(data, row, index){
                                             return (<div title={data}>{data ? i18n.t(100141/*是*/) : i18n.t(100142/*否*/)}</div>)
                                         }
                                     },
                                     {
                                         title: i18n.t(500072/*是否正本*/),
                                         dataIndex: 'origMark',
                                         key: "origMark",
                                         width: '25%',
                                         render(data, row, index){
                                             return (<div title={data}>{data ? i18n.t(100141/*是*/) : i18n.t(100142/*否*/)}</div>)
                                         }
                                     }]
                            }
                           data={this.state.cardData}
                    />
                    <OnlyreadyRuleTemplate onCancel ={this.onCancel} title ={i18n.t(500079/*检验要求*/)}
                            Zindex ={3}
                             showHeader ={true}
                             checkedRowsArray={[]}
                             id={'sendquotation-detail-03'}
                                           columns={
                                               [
                                                   {
                                                       title: i18n.t(500061/*产品名称*/),
                                                       dataIndex: 'mtlLcName',
                                                       key: "mtlLcName",
                                                       width: '50%',
                                                       render(data, row, index){
                                                           return (<div title={data}>{data}</div>)
                                                       }
                                                   },
                                                   {
                                                       title: i18n.t(500073/*测试项目*/),
                                                       dataIndex: 'testItmLcName',
                                                       key: "testItmLcName",
                                                       width: '25%',
                                                       render(data, row, index){
                                                           return (<div title={data}>{data}</div>)
                                                       }
                                                   },
                                                   {
                                                       title: i18n.t(100606/*测试方法*/),
                                                       dataIndex: 'testMethLcName',
                                                       key: "testMethLcName",
                                                       width: '25%',
                                                       render(data, row, index){
                                                           return (<div title={data}>{data}</div>)
                                                       }
                                                   }]
                                           }
                                           data={this.state.testData}
                    />
                </div>
                <div className={'col'}>
                    <OnlyreadyRuleTemplate onCancel ={this.onCancel} title ={i18n.t(100512/*船公司要求*/)} 
                        Zindex ={4}
                         showHeader ={true}
                         checkedRowsArray={[]}
                         id={'sendquotation-detail-02'}
                                           columns={
                                               [
                                                   {
                                                       title: i18n.t(500075/*指定/禁止*/),
                                                       dataIndex: 'spickTypeName',
                                                       key: "spickTypeName",
                                                       width: '50%',
                                                       render(data, row, index){
                                                           return (<div title={data}>{data}</div>)
                                                       }
                                                   },
                                                   {
                                                       title: i18n.t(500076/*船公司*/),
                                                       dataIndex: 'shipBeLcName',
                                                       key: "shipBeLcName",
                                                       width: '25%',
                                                       render(data, row, index){
                                                           return (<div title={data}>{data}</div>)
                                                       }
                                                   }]
                                           }
                                           data={this.state.shipData}
                    />
                    <Template1 
                        menuList={[
                            {type:i18n.t(100439/*编辑*/),child:<div><i className='foddingicon fooding-alter_icon2'></i>{i18n.t(100439/*编辑*/)}</div>}
                        ]}                    
                        id={'6'} title={i18n.t(100140/*组织*/)}
                       isShowIcon={false}
                               tempArray={[
                                   {key: i18n.t(100244/*企业*/), value: businessOne.ccLcName},
                                   {key: i18n.t(100238/*部门*/), value: businessOne.sorLcName},
                                   {key: i18n.t(200066/*报价人*/), value: businessOne.quotationLcName},
                                   {key: i18n.t(100229/*邮箱*/), value: businessOne.quotationMail},
                                   {key: i18n.t(100478/*电话*/), value: businessOne.quotationTel},
                                   {key: i18n.t(100479/*传真*/), value: businessOne.quotationFax}
                               ]}/>
                </div>
    			<Dialog width={926} visible={this.state.visible} titleLeft={this.state.title}>
					{this.state.dialogContent}
				</Dialog> 
			</div>
		);
	}

}

export default NavConnect(createForm()(SendQuotationEdit));

