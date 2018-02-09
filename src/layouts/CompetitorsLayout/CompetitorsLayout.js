import React, { Component,PropTypes } from 'react';
import ReactDOM from 'react-dom'
import '../CoreLayout/CoreLayout.less'
import '../../styles/core.less'
import Header from '../../components/Header'
import CompetitorsDetailsHead from '../../routes/Competitors/Detail/Header/CompetitorsDetailsHead';
//引入ajax请求
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS } from "../../services/apiCall";
import ServiceTips from '../../components/ServiceTips';
import DetailCommon from  '../../common/DetailCommon';

import Detail from  '../../routes/Competitors/Detail/Content/components/CompetitorsDetail';
import Product from  '../../routes/Competitors/FocusProduct/components/FocusProduct';
import Accessory from  '../../routes/Competitors/Accessory/components/Accessory';
import Annotation from  '../../routes/Competitors/Annotation/components/Annotation';
import Organizational from  '../../routes/Competitors/Organizational/components/Organizational';
export class CompetitorsLayout extends Component{
	constructor(props) {
		super(props);
		this.state={
			paddingTop:226,
			competitor:{
				code:'',
				contactTime:'',
				createData:'',
				createUserName:'',
				cstmCreskt:'',
				cstmLevel:'',
				defaultEntContact:'',
				defaultFax:'',
				defaultPhone:'',
				defaultWeb:'',
				description:'',
				estabDate:'',
				id:'',
				leglpsn:'',
				localName:'',
				name:'',
				optlock:'',
				regCapital:'',
				registCode:'',
				taxIdenSN:'',
				updateDate:'',
				updateUserName:'',
				country:{},
				clusterName:"",
				defaultEmail:'',
				strength:'',
				threat:'',
				weakness:'',
				countryName:'',
				companyName:'',
				'defaultWebName':''
			},
			id:this.props.location.query.id,
            curentId:DetailCommon.competitors[this.props.location.query.id] || this.props.location.query.index || 'detail'
		};
		this.getDetailData =this.getDetailData.bind(this);
		this.handleResize=this.handleResize.bind(this);
		this.onClickLink = this.onClickLink.bind(this);
    }

    //获取单条产品数据 （包括常规数据，组织数据，以及所有的table列表等等） 
    //单条数据可以用竞争对手  可是根据id拿不到数据，因此head现在不用写
	getDetailData(obj){
		apiGet(API_FOODING_DS,'/rival/getDetail',{id:this.state.id},(response)=>{
			this.setState({
				competitor:response.data,
			},()=>{
                if(obj){
                    this.onClickLink({id:this.state.curentId,isLoading:false})
                }
            })
		},(error)=>{
			// ServiceTips({text:'服务器错误！',type:'error'});
		})
	}
    onClickLink(obj){
        let that = this;
        if(obj.id == 'detail' && !this.state.isDetail){
            this.detail.getPage();
            this.setState({
                isDetail:true
            });
        }else if(obj.id == 'product' && !obj.isLoading){
            this.product.getPage();
        }else if(obj.id == 'accessory' && !obj.isLoading){
            this.accessory.getPage();
        }else if(obj.id == 'annotation' && !obj.isLoading){
            this.annotation.getPage();
        }else if(obj.id == 'organizational' && !obj.isLoading){
            this.organizational.getChild();
        }
        DetailCommon.competitors[this.props.location.query.id] = obj.id;
        that.setState({
            curentId:obj.id
        });
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
		let {competitor} = this.state;
		let children=Object.assign({},this.props.children,{});
		let newProps=Object.assign({},children.props,{paddingTop:this.state.paddingTop,
			competitor:competitor,
			getDetailData:this.getDetailData
		});
		children.props=newProps;
		return (
			<div className='container-body'>
				<CompetitorsDetailsHead getDetailData={this.getDetailData} value={this.state.competitor}
										curentId ={this.state.curentId}
										id={this.state.id}  onClickLink ={this.onClickLink}
				/>
			    <div className={'detail-layout__viewport'} style={{paddingTop:this.state.paddingTop}}>
					<div>
						<div className={this.state.curentId == 'detail' ?"":"none"}>
							<Detail {...newProps} detail ={no => this.detail = no} isDetail ={this.state.isDetail} />
						</div>
						<div className={this.state.curentId == 'product' ?"":"none"}>
							<Product {...newProps} product ={no => this.product = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'accessory' ?"":"none"}>
							<Accessory {...newProps} accessory ={no => this.accessory = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'annotation' ?"":"none"}>
							<Annotation {...newProps} annotation ={no => this.annotation = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'organizational' ?"":"none"}>
							<Organizational {...newProps} organizational ={no => this.organizational = no} param={{dataTyId:200}} />
						</div>
					</div>
			    </div>
			</div>
			);
	}
}
CompetitorsLayout.propTypes = {
  children : React.PropTypes.element.isRequired
}

export default CompetitorsLayout;

