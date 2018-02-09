import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from "react";
import {createForm, FormWrapper} from "../../../../components/Form";
//引入select插件
import {ConstVirtualSelect} from "./../../../../components/Select";
//引入单选按钮
import Radio from "../../../../components/Radio";
import * as ApiCall from "./../../../../services/client/call";
import ServiceTips, {errorTips, successTips} from "../../../../components/ServiceTips";
import {apiPost} from "../../../../services/apiCall";
/**
 * 客户合并
 */
class CommonForm extends Component {
    constructor(props) {
        super(props)
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.state = this.initialState();
        this.handleChange = this.handleChange.bind(this);
        this.allChecked = this.allChecked.bind(this);
        this.mainSelect = this.mainSelect.bind(this);
        this.selectOneCus = this.selectCustomer.bind(this, "oneCus");
        this.selectTwoCus = this.selectCustomer.bind(this, "twoCus");

        this.cusNames = {
            web: 'defaultWeb',
            phone: 'defaultMobile',
            email: 'defaultEmail',
            fax: 'defaultFax',
        }
    };


    static propTypes = {
        mainRecord: PropTypes.object,
        subRecord: PropTypes.object,
        onSaveAndClose: PropTypes.func,
        onCancel: PropTypes.func
    };

    static defaultProps = {
        mainRecord: {},
        subRecord: {},
    };

    initialState() {
        return {
            isLoading: true,
            oneCus: {},
            twoCus: {},
            customerList: [],
            mainRecord: {
                code: i18n.t(100354/*客户代码*/),
                name: i18n.t(100001/*名称*/),
                "country.localName": i18n.t(100087/*国家*/),
                taxIdenSN: i18n.t(100358/*税号*/),
                leglpsn: i18n.t(100561/*法人代表*/),
                "company.localName": i18n.t(100244/*企业*/),
                "cstmType.localName": i18n.t(100360/*客户类型*/),
                "cstmLevel.localName": i18n.t(100359/*客户等级*/),
                "cstmCrsekt.localName": i18n.t(100362/*客户来源*/),
                "address.localName": i18n.t(100481/*地址*/),
                "email.localName": i18n.t(100229/*邮箱*/),
                "web.localName": i18n.t(200444/*网址*/),
                "phone.localName": i18n.t(100478/*电话*/),
                "fax.localName": i18n.t(100479/*传真*/)
            },
            targetRecord: {},
            radioState: {},
            checkAll: -1,
            mainCheck: "main",//-1,
            selectValue1: undefined,
            selectValue2: undefined,
        }
    }

    componentDidMount() {
        // //查询出客户列表
        // ApiCall.getMergeCustomer({}, ({data}) => {
        //     this.setState({customerList: data.customers, isLoading: false});
        // }, () => {
        //     ServiceTips({text: i18n.t(201275/*操作失败, 可刷新后重试!*/), type: 'error'});
        // });
    }

    componentWillReceiveProps(nextProps) {
        // //用于给默认值
        // if(nextProps.uuid !== this.props.uuid){
        //     this.setState({...this.initialState()});
        //
        //     ApiCall.getMergeCustomer({}, ({data}) => {
        //         this.setState({customerList: data.customers, isLoading: false});
        //     }, () => {
        //         ServiceTips({text: i18n.t(201275/*操作失败, 可刷新后重试!*/), type: 'error'});
        //     });
        // }
    }

    mainSelect(mainType) {
        this.setState({ mainCheck: mainType })
    }

    allChecked(type) {
        let {radioState} = this.state;
        if (type === 0) {
            for (let item in this.state.mainRecord) {
                radioState[item] = {main: true, sub: false};
            }
        }
        if (type === 1) {
            for (let item in this.state.mainRecord) {
                radioState[item] = {main: false, sub: true};
            }
        }
        this.setState({radioState, checkAll: type})
    }

