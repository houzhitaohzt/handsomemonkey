import React, { Component,PropTypes } from 'react';
import Button from  '../../../../components/button/confirm';
import Dialog  from '../../../../components/Dialog';
import Confirm from '../../../../components/Dialog/Confirm';
import "../../../Product/Groupe/assets/_groupe.less";
import InspectionDialog from './InspectionDialog';
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import {I18n} from "../../../../lib/i18n";
export class Inspection extends Component{
	constructor(props){
		super(props);
        props.inspection && props.inspection(this);
		this.state = {
			scrollHeight:0,
            visible:false,
            dialogTitle:'',
            dilogTelmp:<div></div>,
            data:[],
            sourceId:this.props.location.query.id,
            dataTyId:'',
            selectArray:[]
		}
		this.addClick = this.addClick.bind(this);
		this.deleteClick = this.deleteClick.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.onCancel = this.onCancel.bind(this);


	}
    getPage(sID,objValue){
        let that = this;
        var sID = sID || '';
        if(objValue){
            this.setState({
                obj:objValue
            },function() {
            // body... 
                let object=Object.assign({},{sourceId:this.state.sourceId});
                apiGet(API_FOODING_DS,'/tradruleInspct/getPage',object,
                    (response)=>{
                        that.setState({ 
                            data:response.data.data,
                            totalPages: response.data.totalPages,
                            currentPage: response.data.currentPage  
                        });
                    },(errors)=>{
                });
            })
        }else {
            let object=Object.assign({},{sourceId:this.state.sourceId});
            apiGet(API_FOODING_DS,'/tradruleInspct/getPage',object,
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
    onSaveAndClose(value,data,isAdd){
        var that = this;
        value=Object.assign({},data,value);
        apiPost(API_FOODING_DS,'/tradruleInspct/save',value,(response)=>{
                that.setState({
                    visible:!!isAdd
                })
                 ServiceTips({text:response.message,type:'success'});
                 this.getPage();
        },(errors)=>{
            ServiceTips({text:errors.message,type:'error'});
            that.setState({
                    visible:!!isAdd
            })
        })
    }
    onCancel(that){
        this.setState({
            visible:false
        });
    }
	componentDidMount(){
        this.handleResize();
        if(!this.props.isDetail){
            this.getPage();
        }
        // window.addEventListener('resize', this.handleResize(20));
    }
    handleResize(height){
        this.setState({
            paddingTop:!this.state.paddingTop
        });
        let padding = this.state.paddingTop ? 173:226;
        let sch=document.body.offsetHeight-height-padding;
        this.setState({scrollHeight:sch+'px',scroll:scroll});
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize(20));
    }
    componentWillReceiveProps(nextProps){
        this.handleResize(0);
        // window.addEventListener('resize', this.handleResize(0));
    }
    addClick(){
           let dialogTitle=I18n.t(100104/*监装机构新增*/);
             this.setState({
                visible:true,
                dialogTitle:dialogTitle,
                num:0
            });
    }
     deleteClick(data){
        let array=this.state.selectArray;
        let value=[];
        var that = this;
       if(data&&data.id){
            value.push(data.id);
            Confirm(I18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
                      done: () => {
                            apiForm(API_FOODING_DS,'/tradruleInspct/delete',{id:value},(response)=>{
                                that.getPage();
                                ServiceTips({text:response.message,type:'success'});
                                that.setState({
                                    selectArray:[]
                                })

                            },(errors)=>{
                                ServiceTips({text:errors.message,type:'error'});
                            });
                        },
                        close:() => {
                        }
            });
        }else if(array.length > 0){
            for (var i = 0; i < array.length; i++) {
                    value.push(array[i].id);   
            }
            Confirm(I18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
                      done: () => {
                            apiForm(API_FOODING_DS,'/tradruleInspct/delete',{id:value},(response)=>{
                                that.getPage();
                                ServiceTips({text:response.message,type:'success'});
                                that.setState({
                                    selectArray:[]
                                })
                            },(errors)=>{
                                ServiceTips({text:errors.message,type:'error'});
                            });
                        },
                        close:() => {
                        }
            });
        }else{
            ServiceTips({text:I18n.t(100434/*请选择一条数据！*/),type:'error'});
        }
        
    }
    btnClick(i,e,j){
        let selectArray =this.state.selectArray;
        if(selectArray.indexOf(i)== -1){
            selectArray.push(i);
        }else{
            selectArray.splice(e,1);
        }
        this.setState({
            selectArray
        });
    }
	render(){
		let  iconArray = [{type:'add',onClick:this.addClick},
		{type:'delete',onClick:this.deleteClick}];
		const commonForm = this.state.dilogTelmp;
        let data = this.state.data;
		let  that = this;
		return (

			<div>
				<div className={'gtoupe scroll'} style={{height:this.state.scrollHeight,marginTop:'10px',marginLeft:'0px',marginRight:'0px'}}>
					<Button iconArray ={iconArray} that={that}/>
                    <div className='content'>
                        <div className='neirong'>
                             {
                                data.map((value,i)=>{
                                    return(<span key={i}
                                        className ={this.state.selectArray.indexOf(value) != -1 ? 'height-l':''}
                                        onClick={this.btnClick.bind(this,value,i)}>
                                        {value.localName}
                                        <i className='foddingicon fooding-menu_delete_32'
                                            onClick ={this.deleteClick.bind(this,value)}
                                        ></i>
                                        </span>)
                                })
                             }
                        </div>
                    </div>
				</div>
				<Dialog visible={this.state.visible} title={this.state.dialogTitle} width={926}>
		                <InspectionDialog
                            onCancel = {this.onCancel}
                            num={this.state.num}
                            onSaveAndClose = {this.onSaveAndClose}
                            sourceId={this.state.sourceId}
                            dataTyId={this.state.dataTyId}
                            checkedData = {this.state.checkedData}
                        />
		        </Dialog>
			</div>
			);
	}

}
export default Inspection;
