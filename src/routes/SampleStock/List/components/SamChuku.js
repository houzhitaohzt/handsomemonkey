import i18n from '../../../../lib/i18n';
import React, {Component} from 'react';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import {createForm, FormWrapper} from '../../../../components/Form';
import {ConstMiniSelect, Option} from '../../../../components/Select';
// ajax
import {API_FOODING_ERP, apiGet, apiPost, language} from '../../../../services/apiCall';
import {errorTips, successTips} from '../../../../components/ServiceTips';
const {Table} = require("../../../../components/Table");



class SamChuku extends Component {
    constructor(props) {
        super(props);
        this.onSaveAndClose = this.onSaveAndClose.bind(this); // 保存
        this.onCancel = this.onCancel.bind(this);
        let that = this;
        this.columns = [
            {
                title: i18n.t(400025/*仓库*/),
                dataIndex: "sl" + language,
                key: "sl" + language,
                width: "5%",
                render(data, row, index){
                    return <div>{data}</div>
                }
            }, {
                title: i18n.t(400026/*库区*/),
                dataIndex: "st" + language,
                key: "st" + language,
                width: "5%",
                render(data, row, index){
                    return (<div className="text-ellipsis" title={data}>{data}</div>)
                }
            }, {
                title: i18n.t(400027/*储位*/),
                dataIndex: "slsp" + language,
                key: "slsp" + language,
                width: "5%",
                render(data, row, index){
                    return (<div className="text-ellipsis" title={data}>{data}</div>)
                }
            }, {
                title: i18n.t(400012/*品牌*/),
                dataIndex: 'brand' + language,
                key: "brand" + language,
                width: "5%",
                render(data, row, index){
                    return data;
                }
            }, {
                title: i18n.t(400028/*原供应商*/),
                dataIndex: 'vndBe' + language,
                key: "vndBe" + language,
                width: "8%",
                render(data, row, index){
                    return data;
                }
            }, {
                title: i18n.t(400029/*过期日期*/),
                dataIndex: "shelfEdate",
                key: "shelfEdate",
                width: "5%",
                tooltip: false,
                render(data, row, index){
                    return new Date(data).Format('yyyy-MM-dd')
                }
            }, {
                title: i18n.t(400030/*物料状态*/),
                dataIndex: 'mStats' + language,
                key: "mStats" + language,
                width: "5%",
                tooltip: false,
                render(data, row, index){
                    return data;
                }
            }, {
                title: i18n.t(400031/*库存数量*/),
                dataIndex: 'baseQty',
                key: "baseQty",
                width: "5%",
                tooltip: false,
                render(data, row, index){
                    return data / row.eqBasnum;
                }
            }, {
                title: i18n.t(500163/*出库数量*/),
                dataIndex: 'stockingQty',
                key: "stockingQty",
                width: "5%",
                tooltip: false,
                ignore_equals: true,
                render(data, row, index){
                    return data;
                }
            }];

        this.state = {
            inputValue: '',
            checked: 0,
            paddingTop: 0,
            scroll: 0,
            scrollHeight: 0,
            filter: null,
            selectArr: [],
            checkedRows: [],
            choised: false,
            data: {},
            info: [],
            MeunState: true,
            chukuarray: [],
            stockData: {}
        }
    }

    // 保存
    onSaveAndClose() {
        debugger
        let that = this;
        const {form, onSaveAndClose, productData} = this.props;
        form.validateFields((errors, value) => {
            if (errors) {
            } else {
                let totalNums = 0;

                if(!value.outstock){
                    errorTips(i18n.t(500221/*请选中一条出库记录？*/));
                    return;
                }

                value.outstock.forEach(da => {
                    if(da.nums)  totalNums += parseFloat(da.nums);
                });
                if(totalNums !== parseFloat(productData.sendQty)){
                    return errorTips(i18n.t(200178/*出库数量必须要等于样品数量*/))
                }
                apiPost(API_FOODING_ERP, '/specimen/stockOut', value,
                    (response) => {
                        successTips(response.message);
                        that.props.form.resetFields(); // 清除表单
                        that.props.onSaveAndClose(); // 关闭弹框
                        // that.props.refreshDetail();//刷新页面
                    }, (errors) => {
                        errorTips(errors.message)
                    });
            }
        })

    }

    // 取消
    onCancel() {
        this.props.form.resetFields(); // 清除表单
        this.props.onCancel(); // 关闭弹框
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

    componentDidMount() {
        this.handleResize(0);
        window.addEventListener('resize', this.handleResize(0));
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize(0));
    }

    componentWillReceiveProps(nextProps) {
        this.handleResize(0);
        window.addEventListener('resize', this.handleResize(0));
    }

    onStockChange = value => {
        let {productData} = this.props;

        apiGet(API_FOODING_ERP, '/stock/getPage', {
            mtlId: productData['mtlId'],
            slId: value.receSlId, 
            pageSize: 100, 
            currentPage: 1,
            inventory:1,
            isPagable: false
        }, response => {
            this.setState({chukuarray: response.data && response.data.data || []});
        }, error => {
            errorTips(error.message);
        })
    };

