import React, {Component} from 'react';
import RuleTemplate from '../../../../components/RuleTemplate';
import {createForm} from "../../../../components/Form";
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import Dialog from '../../../../components/Dialog';
import Confirm from '../../../../components/Dialog/Confirm';
import {API_FOODING_DS, API_FOODING_ERP, apiForm, apiGet, apiPost} from '../../../../services/apiCall';
import {errorTips, successTips} from "../../../../components/ServiceTips"; //提示框
import NormlEdit from "./NormalEdit"; //常规
import Organ from './Organ';
import WebData from '../../../../common/WebData';
import i18n from '../../../../lib/i18n';

export class SendInquiryEdit extends Component {
    constructor(props) {
        super(props);
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.backClick = this.backClick.bind(this);
        this.releseClick = this.releseClick.bind(this);
        this.confirmClick = this.confirmClick.bind(this);
        this.saveClick = this.saveClick.bind(this);
        this.onSaveNormal = this.onSaveNormal.bind(this);
        this.state = {
            paddingTop: 0,
            visible: false,
            dialogTitle: '',
            productData: [],
            businessOne: {},
            supplierData: [],
            cardData: [],
            shipData: [],
            testData: [],
            dilogTelmp: <div/>
        }
    }

    handleResize(height) {
        // this.setState({
        //     paddingTop: !this.state.paddingTop
        // });
        let sch = document.body.offsetHeight - height - 90;
        // let scroll = sch - 135;
        this.setState({scrollHeight: sch + 'px', scroll: scroll});
    }

