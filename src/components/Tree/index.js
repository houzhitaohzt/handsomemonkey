import React, {PropTypes} from 'react';
import Tree, {TreeNode} from 'rc-tree';
import classNames from 'classnames';
import xt from "../../common/xt";

function browser(navigator) {
    let tem;
    const ua = navigator.userAgent;
    let M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return `IE ${tem[1] || ''}`;
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
        if (tem) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    tem = ua.match(/version\/(\d+)/i);
    if (tem) {
        M.splice(1, 1, tem[1]);
    }
    return M.join(' ');
}

const browserUa = typeof window !== 'undefined' ? browser(window.navigator) : '';
const ieOrEdge = /.*(IE|Edge).+/.test(browserUa);
import './assets/index.less';

class CTreeNode extends TreeNode {
    constructor (props){
        super(props);
    }

    render() {
        const props = this.props;
        const prefixCls = props.prefixCls;
        const expandedState = props.expanded ? 'open' : 'close';
        let iconState = expandedState;

        let canRenderSwitcher = true;
        const content = props.title;
        let newChildren = this.renderChildren(props);
        if (!newChildren || newChildren === props.children) {
            // content = newChildren;
            newChildren = null;
            if (!props.loadData || props.isLeaf) {
                canRenderSwitcher = false;
                iconState = 'docu';
            }
        }
        // For performance, does't render children into dom when `!props.expanded` (move to Animate)
        // if (!props.expanded) {
        //   newChildren = null;
        // }

        let obtainIcon = props.obtainIcon;

        const iconEleCls = {
            [`${prefixCls}-iconEle`]: true,
            [`${prefixCls}-icon_loading`]: this.state.dataLoading,
            [`${prefixCls}-icon__${iconState}`]: true,
        };

        const selectHandle = () => {
            //const icon = (props.showIcon || props.loadData && this.state.dataLoading) ?
            const icon = props.showIcon ?
                <span className={classNames(iconEleCls)} style={{margin:"0 2px",verticalAlign: "text-bottom"}}>{xt.isFunction(obtainIcon) ? obtainIcon(props) : ""}</span> : null;
            const title = <span className={`${prefixCls}-title`}>{content}</span>;
            const wrap = `${prefixCls}-node-content-wrapper`;
            const domProps = {
                className: `${wrap} ${wrap}-${iconState === expandedState ? iconState : 'normal'}`,
            };
            if (!props.disabled) {
                if (props.selected || !props._dropTrigger && this.state.dragNodeHighlight) {
                    domProps.className += ` ${prefixCls}-node-selected`;
                }
                domProps.onClick = (e) => {
                    e.preventDefault();
                    if (props.selectable) {
                        this.onSelect();
                    }
                    // not fire check event
                    // if (props.checkable) {
                    //   this.onCheck();
                    // }
                };
                if (props.onRightClick) {
                    domProps.onContextMenu = this.onContextMenu;
                }
                if (props.onMouseEnter) {
                    domProps.onMouseEnter = this.onMouseEnter;
                }
                if (props.onMouseLeave) {
                    domProps.onMouseLeave = this.onMouseLeave;
                }
                if (props.draggable) {
                    domProps.className += ' draggable';
                    if (ieOrEdge) {
                        // ie bug!
                        domProps.href = '#';
                    }
                    domProps.draggable = true;
                    domProps['aria-grabbed'] = true;
                    domProps.onDragStart = this.onDragStart;
                }
            }
            return (
                <a ref="selectHandle" title={typeof content === 'string' ? content : ''} {...domProps}>
                    {icon}{title}
                </a>
            );
        };

        const liProps = {};
        if (props.draggable) {
            liProps.onDragEnter = this.onDragEnter;
            liProps.onDragOver = this.onDragOver;
            liProps.onDragLeave = this.onDragLeave;
            liProps.onDrop = this.onDrop;
            liProps.onDragEnd = this.onDragEnd;
        }

        let disabledCls = '';
        let dragOverCls = '';
        if (props.disabled) {
            disabledCls = `${prefixCls}-treenode-disabled`;
        } else if (props.dragOver) {
            dragOverCls = 'drag-over';
        } else if (props.dragOverGapTop) {
            dragOverCls = 'drag-over-gap-top';
        } else if (props.dragOverGapBottom) {
            dragOverCls = 'drag-over-gap-bottom';
        }

        const filterCls = props.filterTreeNode(this) ? 'filter-node' : '';

        const noopSwitcher = () => {
            const cls = {
                [`${prefixCls}-switcher`]: true,
                [`${prefixCls}-switcher-noop`]: true,
            };
            if (props.showLine) {
                cls[`${prefixCls}-center_docu`] = !props.last;
                cls[`${prefixCls}-bottom_docu`] = props.last;
            } else {
                cls[`${prefixCls}-noline_docu`] = true;
            }
            return <span className={classNames(cls)}></span>;
        };

        return (
            <li {...liProps} ref="li"
                className={classNames(props.className, disabledCls, dragOverCls, filterCls) }
            >
                {canRenderSwitcher ? this.renderSwitcher(props, expandedState) : noopSwitcher()}
                {props.checkable ? this.renderCheckbox(props) : null}
                {selectHandle()}
                {newChildren}
            </li>
        );
    }
}
const Demo = React.createClass({
    getInitialState() {
        this.filterKeys = [];
        return {
            visible: false,
            inputValue: '',
            sel: '',
            gData: this.props.gData,
            expandedKeys: [],
            autoExpandParent: true,
        };
    },
    onChange(event) {
        this.filterKeys = [];
        this.setState({
            inputValue: event.target.value,
        });
    },
    onVisibleChange(visible) {
        this.setState({
            visible,
        });
    },
    onSelect(selectedKeys, info) {
        // console.log('selected: ', info);
        this.props.onSelect(selectedKeys, info);
        this.setState({
            visible: false,
            sel: info.node.props.title,
        });
    },
    onDragStart(info) {
        // console.log('start', info);
    },
    onDragEnter(info) {
        // console.log('enter', info);
        this.setState({
            // expandedKeys: info.expandedKeys,
        });
    },
    onDrop(info) {
        if ( !this.props.onDrop(info)) return;
        const dropKey = info.node.props.eventKey;
        const dragKey = info.dragNode.props.eventKey;
        const loop = (data, key, callback) => {
            data.forEach((item, index, arr) => {
                if (item.id === key) {
                    return callback(item, index, arr);
                }
                if (item.children) {
                    return loop(item.children, key, callback);
                }
            });
        };
        const data = [...this.props.gData];
        let dragObj;
        loop(data, dragKey, (item, index, arr) => {
            arr.splice(index, 1);
            dragObj = item;
        });
        if (info.dropToGap) {
            let ar;
            let i;
            loop(data, dropKey, (item, index, arr) => {
                ar = arr;
                i = index;
            });
            ar.splice(i, 0, dragObj);
        } else {
            loop(data, dropKey, (item) => {
                item.children = item.children || [];
                // where to insert 示例添加到尾部，可以是随意位置
                item.children.push(dragObj);
            });
        }
        this.setState({
            gData: data,
            expandedKeys: info.rawExpandedKeys.concat([info.node.props.eventKey]),
        });
    },
    onExpand(expandedKeys) {
        this.filterKeys = undefined;
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    },
    filterTreeNode(treeNode) {
        // 根据 key 进行搜索，可以根据其他数据，如 value
        return this.filterFn(treeNode.props.title);
    },
    filterFn(key) {
        if (this.state.inputValue && key.toLowerCase().indexOf(this.state.inputValue.toLowerCase()) > -1) {
            return true;
        }
        return false;
    },
    render() {

        let {disableCheckboxParent=false} = this.props;

        const loop = (data, treeIndex = 0, parent) => {
            treeIndex ++;
            return data.map((item, index) => {
                let name =item.name;
                if(item.localName){
                    name = item.localName;
                }
                if (this.filterKeys && this.filterFn(name)) {
                    this.filterKeys.push(item.id);
                }
                if (item.children && item.children.length) {
                    return <CTreeNode key={item.id} title={name} label={item} subIndex={index} treeIndex={treeIndex} parent={parent} disableCheckbox={disableCheckboxParent} obtainIcon={this.props.obtainIcon}>
                        {loop(item.children, treeIndex, item)}
                    </CTreeNode>;
                }
                return <CTreeNode key={item.id || ''} title={name} label={item} subIndex={index} treeIndex={treeIndex} parent={parent} obtainIcon={this.props.obtainIcon}/>;
            });
        };
        let expandedKeys = this.state.expandedKeys;
        let autoExpandParent = this.state.autoExpandParent;
        if (this.filterKeys) {
            expandedKeys = this.filterKeys;
            autoExpandParent = true;
        }
        let props = {...this.props, };
        return (
            <div style={this.props.style} className={this.props.className}>
            {
                this.props.showSearch?
                    <input  value={this.state.inputValue} onChange={this.onChange} className={'rc-tree-filter-choosen'}/>
                    : null
            }

            <Tree
                expandedKeys={expandedKeys}
                onExpand={this.onExpand}
                {...this.props}
                autoExpandParent={autoExpandParent}
                onSelect={this.onSelect} filterTreeNode={this.filterTreeNode}
                onRightClick={this.props.onRightClick}
                draggable={this.props.draggable}
                onCheck={this.props.onCheck}
                onDragStart={this.onDragStart}
                onDragEnter={this.onDragEnter}
                onDrop={this.onDrop}
                showIcon={this.props.showIcon}
                selectable={true}
                checkStrictly={this.props.checkStrictly}
                checkedKeys={this.props.checkedKeys}
                checkable={this.props.checkable}
                loadData={this.props.onLoadData}
            >
                {loop(this.props.gData)}
            </Tree>
        </div>);
    },
});

export default Demo;
Demo.defaultProps = {
    showIcon:false,
    gData: [],
    showSearch: true,
    draggable: false,
    checkedKeys: [],
    checkStrictly: false,
    checkable: false,
    onSelect(){}
};

