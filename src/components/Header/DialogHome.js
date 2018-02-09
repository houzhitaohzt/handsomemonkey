import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import {browserHistory, Link} from 'react-router';
import {API_FOODING_ES, apiGet, apiPost} from "../../services/apiCall";
import WebData from '../../common/WebData';
import xt from '../../common/xt';

const customStyles = {
  overlay :{
    position: 'fixed',
    zIndex:902,
    top:0,
    minWidth: 1136,
    backgroundColor: 'rgba(126, 140, 153, .8)'
  },
  content : {
    top                   : '80px',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    transform             : 'translate(-50%, 0%)',
    border                : '0',
    backgroundColor       : '#fff',
    padding               :'0',
    overflow              : 'inherit'
  }
};
export class DialogHome extends Component{

  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false ,
      selectValue:'',
      heightLone:'',
      menuArray:[],
        selectId: -1,
    }
    this.openModal=this.openModal.bind(this);
    this.linkClick=this.linkClick.bind(this);
    this.change = this.change.bind(this);
    this.closeModal = this.closeModal.bind(this);
    //查询
    this.findIndex = 0;
    this.findMenuArray = [];
    this.linkRefs = {};
  }
  openModal(){
    this.setState({modalIsOpen: true});
  }
  closeModal(){
    this.setState({modalIsOpen: false});
  }
  afterOpenModal() {
    // this.refs.subtitle.style.color = '#f00';ic-i-menu
  }
  linkClick(obj){

    this.openModal();
    let {actions} = this.props;
    this.closeModal();
    if(obj.url){
      // obj.component = obj.localName;
      // let userId = WebData.user.data.id;
      obj.url = xt.stringTm(obj.url, {
          userId: WebData.user.data.id
      });
      // if(obj.url.indexOf('userId')>-1){obj.url = obj.url+userId}

      // this.props.actions.addTabs({name: obj.localName, component: obj.localName, url: obj.url});
      // browserHistory.push(obj.url);
      window.navTabs.open(obj['localName'],obj['url'],{BI:obj['bi'],menuID:obj['id']},{refresh: true});


      // 保存到 常用菜单
      apiPost(API_FOODING_ES,'/menu/saveRecentMenu',{id:obj['id'],name:obj['name'],url:obj['url']},
        (response)=>{
        },(error)=>{
        }
      );

    }
  }
  change(e){
    this.setState({
      selectValue:e.target.value,
      heightLone:e.target.value,
        selectId: -1,
    });
    this.findIndex = 0;
    this.findMenuArray = [];
    this.findMenu(e.target.value);
  }

    onKeyDown  = (event) =>{
        if(event.keyCode === 13){
            if(this.findMenuArray.length){
                this.findIndex = this.findIndex === this.findMenuArray.length - 1? 0: this.findIndex +1;
                this.toMenu(this.findIndex);
            }
        }
    };

  findMenu = value => {
      if( !value) return;
      let entries = Object.entries(this.linkRefs);
      for( let [k, v] of entries){
          if(k.indexOf(value) !== -1){
              this.findMenuArray.push(v);
          }
      }
      this.toMenu(this.findIndex);
  };

  toMenu = (index)=>{
      let ref = this.findMenuArray[index];
      if(ref){
          let focusedDOM = ReactDOM.findDOMNode(ref);
          let menuDOM  = this.menuRef;
          let focusedRect = focusedDOM.getBoundingClientRect();
          let menuRect = menuDOM.getBoundingClientRect();
          if (focusedRect.bottom > menuRect.bottom || focusedRect.top < menuRect.top) {
              menuDOM.scrollTop = (focusedDOM.offsetTop + focusedDOM.clientHeight * 5 - menuDOM.offsetHeight);
          }
          this.setState({selectId: focusedDOM.id});
      }
  };

  cleanText(){
     this.setState({
      selectValue:'',
      heightLone:''
    });
  }

  componentDidMount(){
      if( !WebData.menuList){
          apiGet(API_FOODING_ES,'/menu/getTreeByLoginUser',{},(response)=>{
              WebData.menuList = response.data.children;
              this.setState({menuArray: response.data.children })
          },(error)=>{

          })
      } else {
          this.setState({menuArray: WebData.menuList})
      }
  }
  render() {
    let {actions} = this.props;
    return (
      <div>
        <Link onClick={this.openModal}><i className={"foddingicon fooding-menu_32"}></i></Link>
        <Modal
          isOpen={this.state.modalIsOpen}
          style={customStyles}
          contentLabel="Example Modal"
        >

        <div ref={rf => this.menuRef = rf} className="menu1 scroll tab-header"  style={{height:document.body.offsetHeight-160,width:document.body.offsetWidth-160}}>
                <h1 className ='title'>应用程序启动器</h1>
                 <div className='box-sousuo'>
                    <div className='sousuo'>
                      <i className='foddingicon fooding-search_32 search'></i>
                      <input type= 'text' placeholder ="查找应用程序或者项目"
                       className='input' onKeyDown={this.onKeyDown}
                      maxLength ={15} onChange ={this.change}  value={this.state.selectValue}/>
                      <i className='foddingicon fooding-clear yashi clear' onClick={this.cleanText.bind(this)}>
                        <span className='path1'/>
                        <span className='path2'/>
                      </i>
                    </div>
                </div>
                {/*<i className='foddingicon fooding-menu_delete_32 nav_01' onClick={this.closeModal}></i>*/}
                <i className='foddingicon fooding-clear nav_01 clear fooding-menu' onClick={this.closeModal}>
                    <span className='path1'/>
                    <span className='path2'/>
                </i>
                {
                  (this.state.menuArray || []).map((Pvalue,k)=>{
                    return (<ul key={k}>
                              <li><h2>{Pvalue.localName}</h2></li>
                              <li>
                                {
                                  Pvalue.children.map((value,i)=>{
                                    return (
                                      <div className="list" key={i}>
                                        <h3>{value.localName}</h3>
                                        <div>
                                            {
                                                value.children.map((v,j)=>{
                                                  let name =v;
                                                if(typeof(v)==='object')
                                                  name=v.localName;
                                                    let isFind = name.toLowerCase().indexOf(this.state.heightLone.toLowerCase())>-1 && this.state.heightLone !='';
                                                    let backgroundColor = this.state.selectId === v.id? "#c55151": '';
                                                    return (<Link id={v.id} ref={rf => this.linkRefs[name] = rf} key ={j}
                                                                className={isFind?"height-lone hh-radius":"hh-radius"} style={{backgroundColor}}
                                                                onClick= {()=>this.linkClick(v)}>{name}</Link>)
                                                })
                                            }
                                        </div>
                                      </div>
                                    )
                                  })
                                }
                              </li>
                          </ul>)
                  })
                }
        </div>
        </Modal>
      </div>
    );
  }
};

export default DialogHome;
