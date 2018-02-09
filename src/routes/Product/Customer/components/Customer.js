import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
const {Table} = require("../../../../components/Table");
import Page from "../../../../components/Page"
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList} from '../../../../services/apiCall';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import ServiceTips from '../../../../components/ServiceTips';
export class Customer extends Component{
			constructor(props){
			super(props);
			let that= this;
            props.customer && props.customer(this);
		this.columns = [{
			title : i18n.t(100355/*客户名称*/),
			dataIndex : 'localName',
			key : "localName",
			width : '10%',
			render(data,row,index){
				return <div onClick={that.onClickLink.bind(that,row)} className='link-color'>{data}</div>;
			}
		},{
			title : i18n.t(100341/*所属国家*/),
			dataIndex : "country",
			key : "country",
			width : "5%",
			render(data,row,index){
				return <div>{data}</div>;
			}
		},{
			title : i18n.t(100359/*客户等级*/),
			dataIndex : "level",
			key : "level",
			width : "5%",
			render(data,row,index){
				return <div>{data}</div>;
			}
		},{
			title : i18n.t(100362/*客户来源*/),
			dataIndex : "source",
			key : "source",
			width : "15%",
			render(data,row,index){
				return <div>{data}</div>;
			}
		},{
			title : i18n.t(100371/*网站*/),
			dataIndex : 'defaultWeb',
			key : "defaultWeb",
			width : "12%",
			render(data,row ,index){
				return <div>{data}</div>;
			}
		},{
			title : i18n.t(200566/*主要联系人*/),
			dataIndex : "defaultContact",
			key : "defaultContact",
			width : "10%",
			render(data,row,index){
				return <div>{data?data.localName:''}</div>;
			}
		},{
			title : i18n.t(200453/*最新修改日期*/),
			dataIndex : "updateDate",
			key : "updateDate",
			width : "8%",
			render(data,row,index){
				return  new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title : i18n.t(100361/*分管人*/),
			dataIndex : 'staff',
			key : "staff",
			width : "5%",
			render(data,row,index){
				let array = data ||[];
				return <div>{
					data.map((e,i)=>{
						return <span key={i} style={{paddingRight:'5px'}}>{e}</span>
					})
				}</div>;
			}
		}];
		this.state = {
			rodalShow:false ,
			title:'',
			scroll:0,
			paddingTop:0,
			selectArr:[],
			checkedRows:[],
			buttonLeft:i18n.t(100429/*保存并关闭*/),
			contentTemplate:<div></div>,
			checkedData:'',
			page:{size:20,totalPages:0,currentPage:1,totalRecords:0},
			data : [],
			materialId:this.props.location.query.id
		}
		this.onClickLink = this.onClickLink.bind(this);
	}
	onClickLink(row){
		let {navAddTab} =this.props;
 		// navAddTab({id:7,name:'客户详情',component:'客户详情',url:'/client/detail'});
  	// 	this.props.router.push({pathname:'/client/detail',query:{id:row.enterpris.id}});

        let name = "客户(" + row.localName + ")";
        navAddTab({id: 3, name: name, component: name, url: '/client/detail/' + row.id});
        this.props.router.push({pathname: '/client/detail/' + row.id,query:{id:row.id}});

	}
	handleResize(height){
		this.setState({
  			paddingTop:!this.state.paddingTop
  		});
  		let padding = this.state.paddingTop ? 173:262;
		let sch=document.body.offsetHeight-height-padding;
		let scroll = sch-135;

		this.setState({scrollHeight:sch+'px',scroll:scroll});
	}
	getPage(sID,objValue){
		let that = this;
		var sID = sID || '';
		if(objValue){
			this.setState({
				obj:objValue
			},function() {
			// body...
				let object=Object.assign({},{mtl:this.state.materialId, pageSize: this.state.pageSize, currentPage: this.state.currentPage },this.state.obj);
				apiGet(API_FOODING_DS,'/customer/getPage',object,
					(response)=>{
						that.setState({
							data: response.data.data,
							totalPages: response.data.totalPages,
							currentPage: response.data.currentPage
						});
					},(errors)=>{
				});
			})
		}else {
			let object=Object.assign({},{mtl:this.state.materialId,pageSize: this.state.pageSize, currentPage: this.state.currentPage, mtltyId: sID },this.state.obj);
			apiGet(API_FOODING_DS,'/customer/getPage',object,
				(response)=>{
					that.setState({
						data: response.data.data,
						totalPages: response.data.totalPages,
						currentPage: response.data.currentPage
					});
				},(errors)=>{
			});
		}

	}
	componentDidMount(){
        this.handleResize(0);
        if(!this.props.isDetail){
            this.getPage();
		}
		window.addEventListener('resize', this.handleResize(0));
    };
    componentWillUnmount() {
    	window.removeEventListener('resize', this.handleResize(0));
  	}
  	componentWillReceiveProps(nextProps){
  		this.handleResize(0);
		window.addEventListener('resize', this.handleResize(0));
  	}
	render(){
		return (
				<div className="contact-fluid">
					<div className='content-margin'></div>
					<div className="contact-body" style = {{height:this.state.scrollHeight}}>
						<Page />
						<div className="action-normal-buttons">
							<Table
									columns={this.columns}
									scroll={{x:true,y:this.state.scroll}}
									data={this.state.data}
									checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
									colorFilterConfig={{show : false}}
									followConfig={{show:false}}
									style={{width:'100%'}}
							/>
						</div>
					</div>
				</div>
			);
	}

}
export default NavConnect(Customer);
