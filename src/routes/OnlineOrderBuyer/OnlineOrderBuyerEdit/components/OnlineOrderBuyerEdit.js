import i18n from './../../../../lib/i18n';
import React, {Component} from 'react';
import Template1  from  '../../../Client/Detail/Content/components/Template1';
import RuleTemplate from  '../../../../components/RuleTemplate';
import {createForm, FormWrapper} from "../../../../components/Form";
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import Dialog  from '../../../../components/Dialog';
import Confirm from '../../../../components/Dialog/Confirm';
import {apiGet, apiPost, apiForm, API_FOODING_ERP, API_FOODING_DS, API_FOODING_ES,language} from '../../../../services/apiCall';
import ServiceTips, {errorTips, successTips} from "../../../../components/ServiceTips";//提示框
import NormlEdit from "./NormalEdit";//常规
import BinformationEdit from "./BinformationEdit";//买方信息
import SinformationEdit from "./SinformationEdit";//卖方信息
import xt from '../../../../common/xt';
import {I18n} from '../../../../lib/i18n';
export class SendInquiryEdit extends Component {
    constructor(props) {
        super(props);
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.backClick = this.backClick.bind(this);
        this.saveClick = this.saveClick.bind(this);
        this.setGetOne = this.setGetOne.bind(this);
        this.state = {
            billId: null,
            paddingTop: 0,
            visible: false,
            dialogTitle: '',
            productData: [],
            businessOne: {},
            cardData: [],
            shipData: [],
            testData: [],
            dilogTelmp: <div/>
        }
    }
    setGetOne(obj){
      this.setState({
        businessOne:obj
      });
    }
    handleResize(height) {
        this.setState({
            paddingTop: !this.state.paddingTop
        });
        let padding = 80;
        let sch = document.body.offsetHeight - height - padding;
        let scroll = sch - 135;

        this.setState({scrollHeight: sch + 'px', scroll: scroll});
    }

