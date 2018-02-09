import i18n from './../../../../../lib/i18n';
import React, {Component} from 'react';
import Dialog from '../../../../../components/Dialog';
import Confirm from '../../../../../components/Dialog/Confirm';
import NormalDetail from "./NormalDetail";
import OrganDetail from './OrganDetail';
import FinanceDetail from './FinanceDetail';
import {
    API_FOODING_DS, API_FOODING_ERP, apiForm, apiGet, apiPost,
    permissionsBtn
} from '../../../../../services/apiCall';
import {errorTips, successTips} from "../../../../../components/ServiceTips"; //提示框
import NavConnect from '../../../../../components/NavigateTabs/containers/AddContainer';
import MeasureNormalCommon from '../../../../../components/RuleTemplate/components/MeasureNormalCommon';
import TabSwitch from "../../../../../components/TabSwitch";
import SamChuKu from './SamChuku';
import SamCaiGou from './SamCaiGou';

/**
 * 销售样品单
 */
export class SalesOrderDetail extends Component{
	constructor(props) {
        super(props);
        this.state=this.initState();
        this.chukuClick = this.chukuClick.bind(this);
    }
    initState(){
        return {
            productData: [],
            businessOne: {},
            priceArray:'',
            visible:false,
            dialogTitle:'',
            dilogTelmp:<div></div>
        }
	}
    componentDidMount(){
        this.handleResize();
        window.addEventListener('resize', this.handleResize(20));
        this.getDetailData(this.props.location.query.id);
    }
    handleResize(height){
        let padding = 80;
        let sch=document.body.offsetHeight-height-padding;
        this.setState({scrollHeight:sch+'px',scroll:scroll});
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize(0));
    }
    componentWillReceiveProps(nextProps){
        this.handleResize(0);
        window.addEventListener('resize', this.handleResize(0));

        let billId = nextProps.location.query.id;
        if (billId !== this.props.location.query.id) {
            this.getDetailData(billId);
        }
    }

    onSaveAndClose = () => {
        this.setState({visible:false});
    };

    onCancel = () => {
        this.setState({visible:false});
    };
    getDetailData = billId => {
        if( !billId) return errorTips(i18n.t(201296/*数据错误!*/));

        apiGet(API_FOODING_ERP, '/specimen/getOne', {
            billId: billId
        }, response => {
            this.setState({businessOne: response.data});
        }, error => {
            errorTips(error.message);
        });

        apiGet(API_FOODING_ERP, '/specimen/mtl/getList', {billId},
            response => {
                this.setState({productData: response.data});
            }, error => {
                errorTips(error.message);
            });

    };

    refreshDetail = ()=> {
        this.getDetailData(this.props.location.query.id);
    };

    /**
     * 收款指令
     */
    receiptClick = ()=>{
        Confirm(i18n.t(201297/*你确定发送收款指令？*/), {
            done: () => {
                apiForm(API_FOODING_ERP, '/specimen/receipt', {
                    billId: this.state.businessOne.billId
                }, response => {
                    successTips(response.message);
                    this.refreshDetail();
                }, error => {
                    errorTips(response.message);
                })
            }
        });
    };
    chukuClick(e,data,row){
        let that = this;
        let {businessOne} = this.state;
        //查看库存
        let content=require('./Kucun').default;
        let element=React.createElement(content,{onCancel:this.onCancel,data:data,businessOne:businessOne});
        this.setState({
            visible : true,
            dilogTelmp: element,
            dialogTitle:i18n.t(500342/*出库信息*/),
            showHeader:true
        })
    }
    /**
     * 样品单作废
     */
    stockDropClick = ()=>{
        Confirm(i18n.t(201298/*你确定执行作废？*/), {
            done: () => {
                let {businessOne} = this.state;
                apiForm(API_FOODING_ERP, '/specimen/drop', {
                    billId: businessOne.billId,
                }, response => {
                    successTips(response.message);
                    this.refreshDetail();
                }, error => {
                    errorTips(error.message);
                })
            }
        });
    };

    /**
     * 样品单出库
     */
    stockOutClick = ()=>{
        //弹出出库
        let {businessOne} = this.state;
        let rowData = this.productComp.dataTable.getSelectArr();
        if( !rowData.length) return errorTips(i18n.t(201299/*请选择一条产品数据!*/));
        let productData = rowData[0];

        let specOptStatus = productData.specOptStatus ? parseInt(productData.specOptStatus) : null;
        if(specOptStatus === 1){
            return errorTips(i18n.t(201300/*该产品已出库!*/))
        }

        let success = data => {
            let dialogProps = {
                stockData: data,
                businessOne,
                productData,
                onCancel: this.onCancel,
                refreshDetail:this.refreshDetail,
                onSaveAndClose: this.onSaveAndClose,

            };
            let caiGouProps = Object.assign({}, dialogProps);
            let chuKuProps = Object.assign({}, dialogProps);

            let tabSwitchArray = [
                {title:i18n.t(200180/*库存*/),content:<SamChuKu {...chuKuProps}/>},
            ];
            if( !specOptStatus || specOptStatus !== 2){
                tabSwitchArray.push(
                    {title:i18n.t(100417/*采购*/),content:<SamCaiGou {...caiGouProps} />}
                );
            }

            this.setState({
                visible:true,
                dialogTitle: i18n.t(200181/*样品单出库*/),
                dilogTelmp: <TabSwitch TabSwitchArray={tabSwitchArray}/>
            });
        };

        apiGet(API_FOODING_ERP, '/specimen/getStock',
            {id: productData.billDtlId},
            response => {
                success(response.data);
               this.refreshDetail();
            }, error => {
                errorTips(error.message);
            })
    };

    submitClick = ()=>{
        Confirm('你确定执行提交？', {
            done: () => {
                let {businessOne} = this.state;
                apiForm(API_FOODING_ERP, '/common/submitBill', {
                    billId: businessOne.billId,
                    billType: businessOne.billType
                }, response => {
                    successTips(response.message);
                    this.refreshDetail();
                }, error => {
                    errorTips(error.message);
                })
            }
        });
    };


    editClick = ()=> {
        let {navRemoveTab, navReplaceTab, navAddTab} = this.props;
        let {businessOne = {}} = this.state;
        if( !businessOne.billId) return errorTips(i18n.t(201296/*数据错误!*/));
        navReplaceTab({ name: i18n.t(200182/*编辑销售样品单*/), component: i18n.t(200182/*编辑销售样品单*/), url: '/samporder/edit'});
        this.props.router.push({pathname: '/samporder/edit', query: {id: businessOne.billId}});
    };
    //反馈信息
    fankuiClick = ()=> {
        let that = this;
        let {businessOne} = this.state;
        let content=require('./requireDiglog').default;
        let element=React.createElement(content,{onCancel:this.onCancel,data:this.state.businessOne});
        apiGet(API_FOODING_ERP,'/specimen/mtl/getList',
            {billId:businessOne.billId},(response)=>{
                this.setState({
                    priceArray:response.data.length

                });
                let priceArray = this.state.priceArray;
                if(priceArray>0){
                    this.setState({
                        visible : true,
                        dilogTelmp: element,
                        dialogTitle: i18n.t(500337/*反馈信息*/),
                        showHeader:true
                    })
                }else{
                    errorTips(i18n.t(500336/*没有相关反馈信息!*/))
                }
            },(error)=>{

            });


    }


    delClick = ()=>{
        let {navReplaceTab} = this.props;
        Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
            done: () => {
                apiForm(API_FOODING_ERP, '/specimen/delete', {
                    billId: this.state.businessOne.billId
                }, response => {
                    successTips(response.message);
                    navReplaceTab({name:i18n.t(200171/*销售样品单*/),component:i18n.t(200171/*销售样品单*/),url:'/SamPorder/list'});
                    this.props.router.push({pathname: '/SamPorder/list'});
                }, error => {
                    errorTips(error.message);
                })
            }
        });
    };

	render(){
		const commonForm = this.state.dilogTelmp;
		let {businessOne, productData} = this.state;
		 var  that = this;
		return (
			  <div className='activity-detail  scroll' style={{height:this.state.scrollHeight}}>
	               <NormalDetail businessOne={this.state.businessOne} editClick={this.editClick} submitClick={this.submitClick} fankuiClick={this.fankuiClick}
                                 stockDropClick={this.stockDropClick}
                                 delClick={this.delClick} receiptClick={this.receiptClick} stockOutClick={this.stockOutClick}/>
                  <div>
                      <MeasureNormalCommon onCancel ={this.onCancel} ref={rf=>this.productComp=rf}
                           title ={i18n.t(100379/*产品*/)} openDialog={this.handleClick}
                           onSaveAndClose={this.onSaveAndClose}
                           id={'38'}
                           singleSelect={true}
                           showHeader ={true}
                           columns ={
                               [{
                                   title : i18n.t(500129/*源单编号*/),
                                   dataIndex : 'sourceNo',
                                   key : "sourceNo",
                                   width : '10%',
                                   render(data,row,index){
                                       return (<div title={data}>{data}</div>)
                                   }
                               },{
                                   title : i18n.t(500061/*产品名称*/),
                                   dataIndex : "mtlLcName",
                                   key : "mtlLcName",
                                   width : "20%",
                                   render(data,row,index){
                                       return data;
                                   }
                               },{
                                   title : i18n.t(100382/*产品规格*/),
                                   dataIndex : "basSpeci",
                                   key : "basSpeci",

                                   render(data,row,index){
                                       return <div>{data}</div>;
                                   }
                               },{
                                   title : i18n.t(200173/*样品数量*/),
                                   dataIndex : "sendQty",
                                   key : "sendQty",
                                   width : "10%",
                                   render(data,row,index){
                                       return data? data + "" + row.uomLcName: data;
                                   }
                               },{
                                   title : i18n.t(200175/*出库状态*/),
                                   dataIndex : 'specOptStatusName',
                                   key : "specOptStatusName",
                                   width : "15%",
                                   render(data,row ,index){
                                       return data;
                                   }
                               },{
                                   title:'',
                                   dataIndex : 'handle',
                                   key : "handle",
                                   width : "10%",
                                   render(data,row ,index){
                                       return <div>
                                           { row.specOptStatus==1 ?
                                               <i className='foddingicon fooding-outinformation' title={i18n.t(500342/*出库信息*/)} onClick={that.chukuClick.bind(this,data,row)} style={{marginRight:'20px'}}></i>
                                               :
                                               ''
                                           }

                                       </div>;
                                   }
                               }]
                           }
                           data={productData}
                      />
                  </div>

                  <FinanceDetail businessOne={this.state.businessOne}/>
                   <OrganDetail businessOne={this.state.businessOne}/>

                  <Dialog visible={this.state.visible} title={this.state.dialogTitle} width={926} height={400}>
                      {commonForm}
                  </Dialog>
               </div>
			);
	}

}
export default NavConnect(SalesOrderDetail);