    handleClick = (e, data, Template) => {
        if (data.number == 2) {
            Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
                done: () => {
                    let uri = '', host = API_FOODING_ERP, params = {}, callback;
                    if (data.id === 'sendinquiry-edit-01') {
                        //询价产品
                        // /enquiry/mtl/delete replace /inquiry/mtl/delete
                        uri = '/inquiry/mtl/delete';
                        callback = [this.getListMtl, this.getListSupplier, this.getListTest];
                    } else if(data.id === 'sendinquiry-edit-02'){
                        //询价供应商
                        ///enquiry/supplier/delete replace /inquiry/vendor/delete
                        uri = "/inquiry/vendor/delete";
                        callback = this.getListSupplier;
                    } else if(data.id === 'sendinquiry-edit-03'){
                        //船公司要求
                        ///enquiry/ship/delete	replace /inquiry/ship/delete
                        uri = '/inquiry/ship/delete';
                        callback = this.getListShip;
                    } else if(data.id === 'sendinquiry-edit-04'){
                        //证书要求
                        // /enquiry/card/delete replace /inquiry/card/delete
                        uri = '/inquiry/card/delete';
                        callback = this.getListCard;
                    } else if(data.id === 'sendinquiry-edit-05'){
                        //检验要求
                        ///enquiry/test/delete replace /inquiry/test/delete
                        uri = '/inquiry/test/delete';
                        callback = this.getListTest;
                    }

                    if (!uri) return;
                    params.id = data.selectArr.map(ar => ar.billDtlId);

                    apiForm(host, uri, params,
                        response => {
                            successTips(response.message);
                            let id = this.state.businessOne.id;
                            if(callback){
                                if(Array.isArray(callback)){
                                    callback.forEach(da => da(id));
                                } else callback(id)
                            }
                        }, error => {
                            errorTips(error.message);
                        })
                }
            });
        } else {
            let dialogTitle = data.action + data.name.title;
            this.setState({
                visible: true,
                dialogTitle: dialogTitle,
                dilogTelmp: Template
            });
        }
    };

    deleteSuppler = (id, cb) =>{
        ///enquiry/supplier/delete replace /inquiry/vendor/delete
        apiForm(API_FOODING_ERP, '/inquiry/vendor/delete', {id},
            response => {
                cb();
            }, error =>{
                cb();
            }, {isLoading: false});
    };

    onProductSupplier = (mtlId)=>{
        let products = (this.state.productData || []).map(da => da.mtlId);
        products.push(mtlId);
        apiGet(API_FOODING_DS, '/material/getPMtlCompanies',{
            pMtlIds: products.join(','),
            ccId: WebData.user.data.staff.ccid,
            forSaleOrPurchase: 0
        }, response => {
            let supplier = response.data || [];
            let delAry = [], cbIndex = 0;
            let cb = ()=>{
                cbIndex ++;
                if(delAry.length && delAry.length === cbIndex){
                    this.getListSupplier();
                }
            };
            this.state.supplierData.forEach(da => {
                if(supplier.findIndex(x => x.id !== da.vndBeId) === -1) {
                    delAry.push(da);
                    this.deleteSuppler(da.billDtlId, cb);
                }
            });

        }, error => {
            errorTips(error.message);
        }, {isLoading: false})
    };

    onSaveProductAndClose = (product) =>{
        //如果是新增产品, 判断产品共有的供应商.
        !product.billDtlId && this.onProductSupplier(product.mtlId);
        this.getOne(product.billId);
        this.getListMtl();
        this.onSaveAndClose();
    };

    onSaveSupplierAndClose = form =>{
        ///enquiry/supplier/save replace /inquiry/vendor/save
        this.onSave(form, '/inquiry/vendor/save', this.getListSupplier);
    };

    onSaveShipAndClose = form =>{
        // /enquiry/ship/save replace /inquiry/ship/save
        this.onSave(form, '/inquiry/ship/save', this.getListShip);
    };

    onSaveCardAndClose = form =>{
        ///enquiry/card/save replace /inquiry/card/save
        this.onSave(form, '/inquiry/card/save', this.getListCard);
    };

    onTestSaveAndClose = form =>{
        ///enquiry/test/save replace /inquiry/test/save
        this.onSave(form, '/inquiry/test/save', this.getListTest);
    };

    onSave = (form, uri, callback) => {
        form.validateFields((error, value) => {
            if( !error){
                apiPost(API_FOODING_ERP, uri, {
                    billId: this.state.businessOne.id,
                    ...value
                }, response => {
                    successTips(response.message);
                    callback();
                    this.onSaveAndClose();
                }, error => {
                    errorTips(error.message);
                })
            }
        });
    };

    onSaveAndClose() {
        this.setState({visible: !this.state.visible});
    }

    onCancel() {
        this.setState({visible: false});
    }

    releseClick() {

    }

    backClick() {
        let {navReplaceTab} = this.props;
        let {businessOne} = this.state;
        let billId = this.props.location.query.id;
        if (billId && businessOne.no) {
            let name = i18n.t(200004/*发出的询盘*/) + '(' + businessOne.no + ")";
            navReplaceTab({name, component: name, url: '/sendinquiry/detail/' + billId});
            this.props.router.push({pathname: '/sendinquiry/detail/' + billId, query: {id: billId}});
        } else {
            let name = i18n.t(200004/*发出的询盘*/);
            navReplaceTab({name, component: name, url: '/sendinquiry'});
            this.props.router.push({pathname: '/sendinquiry'});
        }
    }

    confirmClick() {

    }

    onSaveNormal = callback => {
        let businessOne = this.state.businessOne;
        if (businessOne.id && callback) return callback(null, businessOne);

        const {form} = this.props;
        form.validateFields((error, values) => {
            if(error){

            }else{
                let param = Object.assign({}, businessOne, values);
                ///sendenquiry/save replace /inquiry/save
                apiPost(API_FOODING_ERP, '/inquiry/save', param,
                    response => {
                        param.id = response.data;
                        let cancel = ()=>{
                            this.props.router.push({pathname: this.props.router.location.pathname, query: {id: param.id}, state: {refresh: false}});
                            // param.optlock++;
                            this.setState({businessOne: param});
                            this.getOne(param.id);
                        };
                        let done = ()=>{
                            let name = i18n.t(200004/*发出的询盘*/) + '(' + businessOne.no + ")";
                            this.props.navReplaceTab({name: name, component: name, url: '/sendinquiry/detail/' + param.id});
                            this.props.router.push({pathname: '/sendinquiry/detail/' + param.id, query: {id: param.id}});
                        };
                        if(callback){
                            cancel();
                            callback && callback(null, param);
                        } else {
                            Confirm(i18n.t(500100/*保存成功, 是否跳转到详情界面?*/), { timing: 5, cancel, done  });
                        }
                    }, error => {
                        (callback && callback(error.message)) || errorTips(error.message);
                    })
            }
        });
    };

    saveClick() {
        this.onSaveNormal();
    }

    componentDidMount() {
        this.handleResize(0);
        window.addEventListener('resize', this.handleResize(0));
        this.getEditOne(this.props.location.query.id);
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize(0));
    }

    componentWillReceiveProps(nextProps) {
        this.handleResize(0);
        window.addEventListener('resize', this.handleResize(0));

        let billId = nextProps.location.query.id;
        if (billId !== this.props.location.query.id) {
            this.getEditOne(billId);
        }
    }

    getOne = billId => {
        ///sendenquiry/getOne replace /inquiry/getOne
        apiGet(API_FOODING_ERP, '/inquiry/getOne', {
            billId: billId
        }, response => {
            this.setState({businessOne: response.data});
        }, error => {
            errorTips(error.message);
        }, {isLoading: false});
    };

    getEditOne = billId => {
        this.getOne(billId);
        if (billId) {
            this.getListMtl(billId);
            this.getListSupplier(billId);
            this.getListCard(billId);
            this.getListShip(billId);
            this.getListTest(billId);
        }
    };

    /**
     * 询盘产品
     * @param billId
     */
    getListMtl = billId => {
        billId = billId || this.state.businessOne.id;
        ///enquiry/mtl/getList replace /inquiry/mtl/getList
        apiGet(API_FOODING_ERP, '/inquiry/mtl/getList', {billId},
            response => {
                this.setState({productData: response.data});
            }, error => {
                errorTips(error.message);
            });
    };

    /**
     * 询盘供应商
     * @param billId
     */
    getListSupplier = billId => {
        billId = billId || this.state.businessOne.id;
        ///enquiry/supplier/getList replace /inquiry/vendor/getList
        apiGet(API_FOODING_ERP, '/inquiry/vendor/getList', {billId},
            response => {
                this.setState({supplierData: response.data});
            }, error => {
                errorTips(error.message);
            });
    };

    /**
     * 询盘证书
     * @param billId
     */
    getListCard = billId => {
        billId = billId || this.state.businessOne.id;
        ///enquiry/card/getList replace /inquiry/card/getList
        apiGet(API_FOODING_ERP, '/inquiry/card/getList', {billId},
            response => {
                this.setState({cardData: response.data});
            }, error => {
                errorTips(error.message);
            });
    };

    /**
     * 询盘 船公司要求
     * @param billId
     */
    getListShip = billId => {
        billId = billId || this.state.businessOne.id;
        // /enquiry/ship/getList replace /inquiry/ship/getList
        apiGet(API_FOODING_ERP, '/inquiry/ship/getList', {billId},
            response => {
                this.setState({shipData: response.data});
            }, error => {
                errorTips(error.message);
            });
    };

    /**
     * 询盘 检验要求
     * @param billId
     */
    getListTest = billId => {
        billId = billId || this.state.businessOne.id;
        ///enquiry/test/getList replace /inquiry/test/getList
        apiGet(API_FOODING_ERP, '/inquiry/test/getList', {billId},
            response => {
                this.setState({testData: response.data});
            }, error => {
                errorTips(error.message);
            });
    };

    render() {
        return (
            <div className='activity-detail scroll' style={{height: this.state.scrollHeight}}>
                <NormlEdit backClick={this.backClick} saveClick={this.saveClick}
                           location={this.props.location} releseClick={this.releseClick}
                           confirmClick={this.confirmClick}
                           businessOne={this.state.businessOne} form={this.props.form}
                />
                <RuleTemplate 
                    menuList={[
                        {type:'add'},
                        {type:'delete'},
                        {type:'edit'}                                        
                    ]}                
                    onCancel={this.onCancel} title={i18n.t(200021/*询价产品*/)}
                              addBeforeSaveClick={this.onSaveNormal}
                              otherData={this.state.businessOne}
                              onSaveAndClose={this.onSaveProductAndClose}
                              Zindex={8}
                              singleSelect={true}
                              showHeader={true}
                              checkedRowsArray={[]}
                              openDialog={this.handleClick}
                              DialogTempalte={require('./ProductEditDialog').default}
                              id={'sendinquiry-edit-01'}
                              columns={
                                  [{
                                      title: i18n.t(100377/*产品编码*/),
                                      dataIndex: 'code',
                                      key: "code",
                                      width: '7%',
                                      render(data, row, index){
                                          return (<div title={data}>{data}</div>)
                                      }
                                  },
                                      {
                                          title: i18n.t(500061/*产品名称*/),
                                          dataIndex: 'mtlLcName',
                                          key: "mtlLcName",
                                          width: '10%',
                                          render(data, row, index){
                                              return (<div title={data}>{data}</div>)
                                          }
                                      },
                                      {
                                          title: i18n.t(100382/*产品规格*/),
                                          dataIndex: 'basSpeci',
                                          key: "basSpeci",
                                          width: '12%',
                                          render(data, row, index){
                                              return (<div title={data} className={'text-ellipsis'}>{data}</div>)
                                          }
                                      },
                                      {
                                          title: i18n.t(400012/*品牌*/),
                                          dataIndex: 'brandLcName',
                                          key: "brandLcName",
                                          width: '6%',
                                          render(data, row, index){
                                              return (<div title={data}>{data}</div>)
                                          }
                                      },
                                      {
                                          title: i18n.t(500065/*需求数量*/),
                                          dataIndex: 'requireQty',
                                          key: "requireQty",
                                          width: '6%',
                                          render(data, row, index){
                                              return (<div title={data}>{data}</div>)
                                          }
                                      },
                                      {
                                          title: i18n.t(400035/*产品单位*/),
                                          dataIndex: "uomLcName",
                                          key: "uomLcName",
                                          width: "10%",
                                          render(data, row, index){
                                              return data;
                                          }
                                      },
                                      {
                                          title: i18n.t(200036/*目标单价*/),
                                          dataIndex: "aimPrc",
                                          key: "aimPrc",
                                          width: "10%",
                                          render(data, row, index){
                                              return data;
                                          }
                                      }, {
                                      title: i18n.t(500067/*包装*/),
                                      dataIndex: "packagLcName",
                                      key: "packagLcName",
                                      width: "8%",
                                      render(data, row, index){
                                          return data;
                                      }
                                  }, {
                                      title: i18n.t(500068/*托盘*/),
                                      dataIndex: "salvrLcName",
                                      key: "salvrLcName",
                                      width: "8%",
                                      render(data, row, index){
                                          return data;
                                      }
                                  }, {
                                      title: i18n.t(500069/*可否混装*/),
                                      dataIndex: "isMixed",
                                      key: "isMixed",
                                      width: "8%",
                                      render(data, row, index){
                                          return data ? i18n.t(100141/*是*/) : i18n.t(100142/*否*/);
                                      }
                                  }]
                              }
                              data={this.state.productData}
                />
                <div className={'col'}>
                    <RuleTemplate 
                        menuList={[
                            {type:'add'},
                            {type:'delete'},
                            {type:'edit'}                                        
                        ]}                    
                        onCancel={this.onCancel} title={i18n.t(200023/*询价供应商*/)}
                                  addBeforeSaveClick={this.onSaveNormal}
                                  otherData={Object.assign({products: this.state.productData}, this.state.businessOne)}
                                  onSaveAndClose={this.onSaveSupplierAndClose}
                                  Zindex={5}
                                  showHeader={true}
                                  singleSelect={true}
                                  checkedRowsArray={[]}
                                  openDialog={this.handleClick}
                                  DialogTempalte={require('./SendInquiryEditDialog').default}
                                  id={'sendinquiry-edit-02'}
                                  columns={
                                      [
                                          {
                                              title: i18n.t(100312/*供应商*/),
                                              dataIndex: 'vndBeLcName',
                                              key: "vndBeLcName",
                                              width: '50%',
                                              render(data, row, index){
                                                  return (<div title={data}>{data}</div>)
                                              }
                                          },
                                          {
                                              title: i18n.t(500075/*指定/禁止*/),
                                              dataIndex: 'spickTypeName',
                                              key: "spickTypeName",
                                              width: '50%',
                                              render(data, row, index){
                                                  return (<div title={data}>{data}</div>)
                                              }
                                          }]
                                  }
                                  data={this.state.supplierData}
                    />
                    <RuleTemplate 
                        menuList={[
                            {type:'add'},
                            {type:'delete'},
                            {type:'edit'}                                        
                        ]}                    
                        onCancel={this.onCancel} title={i18n.t(100512/*船公司要求*/)}
                                  Zindex={4}
                                  addBeforeSaveClick={this.onSaveNormal}
                                  otherData={this.state.businessOne}
                                  onSaveAndClose={this.onSaveShipAndClose}
                                  showHeader={true}
                                  checkedRowsArray={[]}
                                  singleSelect={true}
                                  openDialog={this.handleClick}
                                  DialogTempalte={require('./SendInquiryEditDialog').default}
                                  id={'sendinquiry-edit-03'}
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

                    <Organ form={this.props.form}  businessOne={this.state.businessOne}/>
                </div>
                <div className={'col'}>
                    <RuleTemplate 
                        menuList={[
                            {type:'add'},
                            {type:'delete'},
                            {type:'edit'}                                        
                        ]}                    
                        onCancel={this.onCancel} title={i18n.t(500078/*证书要求*/)}
                                  Zindex={4}
                                  showHeader={true}
                                  addBeforeSaveClick={this.onSaveNormal}
                                  otherData={this.state.businessOne}
                                  onSaveAndClose={this.onSaveCardAndClose}
                                  checkedRowsArray={[]}
                                  openDialog={this.handleClick}
                                  singleSelect={true}
                                  DialogTempalte={require('./SendInquiryEditDialog').default}
                                  id={'sendinquiry-edit-04'}
                                  columns={
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
                                                  return (<div title={data}>{data?i18n.t(100141/*是*/) : i18n.t(100142/*否*/)}</div>)
                                              }
                                          },
                                          {
                                              title: i18n.t(500072/*是否正本*/),
                                              dataIndex: 'origMark',
                                              key: "origMark",
                                              width: '25%',
                                              render(data, row, index){
                                                  return (<div title={data}>{data?i18n.t(100141/*是*/) : i18n.t(100142/*否*/)}</div>)
                                              }
                                          }]
                                  }
                                  data={this.state.cardData}
                    />
                    <RuleTemplate 
                        menuList={[
                            {type:'add'},
                            {type:'delete'},
                            {type:'edit'}                                        
                        ]}                    
                        onCancel={this.onCancel} title={i18n.t(500079/*检验要求*/)}
                                  Zindex={3}
                                  showHeader={true}
                                  addBeforeSaveClick={this.onSaveNormal}
                                  otherData={this.state.businessOne}
                                  onSaveAndClose={this.onTestSaveAndClose}
                                  checkedRowsArray={[]}
                                  singleSelect={true}
                                  openDialog={this.handleClick}
                                  DialogTempalte={require('./SendInquiryEditDialog').default}
                                  id={'sendinquiry-edit-05'}
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
                <Dialog width={926} visible={this.state.visible} title={this.state.dialogTitle}>
                    {this.state.dilogTelmp}
                </Dialog>
            </div>
        );
    }

}

export default NavConnect(createForm()(SendInquiryEdit));

