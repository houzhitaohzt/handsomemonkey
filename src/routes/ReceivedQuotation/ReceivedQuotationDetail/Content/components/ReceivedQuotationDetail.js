import i18n from './../../../../../lib/i18n';
import React, {Component} from 'react';
import Template1 from '../../../../Client/Detail/Content/components/Template1';
import OnlyreadyRuleTemplate from '../../../../../components/OnlyreadyRuleTemplate';

import Dialog from '../../../../../components/Dialog';
import Confirm from '../../../../../components/Dialog/Confirm';
import CommerceClause from "./CommerceClause"; //商务条款
import ReceivedInformation from "./ReceivedInformation"; //收货信息

export class ReceivedQuotationDetail extends Component{
	constructor(props) {
        super(props);
        props.feedback && props.feedback(this);
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
        window.addEventListener('resize', this.handleResize(0));
    }
    handleResize(height){
        this.setState({
            // paddingTop:!this.state.paddingTop
        });
        let padding = this.state.paddingTop ? 153:262;
        let sch=document.body.offsetHeight-height-padding;
        this.setState({scrollHeight:sch+'px',scroll:scroll});
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize(0));
    }
    componentWillReceiveProps(nextProps){
        this.handleResize(0);
        window.addEventListener('resize', this.handleResize(0));    
    }
	render(){
        const {businessOne, productRef} = this.props;
		const commonForm = this.state.dilogTelmp;
		return (
			  <div> 
	               <div className='scroll' style={{backgroundColor:'#f0f4f8',
	               height:this.state.scrollHeight,overflow:'auto'}}> 
                        <div style={{padding:'0 10px',backgroundColor:'#f0f4f8'}}>
                            <div className={'addnormal'} style={{margin:'10px 0'}}>
                                <div className={'addnormal-title'}>
                                    <span  >{i18n.t(100138/*常规*/)}</span>
                                </div>
                                <div className={'  girdlayout'}>
                                    <div className={'row'}>
                                        <div className="form-group col-md-3 col-lg-3">
                                            <label className={'col-md-3 col-lg-3'}>{i18n.t(200064/*报价版本*/)}</label>
                                            <div className={'col-md-9 col-lg-9'} style={{position:'relative'}}>
                                                <p className={'paragraph'}>{businessOne.versionNo}</p>
                                                {/*<MoreVersions iconArray={[{data:'v1'},{data:'v2'}]}/>*/}
                                            </div>
                                        </div>
                                        <div className="form-group col-md-3 col-lg-3">
                                            <label className={'col-md-3 col-lg-3'}>{i18n.t(100478/*电话*/)}</label>
                                            <div className={'col-md-9 col-lg-9'}>
                                                <p className={'paragraph'}>{businessOne.quotationTel}</p>
                                            </div>
                                        </div>
                                        <div className="form-group col-md-3 col-lg-3">
                                            <label className={'col-md-3 col-lg-3'}>{i18n.t(100479/*传真*/)}</label>
                                            <div className={'col-md-9 col-lg-9'}>
                                                <p className={'paragraph'}>{businessOne.quotationFax}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <CommerceClause {...this.props}/>
                            <OnlyreadyRuleTemplate onCancel ={this.onCancel} title ={i18n.t(200021/*询价产品*/)} 
                                 Zindex ={4}
                                 showHeader ={true}
                               tableRef={productRef}
                                 checkedRowsArray={[]}
                                 id={'sendquotation-detail-01'}
                                   checkboxConfig={{show:businessOne.status === 10, position:'last'}}
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
                                        width : '13%',
                                        render(data,row,index){
                                            return (<div title={data}>{data}</div>)
                                        }
                                    },
                                    {
                                        title : i18n.t(100382/*产品规格*/),
                                        dataIndex : 'basSpeci',
                                        key : "basSpeci",
                                        width : '13%',
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
                                        width : '4%',
                                        render(data,row,index){
                                            return (<div>{data}{row.uomLcName}</div>)
                                        }
                                    },
                                    {
                                        title : i18n.t(200009/*目标价*/),
                                        dataIndex : "aimPrc",
                                        key : "aimPrc",
                                        width : "4%",
                                        cnyLcName: businessOne.cnyLcName,
                                        render(data,row,index){
                                            return data ? data + businessOne.cnyLcName: '';
                                        }
                                    },{
                                        title : i18n.t(200065/*价格*/),
                                        dataIndex : "calPrc",
                                        key : "calPrc",
                                        width : "4%",
                                        cnyLcName: businessOne.cnyLcName,
                                        render(data,row,index){
                                            return data ? data + businessOne.cnyLcName: '';
                                        }
                                    },{
                                        title : i18n.t(500067/*包装*/),
                                        dataIndex : "packagLcName",
                                        key : "packagLcName",
                                        width : "10%",
                                        render(data,row,index){
                                            return data;
                                        }
                                    },{
                                        title : i18n.t(500068/*托盘*/),
                                        dataIndex : "salvrLcName",
                                        key : "salvrLcName",
                                        width : "7%",
                                        render(data,row,index){
                                            return data;
                                        }
                                    },{
                                        title : i18n.t(500069/*可否混装*/),
                                        dataIndex : "isMixed",
                                        key : "isMixed",
                                        width : "4%",
                                        render(data,row,index){
                                            return data ? i18n.t(100141/*是*/) : i18n.t(100142/*否*/);
                                        }
                                    },{
                                        title : i18n.t(100464/*接受报价*/),
                                        dataIndex : "isAccept",
                                        key : "isAccept",
                                        width : "4%",
                                        visible: businessOne.status > 10,
                                        render(data,row,index){
                                            return data ? i18n.t(100141/*是*/) : i18n.t(100142/*否*/);
                                        }
                                    }]
                                }
                                data={this.props.productData}
                            />   
                        </div>
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
                                   data={this.props.cardData}
                            />
                            <OnlyreadyRuleTemplate onCancel ={this.onCancel} title ={i18n.t(500079/*检验要求*/)} 
                                    Zindex ={3}
                                     showHeader ={true}
                                     checkedRowsArray={[]}
                                     id={'sendquotation-detail-03'}
                                     columns ={
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
                                    data={this.props.testData}
                            />
                            <Template1 
                                menuList={[
                                    {type:i18n.t(100439/*编辑*/),child:<div><i className='foddingicon fooding-alter_icon2'></i>{i18n.t(100439/*编辑*/)}</div>}
                                ]}                            
                                id={'6'} isShowIcon={false} title={i18n.t(100140/*组织*/)}
                                       tempArray={[
                                           {key: i18n.t(100244/*企业*/), value: businessOne.enquiryCcLcName},
                                           {key: i18n.t(400036/*采购组织*/), value: businessOne.enquiryPorLcName},
                                           {key: i18n.t(200024/*询价人*/), value: businessOne.enquiryStaffLcName}
                                       ]}/>
                        </div>
                        <div className={'col'}>
                            <OnlyreadyRuleTemplate onCancel ={this.onCancel} title ={i18n.t(100512/*船公司要求*/)} 
                                Zindex ={4}
                                 showHeader ={true}
                                 checkedRowsArray={[]}
                                 id={'sendquotation-detail-02'}
                                 columns ={
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
                                   data={this.props.shipData}
                            />
                           <ReceivedInformation {...this.props}/>
                        </div>
	               </div>
	                <Dialog visible={this.state.visible} title={this.state.dialogTitle} width={926}>
		                {commonForm}
		            </Dialog>
               </div>
			);
	}

}
export default ReceivedQuotationDetail;
