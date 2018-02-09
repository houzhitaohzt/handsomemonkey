import i18n from './../../../../lib/i18n';
import React, {Component} from 'react';
import Measurement from '../../../../components/RuleTemplate';
import Dialog from '../../../../components/Dialog';
import Confirm from '../../../../components/Dialog/Confirm';
import ProductEdit from './ProductEdit';
import {API_FOODING_ERP, apiForm} from '../../../../services/apiCall';
import {errorTips, successTips} from "../../../../components/ServiceTips"; //提示框

export class ProductDetail extends Component{
	constructor(props) {
        super(props);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
        this.state=this.initState();
    }
    handleClick = (e, data, Template) => {
        // console.log(data)
        if(data.number ==2){
            let ids = data.selectArr.map(da=>da.billDtlId);
            if( !ids.length) return errorTips(i18n.t(200328/*请选择一条数据进行操作*/));
        	 Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
				  done: () => {
                      apiForm(API_FOODING_ERP, '/specimen/mtl/delete', {
                          id: ids
                      }, response => {
                          successTips(response.message);
                          this.props.refreshMtl();
                      }, error => {
                          errorTips(response.message);
                      })
				}
		   	});
        }else{
        	let dialogTitle= data.action+data.name.title;
        	 this.setState({
        	 	visible:true,
                dialogTitle:dialogTitle,
                dilogTelmp:Template
        	});
        }
    };
    onSaveAndClose(){
        this.setState({visible:false});
        this.props.refreshMtl();
    }
	onCancel(){
        this.setState({visible:false});
	}
    initState(){
        return {
            visible:false, 
            dialogTitle:'',
            dilogTelmp:<div></div>
        }
	}
    componentDidMount(){
        this.handleResize();
        window.addEventListener('resize', this.handleResize(20));
    }
    handleResize(height){
        this.setState({
            paddingTop:!this.state.paddingTop
        });
        let padding = this.state.paddingTop ? 173:262;
        let sch=document.body.offsetHeight-height-padding;
        this.setState({scrollHeight:sch+'px',scroll:scroll});
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize(20));
    }
    componentWillReceiveProps(nextProps){
        this.handleResize(0);
        window.addEventListener('resize', this.handleResize(0));
    }
	render(){
		const commonForm = this.state.dilogTelmp;
		return (
			  <div>
	               <div style={{backgroundColor:'#f0f4f8',marginTop:'10px'}}>
		               <div>
		                    <Measurement 
                                menuList={[
                                    {type:'add'},
                                    {type:'delete'},
                                    {type:'edit'}                                        
                                ]}                           
                                onCancel ={this.onCancel} title ={i18n.t(100379/*产品*/)} openDialog={this.handleClick}
                                         addBeforeSaveClick={this.props.onSaveNormal}
			                    onSaveAndClose={this.onSaveAndClose}
                                 otherData={this.props.businessOne}
                                 DialogTempalte={ProductEdit}
			                    id={'sam_porder_require'}
                                         singleSelect={true}
			                    showHeader ={true}
			                    columns ={
                                    [{
                                        title : i18n.t(500129/*源单编号*/),
                                        dataIndex : 'sourceNo',
                                        key : "sourceNo",
                                        width : '10%',
                                        render(data,row,index){
                                            return (<div title={data}>{data}</div>)
                                        }
                                    },{
                                        title : i18n.t(500061/*产品名称*/),
                                        dataIndex : "mtlLcName",
                                        key : "mtlLcName",
                                        width : "10%",
                                        render(data,row,index){
                                            return data;
                                        }
                                    },{
                                        title : i18n.t(100382/*产品规格*/),
                                        dataIndex : "basSpeci",
                                        key : "basSpeci",
                                        width : "20%",
                                        render(data,row,index){
                                            return <div>{data}</div>;
                                        }
                                    },{
                                        title : i18n.t(400035/*产品单位*/),
                                        dataIndex : "uomLcName",
                                        key : "uomLcName",
                                        width : "5%",
                                        render(data,row,index){
                                            return data;
                                        }
                                    },{
                                        title : i18n.t(200173/*样品数量*/),
                                        dataIndex : "sendQty",
                                        key : "sendQty",
                                        width : "10%",
                                        render(data,row,index){
                                            return (<div>{data}</div>)
                                        }
                                    },{
                                        title : i18n.t(200175/*出库状态*/),
                                        dataIndex : 'specOptStatusName',
                                        key : "specOptStatusName",
                                        width : "15%",
                                        render(data,row ,index){
                                            return data;
                                        }
                                    }]
			                    }
			                    data={this.props.data}
			                />
		                </div>
	               </div>
	                <Dialog visible={this.state.visible} title={this.state.dialogTitle} width={926}>
		                {commonForm}
		            </Dialog>
               </div>
			);
	}

}
export default ProductDetail;
