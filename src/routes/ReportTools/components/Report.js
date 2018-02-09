import React, {Component} from 'react';
// ajax
import NavConnect from '../../../components/NavigateTabs/containers/AddContainer';

import {observer} from 'mobx-react';
import TopBar from './TopBar';
import Pager from './Pager';
import Attributes from './Attributes';
import '../assets/report.less';

import {ReportStore} from '../stores/ReportStore';

@observer
class Report extends Component {
    constructor(props) {
        super(props);

        this.reportStore = new ReportStore(props);
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
        this.handleResize();
        this.reportStore.loadExcelData();
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    handleResize = (e, height) => {
        let that = this;
        this.reportStore.filterHeight = height || this.reportStore.filterHeight || 40;
        let sch = document.body.offsetHeight - this.reportStore.filterHeight - 80;
        that.reportStore.setScrollHeight(sch + "px");
    };

    render() {
        let that = this;
        let store = that.reportStore;
        return (
            <div className='ReportContainer'>
                <TopBar store={store.topBar}/>
                <div className='rp-container' style={{height: store.scrollHeight}}>
                    <Pager store={store.pager}/>
                    <Attributes store={store.attribute}/>
                </div>
            </div>
        )
    }
}

export default NavConnect(Report);
