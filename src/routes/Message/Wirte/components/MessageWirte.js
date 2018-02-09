import i18n from './../../../../lib/i18n';
import React,{Component, PropTypes} from "react";
import CheckBox from '../../../../components/CheckBox';
import Select, { Option }  from '../../../../components/Select';
import Tree from "../../../../components/Tree/index";
import SockJS from 'sockjs-client';
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
import WebData from '../../../../common/WebData';
import {browserHistory, withRouter} from 'react-router';
import LocationConnect from '../../../../components/location/Container';
import Tabs from '../../Tabs';
function setLeaf(treeData, curKey, level) {
  const loopLeaf = (data, lev) => {
    const l = lev - 1;
    data.forEach((item) => {
      if ((item.id.length > curKey.length) ? item.id.indexOf(curKey) !== 0 :
        curKey.indexOf(item.id) !== 0) {
        return;
      }
      if (item.children) {
        loopLeaf(item.children, l);
      } else if (l < 1) {
        item.isLeaf = true;
      }
    });
  };
  loopLeaf(treeData, level + 1);
}
function getNewTreeData(treeData, curKey, child, level) {
  const loop = (data) => {
    // if (level < 1 || curKey.length - 3 > level * 2) return;
    data.forEach((item) => {
      if (curKey.indexOf(item.id) === 0) {
          item.children = child;
      }else if(item.children){
        loop(item.children);
      }
    });
  };
  loop(treeData);
  setLeaf(treeData, curKey, level);
}
class MessageWirte extends Component{
	constructor(props){
		super(props);
		this.onSelect = this.onSelect.bind(this);
		this.onLoadData = this.onLoadData.bind(this);
		this.secondonCheck = this.secondonCheck.bind(this);
		this.state ={
			gData:[],
			treeChecked:true,
			checkedKeys: [],
			selectedKeys: [],
			checkedNodes:[]

		};
		this.webSoket= this.webSoket.bind(this);
	}
	 secondonCheck(keys, {checkedNodes}) {
        let checkedKeys = [];
        let checkednode =[];
        checkedNodes.forEach(node => {
        	('children' in node.props && node.props.children.length) || checkednode.push(node.props.label);
            ('children' in node.props && node.props.children.length) || checkedKeys.push(node.key);
        });
        this.setState({checkedKeys:checkedKeys,checkedNodes:checkednode});
    }

