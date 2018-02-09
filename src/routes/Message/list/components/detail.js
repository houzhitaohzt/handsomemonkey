import i18n from './../../../../lib/i18n';
import React, {Component} from "react";
import {FormWrapper} from "../../../../components/Form";
import Select, { Option }  from '../../../../components/Select';

export default class extends Component {

    onCancel = () => {
        const {onCancel} = this.props;
        if(onCancel){
            onCancel();
        }
    };

    render () {
        let {record} = this.props;
        return (
            <FormWrapper showFooter={true} showSaveClose={false} onCancel={this.onCancel}>
                <div style={{height: '320px'}}>
                    <div className="row message-row">
                        <div className="col-xs-6">
                            <label className="col-xs-2" style={{fontWeight:600}}>{i18n.t(200754/*发信人*/)}：</label>
                            <span style={{backgroundColor: 'rgba(224, 218, 218, 0.57)',
                                padding:'0 5px',
                                borderRadius: '15px',fontSize: '12px',border: '1px solid #a295f4',
                                lineHeight: '20px',display: 'inline-block'}}>{record.sentStaffName}</span>
                        </div>
                    </div>
                    <div className="row message-row">
                        <div className="col-xs-6" style={{color: '#888'}}>
                            <label className="col-xs-2" style={{fontWeight:600}}>{i18n.t(400104/*时间*/)}：</label>
                            <span>2016年10月18日 02：30（星期二）</span>
                        </div>
                    </div>
                    <div className='row message-row'>
                        <div className="form-group col-xs-5 col-md-5">
                            <label>{i18n.t(200539/*发件人*/)}：</label>
                            <span>{record.receivedStaffName}</span>
                        </div>
                        <div className={'col-xs-7 col-md-7'}>
                            <span style={{marginLeft:'20px',marginRight:'10px'}}>{i18n.t(200753/*重要级别*/)}</span>
                            <span>{record.level === '1' ? i18n.t(200768/*普通*/): '重要'}</span>
                        </div>
                    </div>
                    <div className='row message-row'>
                        <label className={'col-xs-1 col-md-1'}>{i18n.t(200041/*内容*/)}：</label>
                        <div className={'col-xs-9 col-md-9 context-dialog'}>
                            <div dangerouslySetInnerHTML={{__html: record.text}}/>
                        </div>
                    </div>
                </div>
            </FormWrapper>
        );
    }
}