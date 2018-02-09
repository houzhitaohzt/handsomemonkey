import React, { Component,PropTypes } from 'react';
import ReactDOM from 'react-dom'
import '../CoreLayout/CoreLayout.less'
import '../../styles/core.less'
import Header from '../../components/Header'
import PlatFCustomerHead from '../../routes/PlatFormCustomer/Detail/Header/PlatFCustomerHead'
//引入ajax请求
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS } from "../../services/apiCall";


import DetailCommon from  '../../common/DetailCommon';
import Detail from  '../../routes/PlatFormCustomer/Detail/Content/components/ProCustomer';
import Info  from  '../../routes/PlatFormCustomer/SignInfo/components/SignInfo';
class PlatCustomerLayout extends Component{
	constructor(props) {
		super(props);
		this.state={
			paddingTop:226,
			id:this.props.location.query.id,
			valueone:{},
            curentId: DetailCommon.platCustomer[this.props.location.query.id]  || this.props.location.query.index || 'detail',
		};		
		this.initObj=this.initObj.bind(this);
		this.handleResize=this.handleResize.bind(this);
        this.onClickLink = this.onClickLink.bind(this);
    }
    onClickLink(obj){
        let that = this;
        if(obj.id == 'detail' && !this.state.isDetail){
            this.detail.getPages();
            this.setState({
                isDetail:true
            });
        }else if(obj.id == 'info' && !obj.isLoading){
        }
        DetailCommon.platCustomer[this.props.location.query.id] = obj.id;
        that.setState({
            curentId:obj.id
        });
    }
	 //进入详情初始化数据
    initObj = (obj) => {
        apiGet(API_FOODING_ES,"/party/getRegisterInfo",{partyId:this.state.id}, (response) => {
        	let valueone = response.data.party;
            this.setState({ valueone },()=>{
                if(obj){
                    this.onClickLink({id:this.state.curentId,isLoading:false})
                }
            })
        },(error) => {
            console.log(error.message)
        })
    };
	handleResize(){
		let sch=document.body.offsetHeight-this.state.paddingTop;
		this.setState({scrollHeight:sch+'px'});
	};
	componentDidMount(){
		this.initObj(true);
        let sch=document.body.offsetHeight-this.state.paddingTop;
		this.setState({scrollHeight:sch+'px'});
		// window.addEventListener('resize', this.handleResize);
    };
    componentWillReceiveProps(nextProps){
    	let id = nextProps.location.query?nextProps.location.query.id:"";
    	if(id && this.props.location.query.id != id){
    		this.setState({id:id},() => this.initObj())
    	}
    }
	componentWillUnmount() {
    	// window.removeEventListener('resize', this.handleResize);
  	};
	render(){
		let children=Object.assign({},this.props.children,{});
		let newProps=Object.assign({},children.props,{paddingTop:this.state.paddingTop,valueone:this.state.valueone});
		children.props=newProps;
		return (
			<div className='container-body'>
				<PlatFCustomerHead valueone={this.state.valueone}
								   curentId ={this.state.curentId}
								   id={this.state.id}  onClickLink ={this.onClickLink}
				/>
			    <div className={'detail-layout__viewport'} style={{paddingTop:this.state.paddingTop}}>
					<div>
						<div className={this.state.curentId == 'detail' ?"":"none"}>
							<Detail {...newProps} detail ={no => this.detail = no} isDetail ={this.state.isDetail} />
						</div>
						<div className={this.state.curentId == 'info' ?"":"none"}>
							<Info {...newProps} info ={no => this.info = no} isDetail ={true} />
						</div>
					</div>
			    </div>
			</div>
		);
	}
}
PlatCustomerLayout.propTypes = {
  children : React.PropTypes.element.isRequired
}

export default PlatCustomerLayout;