    render() {
        let array = [];
        let {checkedData, businessOne, productData, stockData} = this.props;
        let {chukuarray} = this.state;
        let info = this.props.info || {};
        let data = this.props.data;
        let {getNFieldProps, getFieldProps, getFieldError, getFieldValue} = this.props.form;

        for (let i = 0; i < chukuarray.length; i++) {
            let chu = Object.assign({}, chukuarray[i]);

            //^([0-3](\.\d+)?|4)$
            //验证0 - 4 的数字 [0.0, 4.0] 包含销售
            chu.baseQty = chu.baseQty / stockData.eqBasnum;

            let validate = (rule, value, callback) => {
                if(value.trim() === '') return callback([]);
                if(parseFloat(value) <= chu.baseQty && chu.baseQty > 0){
                    callback([]);
                } else callback([i18n.t(400102/*数量不能大于*/) + chu.baseQty]);
            };
            chu.stockingQty = <div key={i}>
                <span hidden {... getNFieldProps('outstock[' + i + '].id', { initialValue: chu.id,  })} />
                <input style={{width: 60}} className={getFieldError('outstock[' + i + '].nums')?"error-border":''}
                       {...getFieldProps('outstock[' + i + '].nums', {
                           validateFirst: true,
                           rules: [{required: false}, validate],
                           initialValue: '',
                           key: chu.id
                       })}
                />
            </div>;
            array.push(chu);
        }
        return (
            <div className="package-action-buttons" >
                <FormWrapper showFooter={true} buttonLeft={this.props.buttonLeft} onSaveAndClose={this.onSaveAndClose}
                             onCancel={this.onCancel} >
                    <div>
                        <div className={'  girdlayout'} >
                            <div className={'row'}>
                                <div className="form-group col-md-4">
                                    <label className={'col-md-4'}>{i18n.t(100379/*产品*/)}</label>
                                    <input disabled type="text" className={'col-md-8 text-input-nowidth'} placeholder=""
                                           {...getNFieldProps('mtlId', {
                                               initialValue: {
                                                   billDtlId: stockData.mtl.billDtlId,
                                                   mtlId: stockData.mtl.billDtlId,
                                                   uomId: stockData.mtl.uomId,
                                                   eqBasnum: stockData.eqBasnum,
                                                   billId: stockData.specimen.billId,
                                                   billType: stockData.specimen.billType,
                                                   s_label: stockData.mtl.mtlLcName
                                               }
                                           })}
                                    />
                                </div>
                                <div className="form-group col-md-4">
                                    <label className={'col-md-4'}>{i18n.t(200173/*样品数量*/)}</label>
                                    <input disabled type="text" className={'col-md-8 text-input-nowidth'} placeholder=""
                                           value={String(productData.sendQty || '')}
                                    />
                                </div>
                                <div className="form-group col-md-4">
                                    <label className={'col-md-4'}>{i18n.t(400035/*产品单位*/)}</label>
                                    <input disabled type="text" className={'col-md-8 text-input-nowidth'} placeholder=""
                                           value={String(productData.uomLcName || '')}
                                    />
                                </div>
                            </div>
                            <div className={'row'}>
                                <div className="form-group col-md-4">
                                    <label className={'col-md-4'}>HSCODE</label>
                                    <input disabled type="text" className={'col-md-8 text-input-nowidth'} placeholder=""
                                           value={String(productData.hsCode || '')}
                                    />
                                </div>
                                <div className="form-group col-md-4">
                                    <label className={'col-md-4'}>{i18n.t(100382/*产品规格*/)}</label>
                                    <input disabled type="text" className={'col-md-8 text-input-nowidth'} placeholder=""
                                           value={String(productData.basSpeci || '')}
                                    />
                                </div>
                                <div className="form-group col-md-4">
                                    <label className={'col-md-4'}><span>*</span>{i18n.t(200177/*样品库*/)}</label>
                                    <ConstMiniSelect form={this.props.form}
                                                     pbj={{
                                                         params: {obj:'com.fooding.fc.ds.entity.StorLocatn',
                                                             queryParams:[
                                                                 { attr:'ccid',  expression:'=', value:businessOne.ccId || ""},
                                                                 { attr:'stroTyId',  expression:'=', value:10},
                                                                 // { attr:'plntId',  expression:'=', value:businessOne.plantId || ""}
                                                                 ]
                                                         }
                                                     }} fieldName="receSlId"
                                                     optionValue={(da, di) => <Option key={di} objValue={{
                                                         receSlId: da.id,
                                                         receSlLcName: da.localName,
                                                         receSlEnName: da.name,
                                                         s_label: da["localName"]
                                                     }}>{da.localName}</Option>}
                                                     onChange={this.onStockChange}
                                                     reles={true}
                                    />
                                </div>
                            </div>
                        </div>
                       <div >
                           <Table
                               columns={this.columns}
                               data={array}
                               checkboxConfig={{show: false,  position: 'first' }}
                               colorFilterConfig={{show: false, dataIndex: 'colorType'}}
                               followConfig={{show: false}}
                               scroll={{x: true, y: 150}}
                           />
                       </div>
                    </div>
                </FormWrapper>
            </div>
        );

    }

}

export default NavConnect(createForm()(SamChuku));