	onLoadData(treeNode,Pid){
			if(treeNode.props.treeIndex > 1){
				let parentId = Pid || treeNode.props.eventKey;
				let treeIndex = Pid?treeNode.props.treeIndex-2:treeNode.props.treeIndex-1;
				return new Promise((resolve) => {
						  apiGet(API_FOODING_ES,'/staff/getStaffsMsgList',{partyId:parentId},(response)=>{
						  		const gData = [...this.state.gData];
						  		let array = [];
						  		if(response.data){
						  			for(var i=0;i< response.data.length;i++){
						  				array.push(response.data[i].entity);
						  			}
						  		}
						        getNewTreeData(gData, parentId,array, 10);
						        this.setState({gData});
						        resolve();
						  },(error)=>{

						  })
				});
			}else {
				return new Promise((resolve) => {
					const gData = [...this.state.gData];
					this.setState({gData});
					resolve();	 
				});
			}
			
	}
	onSelect(key,obj){
		//因为可以在选中时有值，而没选中时没有，所以不能用来判断length长度
	}
	handleData(data){
		console.log(data);

	}
	getTree(){
		let that = this;
		apiGet(API_FOODING_ES,'/party/getLoginCompanyDepts',{},(response)=>{
			that.setState({
				gData:response.data.dataList
			})
		},(error)=>{

		});
	}
	linkClick(pathName){
		let tab = {id: this.props.navigate.currentTab, url: pathName};
        this.props.updateTab(tab);
        browserHistory.push(pathName);
	}
	componentDidMount(){
		this.getTree();


		// var stompClient = new Stomp.Stomp(new SockJS('http://192.168.1.75/fooding-message/ws'));
		// var headers ={
  //   login: 'mylogin',
  //   passcode: 'mypasscode',
  //   // additional header
  //   'client-id': 'my-client-id'
// };
// function connectCallback(){
// }
// function errorCallback(){
// }
// stompClient.connect(headers, connectCallback, errorCallback);
// stompClient.send('/subcribe/destination',headers,"message content");
// stompClient.subscribe('/subcribe/destination', function (message) {
// });
		// sock.onopen = function() {
		//     console.log('open');
		//     sock.send("message content");
		// };
		// sock.onmessage = function(e) {
		//     console.log('message', e.data);
		// };
		// sock.onclose = function() {
		//     console.log('close');
		// };
	}
	webSoket(){
		var stompClient;
		stompClient = Stomp.over(new SockJS(url, null, {transports: sockJsProtocols}));
	}
	render(){
		let user = WebData.user;
		return (<div className='message'>
			  <Tabs />
			  <div className='content' style={{height:document.body.offsetHeight-110}}>
			       <div className='button'>
			    	  <span>{i18n.t(200427/*发送*/)}</span>
			  		  <span>{i18n.t(100432/*关闭*/)}</span>
			       </div>
			       <div className='row'>
				  	    <div className='form-group col-xs-12 col-md-12'>
				  			<label className='col-xs-1 col-md-1'>{i18n.t(200540/*收件人*/)+':'}</label>
				  			<div className={'col-xs-10 col-md-10'}>
				  				{
				  					this.state.checkedNodes.map((value,i)=>{
				  						return <span key={i} style={{backgroundColor: 'rgba(224, 218, 218, 0.57)',
					  			    padding:'0 5px',
					  			    marginRight:'5px',
		    						borderRadius: '15px',fontSize: '12px',border: '1px solid #a295f4',
		    					   lineHeight: '20px',display: 'inline-block'}}>{value.localName}</span>
				  					})
				  				}
					  			<div style ={{float:'right'}}>
						  			<CheckBox className ='checked'/>
						  			<p style={{display: 'inline-block',marginLeft:'15px'}}>{i18n.t(200767/*广播*/)}</p>
					  			</div>
				  			</div>
				  		</div>
			  		</div>
			  		<div className='row'>
			  			<div className="form-group col-xs-12 col-md-12">
							<label className={'col-xs-1 col-md-1'}>标题：</label>
							<div className={'col-xs-9 col-md-9'}>
								<input type='text' className='text-input' style={{width:'100%'}}/>
							</div>
						</div>
			  		</div>
			  		<div className='row'>
			  			<div className="form-group col-xs-12 col-md-12">
							<label className={'col-xs-1 col-md-1'}>内容：</label>
							<div className={'col-xs-9 col-md-9'}>
								<textarea style={{resize:'none',verticalAlign:'top',
								borderRadius:'6px',width:'100%',height:document.body.offsetHeight-400,borderColor:'#dddddd'}}/>
							</div>
						</div>
			  		</div>
			  		<div className='row'>
			  			<div className="form-group col-xs-12 col-md-12">
							<label className={'col-xs-1 col-md-1'}>查看回执：</label>
							<div className={'col-xs-9 col-md-9'}>
								<CheckBox />
							</div>
						</div>
			  		</div>
			  		<div className='row'>
			  			<div className="form-group col-xs-12 col-md-12">
							<label className={'col-xs-1 col-md-1'}>{i18n.t(200539/*发件人*/) +':'}</label>
							<div className={'col-xs-9 col-md-9'}>
								<span>{user?(user.data.loginName+' - '+ user.data.staff.cluster.localName):''}</span>
					  		    <span style={{marginLeft:'20px',marginRight:'10px'}}>{i18n.t(200753/*重要级别*/)}</span>
					  		    <Select style={{width:'200px'}}>
					  		    		<Option value={'2222'}>111</Option>
					  		    </Select>
							</div>
						</div>
			  		</div>
			  	</div>
			  	<div className='right-wirte'  style={{height:document.body.offsetHeight-110}}>
			  		<Tree 
						onRightClick={this.onRightClick} 
						onSelect={this.onSelect}
						onCheck={this.secondonCheck}
						checkable={this.state.treeChecked}
          				gData={this.state.gData}	
          				onLoadData={this.onLoadData}
          				checkedKeys={this.state.checkedKeys}
                        selectedKeys={this.state.selectedKeys}			
          			>
					</Tree>
			  	</div>
		</div>)
	}

}
export default LocationConnect(MessageWirte);