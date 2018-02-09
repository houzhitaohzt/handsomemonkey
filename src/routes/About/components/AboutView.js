import i18n from './../../../lib/i18n';
import React from 'react'
import DuckImage from '../assets/Duck.jpg'
import './AboutView.less'
import '../../../styles/font.less'

import Dialog from '../../../components/Dialog/Dialog';
import AboutForm from './AboutForm';
import Confirm from '../../../components/Dialog/Confirm'
import SwitchContainer from '../../../containers/loc/SwitchContainer';
import AboutDemo from './PureComponent';
// import LoadingEl from '../../../components/Loading';
import Table from "../../../components/Table";//Table表格

// import ReactSummernote from '../../../../components/Summernote/components/react-summernote';
// import 'react-summernote/dist/react-summernote.css'; // import styles
// import 'react-summernote/lang/summernote-ru-RU'; // you can import any other locale

// Import bootstrap(v3 or v4) dependencies


export class AboutView extends React.Component{
  constructor(props){
    super(props);  
    this.state={
      rodalShow:false
    }
    this.closeClick=this.closeClick.bind(this);
    this.emailSelect = this.emailSelect.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onImageUpload = this.onImageUpload.bind(this);
    this.accessoryHeaderSelect = this.accessoryHeaderSelect.bind(this);
    this.emailHeaderSelect = this.emailHeaderSelect.bind(this);

    this.encodeReg = this.encodeReg.bind(this);
  }
  encodeReg(source) {
        return String(source).replace(/([.*+?^=!:${}()|[\]/\\])/g,'\\$1');
  }
  componentDidMount(){
      var str= '<p class="MsoNormal"><span style="color:#1F497D"><img width="80" height="40" id="_x0000_i1034" ' +
          'src="cid:image001.png@01D33076.7236BB20" ' +
          'alt="cid:image001.png@01CFF2BC.C549DF40"></span><span style="color:#1F497D"><o:p></o:p></span></p>\n' +
          '<p class="MsoNormal"><span style="color:#1F497D"><img border="0" width="390" height="72" id="_x0000_i1033" ' +
          'src="cid:image002.jpg@01D33076.7236BB20" alt="Anuga | \n' +
          '"><o:p></o:p></span></p>';
      var s=str.match(/<img[^<>]*\s*src=\"([^\"]*?)\"[^>]*>/gi);
      // var s2=str.split(/\<img\s*src=\"([^\"]*?)\"[^>]*>/gi);
      //document.write(s);

      for(var i= 0;i<s.length;i++)
      {
          // console.log(s[i]);
          // console.log('<br/>');
          // console.log(RegExp.$1);
      }

      var reg = /<img[^>]*src[=\'\"\s]+([^\"\']*)[\"\']?[^>]*>/gi;
     // var str = '<p><img alt=\"\" src=\"/uploads/ckeditor/pictures/7/content_1234594100532399625.jpg\" style=\"width: 700px; height: 560px;\" />132<img alt=\"\" src=\"/uploads/ckeditor/pictures/8/content_1901904_140154707195_2.jpg\" style=\"width: 800px; height: 531px;\" /></p>\r\n';
      while (reg.exec(str))
      {
          console.log(RegExp.$1);
      }
  }
  emailHeaderSelect(color, rowData, e){
  }
  onImageUpload(img){
    //插入模板
    // var node = document.createElement('div');
    // node.innerHTML='<span>786867867867</span>';
    // ReactSummernote.insertNode(node);
  }
  accessoryHeaderSelect(color, rowData, e){

  }
  emailSelect(record, index, isFol){
    console.log(record, index, isFol);
  }
  closeClick(){
    this.setState({rodalShow:!this.state.rodalShow});
  }
  show () {
        Confirm('Are you sure?', {
  done: () => {
    console.log('ok, got it');
  },
});
    }
    hide () {

    }
    onChange(content) {
    console.log('onChange', content);
  }
  render(){
    let that = this;
    return (
  <div>
    <div style={{width:'1000px'}}>
    </div>

    <Table
        ref = 'booking'
      data={[{},{}]}
      columns={[	{
    			title : i18n.t(400048/*单据编号*/),
    			dataIndex : 'no',
    			key : "no",
    			render(data,row ,index){
    				return <div>{data}</div>
    			}
    		},
    		{
    			title : i18n.t(400008/*销售单号*/),
    			dataIndex : "sourceNo",
    			key : "sourceNo",
                width: 1000,
    			render(data,row,index){
    				return (<div className="text-ellipsis mail-hover" title={data}>{data}</div>)
    			}
    		}]}
      checkboxConfig={{show:true,checkedAll:false,checkedRows:[],position:'first'}}
      emailFilterConfig={{show : true,dataIndex:'emailType',emailSelect:this.emailSelect,
      emailHeaderSelect:this.emailHeaderSelect}}
      colorFilterConfig={{show : true,dataIndex:'colorType'}}
      accessoryConfig={{show : true,dataIndex:'accessoryType',
    accessoryHeaderSelect:this.accessoryHeaderSelect}}
      followConfig={{show:true}}
      scroll={{x:true,y:this.state.scroll}}
      onRowDoubleClick={this.onRowDoubleClick}
    />
    <img
      alt='This is a about web site, because Redux!'
      className='duck'
      src={DuckImage} />
      <div>
        <AboutDemo title='abcde' children={null} />
      </div>
      <div>
      <label >{i18n.t(200264/*文件上传*/)}</label>
      <input type="file" name="file_upload" title={i18n.t(200264/*文件上传*/)} style={{opacity: 0,position:'absolute',zIndex:'2'}} />
      </div>
      <div>
        <i className='fi-view'></i>
      </div>
      {
      <Dialog visible={false} titleLeft={i18n.t(200263/*添加*/)} showHeader={true} showFooter={false}>
        <AboutForm onChange={this.props.onChange} onSaveAndClose={this.closeClick} onCancel={this.closeClick} />
      </Dialog>
      }
      {
        <Dialog visible={this.state.rodalShow} titleLeft={i18n.t(200263/*添加*/)} showHeader={true} showFooter={false}>
          <SwitchContainer />
        </Dialog>
      }
  </div>
  )}
}
export default AboutView;