    handleClick = (e, data, Template) => {
        if (data.number == 2) {
            Confirm(I18n.t(100396/*条数据删除后将无法恢复，您确定删除吗？*/), {
                done: () => {
                    let uri = '', host = API_FOODING_ERP, params = {}, callback;
                    if (data.id === 'sendinquiry-edit-01') {
                        //询价产品
                        ///nooorder/mtl/delete replace /inquiryorder/mtl/delete
                        uri = '/inquiryorder/mtl/delete';
                       callback = [this.getListMtl, this.getListShip, this.getListTest,this.getListCard];
                    } else if(data.id === 'sendinquiry-edit-03'){
                        //船公司要求
                        ///nooorder/pakg/delete replace /inquiryorder/ship/delete
                        uri = '/inquiryorder/ship/delete';
                        callback = this.getListShip;
                    } else if(data.id === 'sendinquiry-edit-04'){
                        //证书要求
                        // /nooorder/card/delete replace /inquiryorder/card/delete
                        uri = '/inquiryorder/card/delete';
                        callback = this.getListCard;
                    } else if(data.id === 'sendinquiry-edit-05'){
                        //检验要求
                        ///nooorder/test/delete replace /inquiryorder/test/delete
                        uri = '/inquiryorder/test/delete';
                        callback = this.getListTest;
                    }

                    if (!uri) return;
                    params.id = data.selectArr.map(ar => ar.billDtlId);

                    apiForm(host, uri, params,
                        response => {
                            successTips(response.message);
                            let id = this.state.businessOne.billId;
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

    onSaveProductAndClose = (product)=>{
      //this.refreshDetail(this.props.location.query.id);
        this.getOne(product.billId);
        this.getListMtl();
        this.onSaveAndClose();
    };

    onSaveShipAndClose= form =>{
        ///nooorder/pakg/save replace /inquiryorder/ship/save
         this.onSave(form, '/inquiryorder/ship/save', this.getListShip);
    };

    onSaveCardAndClose = form =>{
        ///nooorder/card/save replace /inquiryorder/card/save
        this.onSave(form, '/inquiryorder/card/save', this.getListCard);
    };

    onTestSaveAndClose= form =>{
        ///nooorder/test/save replace /inquiryorder/test/save
         this.onSave(form, '/inquiryorder/test/save', this.getListTest);
    };
     onSave = (form, uri, callback) => {
        form.validateFields((error, value) => {
            if( !error){
                apiPost(API_FOODING_ERP, uri, {
                    billId: this.state.businessOne.billId,
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

    backClick() {
        let {navReplaceTab} = this.props;
        let billId = this.props.location.query.id;
        if (billId) {
            navReplaceTab({name:I18n.t(500026/*买家订单详情*/), component:I18n.t(500026/*买家订单详情*/), url: '/onlineorderbuyer/detail'});
            this.props.router.push({pathname: '/onlineorderbuyer/detail', query: {id: billId}});
        } else {
            navReplaceTab({name:I18n.t(500094/*买家订单*/), component:I18n.t(500094/*买家订单*/), url: '/onlineorderbuyer/list'});
            this.props.router.push({pathname: '/onlineorderbuyer/list'});
        }
    }

    onSaveNormal = callback => {
        let businessOne = this.state.businessOne;
       if (businessOne.id && callback) return callback(null, businessOne);
        const {form} = this.props;
        form.validateFields((error, values) => {
            if (!error) {
                let param = Object.assign({}, businessOne, values);
                // /nooorder/save replace /inquiryorder/save
                apiPost(API_FOODING_ERP, '/inquiryorder/save', param,
                    response => {
                       
                        param.id = response.data;

                        // this.props.router.push({pathname: '/onlineorderbuyer/edit', query: {id: param.billId}, state: {refresh: false}});
                        // //param.optlock++;
                        // this.setState({businessOne: param});
                        // callback && callback(null, param);

                        let cancel = ()=>{
                            this.props.router.push({pathname: this.props.router.location.pathname, query: {id: param.id}, state: {refresh: false}});
                            // param.optlock++;
                            this.setState({businessOne: param});
                             this.getOne(param.id || businessOne.id);
                        };
                        let done = ()=>{
                            let name =  I18n.t(500094/*买家订单*/);
                            this.props.navReplaceTab({name: name, component: name, url: '/onlineorderbuyer/detail'});
                            this.props.router.push({pathname: '/onlineorderbuyer/detail', query: {id: param.id}});
                        };
                        if(callback){
                            cancel();
                            callback && callback(null, param);
                        } else {
                            Confirm(I18n.t(500100/*保存成功, 是否跳转到详情界面?*/), { timing: 5, cancel, done  });
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
        ///nooorder/getOne replace /inquiryorder/getOne
        apiGet(API_FOODING_ERP, '/inquiryorder/getOne', {
            id : this.state.businessOne.id || billId
        }, response => {
            this.setState({businessOne: response.data});
        }, error => {
            errorTips(error.message);
        }, {isLoading: false});
    };
    getEditOne = billId => {
       this.getOne(billId);
        if (billId) {
            this.getListMtl(this.state.businessOne.id|| billId);
            this.getListCard(this.state.businessOne.id||billId);
            this.getListShip(this.state.businessOne.id||billId);
            this.getListTest(this.state.businessOne.id || billId);
        }
    };

    /**
     * 询盘产品
     * @param billId
     */
    getListMtl = billId => {
        billId = billId || this.state.businessOne.id;
        // /nooorder/mtl/getList replace /inquiryorder/mtl/getList
        apiGet(API_FOODING_ERP, '/inquiryorder/mtl/getList', {billId},
            response => {
                this.setState({productData: response.data});
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
        ///nooorder/card/getList replace /inquiryorder/card/getList
        apiGet(API_FOODING_ERP, '/inquiryorder/card/getList', {billId},
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
        // /nooorder/pakg/getList replace /inquiryorder/ship/getList
        apiGet(API_FOODING_ERP, '/inquiryorder/ship/getList', {billId},
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
        ///nooorder/test/getList replace /inquiryorder/test/getList
        apiGet(API_FOODING_ERP, '/inquiryorder/test/getList', {billId},
            response => {
                this.setState({testData: response.data});
            }, error => {
                errorTips(error.message);
            });
    };
    refreshDetail = (type = 'all') => {
        let billId = this.state.billId;
        switch (type){
            case 'mtl':
                this.getListMtl(billId);
                break;
            case 'card':
                this.getListCard(billId);
                break;
            case 'ship':
                this.getListShip(billId);
                break;
            case 'test':
                this.getListTest(billId);
                break;
            default:
                this.getEditOne(billId);
                break;
        }
    };
    render() {
      var that =this;
        return (
            <div className='activity-detail scroll' style={{height: this.state.scrollHeight}}>
                <NormlEdit backClick={this.backClick} saveClick={this.saveClick}
                           location={this.props.location}
                           confirmClick={this.confirmClick}
                           businessOne={this.state.businessOne} form={this.props.form}
                           setGetOne = {this.setGetOne}
                />
                <BinformationEdit 
                          location={this.props.location} 
                          businessOne={this.state.businessOne}
                          form={this.props.form}
                          setGetOne = {this.setGetOne}
                />
                <SinformationEdit 
                           location={this.props.location} 
                           businessOne={this.state.businessOne}
                           form={this.props.form}
                           setGetOne = {this.setGetOne}
                />
                <RuleTemplate 
                    menuList={[
                        {type:'add'},
                        {type:'delete'},
                        {type:'edit'}                                        
                    ]}                
                    onCancel={this.onCancel} title={i18n.t(500077/*订单产品*/)}
                              addBeforeSaveClick={this.onSaveNormal}
                              otherData={this.state.businessOne}
                              onSaveAndClose={this.onSaveProductAndClose}
                              Zindex={8}
                              showHeader={true}
                              singleSelect={true}
                              checkedRowsArray={[]}
                              openDialog={this.handleClick}
                              DialogTempalte={require('./ProductEditDialog').default}
                              id={'sendinquiry-edit-01'}
                              columns={
                                  [{
                                      title: I18n.t(100377/*产品编码*/),
                                      dataIndex: 'code',
                                      key: "code",
                                      width: '7%',
                                      render(data, row, index){
                                          return (<div title={data}>{data}</div>)
                                      }
                                  },{
                                          title: I18n.t(500061/*产品名称*/),
                                          dataIndex: 'mtlLcName',
                                          key: "mtlLcName",
                                          width: '10%',
                                          tooltip(data,record,index){
                                              return record.mtlEnName || "";
                                          },
                                          render(data, row, index){
                                              return (<div title={data}>{data}</div>)
                                      }
                                    
                                  },{
                                          title: I18n.t(100382/*产品规格*/),
                                          dataIndex: 'basSpeci',
                                          key: "basSpeci",
                                          width: '12%',
                                          render(data, row, index){
                                              return (<div title={data} className={'text-ellipsis'}>{data}</div>)
                                          }
                                      },{
                                          title:I18n.t(400012/*品牌*/),
                                          dataIndex: 'brandLcName',
                                          key: "brandLcName",
                                          width: '6%',
                                          render(data, row, index){
                                              return (<div title={data}>{data}</div>)
                                          }
                                      },{
                                          title: I18n.t(500065/*需求数量*/),
                                          dataIndex: 'requireQty',
                                          key: "requireQty",
                                          width: '6%',
                                          render(data, row, index){
                                              return (<div>{data?(data+' '+row.uomLcName):''}</div>)
                                          }
                                      },{
                                          title:I18n.t(500066/*成交价*/),
                                          dataIndex: "aimPrc",
                                          key: "aimPrc",
                                          width: "10%",
                                          ignore_equals: true,
                                          render(data, row, index){
                                              return(<div>{data?data+ ' ' + that.state.businessOne['cny'+language]:''}</div>)
                                          }
                                      },{
                                          title:I18n.t(500067/*包装*/),
                                          dataIndex: "packagLcName",
                                          key: "packagLcName",
                                          width: "8%",
                                          render(data, row, index){
                                              return data;
                                          }
                                      },{
                                          title: I18n.t(500068/*托盘*/),
                                          dataIndex: "salvrLcName",
                                          key: "salvrLcName",
                                          width: "8%",
                                          render(data, row, index){
                                              return data;
                                          }
                                      },{
                                          title: I18n.t(500069/*可否混装*/),
                                          dataIndex: "canMixedStowage",
                                          key: "canMixedStowage",
                                          width: "8%",
                                          render(data, row, index){
                                              return <i style = {{display: 'inline-block',textAlign: 'center'}} className={data ?'foddingicon fooding-dui-icon2':''}></i>;
                                               //return (<div title={data}>{data?I18n.t(100141/*是*/):I18n.t(100142/*否*/)}</div>)
                                          }
                                  }]
                              }
                              data={this.state.productData}
                />
                <div className={'col'} style={{paddingLeft:'0px',paddingRight:'0px'}}>
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
                                              title: I18n.t(500070/*证书名称*/),
                                              dataIndex: 'cardLcName',
                                              key: "cardLcName",
                                              width: '50%',
                                              render(data, row, index){
                                                  return (<div title={data}>{data}</div>)
                                              }
                                          },
                                          {
                                              title:I18n.t(500071/*是否加急*/),
                                              dataIndex: 'gentMark',
                                              key: "gentMark",
                                              width: '25%',
                                              render(data, row, index){
                                                  return <i style = {{display: 'inline-block',textAlign: 'center'}} className={data ?'foddingicon fooding-dui-icon2':''}></i>;
                                                  //return (<div title={data}>{data?I18n.t(100141/*是*/):I18n.t(100142/*否*/)}</div>)
                                              }
                                          },
                                          {
                                              title: I18n.t(500072/*是否正本*/),
                                              dataIndex: 'origMark',
                                              key: "origMark",
                                              width: '25%',
                                              render(data, row, index){
                                                  return <i style = {{display: 'inline-block',textAlign: 'center'}} className={data ?'foddingicon fooding-dui-icon2':''}></i>;
                                                   //return (<div title={data}>{data?I18n.t(100141/*是*/):I18n.t(100142/*否*/)}</div>)
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
                                              title: I18n.t(500061/*产品名称*/),
                                              dataIndex: 'mtlLcName',
                                              key: "mtlLcName",
                                              width: '50%',
                                              render(data, row, index){
                                                  return (<div title={data}>{data}</div>)
                                              }
                                          },
                                          {
                                              title: I18n.t(500073/*测试项目*/),
                                              dataIndex: 'testItmLcName',
                                              key: "testItmLcName",
                                              width: '25%',
                                              render(data, row, index){
                                                  return (<div title={data}>{data}</div>)
                                              }
                                          },
                                          {
                                              title: I18n.t(100606/*测试方法*/),
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
                <div className={'col'} style={{paddingRight:'0px'}}>
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
                                              title: I18n.t(500075/*指定/禁止*/),
                                              dataIndex: 'spickTypeName',
                                              key: "spickTypeName",
                                              width: '50%',
                                              render(data, row, index){
                                                  return (<div title={data}>{data}</div>)
                                              }
                                          },
                                          {
                                              title: I18n.t(500076/*船公司*/),
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
                </div>
                
                <Dialog width={926} visible={this.state.visible} title={this.state.dialogTitle}>
                    {this.state.dilogTelmp}
                </Dialog>
            </div>
        );
    }

}

export default NavConnect(createForm()(SendInquiryEdit));

