import i18n from './../../../lib/i18n';
import React, {Component, PropTypes} from 'react';
import '../assets/_selectChange.less';
import Radio from '../../Radio';

export class SelectChange extends Component {
    constructor(props) {
        super(props);
        let clone = require('clone');
        let checked = clone(this.props.checked);
        this.state = {
            checked: checked,
            isShowDialog: false,
        }
        this.hideDialog = true;
        this.handleChange = this.handleChange.bind(this);
        this.inputClick = this.inputClick.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.dialogClick = this.dialogClick.bind(this);
    }

    //输入框的点击事件
    inputClick() {
        this.setState({
            isShowDialog: !this.state.isShowDialog
        }, function () {
            document.getElementById('dialog').focus();
        });
        this.props.inputClick();
    }

    onBlur(e) {
        setTimeout(() => {
            if (!this.hideDialog) {
                this.hideDialog = !this.hideDialog;
                return false;
            }
            this.setState({
                isShowDialog: false
            });
        }, 200);
    }

    dialogClick(e) {
        e.stopPropagation();
        e.preventDefault();
        this.hideDialog = false;
    }

    //点击某一行数据的点击事件
    handleChange(data, e) {
        this.hideDialog = false;
        this.props.handleChange(data);
    }

    //循环数据
    formatting = data => {
        for (var i = 0, length = this.props.columns.length; i < length; i++) {
            if (this.props.columns[i].key == data) {
                return {key: data, width: this.props.columns[i].width};
            }
        }
        return null;
    }

    //单击某一条数据，然后获取数据
    onTableClick(value) {
        this.props.onTableClick(value);
        this.setState({
            isShowDialog: false
        });
    }

    render() {
        let radioArray = this.props.radioArray;
        let content = this.props.data.map((value, i) => {
            return (
                <ul key={i} className='cursor' onClick={this.onTableClick.bind(this, value)}>
                    {
                        Object.keys(value).map((key, j) => {
                            return this.formatting(key) !== null ?
                                <li key={j} style={{width: this.formatting(key).width}}>{value[key]}</li> :
                                <span key={j}></span>
                        })
                    }
                </ul>
            )
        });
        return (<div className='select-change row'>
            <div className='title from-group col-md-12 col-lg-12'>
                <label className='label-title col-md-1 col-lg-1'><em>*</em>{this.props.title.title_1}</label>
                <input type='text' style={{paddingLeft: 10}} className={'col-md-12 col-lg-12 text-input-nowidth'}
                       onClick={this.inputClick}
                       value={this.props.inputValue}
                       readOnly={true} placeholder={i18n.t(400161/*请选择商机、订单、合作、其他*/)}/>
                <i className='foddingicon fooding-add_32 color' onClick={this.inputClick}></i>
            </div>
            <div id='dialog' tabIndex="-1" onClick={this.dialogClick} onBlur={this.onBlur}
                 className={this.state.isShowDialog ? 'dialog' : 'none'}>
                <div>
                    <label className='color-hui margin-right-20 line-height'>{this.props.title.title_2}</label>
                    {
                        radioArray.map((value, i) => {
                            return (
                                <span key={i} className='margin-right-20'>
												<Radio
                                                    className='margin-right-5'
                                                    value={value.type}
                                                    onChange={this.handleChange.bind(this, value)}
                                                    checked={this.props.checked == value.type}
                                                />
                                    {value.name}
											</span>
                            )
                        })
                    }
                </div>
                <div className={
                    this.state.isShowDialog ? 'table' : 'none'}>
                    <ul className='ul1'>
                        {
                            this.props.columns.map((value, i) => {
                                return (<li key={i} style={{width: value.width}}>{value.title}</li>);
                            })
                        }
                    </ul>
                    <div className='scorll-table scroll'>
                        {
                            content
                        }

                    </div>
                </div>
            </div>
        </div>);
    }
}

SelectChange.propTypes = {
    columns: PropTypes.array,
    data: PropTypes.array,
    inputValue: PropTypes.string,
    checked: PropTypes.any,
    radioArray: PropTypes.array,
    title: PropTypes.object,
    inputClick: PropTypes.func,
}
SelectChange.defaultProps = {
    columns: [{title: i18n.t(100322/*商机编号*/), dataIndex: "no", key: 'no', width: '28%'},
        {title: i18n.t(100304/*主题*/), dataIndex: "theme", key: 'theme', width: '35%'},
        {title: i18n.t(100323/*业务日期*/), dataIndex: "billDate", key: 'billDate', width: '20%'}],
    data: [],
    inputValue: '',
    checked: 0,
    radioArray: [{name: i18n.t(100321/*商机*/), key: 'business', type: 1}, {
        name: i18n.t(100324/*订单*/),
        key: 'order',
        type: 2
    }, {name: i18n.t(100327/*合作*/), key: 'cooperate', type: 3}, {name: i18n.t(100488/*其他*/), key: 'other', type: 4}],
    title: {title_1: i18n.t(100315/*约会目的*/), title_2: i18n.t(400005/*约会地址*/)},

    inputClick: () => {
    }
}
export default SelectChange;
