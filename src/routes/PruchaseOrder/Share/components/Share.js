import i18n from '../../../../lib/i18n';
/*附件*/
import React,{Component,PorpTypes} from "react";
//引入按钮键
import  Confirm from  '../../../../components/button/confirm';
import  DeleteDialog from '../../../../components/Dialog/Confirm';
const {Table} = require("../../../../components/Table");
import Page from "../../../../components/Page";
import Dialog from '../../../../components/Dialog/Dialog';
import Shareplug from "./Shareplug";
import YuLang from './YuLang';
import WebData from '../../../../common/WebData';
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,API_FOODING_ES,API_FOODING_OA,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
import xt from '../../../../common/xt';
export class Accessory extends Component{
		constructor(props){
			super(props);
            props.share && props.share(this);
			this.columns = [{
					title : i18n.t(200077/*附件名称*/),
					dataIndex : 'fileName',
					key : "fileName",
					width : '20%',
					render(data,row,index){
						return (<div className="text-ellipsis" title={data}>{data}</div>)
					}
				},{
					title : i18n.t(200078/*上传人*/),
					dataIndex : "staffName",
					key : "staffName",
					width : "11%",
					render(data,row,index){
						return data;
					}
				},{
					title : i18n.t(200079/*上传时间*/),
					dataIndex : "updateDate",
					key : "updateDate",
					width : "9%",
					render(data,row,index){
						return new Date(data).Format('yyyy-MM-dd');
					}
				},{
				title : i18n.t(200080/*类型*/),
				dataIndex : "ext",
				key : "ext",
				width : "10%",
				render(data,row,index){
					return (<div className="text-ellipsis">{data}</div>)
					}
				},{
				title : i18n.t(300063/*大小*/),
				dataIndex : "length",
				key : "length",
				width : "10%",
				render(data,row,index){
					return (<div className="text-ellipsis">{data}</div>)
				}
		}];
		this.state = {
			rodalShow:false ,
			title:'',
			paddingTop:false,
			contentTemplate:<div></div>,
			data : [],
			id:this.props.location.query.id,
			muluArray:[],
			muluId:5,
			searchValue:'',
			sourceId:[],
			getOne:{}
		}
		this.addClick = this.addClick.bind(this);
		this.deleteClick = this.deleteClick.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.getPage = this.getPage.bind(this);
		this.onChange = this.onChange.bind(this);
		this.getMulu = this.getMulu.bind(this);
		this.searchChange = this.searchChange.bind(this);
		this.searchClick = this.searchClick.bind(this);
		this.getPages = this.getPages.bind(this);
	}
	getPages(){
			let that = this;
        this.getPage();
        apiGet(API_FOODING_OA,'/netdisk/getDirId',{businessType:this.props.businessType,businessId:that.state.sourceId},(response)=>{
            this.setState({
                muluId:response.data
            });
            //this.getPage(response.data);
            this.getMulu(response.data);
        },(error)=>{

        });
	}
	searchClick(){
		let that = this;
		apiGet(API_FOODING_OA,'/fastdfs/share/getList/byName',{name:this.state.searchValue,businessType:'saleNo',businessId:this.state.sourceId},(response)=>{
	        	this.setState({
	        		data:response.data
	        	});
	        	// this.getPage(response.data,this.state.searchValue);
	        	// this.getMulu(response.data);
	        },(error)=>{

	        });

	}
	searchChange(e){
		this.setState({
			searchValue:e.target.value
		});
	}
	onChange(info) {
		let that = this;
	    if (info.file.status !== 'uploading') {

	    }
	    if (info.file.status === 'done') {
	    	this.getPage(this.state.muluId);
	    	this.onCancel();
	    } else if (info.file.status === 'error') {

	    }
  	}
  	getMulu(parent){
  		// let that = this;
  		// let parentId = parent||5;
  		// apiGet(API_FOODING_OA,'/netdisk/dir/getList',{id:parentId},(response)=>{
  		// 	this.setState({
  		// 		muluArray:response.data,
  		// 		muluId:parentId
  		// 	});
  		// },(error)=>{

  		// });
  	}
	getPage(parent,name){
		let that = this;
		let id = this.state.id;
		apiGet(API_FOODING_ERP,'/purorder/getOne',{billId:id},(response)=>{
			this.setState({
				sourceId:response.data.sourceId,
				getOne:response.data
					
			});
			apiGet(API_FOODING_OA,'/fastdfs/share/getList',{businessId:that.state.sourceId,businessType:'saleNo'},
						(response)=>{
						that.setState({
							data:response.data
						})
					},(error)=>{

			})
		},(error)=>{

		})
		
	}
		addClick(e){
			let that =this;
				this.setState({
					rodalShow : true,
					title:i18n.t(200081/*新增附件*/),
					title_1:'',
					contentTemplate:<Shareplug onCancel = {this.onCancel} businessType ={this.props.businessType}
					 id={that.state.sourceId} muluId={this.state.muluId} onChange ={this.onChange}
					onSaveAndClose={this.onSaveAndClose}/>
				});
	    }
	    deleteClick(e){
	    	let that = this;
	    	let select = this.refs.accessory.getSelectArr();
			let IDAll = select.map( (o)=>o.id );
			if(select.length == 0 ){
				ServiceTips({text:i18n.t(200082/*请选中一条数据*/),type:'error'});
			} else{
				DeleteDialog(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
					done: () => {
						apiForm(API_FOODING_OA,'/fastdfs/delete',{id: IDAll},
							(response)=>{
								ServiceTips({text:response.message,type:'sucess'});
								that.getPage(this.state.muluId);
							},(errors)=>{
								ServiceTips({text:errors.message,type:'error'});
						});
					}
				});
			}
	    }
	    onSaveAndClose(){
		}
		onCancel(that){
			this.setState({
				rodalShow:false
			});
		}
		handleClick(e,data,target){
			let tit= data.title;
			let content;
			if(data.type == 3){
				this.deleteClick();
			}else if(data.type ==1){
				window.location.href = API_FOODING_OA + '/fastdfs/download?'+'fileName='+data.record.fileName+'&fullPath='+data.record.fullPath;
			}else if(data.type ==2){
               apiGet(API_FOODING_OA,'/fastdfs/get/'+data.record.id,{},(response)=>{
					let type = response.data.ext.toUpperCase();
					if(type == 'JPG'|| type=='PDF'||type== 'PNG'||
						type=='GIF' || type== 'MP4' || type == 'MP3' || type == 'XML'){
						this.setState({
							rodalShow:true,
							title:tit,
							title_1:data.record.name,
							contentTemplate:<YuLang filename={response.data.fullPath}
							 onCancel = {this.onCancel}/>
						});
					}else{
						DeleteDialog(i18n.t(300052/*当前格式不支持在线预览，是否下载后再预览？*/), {
							done: () => {
								window.location.href = API_FOODING_OA + '/fastdfs/download?'+'fileName='+data.record.fileName+'&fullPath='+data.record.fullPath;
							},
							confirmLabel:i18n.t(200083/*下载*/)
						});
					}

			  },(error)=>{
			  		ServiceTips({text:error.message,type:'error'});
			  });
			}else{
			// this.setState({
			// 	rodalShow:true,
			// 	title:tit,
			// 	title_1:data.record.name,
			// 	contentTemplate:<Accessoryplug
			// 	data ={data} id={this.state.id}
			// 	 onSaveAndClose={this.onSaveAndClose} onCancel = {this.onCancel}/>
			// })
			}
		}
		handleResize(height){
			let sch=document.body.offsetHeight-height;
			let scroll = sch - 282;
			this.setState({scrollHeight:sch+'px',scroll:scroll});
		}
		componentDidMount(){
			let that = this ;
	        this.handleResize(0);
	        if(!this.props.isDetail){
                this.getPage();
                apiGet(API_FOODING_OA,'/netdisk/getDirId',{businessType:this.props.businessType,businessId:that.state.sourceId},(response)=>{
                    this.setState({
                        muluId:response.data
                    });
                    //this.getPage(response.data);
                    this.getMulu(response.data);
                },(error)=>{

                });
			}
			// window.addEventListener('resize', this.handleResize(0));
	    };
		componentWillUnmount() {
	    	// window.removeEventListener('resize', this.handleResize(0));
	  	}
	componentWillReceiveProps(nextProps){
  		this.handleResize(0);
		// window.addEventListener('resize', this.handleResize(0));
  	}
  	linkClick(value){
  		this.getPage(value.id);
  		this.getMulu(value.id);
  	}
	render(){
		let that = this;
		let {getOne} = this.state;
		let common = <div style={{float:'left',height:'40px'}}>
		    {this.state.muluArray.map((value,i)=>{
		    	if(i !=0){
		    		return (<a style={{lineHeight:'40px'}} key={i} onClick={this.linkClick.bind(this,value)}>{value.name +'>'}</a>);
		    	}
		    })}
		</div>



		// 权限按钮
		let  iconArray = getOne['sourceId']?[{type:'add',onClick:this.addClick},{type:'delete',onClick:this.deleteClick}]:[];
		let title = <span>{this.state.title}<i className="font">{this.state.title_1}</i></span>;
		return (
			<div className="contact-fluid">
				<div className='content-margin'></div>
				<div className="contact-body" style = {{height:this.state.scrollHeight}}>
					<Confirm iconArray ={iconArray}/>
					<div className="search"><input type='search'
						name="search" placeholder={i18n.t(200084/*搜索名称*/)}
						value ={this.state.searchValue} onChange = {this.searchChange}
					 />
						<i className="foddingicon fooding-search_icon" onClick={this.searchClick}></i>
					</div>
					<Page />
				<div className="action-buttons">
					<Table  ref ="accessory"
							columns={this.columns}
							data={this.state.data}
							sourceId
							scroll={{x:true,y:this.state.scroll}}
							checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
							style={{width:'100%'}}
							contextMenuConfig={{
								enable:true,
								contextMenuId:'SIMPLE_TABLE_MENU',
								menuItems:[{
									onClick:this.handleClick,
									content:<div><i className="foddingicon fooding-download"></i>{i18n.t(200083/*下载*/)}</div>,
									data:{title:i18n.t(200086/*下载附件*/),type:1}
								},{
									onClick:this.handleClick,
									content:<div><i className={'foddingicon fooding-preview'}></i>{i18n.t(200087/*预览*/)}</div>,
									data:{title:i18n.t(200088/*预览附件*/),type:2}
								},{
									onClick:this.handleClick,
									content:<div><i className={'foddingicon fooding-delete-icon3'}></i>{i18n.t(100437/*删除*/)}</div>,
									data:{title:i18n.t(200089/*删除联系人*/),type:3}
								}]
							}}
					/>
					<Dialog visible={this.state.rodalShow} titleLeft={title} width={926}>
							{this.state.contentTemplate}
					</Dialog>
				</div>
				</div>

			</div>
		)
	}
}
export default Accessory;
