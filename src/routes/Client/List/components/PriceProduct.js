import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from 'react';
import * as ApiCall from '../../../../services/client/call';

const {Table} = require("../../../../components/Table");

export default class PriceProduct extends Component {
    constructor(props) {
        super(props);

        this.columns = {
            left: [{
                title: i18n.t(200458/*添加产品*/),
                dataIndex: 'localName',
                key: 'localName',
                width: "90%",
                render(data, row, index){
                    if(row.flag){
                        return (<div className="text-ellipsis" >{row['code']} {data} {row['specTxt']}</div>);
                    }
                    return (<div className="text-ellipsis" style={{color:"#BBBBBB"}}>[无价格]&nbsp;&nbsp;{row['code']} {data} {row['specTxt']}</div>);
                }
            }],
            right: [{
                title: i18n.t(200459/*已选产品*/),
                dataIndex: 'localName',
                key: "localName",
                width: '90%',
                render(data, row, index){
                    if(row.flag){
                        return (<div className="text-ellipsis">{row['code']} {data} {row['specTxt']}</div>);
                    }
                    return (<div className="text-ellipsis" style={{color:'#BBBBBB'}}>[无价格]&nbsp;&nbsp; {row['code']} {data} {row['specTxt']}</div>);
                }
            }]
        };
        this.leftTable = null;
        this.rightTable = null;
        this.tableLeftSearch = this.tableLeftSearch.bind(this);
        this.leftClick=this.leftClick.bind(this);
        this.rightClick=this.rightClick.bind(this);
        this.state = this.initState();
    }

    static propTypes = {
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
            left: [],
            right: []
        }
    }

    rightClick() {
        let {left, right} = this.state;
        let selectLeft = this.leftTable.getSelectArr();

        for (let i = 0; i < selectLeft.length; i++) {
            for(let j = 0; j < right.length; j++){
				if(selectLeft[i].id === right[j].id){
					left.remove(selectLeft[i]);
                    selectLeft.remove(selectLeft[i]);
					i--;
					break;
				}				
			}
            left.remove(selectLeft[i]);
        }

        right = right.concat(selectLeft);
        this.setState({left, right});
        this.props.selectProducts(right);
    }

    leftClick() {
        let {left, right} = this.state;
        let selectRight = this.rightTable.getSelectArr();
        for (let i = 0; i < selectRight.length; i++) {
            for(let j = 0; j < left.length; j++){
				if(selectRight[i].id === left[j].id){
					right.remove(selectRight[i]);
                    selectRight.remove(selectRight[i]);					
					i--;
					break;
				}
			}
            right.remove(selectRight[i]);
        }
        left = left.concat(selectRight);
        this.setState({left, right});
        this.props.selectProducts(right);
    }

    searchProduct = () => {
        let keyword = this.state.selectValue;
        let param = Object.assign({},{keyword:keyword,filter:true});
        ApiCall.searchMaterial(param, ({data}) => {
            this.setState({left: data});
        }, error => console.log(error));
    };

    tableLeftSearch(e) {
        this.setState({selectValue: e.target.value});
    }
    handleClick = () => {

    }
    render() {
        let y = this.props.type === 0? 270: 285;
        return (<div className="client-price-content-table" style={{paddingTop:'10px'}}>
            <div className="table-left">
                <Table ref={table => this.leftTable = table}
                    columns={this.columns.left}
                    data={this.state.left}
                    checkboxConfig={{show: true, checkedAll: this.state.leftChoised}}
                    colorFilterConfig={{show: false}}
                    followConfig={{show: false}}
                    prefixCls={"rc-confirm-table"}
                    scroll={{x: false, y}}
                    contextMenuConfig={{
                        enable: true,
                        contextMenuId: 'SIMPLE_TABLE_MENU',
                        menuItems: [{
                            onClick: this.rightClick,
                            content: <div><i className={'foddingicon fooding-arrow-right_16'}></i></div>
                        }]
                    }}
                />
                <a className={'client-price-content-table-search'} href="javascript:;">
                    <input type='text' onChange={this.tableLeftSearch} value={this.state.selectValue} onKeyDown={(e)=>{
                        if(e.keyCode == 13){this.searchProduct()}
                    }}/>
                    <i className='foddingicon fooding-search_32' onClick={this.searchProduct} />
                </a>
            </div>
            <div className="content-button" style={{position:"relative"}}>
                <i className='foddingicon fooding-arrow-right_16 move-right' onClick={this.rightClick.bind(this)} style={{position:'absolute',top:'0px'}} />
                <i className='foddingicon fooding-arrow_left_16 move-left' onClick={this.leftClick.bind(this)} style={{position:'absolute',top:"24px"}}/>
            </div>
            <div className="table-right">
                <Table ref={table => this.rightTable = table}
                    columns={this.columns.right}
                    data={this.state.right}
                    checkboxConfig={{show: true, checkedAll: this.state.rightChoised, checkedRows: this.state.rightCheckedRows}}
                    colorFilterConfig={{show: false}}
                    followConfig={{show: false}}
                    prefixCls={"rc-confirm-table"}
                    scroll={{x: false, y}}
                    contextMenuConfig={{
                        enable: true,
                        contextMenuId: 'SIMPLE_TABLE_MENU',
                        menuItems: [{
                            onClick: this.leftClick,
                            content: <div><i className={'foddingicon fooding-arrow_left_16'}></i></div>
                        }]
                    }}
                />
            </div>
        </div>);
    }
}
