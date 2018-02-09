import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import OnlyreadyRuleTemplate from  '../../../../../components/OnlyreadyRuleTemplate';
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,language,pageSize,sizeList} from '../../../../../services/apiCall';
class PruchaseOrderDetailRequire extends Component{
	constructor(props){
		super(props)
		this.state={
			titleArray:[]
		}
	}
	componentDidMount(){
		this.getTitleAjax();
	}
	getTitleAjax = () => {
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.Item'},(response)=>{
                this.setState({
                    titleArray:response.data
                })
        },(error)=>{

        })
	}
	componentWillReceiveProps(nextProps){
		if(this.props.billId !== nextProps.billId){
			this.getTitleAjax();
		}
	}
	render(){
		let {billreqirListData = [], cardListData = [], marksListData = [], requireListData = [] } = this.props;
		let that = this;
		return(<div>
	        <OnlyreadyRuleTemplate  title ={i18n.t(200336/*单证要求*/)} 
                id={'30'}
                showHeader ={true}
                columns ={
                	[{
						title : i18n.t(200335/*操作人员*/),
						dataIndex : 'userTypeName',
						key : "userTypeName",
						width : '20%',
						render(data,row,index){
							return (<div title={data}>{data}</div>)
						}
					},{
						title : i18n.t(100128/*单据要求*/),
						dataIndex : "billRequLcName",
						key : "billRequLcName",
						width : "30%",
						render(data,row,index){
							return data;
						}
					},{
						title : i18n.t(100002/*描述*/),
						dataIndex : "content",
						key : "content",
						width : "50%",
						render(data,row,index){
							return (<div>{data}</div>);
						}
					}]
                }
                data={billreqirListData}
            />
           	<OnlyreadyRuleTemplate title ={i18n.t(400137/*唛头要求*/)} 
                id={'31'}
                showHeader ={true}
                columns ={
                	[{
						title : i18n.t(100379/*产品*/),
						dataIndex : 'mtlLcName',
						key : "mtlLcName",
						width : '14%',
						render(data,row,index){
							return (<div title={data}>{data}</div>)
						}
					},{
						title : i18n.t(400130/*贴唛方*/),
						dataIndex : "stickDirectionName",
						key : "stickDirectionName",
						width : "8%",
						render(data,row,index){
							return data;
						}
					},{
						title : i18n.t(400131/*唛头类型*/),
						dataIndex : "markTyLcName",
						key : "markTyLcName",
						width : "14%",
						render(data,row,index){
							return (<div>{data}</div>);
						}
					},{
						title : i18n.t(400132/*颜色*/),
						dataIndex : "colorTypeName",
						key : "colorTypeName",
						width : "14%",
						render(data,row,index){
							return (<div>{data}</div>);
						}
					},{
						title : i18n.t(400133/*唛头内容*/),
						dataIndex : "items",
						key : "items",
						width : "24%",
						render(data,row,index){
							return <div>
                            {
                                that.state.titleArray.map((value,i)=>{
                                    if(data && data[value["id"]]){
                                          return value["localName"]+' '+data[value["id"]];  
                                    }
                                })
                            }                                    
                        </div>;
						}
					}]
                }
                data={marksListData}
            />
            <OnlyreadyRuleTemplate title ={i18n.t(500078/*证书要求*/)} 
                id={'32'}
                showHeader ={true}
                columns ={
                	[{
						title : i18n.t(500070/*证书名称*/),
						dataIndex : 'cardLcName',
						key : "cardLcName",
						width : '14%',
						render(data,row,index){
							return (<div title={data}>{data}</div>)
						}
					},{
						title : i18n.t(500071/*是否加急*/),
						dataIndex : "gentMark",
						key : "gentMark",
						width : "5%",
						render(data,row,index){
							return <i style = {{display: 'inline-block',textAlign: 'center'}} className={data ?'foddingicon fooding-dui-icon2':''}></i>;
							//return data?i18n.t(100141/*是*/):i18n.t(100142/*否*/);
						}
					},{
						title : i18n.t(500072/*是否正本*/),
						dataIndex : "origMark",
						key : "origMark",
						width : "5%",
						render(data,row,index){
							return <i style = {{display: 'inline-block',textAlign: 'center'}} className={data ?'foddingicon fooding-dui-icon2':''}></i>;
							//return data?i18n.t(100141/*是*/):i18n.t(100142/*否*/);
						}
					},{
						title : i18n.t(400134/*相关产品*/),
						dataIndex : "mtlLcName",
						key : "mtlLcName",
						width : "20%",
						render(data,row,index){
							return (<div>{data}</div>);
						}
					},{
						title : i18n.t(400135/*供应商提供*/),
						dataIndex : "vndBeMark",
						key : "vndBeMark",
						width : "20%",
						render(data,row,index){
							return <i style = {{display: 'inline-block',textAlign: 'center'}} className={data ?'foddingicon fooding-dui-icon2':''}></i>;
							//return (<div>{data?i18n.t(100141/*是*/):i18n.t(100142/*否*/)}</div>);
						}
					}]
                }
                data={cardListData}
            />
            <OnlyreadyRuleTemplate title ={i18n.t(400138/*装船要求*/)} 
                id={'34'}
                showHeader ={true}
                columns ={
                	[{
						title : i18n.t(100379/*产品*/),
						dataIndex : 'mtlLcName',
						key : "mtlLcName",
						width : '40%',
						render(data,row,index){
							return (<div title={data}>{data}</div>)
						}
					},{
						title : i18n.t(200080/*类型*/),
						dataIndex : "shipTestTypeName",
						key : "shipTestTypeName",
						width : "18%",
						render(data,row,index){
							return data;
						}
					},{
						title : i18n.t(100313/*服务机构*/),
						dataIndex : "splBeLcName",
						key : "splBeLcName",
						width : "38%",
						render(data,row,index){
							return (<div>{data}</div>);
						}
					}]
                }
                data={requireListData}
            />
		</div>)
	}
}
export default PruchaseOrderDetailRequire;
