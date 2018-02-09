import React from 'react';
import {observer} from 'mobx-react';
import Tree from '../../../../components/Tree';
import RightFuncKeys from "./RightFuncKeys";

/**
 * 字段列表树
 * @author tangzehua
 * @since 2018-01-12 11:08
 */
@observer
export default class extends React.Component {

    componentDidUpdate() {
        if (this.props.store.rightMenuVisible) {
            document.getElementById('rightfunckey').focus();
        }
    }

    render() {
        let that = this;
        let store = that.props.store;
        let {rightPos, rightMenu, activeRight} = store;

        let rightDom = store.rightMenuVisible ?
            <RightFuncKeys iconArray={rightMenu} position={rightPos} active={activeRight}
                           onBlur={store.onRightBlur} handClick={store.onRightMenuClick}/>
            : null;
        return (
            <div>
                {rightDom}
                <Tree
                    onSelect={store.onTreeSelect}
                    onRightClick={store.onTreeRightClick}
                    showIcon={false}
                    selectable={true}
                    checkable={false}
                    showSearch={true}
                    defaultExpandedKeys={['menu']}
                    gData={store.treeList}
                />
            </div>

        )
    }
}
