import React, {PropTypes, Component} from "react";
import i18n from '../../../../lib/i18n';

import {getQueryString, apiGet, apiPost, apiForm, API_FOODING_MAIL, API_FOODING_DS, language, pageSize, sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';

import {availHeight,commonRow,commonAjax,NavBtnFunc} from "./Common.js"; // 公共库
import {FormWrapper} from '../../../../components/Form';

export default class Detail extends Component {

    constructor(props) {
        super(props);

        // init state
        this.state = {
            context: '', // 内容
            getOne:{}
        }
    }

	componentDidMount(){
		this.getPage();
    };
	componentWillUnmount() {
	}

    // closeHandle
    closeHandle = ()=>this.props.previewHandle(this,false);

    // getPage
    getPage = ()=>{
        let {row} = this.props;
        let that = this;

        apiGet(API_FOODING_MAIL,'/box/getOne',{mailId:row['id'],collectionName:row['collectName']},
            (response)=>{
                that.setState({
                    context: response.data['context'],
                    getOne:response.data

                });
            },(errors)=>{
                ServiceTips({text:errors.message,type:'error'});
        });
    }

    render(){
        let {context} = this.state;

        return <div>
            <FormWrapper showFooter={true} showSaveClose={false} onCancel={this.props.onCancel}>
                <div className="html-page scroll" dangerouslySetInnerHTML={{__html: context}}></div>
            </FormWrapper>
        </div>
    }

}
