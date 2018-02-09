import React, {Component, PropTypes} from 'react';
import {createForm, FormWrapper} from '../../../../components/Form';
//引入select插件
import Select, {Option, ConstVirtualSelect} from '../../../../components/Select';
import Radio from '../../../../components/Radio';
import Calendar from '../../../../components/Calendar/Calendar';
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS} from "../../../../services/apiCall";
import Input from '../../../../components/FormValidating/FormValidating';
//引入国际化
import i18n, {I18n} from '../../../../lib/i18n';
import WebData from "../../../../common/WebData";
import ServiceTips, {errorTips, successTips} from '../../../../components/ServiceTips'; // 提示
import xt from '../../../../common/xt';

import Tree from '../../../../components/Tree';

export class SuperiorReportDialog extends Component {
    constructor(props) {
        super(props);
        let that = this;
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onTypeClick = this.onTypeClick.bind(this);
        let party = props.initData && props.initData.party ? props.initData.party : {};
        this.state = {
            isShow:false,
            partyId:party.id || "",
            localName:party.localName || "",
            checkedKeys:[party.id || ""],
            expandedKeys: [party.id || ""],
        };
    }

    componentWillReceiveProps(nextProps) {
        //
    }

    onSaveAndClose = () => {
        let {onSaveAndClose, form, data, otherData, initData} = this.props;
        form.validateFields((errors, value) => {
            if (errors) {

            } else {
                if(!this.state.partyId) {
                    ServiceTips({text:"请选择岗位名称", type:'error'});
                    return false;
                }
                let params = data.number == 0 ? Object.assign({}, form.getFieldsValue(), otherData, {
                    id: initData.id,
                    partyId:this.state.partyId
                }) : Object.assign({}, form.getFieldsValue(), otherData, {partyId:this.state.partyId});
                apiPost(API_FOODING_ES, "/reportingLine/save", params, response => {
                    onSaveAndClose && onSaveAndClose();
                    ServiceTips({text: response.message, type: 'success'});
                    form.resetFields();
                }, error => ServiceTips({text: error.message, type: 'error'}));
            }
        })
    };

    onCancel = () => {
        this.props.onCancel && this.props.onCancel();
    };

    //初始化树节点
    getTree() {
        let that = this;
        apiGet(API_FOODING_ES, '/party/getPartySyncTreeByLoginUser', {}, (response) => {
            that.setState({gData: response.data || []});
        }, (error) => {})
    }

    /**
     * 树 拓展
     * */
    onTreeExpand = (expandedKeys, {node}) =>{
        let expand = children =>{
            if( !children) return;
            children.forEach(da => {
                expand(da.props.children);

                let ix;
                if( ( ix = expandedKeys.indexOf(da.key)) !== -1){
                    expandedKeys.splice(ix, 1);
                }
            });
        };
        expand(node.props.children);
        this.setState({expandedKeys});
    };

    /**
     * 树 选择
     * */
    onTreeSelect = (checkedKeys, {node, checked}) => {
        if(node.props.label.typeId == 50){
            if(checkedKeys.length == 0){
                this.setState({checkedKeys:checkedKeys}, () => this.onChange({}));
            }else if(checkedKeys.length == 1){
                if(checked){
                    this.setState({checkedKeys:checkedKeys}, () => this.onChange(node.props.label));
                }else {
                    this.setState({checkedKeys:[]}, () => this.onChange({}));
                }
            }else if(checkedKeys.length == 2){
                this.setState({checkedKeys:[checkedKeys[1]]}, () => this.onChange(node.props.label));
            }
        }
    };

    /**
     * onChange
     * 拿到选中的那一条数据
     * */
    onChange = data => {
        this.setState({partyId:data.id || "", localName:data.localName || ""})
    };

    onTypeClick = () => {
        if(this.refs.superiorType.style.visibility == "visible"){
            this.refs.superiorType.style.visibility = "hidden";
        }else{
            this.refs.superiorType.style.visibility = "visible";
        }
    };

    onClose = () => {
        this.refs.superiorType.style.visibility = "hidden";
    };

    componentDidMount(){
        this.getTree();
    }

