/**
 *
 * @flow
 * @author tangzehua
 * @sine 2018-01-15 15:45
 */
import React from 'react';
import {observer} from 'mobx-react';
import {CellType} from './../../stores/Config';
import xt from '../../../../common/xt';

@observer
export default class extends React.Component {

    constructor(props) {
        super(props);
    }

    renderTypeSingle = (format) => {
        let that = this, dom = null, store = that.props.store;
        let defaultValue = store.attrData? store.attrData[format.key] : format.value;
        defaultValue = xt.isEmpty(defaultValue)? format.value: defaultValue;

        if(format.element === 'input'){
            dom = <input value={defaultValue} type={format.type} onChange={store.onAttrChange} name={format.key}/>
        } else if(format.element === 'select'){
            dom = (
                <select value={defaultValue} onChange={store.onAttrChange} name={format.key}>
                    {format.select.map(da => <option key={da.value} value={da.value}>{da.name}</option>)}
                </select>
            );
        }
        return (
            <div className={'rp-field-row'} key={format.name}>
                <label>{format.name}</label>
                {dom}
            </div>
        )
    };

    renderType = () => {
        let store = this.props.store;
        // if (!store.formatIndex) return;
        let dom = null, format = CellType[store.formatIndex].format;
        if (Array.isArray(format)) {
            dom = format.map(this.renderTypeSingle);
        } else {
            dom = this.renderTypeSingle(format);
        }
        return dom;
    };

    render = () => {
        let that = this;
        let store = that.props.store;
        if (store.value === null || store.value === null) return null;
        let cellType = CellType[store.formatIndex];
        return (
            <div>
                <div className={'rp-field-row'}>
                    <label>内容</label>
                    <textarea value={store.value} onChange={store.onValueChange} onBlur={store.onValueBlur} rows="3"/>
                </div>
                <div className={'rp-field-row'}>
                    <label>类型</label>
                    <select onChange={store.onCellTypeSelect} value={cellType.type}>
                        {CellType.map((da, index) => <option key={da.type} value={da.type}>{da.name}</option>)}
                    </select>
                </div>
                {that.renderType()}
                {that.props.children}
            </div>
        )
    };
}
