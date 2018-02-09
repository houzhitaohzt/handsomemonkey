/**
 *
 * @flow
 * @author tangzehua
 * @sine 2017-10-13 15:18
 */
import React from 'react';

import ImConcatList from './ImConcatList';
import ImConcatContainer from './ImConcatContainer';
import WebData from '../../../../common/WebData';

import {API_FOODING_ES, API_FOODING_DS, API_FOODING_MESSAGE,apiGet, apiPost} from "../../../../services/apiCall";
import ServiceTips, {errorTips} from "../../../../components/ServiceTips";

import i18n from './../../../../lib/i18n';

export default class extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            selectMenu: null,
            menuAry:[]
        }
    }

    onMenuChange = (item)=> {
        if(item){
            this.setState({ selectMenu: item});
        } else {
            this.setState({ selectMenu: null});
        }
    };

    componentDidMount(){
        let that = this;
        let menuAry = [];
        (WebData.user.data.clusters || []).forEach( da => {
            //apiGet(API_FOODING_ES, '/party/getLoginCompanies', {clusId: da.id}, response => {
            let companyArr = (WebData.user.data.companies || []).filter( e => e.parentId === da.id);
            companyArr.forEach((da1,dai) => {
                    da1.icon = 'fooding-concat-merge-l',
                    da1.type =  "1--" + dai;
                });
                menuAry.push({
                    children : companyArr,
                    icon: 'fooding-company',
                    id: da.id,
                    type: 1,
                    localName: da.localName,
                });

            //}, error => console.log(error))
        });

        menuAry.push(
            {
                localName: i18n.t(700144/*最近联系人*/),
                icon: 'fooding-concat-now',
                type: 12,
            },
            {
                localName: i18n.t(500288/*我的群组*/),
                icon: 'fooding-concat-group',
                type: 13,
            }
        );

        that.setState({menuAry});
    }

    render() {
        let { main } = this.props;
        let { selectMenu } = this.state;
        let openMessage = main.openMessage;
        return (
            <div className='im-concat'>
                <ImConcatList menuAry={this.state.menuAry} onChange={this.onMenuChange}/>
                <ImConcatContainer item={selectMenu} openMessage={openMessage}/>
            </div>
        );
    }
}