    handleChange(itemSource) {
        let source = itemSource.type, item = itemSource.item;
        let {mainRecord, subRecord, targetRecord, radioState, checkAll} = this.state;
        let isAllcheckecLeft = "", isAllcheckecRight = "";
        if (source == 0) {
            targetRecord[item] = this.state.oneCus[item];
            radioState[item] = {main: true, sub: false};
        }
        if (source == 1) {
            targetRecord[item] = this.state.twoCus[item];
            radioState[item] = {main: false, sub: true};
        }
        for (item in mainRecord) {
            if (radioState[item] == undefined || !radioState[item].main) {
                isAllcheckecLeft = "left";
                break;
            }
        }
        for (item in mainRecord) {
            if (radioState[item] == undefined || !radioState[item].sub) {
                isAllcheckecRight = "right";
                break;
            }
        }
        if (isAllcheckecLeft != "left" && isAllcheckecRight == "right") {
            checkAll = 0;
        } else if (isAllcheckecLeft == "left" && isAllcheckecRight != "right") {
            checkAll = 1;
        } else {
            checkAll = -1;
        }
        this.setState({radioState, checkAll: checkAll});
    }

    onSaveAndClose() {
        const {form, onSaveAndClose} = this.props;
        const {oneCus, twoCus, radioState, mainRecord, mainCheck} = this.state;
        if(!oneCus.id || !twoCus.id){
            return errorTips(i18n.t(200445/*请选择客户*/));
        }

        let customer = {};
        let newCustomer = [];
        for (let key in mainRecord) {
            let radio = radioState[key];
            if(!radio || (!radio.main && !radio.sub)){
                return errorTips(i18n.t(200446/*请选择需要合并的*/), mainRecord[key]);
            } else {
                let name = key.split(".")[0];
                customer[name] = (radio.main ? oneCus : twoCus)[name];
                //new
                if(radio.sub){
                    let newName = name;
                    if(newName.indexOf(".") !== -1){
                        newName = name.substring(0, name.indexOf("."));
                    }
                    newCustomer.push(this.cusNames[newName] || newName);
                }
            }
        }

        let mainCus, subCus;
        if(mainCheck === 'main'){
            mainCus = oneCus;
            subCus = twoCus;
        } else if(mainCheck === 'sub'){
            mainCus = twoCus;
            subCus = oneCus;
        } else {
            return errorTips(i18n.t(201276/*请选择需要合并的主记录!*/));
        }
        if(mainCus.id === subCus.id){
            return errorTips(i18n.t(201277/*所选的客户是一个客户, 不可合并!*/));
        }
        let params = {
            id: mainCus.id,
            slaveId: subCus.id,
            fields: newCustomer
        };
        // let params = {
        //     id: mainCus.id,
        //     optlock: mainCus.optlock,
        //     slaveId: subCus.id,
        //
        //     code: customer.code,
        //     name: customer.name,
        //     cntryId: this.getItemValue(customer, 'country.id'),
        //     taxIdenSN: customer.taxIdenSN,
        //     leglpsn: customer.leglpsn,
        //     description: customer.description,
        //     localName: customer.localName,
        //     companyId: this.getItemValue(customer, 'company.id'),
        //     cstmTypeId: this.getItemValue(customer, 'cstmType.id'),
        //     cstmLevelId: this.getItemValue(customer, 'cstmLevel.id'),
        //     cstmCrsektId: this.getItemValue(customer, 'cstmCrsekt.id'),
        //
        //     address: this.getSubRadioBool('address.localName'),
        //     email: this.getSubRadioBool("email.localName"),
        //     web: this.getSubRadioBool("web.localName"),
        //     phone: this.getSubRadioBool("phone.localName"),
        //     fax: this.getSubRadioBool("fax.localName")
        // };
        ApiCall.saveMergerCustomer(params, response => {
            successTips("合并成功!");
            onSaveAndClose && onSaveAndClose();
        }, error => {
            errorTips(error.message);
        })
    }

    getSubRadioBool ( name){
        let {radioState, mainCheck} = this.state;
        let radio = radioState[name] ;
        return radio ? !radio[mainCheck] : false;
    }

    onCancel() {
        const {onCancel} = this.props;
        if (onCancel) {
            onCancel();
        }
    }

