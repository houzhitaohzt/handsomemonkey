import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from 'react';
import {createForm, FormWrapper} from "../../../../components/Form";
import Checkbox from "../../../../components/CheckBox";
import * as ApiCall from '../../../../services/client/call';

const {Table} = require("../../../../components/Table");

/**
 * 客户发送邮件
 */
class SendEmail extends Component {
    constructor(props) {
        super(props);
        this.columns = {
            left: [{
                title: i18n.t(300016/*联系人名称*/),
                dataIndex: 'linkname',
                key: 'linkname',
                width: "90%",
                render(data, row, index){
                    return (<div className="text-ellipsis">{data}</div>);
                }
            }],
            right: [{
                title: i18n.t(200462/*已选择联系人*/),
                dataIndex: 'linkname',
                key: "linkname",
                width: '90%',
                render(data, row, index){
                    return (<div className="text-ellipsis">{data}</div>);
                }
            }]
        };
        this.leftTable = null;
        this.rightTable = null;
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.tableLeftSearch = this.tableLeftSearch.bind(this);
        this.state = this.initState()
    }

    static PropTypes = {
        selectProducts: PropTypes.func,
        data: PropTypes.object,
        form: PropTypes.object,
        onSaveAndClose: PropTypes.func,
        onCancel: PropTypes.func,
    };

    static defaultProps = {
        selectProducts(){
        },
        onSaveAndClose(){
        },
        onCancel(){
        }
    };

    initState() {
        return {
            leftChoised: false,
            rightChoised: false,
            selectValue: '',
            checkPeople: false,
            left: [],
            right: []
        }
    }

    onSaveAndClose() {
        const {form, onSaveAndClose} = this.props;
        form.validateFields((errors, value) => {
            if (null == errors) {
                if (onSaveAndClose) {
                    onSaveAndClose(form.getFieldsValue());
                }
            }
        })
    }

    onCancel() {
        const {onCancel} = this.props;
        if (onCancel) {
            onCancel()
        }
    }

    rightClick() {
        let {left, right} = this.state;
        let selectLeft = this.leftTable.getSelectArr();
        for (let i = 0; i < selectLeft.length; i++) {
            left.remove(selectLeft[i]);
        }
        right = right.concat(selectLeft);
        this.setState({ left, right});
    }

    leftClick() {
        let {left, right} = this.state;
        let selectRight = this.rightTable.getSelectArr();
        for (let i = 0; i < selectRight.length; i++) {
            right.remove(selectRight[i]);
        }
        left = left.concat(selectRight);

        this.setState({left, right});
    }

    searchProduct = () => {
        let keyword = this.state.selectValue;
        let param = Object.assign({},{keyword:keyword,filter:true});
        ApiCall.searchMaterial(param, ({data}) => {
            this.setState({left: data});
        }, error => console.log(error));
    };

    tableLeftSearch(e) {
        this.setState({ selectValue: e.target.value });
    }

    checkPeople = ({target}) =>{
        this.setState({checkPeople: target.checked});
    };


    render() {
        const {dataMain} = this.props;
        const {getFieldProps, getFieldError, form} = this.props.form;
        return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
            <div className="send-email-common">
                <div className="row">
                    <div className="col-xs-6 send-email-common-main">
                        <p className="send-email-common-main-linker">{i18n.t(100372/*主联系人*/)}</p>
                        <Checkbox
                            defaultChecked
                            checked={this.state.checkPeople}
                            onChange={this.checkPeople}
                        />
                        <p className="send-email-common-main-linker">{i18n.t(200463/*徐东*/)}<span style={{marginLeft: '8px'}}>{dataMain.contacts}</span></p>
                    </div>
                </div>
                <div className="send-email-common-table">
                    <div className="table-left">
                        <Table  ref={table => this.leftTable = table}
                            columns={this.columns.left}
                            data={this.state.left}
                            checkboxConfig={{show: true, checkedAll: this.state.leftChoised}}
                            colorFilterConfig={{show: false}}
                            followConfig={{show: false}}
                            prefixCls={"rc-confirm-table"}
                            scroll={{x: false, y: 260}}
                        />
                        {/*<a className={'send-email-common-table-search'} href="javascript:;">*/}
                            {/*<input type='text' onChange={this.tableLeftSearch} value={this.state.selectValue}/>*/}
                            {/*<i className='foddingicon fooding-search_32' onClick={this.searchProduct}/>*/}
                        {/*</a>*/}
                    </div>
                    <div className="content-button">
                        <i className='foddingicon fooding-arrow-right_16 move-right' onClick={this.rightClick.bind(this)}></i>
                        <i className='foddingicon fooding-arrow_left_16 move-left' onClick={this.leftClick.bind(this)}></i>
                    </div>
                    <div className="table-right">
                        <Table ref={table => this.rightTable = table}
                            columns={this.columns.right}
                            data={this.state.right}
                            checkboxConfig={{show: true, checkedAll: this.state.rightChoised}}
                            colorFilterConfig={{show: false}}
                            followConfig={{show: false}}
                            prefixCls={"rc-confirm-table"}
                            scroll={{x: false, y: 260}}
                        />
                    </div>
                </div>
            </div>
        </FormWrapper>);
    }
}

SendEmail = createForm()(SendEmail);

export default SendEmail;

