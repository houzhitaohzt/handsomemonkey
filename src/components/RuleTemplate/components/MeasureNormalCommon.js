import React, {Component, PropTypes} from 'react';
const {Table} = require("../../Table");
import MeasureCommonDialog from './MeasureCommonDialog';
import RightKey from '../../RightKey/RightKey';
import Morekeys from "./Morekeys";
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS} from "../../../services/apiCall";
import ServiceTips from '../../ServiceTips';

export class MeasureNormalCommon extends Component {
    constructor(props) {
        super(props);
        this.dataTable = null;
    }

    render() {
        let {array, title} = this.props;
        return (
            <div style={{
                width: '100%', backgroundColor: '#fff', borderRadius: '6px', zIndex: this.props.Zindex,
                boxShadow: '0px 2px 0px #dadada', marginBottom: 10, position: "relative"
            }} className='product-measurement'>
                <div>
                    <div className='item-title'>
                        <span className='title'>{title}</span>
                    </div>
                </div>
                <Table
                    ref={rf => this.dataTable = rf}
                    showHeader={this.props.showHeader}
                    columns={this.props.columns}
                    data={this.props.data}
                    singleSelect={this.props.singleSelect}
                    checkboxConfig={{ show: true, position: 'first' }}
                    colorFilterConfig={{show: false}}
                    followConfig={{show: false}}
                    scroll={{x: true, y: 0}}
                    onHeaderCellClick={this.onHeaderCellClick}
                    onRowClick={this.props.onRowClick}
                    onRowDoubleClick={this.props.onRowDoubleClick}
                    contextMenuConfig={{enable: false }}
                />
            </div>
        )
    }
}

export default MeasureNormalCommon;
MeasureNormalCommon.defaultProps = {
    onRowDoubleClick(){
    },
    onRowClick(){
    },
    singleSelect: true,
};
