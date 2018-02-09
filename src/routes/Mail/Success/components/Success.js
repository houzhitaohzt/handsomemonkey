import React from 'react';
import {getQueryString, apiGet, apiPost, apiForm, API_FOODING_MAIL, API_FOODING_ERP, language, pageSize, sizeList} from '../../../../services/apiCall';
import Dialog from '../../../../components/Dialog/Dialog';
import Archive from '../../Home/components/Archive';
import NavConnect from "../../../../components/NavigateTabs/containers/AddContainer";
import i18n from '../../../../lib/i18n';
export class Success extends React.Component{
  constructor(props){
    super(props);
    this.state ={
      mailId:this.props.location.query.mailId,
      collectionName:this.props.location.query.collectionName,
      statusCode:this.props.location.query.statusCode,
      data:{bills:[]},
      showDialog:false,
      showDetail: false, // show 详情
    }

    this.buttonClick = this.buttonClick.bind(this);
  }
  buttonClick(){
    this.setState({showDialog:true});
  }
  componentDidMount(){
    this.getPage();
  }

  //点击归档
  addHandle = (Template)=>{
    this.setState({
      dialogContent:Template,
      showDetail:true,
      title:i18n.t(700071/*归档*/)
    });
  }
  
  onCancel = ()=>{
    this.setState({showDetail:false});
  }    

  // page 
  getPage= ()=>{
    apiGet(API_FOODING_MAIL,'/box/getOne',{mailId:this.state.mailId,collectionName:this.state.collectionName},(response)=>{
      let data = Object.assign({},response.data,{collectName:this.state.collectionName});

      this.setState({data:data,showDialog:false},function(){
        this.setState({showDialog:true});
      });
    },(error)=>{

    });
  }


  render(){
    let {showDialog} = this.state;
    let that = this;
    return <div className='send-success noohle-email' style={{height:document.body.offsetHeight-80,backgroundColor:'#fff'}}>
      <div className='head'>
        <span>{this.state.statusCode==2?i18n.t(700075/*发送成功！*/):i18n.t(700073/*发送失败*/)}</span>
        <div>
          { showDialog ?
            <Archive  page="success" row ={this.state.data} getPage={that.getPage} addHandle = {that.addHandle} onCancel={that.onCancel}/>
            :
            ''
          }
        </div>
        {/*<button>{i18n.t(700072*//*需要归档*//*)}</button>*/}
      </div>
      <ul className='footer'>
        <li onClick={()=>{
            that.props.navRemoveTab({name:i18n.t(700006/*写邮件*/), component:i18n.t(700006/*写邮件*/), url:'/email/success'});
            that.props.navAddTab({name:i18n.t(100586/*邮件*/),component:i18n.t(100586/*邮件*/),url:'/mail'});
            this.props.router.push({pathname:'/mail'});
        }}>
          <i className='foddingicon fooding-Inbox'></i>
          <span>{i18n.t(100431/*返回*/)+i18n.t(700008/*收件箱*/)}</span>
        </li>
        <li onClick={()=>{
            that.props.navRemoveTab({name:i18n.t(700006/*写邮件*/), component:i18n.t(700006/*写邮件*/), url:'/email/success'});
            that.props.navAddTab({name:i18n.t(100586/*邮件*/),component:i18n.t(100586/*邮件*/),url:'/mail'});
            this.props.router.push({pathname:'/mail',query:{type:'outbox'}});
        }}>
          <i className='foddingicon fooding-send-mail'></i>
          <span>{i18n.t(700154/*查看已发邮件*/)}</span>
        </li>
        <li onClick={()=>{
            that.props.navReplaceTab({name:i18n.t(700006/*写邮件*/),component:i18n.t(700006/*写邮件*/),url:'/email/write'});
            this.props.router.push({pathname:'/email/write',query:{collectionName:that.state.collectionName}});
        }}>
          <i className='foddingicon fooding-write-mail'></i>
          <span>{i18n.t(700155/*继续写信*/)}</span>
        </li>
      </ul>
      <Dialog visible={this.state.showDetail} title={this.state.title} width={'80%'}>
          { this.state.dialogContent}
      </Dialog>
    </div>
  }
}
export default NavConnect(Success);
