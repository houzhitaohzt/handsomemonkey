import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../components/Form';
//引入select插件
import {I18n} from "../../../../lib/i18n";
const {Table} = require("../../../../components/Table");
import {apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_ERP,language, toDecimal} from '../../../../services/apiCall';
export class BoxListDailog extends Component{
    constructor(props){
        super(props);
        this.onCancel = this.onCancel.bind(this);
        this.state  = {
            data:[]
        }
    }

    onCancel(){
        const {form, onCancel} = this.props;
        this.props.onCancel();
        this.props.form.resetFields();
    }

    componentDidMount(){
        let that = this;
        apiGet(API_FOODING_ERP, "/purquotation/price/getList", {billId:this.props.billId}, response => {
            that.setState({data:response.data || []})
        })
    }

    render(){
        let { singleData } = this.props;
        return (
            <div className="package-action-buttons">
                <FormWrapper
                    showFooter={true}
                    onCancel={this.onCancel}
                    showSaveClose={false}
                >
                    <Table
                        columns={[
                            {
                                title : "重量区间",
                                dataIndex : 'sNum',
                                key : "sNum",
                                width : '40%',
                                render(data,row,index){
                                    return (<div className="text-ellipsis" title={data}>{data + "  " + singleData.uomLcName + "  ~  " + row.eNum+ "  " + singleData.uomLcName}</div>)
                                }
                            },{
                                title : "采购单价",
                                dataIndex : 'sendPrc',
                                key : "sendPrc",
                                width : '40%',
                                render(data,row,index){
                                    return (<div className="text-ellipsis" title={data}>{toDecimal(data) + "  " +singleData.cnyLcName + " / " + singleData.uomLcName}</div>)
                                }
                            }
                        ]}
                        scroll={{x:true,y:230}}
                        data={this.state.data || []}
                        checkboxConfig={{show:false}}
                        style={{width:'100%'}}
                        prefixCls={"rc-confirm-table"}
                    />
                </FormWrapper>
            </div>
        )
    }
}
const BoxListForm =createForm()(BoxListDailog);
export default BoxListForm;
