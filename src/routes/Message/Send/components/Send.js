import i18n from './../../../../lib/i18n';
import React,{Component, PropTypes} from "react";
import CheckBox from '../../../../components/CheckBox';
import Select, { Option }  from '../../../../components/Select';
import Tabs from "../../Tabs";
class Send extends Component{
  render(){
    return (<div className='message'>
        <Tabs />
        <div className='content' style={{height:document.body.offsetHeight-110}}>
             <div className='button'>
                <span style={{marginRight:10}}>{i18n.t(100431/*返回*/)}</span>
                <span style={{marginRight:10}}>{i18n.t(100437/*删除*/)}</span>
                <span style={{marginRight:10}}>{i18n.t(200750/*左*/)}</span>
                <span style={{marginLeft:0}}>{i18n.t(200751/*右*/)}</span>
             </div>
              <div className='content-two'>
                  <label style={{fontWeight:600}}>标题：</label>
                  <p style={{display:'inline-block',fontWeight: 600}}>1037正本单据</p>
              </div>
              <div>
              <label>发信人：</label>
              <span style={{backgroundColor: 'rgba(224, 218, 218, 0.57)',
                  padding:'0 5px',
                borderRadius: '15px',fontSize: '12px',border: '1px solid #a295f4',
                 lineHeight: '20px',display: 'inline-block'}}>info@noohle.com</span>
            </div>
            <div>
              <div className="form-group col-xs-12 col-md-12">
              <label className={'col-xs-1 col-md-1'} style={{paddingLeft:0}}>时间：</label>
              <div className={'col-xs-9 col-md-9'}>
                2016年10月18日 02：30（星期二）
              </div>
            </div>
            </div>
            <div className='row'>
              <div className="form-group col-xs-12 col-md-12">
                <label className={'col-xs-1 col-md-1'}>{i18n.t(200539/*发件人*/)+'：'}</label>
                <div className={'col-xs-9 col-md-9'}>
                  <span>{i18n.t(200752/*张三-上海弘昊化工有限公司*/)}</span>
                    <span style={{marginLeft:'20px',marginRight:'10px'}}>{i18n.t(200753/*重要级别*/)}</span>
                    <Select style={{width:'200px'}}>
                        <Option value={'2222'}>111</Option>
                    </Select>
                </div>
              </div>
            </div>
             <div className='row'>
                <div className="form-group col-xs-12 col-md-12">
                     <label className={'col-xs-1 col-md-1'}>内容：</label>
                </div>
             </div>
              <div className='row'>
                <div className="form-group col-xs-12 col-md-12">
                     <label className={'col-xs-1 col-md-1'}></label>
                     <div className={'col-xs-9 col-md-9'}>
                          <p>
                              dsklfjsdlkfjdsklfjdklsfjdklsfjdklsfjdklsfjdklsfjdklsfjdkls
                          </p>
                     </div>
                </div>
             </div>
          </div>
    </div>)
  }

}
export default Send;