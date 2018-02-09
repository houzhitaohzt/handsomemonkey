/**
 * 属性列表
 * @flow
 * @author tangzehua
 * @since 2018-02-01
 */
import React from 'react';
import { observer } from 'mobx-react';
import Collapse, {Panel} from 'rc-collapse';
import FieldTree from './FieldTree';
import BaseField from './BaseField';
import TableField from './TableField';

export default observer((props)=> {
    let store = props.store;
    return (
        <div className='rp-attributes'>
            <Collapse className='train-action-buttons rp-collapse' defaultActiveKey={'default'} accordion={true}>
                <Panel header="字段列表" headerClass='rp-collapse-panel' key='default' className='scroll rp-collapse-panel-c'>
                    <FieldTree store={store.fieldTree}/>
                </Panel>
                <Panel header="属性" headerClass='rp-collapse-panel' className='scroll rp-collapse-panel-c'>
                    <BaseField store={store.attr}>
                        <TableField store={store.tableAttr}/>
                    </BaseField>
                </Panel>
            </Collapse>
        </div>
    )
});
