/**
 * 打印模板列表
 * @flow
 * @author tangzehua
 * @sine 2018-01-22 10:03
 */
import React from 'react';
import {observer} from 'mobx-react';
import {ReportListStore} from './../stores/ReportListStore';
import {PagingList} from './../../../components/Paging';
import ReportEdit from './ReportEdit';

export default class extends React.Component {

    constructor (props){
        super(props);
        this.store = new ReportListStore(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }

    render = () =>(
        <PagingList paging={this.store.paging}>
            <ReportEdit store={this.store.editStore}/>
        </PagingList>
    )
}
