import React, {Component, PropTypes} from 'react';
import Select, {Option} from 'rc-select';
import './_common.less';
import './_page.less';
import "./_second_page.less";

export class Page extends Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: false,
            value: this.props.currentPage,
            totalPages: this.props.totalPages
        }
    }

    change(e) {
        let reg = new RegExp("^[0-9]*$");
        if (!reg.test(e.target.value)) {
            return false;
        }
        if (e.target.value !== '' && e.target.value < 1) {
            return this.setState({value: 1});
        } else if (e.target.value !== '' && e.target.value > this.state.totalPages) {
            return this.setState({value: this.state.totalPages});
        }
        this.setState({value: e.target.value});
    }

    backClick(e) {
        let value = Number(this.state.value);
        if (value > 1) {
            this.setState({
                value: (value - 1)
            });
            value--;
            this.props.backClick(value);
        }
    }

    nextClick(e) {
        let value = Number(this.state.value);
        if (value < this.props.totalPages) {
            this.setState({
                value: (value + 1)
            });
            value++;
            this.props.nextClick(value);
        }

    }

    componentWillReceiveProps(nextProps) {
        let current = nextProps.currentPage === 0 ? 1: nextProps.currentPage;
        let totalPages = nextProps.totalPages === 0? 1: nextProps.totalPages;
        this.setState({value: current, totalPages});
    }

    render() {
        let {sizeList, currentSize, type = 1} = this.props;
        currentSize = currentSize.toString();
        let rows = 'totalRecords' in this.props? this.props.totalRecords + "条": '';
        return (
            <div className={this.props.prefixCls}>
                <div className={this.props.classn}>
                    {
                        type === 2?
                            null:
                            [
                                <Select key='1'
                                    prefixCls='foodding-select'
                                    placeholder={currentSize}
                                    className='select-width'
                                    onChange={this.props.pageSizeChange}
                                    getPopupContainer={this.getPopupContainer}
                                >
                                    {
                                        sizeList.map((v, i) => (<Option key={i} value={String(v)}>{v}</Option>))
                                    }
                                </Select>,
                                <span  key='2' className='span1'>P</span>,
                                <span  key='3' className='span2'>共{this.state.totalPages}页&nbsp;&nbsp;{rows}</span>,
                            ]
                    }
                    <input type='text' className='input1' onChange={this.change.bind(this)} value={this.state.value} />
                    <span  className='span3'>/{this.state.totalPages}</span>
                    <input type='button' value='GO' className='button' onClick={this.props.goChange.bind(this, this.state.value)}/>
                    <i className='foddingicon fooding-up_icon up' onClick={this.backClick.bind(this, this.state.value)}></i>
                    <i className='foddingicon fooding-page_icon up' onClick={this.nextClick.bind(this, this.state.value)}></i>
                </div>
            </div>
        );
    }
}

Page.propTypes = {
    classn: PropTypes.object,
    totalPages: PropTypes.number,
    currentPage: PropTypes.number,
    totalRecords: PropTypes.number,
    goChange: PropTypes.func,
    backClick: PropTypes.func,
    nextClick: PropTypes.func,
    pageSizeChange: PropTypes.func,
    prefixCls: PropTypes.string,
    sizeList: PropTypes.array,
    currentSize: PropTypes.number
};
Page.defaultProps = {
    classn: {float: 'left'},
    totalPages: 1,
    currentPage: 1,
    goChange() {
    },
    backClick() {
    },
    nextClick() {
    },
    pageSizeChange() {
    },
    prefixCls: 'page-normal',
    sizeList: [20, 50, 200],
    currentSize: 20
};

export default Page;

