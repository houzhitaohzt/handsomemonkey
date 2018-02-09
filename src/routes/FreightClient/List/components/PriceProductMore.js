import i18n from './../../../../lib/i18n';
import React from 'react';

const {Table} = require("../../../../components/Table");

/**
 * 废弃......
 * 自动报价
 */
/*
class PriceProductMore extends Component {
    constructor(props) {
        super(props);
        this.columns = {
            left: [{
                title: i18n.t(200458*//*添加产品*//*),
                dataIndex: 'localName',
                key: 'localName',
                width: "90%",
                render(data, row, index){
                    return (<div className="text-ellipsis">{data}</div>);
                }
            }],
            right: [{
                title: i18n.t(200459*//*已选产品*//*),
                dataIndex: 'localName',
                key: "localName",
                width: '90%',
                render(data, row, index){
                    return (<div className="text-ellipsis">{data}</div>);
                }
            }]
        };
        this.leftTable = null;
        this.rightTable = null;
        this.tableLeftSearch = this.tableLeftSearch.bind(this);
        this.state = this.initState()
    }

    static PropTypes = {
        selectProducts: PropTypes.func
    };

    static defaultProps = {
        selectProducts(){
        }
    };

    initState() {
        return {
            leftChoised: false,
            rightChoised: false,
            selectValue: '',
            sendEmail: false,
            left: [],
            right: []
        }
    }

    rightClick() {
        let {left, right} = this.state;
        let selectLeft = this.leftTable.getSelectArr();

        for (let i = 0; i < selectLeft.length; i++) {
            left.remove(selectLeft[i]);
        }

        right = right.concat(selectLeft);
        this.setState({left, right});
        this.props.selectProducts(right, this.state.sendEmail);
    }

    leftClick() {
        let {left, right} = this.state;
        let selectRight = this.rightTable.getSelectArr();
        for (let i = 0; i < selectRight.length; i++) {
            right.remove(selectRight[i]);
        }
        left = left.concat(selectRight);
        this.setState({left, right});
        this.props.selectProducts(right, this.state.sendEmail);
    }

    searchProduct = () => {
        let keyword = this.state.selectValue;
        ApiCall.searchMaterial(keyword, ({data}) => {
            console.log(keyword);
            this.setState({left: data});
        }, error => console.log(error));
    };

    tableLeftSearch(e) {
        this.setState({selectValue: e.target.value});
    }

    checkEmail = ({target}) =>{
        this.props.selectProducts(this.state.right, target.checked);
        this.setState({sendEmail: target.checked});
    };

    render() {
        return (<div className="send-email-common">
            <div className="row">
                <div className="col-xs-6 send-email-common-main">
                    <p className="send-email-common-main-linker">{i18n.t(200460*//*是否发送邮件*//*)}</p>
                    <Checkbox
                        name="my-checkbox"
                        defaultChecked
                        checked={this.state.sendEmail}
                        onChange={this.checkEmail}
                    />
                </div>
            </div>
            <div className="send-email-common-table">
                <div className="table-left">
                    <Table ref={table => this.leftTable = table}
                           columns={this.columns.left}
                           data={this.state.left}
                           checkboxConfig={{show: true, checkedAll: this.state.leftChoised}}
                           colorFilterConfig={{show: false}}
                           followConfig={{show: false}}
                           prefixCls={"rc-confirm-table"}
                           scroll={{x: false, y: 270}}
                    />
                    <a className={'send-email-common-table-search'} href="javascript:;">
                        <input type='text' onChange={this.tableLeftSearch} value={this.state.selectValue}/>
                        <i className='foddingicon fooding-search_32' onClick={this.searchProduct}></i>
                    </a>
                </div>
                <div className="content-button">
                    <i className='foddingicon fooding-arrow-right_16 move-right' onClick={this.rightClick.bind(this)}></i>
                    <i className='foddingicon fooding-arrow_left_16 move-left' onClick={this.leftClick.bind(this)}></i>
                </div>
                <div className="table-right">
                    <Table ref={table => this.rightTable = table}
                           columns={this.columns.right}
                           data={this.state.right}
                           checkboxConfig={{show: true, checkedAll: this.state.rightChoised, checkedRows: this.state.rightCheckedRows}}
                           colorFilterConfig={{show: false}}
                           followConfig={{show: false}}
                           prefixCls={"rc-confirm-table"}
                           scroll={{x: false, y: 270}}
                    />
                </div>
            </div>
        </div>);
    }
}

export default PriceProductMore;
*/