    /**
     * 给组织树添加icon
     * */
    obtainIcon = ({label, title}) => {
        if(label.typeId == 10) return (<i className='foddingicon fooding-home_16' title={label.partyType && label.partyType.name ? label.partyType.name : "" }></i>);
        if(label.typeId == 20) return (<img src={require("../../../../styles/images/fd_clur.png")} title={label.partyType && label.partyType.name ? label.partyType.name : "" } />);
        if(label.typeId == 30) return (<img src={require("../../../../styles/images/fd_cp.png")} title={label.partyType && label.partyType.name ? label.partyType.name : "" } />);
        if(label.typeId == 40) return (<img src={require("../../../../styles/images/fd_party.png")} title={label.partyType && label.partyType.name ? label.partyType.name : "" } />);
        if(label.typeId == 50) return (<img src={require("../../../../styles/images/fd_jobs.png")} title={label.partyType && label.partyType.name ? label.partyType.name : "" } />);
        if(label.typeId == 60) return (<img src={require("../../../../styles/images/fd_role.png")} title={label.partyType && label.partyType.name ? label.partyType.name : "" } />);
        if(label.typeId == 70) return (<img src={require("../../../../styles/images/fd_role.png")} title={label.partyType && label.partyType.name ? label.partyType.name : "" } />);
    };

    render() {
        let that = this;
        const {getFieldProps, getFieldError, getNFieldProps, getFieldValue} = this.props.form;
        let initData = this.props.initData || {};

        return (
            <FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} width={976}>
                <div className="girdlayout scroll" style={{height:"334px"}}>
                    <div className={'row'}>
                        <div className="form-group col-xs-6 col-md-6">
                            <label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(400267/*汇报类型*/)}</label>
                            <ConstVirtualSelect
                                form={this.props.form}
                                fieldName="reportingTypeId"
                                rules
                                apiType={apiPost}
                                initValueOptions={initData.reportingType ? [initData.reportingType] : []}
                                initialValue={initData.reportingTypeId}
                                className="col-md-9 col-lg-9"
                                apiParams="com.fooding.fc.ds.entity.ReportingType"
                                valueKeys={"code"}
                            />
                        </div>
                        <div className="form-group col-xs-6 col-md-6" >
                            <label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(400268/*岗位名称*/)}</label>
                            <div className={'col-xs-9 col-md-9'} style={{position:"relative"}} id={'superior-type'} >
                                <input type="text"  className={'col-md-12 col-lg-12 text-input-nowidth'} readOnly onClick={this.onTypeClick} value={this.state.localName} />
                                <div className={'scroll'} ref={"superiorType"}
                                 style={{
                                    position: "absolute",
                                    top: "25px",
                                    left: "-4px",
                                    width: "100%",
                                    boxShadow: "0px 0px 2px 4px #eee",
                                    backgroundColor: "white",
                                    height: "270px",
                                    overflowY: "auto",
                                    borderRadius:"6px",
                                    visibility:'hidden'
                                }}>
                                    <Tree
                                        showIcon={true}
                                        selectable={false}
                                        checkable={true}
                                        checkStrictly={true}
                                        gData={this.state.gData}
                                        onCheck={this.onTreeSelect}
                                        checkedKeys={this.state.checkedKeys}
                                        defaultExpandAll={true}
                                        expandedKeys={this.state.expandedKeys}
                                        onExpand={this.onTreeExpand}
                                        obtainIcon={this.obtainIcon}
                                    >
                                    </Tree>
                                </div>
                            </div>

                        </div>
                        <div className="form-group col-xs-6 col-md-6">
                            <label className={'col-xs-3 col-md-3'}>{I18n.t(100002/*描述*/)}</label>
                            <input type="text" {...getFieldProps('description', {
                                initialValue:initData.description || "",
                            })} className={'col-md-9 col-lg-9 text-input-nowidth'}/>
                        </div>
                    </div>
                </div>
            </FormWrapper>
        );
    }
}

SuperiorReportDialog.propTypes = {
    onSaveAdd: PropTypes.func,
    onSaveAndClose: PropTypes.func,
    onCancel: PropTypes.func
};
SuperiorReportDialog.defaultProps = {
    onSaveAdd() {
    },
    onSaveAndClose() {
    },
    onCancel() {
    }
};
const SuperiorReportForm = createForm()(SuperiorReportDialog);
export default SuperiorReportForm;

