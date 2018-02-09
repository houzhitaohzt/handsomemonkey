import React from 'react';
// import Draggable from 'react-draggable';
import TabsCommon from '../../../Home/components/TabsCommon';
import {apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_ES,API_FOODING_MAIL,
  language,commonAjax,getQueryString} from '../../../../services/apiCall';
import { Tree } from 'antd';
import i18n from '../../../../lib/i18n';
const TreeNode = Tree.TreeNode;
function setLeaf(treeData, curKey, level) {
  const loopLeaf = (data, lev) => {
    const l = lev - 1;
    data.forEach((item) => {
      if(!item.id) return;
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

export class LinkMan extends React.Component{
  constructor(props){
    super(props);
    let clone = require('clone');
    this.state ={
      gData:[],
      isgData:0,
      currentIndex:0,
      zuijinArray:[],//最近联系人
      waibuArray:[],//外部联系人
      neibuArray:[],//内部联系人
      inputWValue:'',
      inputNValue:'',
      selectArray:clone(this.props.selectArray)||[],//已选择的联系人数组
    };
    this.tabClick = this.tabClick.bind(this);

    //最近联系人
    this.zuijinClick = this.zuijinClick.bind(this);
    //外部联系人搜索
    this.waibuSearch = this.waibuSearch.bind(this);
    //内部联系人搜索
    this.neibuSearch = this.neibuSearch.bind(this);

    //选择联系人
    this.selectLink = this.selectLink.bind(this);
    this.deleteLink = this.deleteLink.bind(this);
    //判断已经选择的数据当中是否存在当前元素
    this.ishasArray = this.ishasArray.bind(this);

    //加载内部联系人
    this.onLoadData = this.onLoadData.bind(this);
    this.onTreeSelect = this.onTreeSelect.bind(this);

    //点击确定按钮
    this.confirmClick = this.confirmClick.bind(this);
  }
  confirmClick(){
    this.props.confirmClick(this.state.selectArray);
  }
  onTreeSelect(info,treeNode){
    if(treeNode.node.props.data.entity){
      this.selectLink(treeNode.node.props.data);
    }
  }
  onLoadData(treeNode){
    let that = this;
    return new Promise((resolve) => {
      setTimeout(() => {
        treeNode.props.data.partyType = treeNode.props.data.partyType || {};

        if(treeNode.props.data.partyType.id != 30){
          apiGet(API_FOODING_ES,'/staff/getStaffsMailList',{partyId:treeNode.props.eventKey},(response)=>{
              const gData = [...this.state.gData];
                getNewTreeData(gData,treeNode.props.eventKey,response.data,10);
                this.setState({gData});
                resolve();
          },(error)=>{

          })
        }else{
          // debugger
          // const gData = [...that.state.gData];
          // getNewTreeData(gData, treeNode.props.eventKey, generateTreeNodes(treeNode), 2);
          // this.setState({gData});
          resolve();
        }
      }, 500);
    });
  }
  deleteLink(index){
    let selectArray = this.state.selectArray;
    selectArray.splice(index,1);
    this.setState({selectArray:selectArray})
  }
  ishasArray(value){
    let selectArrayId = [];
    let selectArray = this.state.selectArray;
    selectArray.map((e)=>{
      selectArrayId.push(e.email)
    });
    let dd = value.entity.localName? value.entity.localName+'<'+value.email+'>':value.email;
    if(selectArrayId.indexOf(value.email)>-1 || selectArrayId.indexOf(dd)>-1){
      return true;
    }
    return false;
  }
  selectLink(value){
    let that = this;
    let selectArray = this.state.selectArray;
    if(!this.ishasArray(value)){
      selectArray.push(value);
      this.setState({selectArray:selectArray});
    }
  }
  tabClick(index){
    if(index == 2){
      apiGet(API_FOODING_ES,'/party/getLoginCompanyDepts',{},(response)=>{
         this.setState({gData:response.data.dataList||[],isgData:0});
      },(error)=>{

      })
    }
    this.setState({currentIndex:index});
  }
  neibuSearch(value){
    apiGet(API_FOODING_ES,'/staff/searchStaffsMailList',{keyword:value},(response)=>{
        this.setState({neibuArray:response.data,isgData:1})
    },(error)=>{
    })
  }
  waibuSearch(value){
    apiGet(API_FOODING_DS,'/emailContact/getOutContacts',{keyword:value},(response)=>{
        this.setState({waibuArray:response.data})
    },(error)=>{
    })
  }
  zuijinClick(){
    apiGet(API_FOODING_DS,'/emailContact/getRecentContacts',{},(response)=>{
       this.setState({zuijinArray:response.data});
    },(error)=>{
    })
  }
  componentDidMount(){
    this.zuijinClick();
  }
  render(){
    let that = this;
    let common=<div></div>;
    if(that.state.currentIndex == 0){
      common=<ul className='scroll' style={{height:'100%',overflowY:'auto',marginTop:0}}>
              {
                this.state.zuijinArray.map((e,i)=>{
                   return   <li key={i} title={e.entity.localName? e.entity.localName+'<'+e.email+'>':e.email}  onClick={this.selectLink.bind(this,e)} className={this.ishasArray(e)?'none':'font-hide'}>{e.entity.localName?e.entity.localName+'<'+e.email+'>':e.email}</li>
                })
              }
          </ul>;
    }else if (that.state.currentIndex == 1) {
      common=<div style={{height:'100%'}}>
        <label>
          <i className='foddingicon fooding-search_icon' onClick={this.waibuSearch.bind(this,that.state.inputWValue)}></i>
          <input type='text'
            placeholder={i18n.t(700148/*请输入姓名或者邮箱*/)}
            value={this.state.inputWValue}
            onChange={(e)=>{
            that.setState({inputWValue:e.target.value})
          }}
          onKeyUp={
            (e)=>{
              if(e.keyCode == 13){
                this.waibuSearch(e.target.value);
              }
            }
          }
        />
        </label>
        <ul className='scroll' style={{height:'85%',overflowY:'auto',marginTop:0}}>
          {
            this.state.waibuArray.map((e,i)=>{
               return   <li key={i} title={e.entity.localName? e.entity.localName+'<'+e.email+'>':e.email} onClick={this.selectLink.bind(this,e)} className={this.ishasArray(e)?'none':'font-hide'}>{e.entity.localName? e.entity.localName+'<'+e.email+'>':e.email}</li>
            })
          }
        </ul>
      </div>;
    }else if (that.state.currentIndex == 2) {
      //内部联系人
      let comz = <div></div>;
      const loop = (data) => data.map((item) => {
        if (item.children && item.children.length) {
          return <TreeNode
            key={item.entity?item.email:item.id}
            title={item.localName?item.localName:item.entity.localName} data={item}
           isLeaf={item.entity?true:false}>{loop(item.children)}</TreeNode>;
        }
        return <TreeNode key={item.entity?item.email:item.id}
          title={item.localName?item.localName:(item.entity.localName?item.entity.localName+'<'+item.email+'>':item.email)}
          data={item} isLeaf={item.entity?true:false}
        />;
      });
      if(this.state.isgData){
        comz = <ul className='scroll' style={{height:'85%',overflowY:'auto',marginTop:0}}>
                {
                  that.state.neibuArray.map((e,i)=>{
                    return <li key={i} onClick={this.selectLink.bind(this,e)} className={this.ishasArray(e)?'none':''}>{e.entity.localName?e.entity.localName+'<'+e.email+'>':e.email}</li>
                  })
                }
          </ul>
      }else{
        comz =  <ul className='scroll' style={{height:'85%',overflowY:'auto',marginTop:0}}>
              <Tree onSelect={this.onTreeSelect} loadData={this.onLoadData}>
              {loop(this.state.gData)}
            </Tree>
          </ul>
      }
      common=<div style={{height:'100%'}}>
        <label>
          <i className='foddingicon fooding-search_icon' ></i>
          <input type='text'   placeholder={i18n.t(700148/*请输入姓名或者邮箱*/)}
            value={this.state.inputNValue}
            onChange={(e)=>{
            that.setState({inputNValue:e.target.value})
          }}
          onKeyUp={
            (e)=>{
              if(e.keyCode == 13){
                this.neibuSearch(e.target.value);
              }
            }
          }
          />
        </label>
        {comz}
      </div>
    }
    return <div>
      <div className='linkman' style={{top:'38%',left:document.body.offsetWidth/2-328}}>
        <h1>{i18n.t(700147/*从联系人中添加*/)}</h1>
        <div className='menu'>
          <h2>{i18n.t(100370/*联系人*/)}</h2>
          <div className='content'>
            <nav id='linkman_nav'>
              <li className={this.state.currentIndex == 0?'on':''} onClick={this.tabClick.bind(this,0)}>{i18n.t(700144/*最近联系人*/)}</li>
              <li className={this.state.currentIndex == 1?'on':''} onClick={this.tabClick.bind(this,1)}>{i18n.t(700145/*外部联系人*/)}</li>
              <li className={this.state.currentIndex == 2?'on':''} onClick={this.tabClick.bind(this,2)}>{i18n.t(700146/*内部联系人*/)}</li>
            </nav>
            <div className='tab-box'>
              {common}
            </div>
          </div>
        </div>
        <div className='menu'>
          <h2>{i18n.t(200540/*收件人*/)}</h2>
          <ul className='content scroll' style={{overflowY:'auto'}}>
              {
                this.state.selectArray.map((e,i)=>{
                  return <li key={i} style={{position:'relative'}}>{e.entity.localName?e.entity.localName+'<'+e.email+'>':e.email}
                    <i className='foddingicon fooding-menu_delete_32'
                      style={{color: 'red',position: 'absolute',right:'10px',top: '8px',display:'none'}}
                      onClick={this.deleteLink.bind(this,i)}
                    ></i>
                  </li>;
                })
              }
          </ul>
        </div>
        <footer>
          <button className='saerch_confirm on' onClick={this.confirmClick}>{i18n.t(200043/*确定*/)}</button>
          <button className='saerch_confirm' onClick={this.props.onCancal}>{i18n.t(100461/*取消*/)}</button>
        </footer>
      </div>
    </div>

  }
}
export default LinkMan;
