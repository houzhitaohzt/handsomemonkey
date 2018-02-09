import React, { Component,PropTypes } from 'react';
import ReactDOM from 'react-dom'
import '../CoreLayout/CoreLayout.less'
import '../../styles/core.less'
import Header from '../../components/Header'
import SFDetailsHead from '../../routes/Staffer/Detail/Header/SFDetailsHead'
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS } from "../../services/apiCall";
import ServiceTips from '../../components/ServiceTips';


import DetailCommon from  '../../common/DetailCommon';
import Detail from  '../../routes/Staffer/Detail/Content/components/ProviderDetail';
import Accessory from  '../../routes/Staffer/Accessory/components/Accessory';
import Annotation from '../../routes/Staffer/Annotation/components/Annotation';
export class SFDetailLayout extends Component{
	constructor(props) {
		super(props);
		this.state={
			paddingTop:226,
			id:this.props.location.query.id,
			staff:{
			    code:"",
			    name:"",
			    createUserId:'',
			    description:null,
			    createDate:'',
			    country:"",
			    company:"",
			    defaultContact:"",
			    defaultWeb:"",
			    enName:"",
			    id:"",
			    localName:"",
			    optlock:'',
			    rowSts:'',
			    updateDate:'',
			    updateName:"",
			    locale:'',
			    organization:'',
			    positn:'',
			    partys:[],
			    sex:'',
			    skype:'',
			    emailAddress:'',
			    hobbys:'',
			    eduDegr:'',
			    idcardSN:'',
			    stfType:'',
			    title:'',
			    workingState:'',
			    cluster:"",
			    createName:'',
			},
            curentId: DetailCommon.staff[this.props.location.query.id] || this.props.location.query.index  || 'detail'
			
		};
		this.getDetailData =this.getDetailData.bind(this);
		this.handleResize=this.handleResize.bind(this);
        this.onClickLink = this.onClickLink.bind(this);
    }
    onClickLink(obj){
        let that = this;
        if(obj.id == 'detail' && !this.state.isDetail){
            this.detail.getPage();
            this.setState({
                isDetail:true
            });
        }else if(obj.id == 'accessory' && !obj.isLoading){
            this.accessory.getPage();
        }else if(obj.id == 'annotation' && !obj.isLoading){
            this.annotation.getPage();
        }
        DetailCommon.staff[this.props.location.query.id] = obj.id;
        that.setState({
            curentId:obj.id
        });
    }
    //获取单条产品数据 （包括常规数据，组织数据，以及所有的table列表等等）
	getDetailData(obj){
		apiGet(API_FOODING_ES,'/staff/getDetail',{id:this.state.id},(response)=>{
			let {staff} = response.data;
			staff = Object.assign({},staff,{updateName:response.data.updateName,createName:response.data.createName});
			this.setState({
				staff:staff
				
			},()=>{
                if(obj){
                    this.onClickLink({id:this.state.curentId,isLoading:false})
                }
            })
		},(error)=>{
			ServiceTips({text:'服务器错误！',type:'error'});
		})
	}

	handleResize(){
		let sch=document.body.offsetHeight-this.state.paddingTop;
		this.setState({scrollHeight:sch+'px'});
	};
	componentDidMount(){
		this.getDetailData(true);
        let sch=document.body.offsetHeight-this.state.paddingTop;
		this.setState({scrollHeight:sch+'px'});
		// window.addEventListener('resize', this.handleResize);
    };
	componentWillUnmount() {
    	// window.removeEventListener('resize', this.handleResize);
  	};
	render(){
		let children=Object.assign({},this.props.children,{});
		let newProps=Object.assign({},children.props,{
			paddingTop:this.state.paddingTop,
			staff:this.state.staff,
			getDetailData:this.getDetailData});
			children.props=newProps;
		return (

			<div className='container-body'>
				<SFDetailsHead  getDetailData={this.getDetailData} value={this.state.staff}
								curentId ={this.state.curentId}
								id={this.state.id}  onClickLink ={this.onClickLink}
				/>
			    <div className={'detail-layout__viewport'} style={{paddingTop:this.state.paddingTop}}>
					<div>
						<div className={this.state.curentId == 'detail' ?"":"none"}>
							<Detail {...newProps} detail ={no => this.detail = no} isDetail ={this.state.isDetail} />
						</div>
						<div className={this.state.curentId == 'accessory' ?"":"none"}>
							<Accessory {...newProps} accessory ={no => this.accessory = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'annotation' ?"":"none"}>
							<Annotation {...newProps} annotation ={no => this.annotation = no} isDetail ={true} />
						</div>
					</div>
			    </div>
			</div>
			);
	}
}
SFDetailLayout.propTypes = {
  children : React.PropTypes.element.isRequired
}

export default SFDetailLayout

