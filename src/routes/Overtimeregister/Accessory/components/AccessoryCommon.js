import i18n from '../../../../lib/i18n';
/*附件*/
import React,{Component,PorpTypes} from "react";
//引入按钮键
import  Confirm from  './FuctionKeys';
import  DeleteDialog from '../../../../components/Dialog/Confirm';
const {Table} = require("../../../../components/Table");
import Page from "../../../../components/Page";
import Dialog from '../../../../components/Dialog/Dialog';
import Accessoryplug from "./Accessoryplug";
import YuLang from './YuLang';
import WebData from '../../../../common/WebData';
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,API_FOODING_ES,API_FOODING_OA,language,pageSize,sizeList,API_NOOHLE_OA} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
import xt from '../../../../common/xt';
export class Accessory extends Component{
    constructor(props){
        super(props);
        props.accessory && props.accessory(this);
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
            page: {size: 20, totalPages: 0, currentPage: 1, totalRecords: 0},
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
        apiGet(API_FOODING_OA,'/netdisk/getDirId',{businessType:this.props.businessType,businessId:this.state.id},(response)=>{
            this.setState({
                muluId:response.data
            });
            this.getPage(response.data);
            this.getMulu(response.data);
        },(error)=>{

        });
    }
    searchClick(){
        let that = this;
        apiGet(API_FOODING_OA,'/fastdfs/getList/byName',{name:this.state.searchValue,businessType:this.props.businessType,businessId:this.state.id},(response)=>{
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
        let  businessId = this.state.id;
        let businessType = this.props.businessType;
        apiGet(API_NOOHLE_OA,'/getList/' + businessType + '/' + businessId,{}, (response)=>{
                that.setState({
                    data:response.data.data,
                    totalPages: response.data.totalPages,
                    currentPage: response.data.currentPage,
                    parent:parent
                })
            },(error)=>{

            })
    }
    addClick(e){
        this.setState({
            rodalShow : true,
            title:i18n.t(200081/*新增附件*/),
            title_1:'',
            contentTemplate:<Accessoryplug onCancel = {this.onCancel} businessType ={this.props.businessType}
                                           id={this.state.id} muluId={this.state.muluId} onChange ={this.onChange}
                                           onSaveAndClose={this.onSaveAndClose}/>
        });
    }
    deleteClick(e){
        let that = this;
        let select = this.refs.accessory.getSelectArr();
        let IDAll = select.map( (o)=>o.businessId );
        if(select.length == 0 ){
            ServiceTips({text:i18n.t(200082/*请选中一条数据*/),type:'error'});
        } else{
            DeleteDialog(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
                done: () => {
                    apiForm(API_NOOHLE_OA,'/delete',{id: IDAll},
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
            window.location.href = API_NOOHLE_OA + '/download?'+'fileName='+data.record.fileName+'&fullPath='+data.record.fullPath;
        }else if(data.type ==2){
            apiGet(API_NOOHLE_OA,'/get/'+data.record.id,{},(response)=>{
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
                            window.location.href = API_NOOHLE_OA + '/download?'+'fileName='+data.record.fileName+'&fullPath='+data.record.fullPath;
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
        let scroll = sch - 326;
        this.setState({scrollHeight:sch+'px',scroll:scroll});
    }
    componentDidMount(){
        this.handleResize(0);
        if(!this.props.isDetail){
            apiGet(API_FOODING_OA,'/netdisk/getDirId',{businessType:this.props.businessType,businessId:this.state.id},(response)=>{
                this.setState({
                    muluId:response.data
                });
                this.getPage(response.data);
                this.getMulu(response.data);
            },(error)=>{

            });
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
    linkClick(value){
        this.getPage(value.id);
        this.getMulu(value.id);
    }
    render(){
        let that = this;
        let {page} = this.state;
        let common = <div style={{float:'left',height:'40px'}}>
            {this.state.muluArray.map((value,i)=>{
                if(i !=0){
                    return (<a style={{lineHeight:'40px'}} key={i} onClick={this.linkClick.bind(this,value)}>{value.name +'>'}</a>);
                }
            })}
        </div>


        let {pageIdent} = this.props;
        // 权限按钮
        switch(pageIdent){
            case 'client' :  // 客户
                var  iconArray = [{type:'add',classn:'foddingicon fooding-add-icon3',onClick:this.addClick,permissions:'clien.dtl.add'},{type:'delete',classn:'foddingicon fooding-delete-icon4',onClick:this.deleteClick,permissions:'clien.dtl.del'}];
                break;
            case 'clientLinkman' :	 // 客户-联系人
                var iconArray =  [{type:'add',classn:'foddingicon fooding-add-icon3',onClick:this.addClick,permissions:'clientcontact.dtl.add'},{type:'delete',classn:'foddingicon fooding-delete-icon4',onClick:this.deleteClick,permissions:'clientcontact.dtl.del'}];
                break;
            case 'provider' :	 // 供应商
                var iconArray =  [{type:'add',classn:'foddingicon fooding-add-icon3',onClick:this.addClick,permissions:'provider.dtl.add'},{type:'delete',classn:'foddingicon fooding-delete-icon4',onClick:this.deleteClick,permissions:'provider.dtl.del'}];
                break;
            case 'providerLinkman' :	 // 供应商联系人
                var iconArray =  [{type:'add',classn:'foddingicon fooding-add-icon3',onClick:this.addClick,permissions:'providercontact.dtl.add'},{type:'delete',classn:'foddingicon fooding-delete-icon4',onClick:this.deleteClick,permissions:'providercontact.dtl.del'}];
                break;
            case 'forwarder' :  // 货代公司
                var iconArray = [{type:'add',classn:'foddingicon fooding-add-icon3',onClick:this.addClick,permissions:'forwarder.dtl.add'},{type:'delete',classn:'foddingicon fooding-delete-icon4',onClick:this.deleteClick,permissions:'forwarder.dtl.del'}];
                break;
            case 'forwarderLinkman' :  // 货代公司联系人
                var iconArray = [{type:'add',classn:'foddingicon fooding-add-icon3',onClick:this.addClick,permissions:'forwardercontact.dtl.add'},{type:'delete',classn:'foddingicon fooding-delete-icon4',onClick:this.deleteClick,permissions:'forwardercontact.dtl.del'}];
                break;
            case 'product' :  // 产品
                var iconArray = [{type:'add',classn:'foddingicon fooding-add-icon3',onClick:this.addClick,permissions:'mtl.dtl.add'},{type:'delete',classn:'foddingicon fooding-delete-icon4',onClick:this.deleteClick,permissions:'mtl.dtl.del'}];
                break;
            case 'platformProduct' :  // 平台产品
                var iconArray = [{type:'add',classn:'foddingicon fooding-add-icon3',onClick:this.addClick,permissions:'platform.mtl.dtl.add'},{type:'delete',classn:'foddingicon fooding-delete-icon4',onClick:this.deleteClick,permissions:'platform.mtl.dtl.del'}];
                break;
            case 'server' :  // 服务机构
                var iconArray = [{type:'add',classn:'foddingicon fooding-add-icon3',onClick:this.addClick,permissions:'servbe.dtl.add'},{type:'delete',classn:'foddingicon fooding-delete-icon4',onClick:this.deleteClick,permissions:'servbe.dtl.del'}];
                break;
            case 'serverLinkman' :  // 服务机构 联系人
                var iconArray = [{type:'add',classn:'foddingicon fooding-add-icon3',onClick:this.addClick,permissions:'servbecontact.dtl.add'},{type:'delete',classn:'foddingicon fooding-delete-icon4',onClick:this.deleteClick,permissions:'servbecontact.dtl.del'}];
                break;
            case 'staffer' :  // 职员
                var iconArray = [{type:'add',classn:'foddingicon fooding-add-icon3',onClick:this.addClick,permissions:'staff.dtl.add'},{type:'delete',classn:'foddingicon fooding-delete-icon4',onClick:this.deleteClick,permissions:'staff.dtl.del'}];
                break;
            default:
                var  iconArray = [{type:'add',classn:'foddingicon fooding-add-icon3',onClick:this.addClick},{type:'delete',classn:'foddingicon fooding-delete-icon4',onClick:this.deleteClick}];
        }


        let title = <span>{this.state.title}<i className="font">{this.state.title_1}</i></span>;
        return (
            <div className="contact-fluid">
                <div className='content-margin'></div>
                <div className="contact-body" style = {{height:this.state.scrollHeight}}>
                    <Confirm iconArray ={iconArray}
                             businessType ={this.props.businessType}
                             id={this.state.id} muluId={this.state.muluId} onChange ={this.onChange}
                    />
                    <div className="search"><input type='search'
                                                   name="search" placeholder={i18n.t(200084/*搜索名称*/)}
                                                   value ={this.state.searchValue} onChange = {this.searchChange}
                                                   onKeyDown={(e)=>{
                                                       if(e.keyCode == 13){
                                                           this.searchClick()
                                                       }
                                                   }}
                    />
                        <i className="foddingicon fooding-search_icon" onClick={this.searchClick}></i>
                    </div>
                    <Page
                        currentPage={this.state.currentPage}
                        totalPages={this.state.totalPages}
                        sizeList={[20,50,100]}
                        currentSize={this.state.pageSize}
                        pageSizeChange={(num)=>{
                            that.setState({ pageSize: Number.parseInt(num),currentPage:1 },()=>that.getPage());
                        }}
                        backClick={(num)=>{
                            that.setState({ currentPage: Number.parseInt(num)},()=>that.getPage());
                        }}
                        nextClick={(num)=>{
                            that.setState({ currentPage: Number.parseInt(num)},()=>that.getPage());
                        }}
                        goChange={(num)=>{
                            that.setState({ currentPage: Number.parseInt(num)},()=>that.getPage());
                        }}
                    />
                    <div className="action-buttons">
                        <Table  ref ="accessory"
                                columns={this.columns}
                                data={this.state.data}
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
