import i18n from './../../../../../lib/i18n';
import React, { Component } from 'react';
const {Table} = require("../../../../../components/Table");
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList,toDecimal} from '../../../../../services/apiCall';
import ServiceTips from '../../../../../components/ServiceTips';
export  class  ActivityDetail extends Component{
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.onTableClick = this.onTableClick.bind(this);
        this.getData=this.getData.bind(this);
        this.columns = [{
                                title : i18n.t(200600/*开户银行*/),
                                dataIndex : 'bank'+language,
                                key : "bank"+language,
                                width : '50%',
                                render(data,row,index){
                                    return (<div title={data}>{data}</div>)
                                }
                            },{
                                title : i18n.t(500121/*费用名称*/),
                                dataIndex : "costlvtr"+language,
                                key : "costlvtr"+language,
                                width : "25%",
                                render(data,row,index){
                                    return data;
                                }
                            },{
                                title : i18n.t(200601/*费用金额*/),
                                dataIndex : "costagg",
                                key : "costagg",
                                width : "25%",
                                render(data,row,index){
                                    return (<div>{data?toDecimal(data):''}</div>);
                                }
                            }]

        this.state = {
            inputValue:'',
            checked:0,
            paddingTop:0,
            scroll:0,
            scrollHeight:0,
            filter:null,
            selectArr:[],
            checkedRows:[],
            choised:false,
            data:null,
            MeunState:true
        }
    }
    getData(){
        return this.refs.mainTable.getSelectArr();
    }
    handleChange(e){
    }
    onTableClick(value){
        if(this.state.checked == 0){
            this.setState({
                inputValue:value.business + '  '+ value.theme
            })
        }else if(this.state.checked == 1){
            this.setState({
                inputValue:value.business + '  '+ value.theme
            })
        }
    }
    handleResize(height){
        this.setState({
            paddingTop:!this.state.paddingTop
        });
        let padding = 80;
        let sch=document.body.offsetHeight-height-padding;
        let scroll = sch-135;

        this.setState({scrollHeight:sch+'px',scroll:scroll});
    }
    componentDidMount(){
        this.handleResize(0);
        window.addEventListener('resize', this.handleResize(0));
    };
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize(0));
    }
    componentWillReceiveProps(nextProps){
        this.handleResize(0);
        window.addEventListener('resize', this.handleResize(0));
    }
    kun(){
        
    }
    render(){

            return (
                <div className='activity-detail'>
                <div className={'client-body-single'}>
                <div className={'addnormal-title'}>
                <span  >{i18n.t(200367/*其他费用*/)}</span>
                </div>
                    <Table
                        ref = "mainTable"
                        columns={this.columns}
                        data={this.props.BankArray}
                        checkboxConfig={{show:false,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
                    />
                </div>
            </div> 
            );

    }

}

export default ActivityDetail;
