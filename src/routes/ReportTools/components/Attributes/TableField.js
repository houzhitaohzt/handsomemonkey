/**
 * Table 组件属性
 * @flow
 * @author tangzehua
 * @sine 2018-01-15 15:45
 */
import React from 'react';
import {observer} from 'mobx-react';
import {CellType} from './../../stores/Config';
import BaseField from './BaseField';
import xt from '../../../../common/xt';

@observer
export default class extends React.Component {

    constructor(props) {
        super(props);
    }

    renderExp = ()=>{
        let store = this.props.store, cellMeta = store.cellMeta;
        if (cellMeta.expType){
            return (
                <div className={'rp-field-row'}>
                    <label>表达式&nbsp;&nbsp;&nbsp;
                        <a href={"javascript:void(0)"} onClick={store.onExpTypeChange} >(选择字段)</a>
                    </label>
                    <textarea value={cellMeta.expValue} onChange={store.onDomMetaChange} rows={3} name={'expValue'}/>
                </div>
            )
        } else {
            let options = store.getFieldList();
            return (
                <div className={'rp-field-row'}>
                    <label>字段名称&nbsp;&nbsp;&nbsp;
                        <a href={"javascript:void(0)"} onClick={store.onExpTypeChange}>(自定义)</a>
                    </label>
                    <select value={cellMeta.expSelectValue} onChange={store.onDomMetaChange} name={'expSelectValue'}>
                        <option value={''}/>
                        {options.map((da, index) => <option value={da.value} key={index}>{da.name}</option>)}
                    </select>
                </div>
            )
        }
    };

    render = () => {
        let that = this, store = that.props.store, cellMeta = store.cellMeta;
        if ( !store.visible ) return null;
        return (
            <div>
                {that.renderExp()}
            </div>
        )
    };
}
