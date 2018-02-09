import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';

import Button from  '../../../../components/button/confirm';
import Dialog  from '../../../../components/Dialog';
import Confirm from '../../../../components/Dialog/Confirm';
import ChenpsortDialog from './ChenpsortDialog';
//引入ajax
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
export class Chenpsort extends Component{
    constructor(props){
        super(props);
        props.chenpsort && props.chenpsort(this);
        this.state = {
            scrollHeight:0,
            visible:false, 
            dialogTitle:'',
            dilogTelmp:<div></div>,        
            
            id:this.props.location.query.id,
            data:[],
            selectArray:[], //判断是否选中的一个数组
        }
    }
    addClick = () => {
        let dialogTitle=i18n.t(200863/*新增成品分类*/);
        this.setState({
            visible:true,
            dialogTitle:dialogTitle,
            dilogTelmp:<ChenpsortDialog 
                onCancel = {this.onCancel}
                id={this.state.id}
                onSaveAndClose = {this.onSaveAndClose}
            />
        }); 
    }

    onSaveAndClose = () => {
        this.setState({visible:false});
        this.getInitData()
    }
    onCancel = () => {
        this.setState({visible:false});
    }
    //单个删除
    cleanClick = (obj,i,event) =>　{
        event.stopPropagation();
        this.deleteNode(obj.id);        
    }
    //多个删除
    deleteAllClick = (e) => {
        let {selectArray} = this.state,ids=[];
        selectArray.filter((e,i) => {
            if(e.selected) ids.push(e.id);
        })
        this.deleteNode(ids);
    }

    //删除的公共方法
    deleteNode = (ids) => {
        if(!ids.length) {
            Confirm(i18n.t(200864/*请至少选择一条数据进行操作*/), {
                done: () => {
                        
                }
            });
        }else{
            Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
                done: () => {
                    apiForm(API_FOODING_DS,'/material/deleteDataMulDiv1s',{id:this.state.id,dataMulDiv1ids:ids}, response => {
                        ServiceTips({text:response.message,type:'success'})
                        this.getInitData()
                    },error => {
                        ServiceTips({text:error.message,type:'error'})
                    })
                }
            });
        }        
    }
    loseClick = () => {
        //失效是否要做
        // Confirm('确定对该条数据进行失效吗？', {
        //     done: () => {
        //             apiPost(API_FOODING_DS,'',{},{id:this.state.id,dataMulDiv1ids:ids}, response => {
        //                 ServiceTips({text:response.message,type:'success'})
        //                 this.getInitData()
        //             },error => {
        //                 ServiceTips({text:error.message,type:'error'})
        //             })
        //     }
        // }); 
    }
    //选中与不选中
    btnClick =(obj,i,e) => {
        let {selectArray} = this.state;
        for(let j = 0; j<selectArray.length; j++){
            if(obj.id === selectArray[j].id){
                if(!selectArray[j].isClick){
                    selectArray[j].selected = true;
                    selectArray[j].isClick = true;
                }else{
                   selectArray[j].selected = false;
                    selectArray[j].isClick = false; 
                }                
            }
        }
        this.setState({selectArray});
    }
    //初始化数据
    getInitData = () => {
        let that = this;
        apiGet(API_FOODING_DS,'/material/getOne',{id:this.state.id},response => {
            let dataMulDiv1s = response.data.dataMulDiv1s || [];
            let selectArr = dataMulDiv1s.map((o,i) => {return {selected:false,id:o.id,i:i,isClick:false}});
            that.setState({
                data:dataMulDiv1s,
                selectArray:selectArr
            })
        },error => {
            ServiceTips({text:'请刷新后再试！',type:"error"})
        })
    }
    componentDidMount(){
        if(!this.props.isDetail){
            this.getInitData();
        }
        this.handleResize();
        window.addEventListener('resize', this.handleResize(20));
    }
    handleResize(height){
        let padding = 226;
        let sch=document.body.offsetHeight-height-padding;
        this.setState({scrollHeight:sch+'px',scroll:scroll});
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize(0));
    }
    componentWillReceiveProps(nextProps){
        this.handleResize(0);
        window.addEventListener('resize', this.handleResize(0));    
    }
    render(){
        let  iconArray = [{type:'add',onClick:this.addClick,permissions:'mtl.dtl.add'},
        {type:'delete',onClick:this.deleteAllClick,permissions:'mtl.dtl.del'}];
        const commonForm = this.state.dilogTelmp;
        let  that = this;
        return (
            <div>
                <div className={'gtoupe scroll'} style={{height:this.state.scrollHeight}}>
                    <Button iconArray ={iconArray} that={that}/>
                    <div className='content'>
                        <div className='neirong'>
                             {
                                this.state.data.map((value,i)=>{
                                    return(<span key={i}
                                        className ={this.state.selectArray[i].selected ? 'height-l':''}
                                        onClick={this.btnClick.bind(this,value,i)}>
                                        {value&&value.localName?value.localName:''}
                                        <i className='foddingicon fooding-menu_delete_32'
                                            onClick={this.cleanClick.bind(this,value,i)}
                                        ></i>
                                    </span>)
                                })
                             }
                        </div>
                       
                    </div>
                </div>
                <Dialog visible={this.state.visible} title={this.state.dialogTitle} width={926}>
                        {commonForm}
                </Dialog>
            </div>
            );
    }

}
export default Chenpsort;