    selectCustomer (stateName, cid) {
        this.setState({selectValue1: cid});
        ApiCall.getCustomerDetail(cid, ({data}) => {
            if(stateName === 'oneCus'){
                this.allChecked(0);
            }
            this.setState({[stateName]: data});
        }, () => {
            ServiceTips({text: i18n.t(201275/*操作失败, 可刷新后重试!*/), type: 'error'});
        });
    }

    getItemValue (obj, key){
        let k = key.split(".");
        let value = {};
        for (let vk of k) {
            value = value[vk] || obj[vk];
            if( !value) break;
        }
        return value;
    }

    elementRender() {
        let checkEles = [];
        for (let item in this.state.mainRecord) {
            let lebal = <label>{this.state.mainRecord[item]}</label>;

            let mitem = {item: item, type: 0}, sitem = {item: item, type: 1};
            let labelValue = this.getItemValue(this.state.oneCus, item);
            let source = (<div className='common-merge-operation-left'>
                <Radio value={labelValue}
                       name={this.state.mainRecord[item]}
                       onChange={this.handleChange.bind(this, mitem)}
                       checked={!this.state.radioState[item] ? false : this.state.radioState[item].main}
                />
                <p>{labelValue}</p>
            </div>);

            let labelValue2 = this.getItemValue(this.state.twoCus, item);
            let sub = (<div className='common-merge-operation-right'>
                <Radio value={labelValue2}
                       name={this.state.mainRecord[item]}
                       onChange={this.handleChange.bind(this, sitem)}
                       checked={!this.state.radioState[item] ? false : this.state.radioState[item].sub}
                />
                <p>{labelValue2}</p>
            </div>);
            checkEles.push(<div className='common-merge-only' key={item + 'only'}>{lebal}{source}{sub}</div>)
        }
        return checkEles;
    }

    render() {
        const {form, data} = this.props;
        const {getNFieldProps, getFieldError} = this.props.form;
        const disabled = form.isFieldValidating() || form.isSubmitting();
        let checkElms = this.elementRender();
        return (
            <FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
                <div className="common-merge scroll form-horizontal">
                    <div className="common-merge-instructions">{i18n.t(200447/*主记录和字段选择*/)}<span>({i18n.t(201278/*选择主记录，然后选择其中所要合并的字段*/)})</span></div>
                    <div className="common-merge-records">
                        <label>{i18n.t(200448/*主记录*/)}</label>
                        <div className="common-merge-operation-left">
                            <Radio
                                onChange={this.mainSelect.bind(this, "main")}
                                checked={this.state.mainCheck === 'main'}
                                style={{float:'left'}}
                            />
                            <ConstVirtualSelect
                                apiUri={'/enterprise/search?dataTyId='+30}
                                apiType={apiPost}
                                style={{width: 320}}
                                onChange={this.selectOneCus}
                                async={true}
                                apiParams='keyword'
                            />
                        </div>
                        <div className="common-merge-operation-right">
                            {/*<Radio*/}
                                {/*onChange={this.mainSelect.bind(this, 'sub')}*/}
                                {/*checked={this.state.mainCheck === 'sub'}*/}
                            {/*/>*/}
                            <ConstVirtualSelect
                                apiUri={'/enterprise/search?dataTyId='+30}
                                apiType={apiPost}
                                style={{width: 320}}
                                onChange={this.selectTwoCus}
                                async={true}
                                apiParams='keyword'
                            />
                        </div>
                    </div>
                    <div className="common-merge-all">
                        <label></label>
                        <div className="common-merge-operation-left">
                            <Radio
                                onChange={() => this.allChecked(0)}
                                checked={this.state.checkAll === 0}
                            />
                            <p>{i18n.t(200449/*选择此节点中的所有字段*/)}</p>
                        </div>
                        <div className="common-merge-operation-right">
                            <Radio
                                onChange={() => this.allChecked(1)}
                                checked={this.state.checkAll === 1}
                            />
                            <p>{i18n.t(200449/*选择此节点中的所有字段*/)}</p>
                        </div>
                    </div>
                    {checkElms}
                </div>
            </FormWrapper>
        )
    }
}

CommonForm = createForm()(CommonForm);

export default CommonForm;
