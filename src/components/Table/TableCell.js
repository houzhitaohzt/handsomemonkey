import React, {PropTypes, Component} from 'react';
import objectPath from 'object-path';
import {ClipTip} from '../../components/Tip';
import xt from '../../common/xt';

export class TableCell extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    static propTypes = {
        // record: PropTypes.object,
        // prefixCls: PropTypes.string,
        // index: PropTypes.number,
        // indent: PropTypes.number,
        // indentSize: PropTypes.number,
        // column: PropTypes.object,
        // expandIcon: PropTypes.node
    };

    shouldComponentUpdate(props, state) {
        return xt.equalsObject(props, this.props);
    }

    isInvalidRenderCellText(text) {
        return text && !React.isValidElement(text) && Object
                .prototype
                .toString
                .call(text) === '[object Object]';
    }

    handleClick(e) {
        const {
            record, column: {
                onCellClick
            }
        } = this.props;
        if (onCellClick) {
            onCellClick(record, e);
        }
    }

    getTitle = dom => {
        if(React.isValidElement(dom)){
            return this.getTitle(dom.props.children);
        } else  return dom;
    };

    render() {
        const {
            record,
            indentSize,
            prefixCls,
            indent,
            index,
            expandIcon,
            column
        } = this.props;
        const {
            dataIndex,
            render,
            className = '',
            tooltip = true,
        } = column;

        let data = objectPath.get(record, dataIndex);
        let tdProps, colSpan, rowSpan, title, text = data, placement = "topLeft";

        if (render) {
            text = render(data, record, index);
            if (this.isInvalidRenderCellText(text)) {
                tdProps = text.props || {};
                rowSpan = tdProps.rowSpan;
                colSpan = tdProps.colSpan;
                text = text.children;
            }
            if(tooltip !== false){
                if(!xt.isFunction(tooltip)) {
                    title = this.getTitle(text);
                    title = (xt.isObject(title) || xt.isArray(title)) ? null : title;
                    if (xt.isString(tooltip)) placement = tooltip;
                } else {
                    title = tooltip(data, record, index);
                }
            }
        }
        if (this.isInvalidRenderCellText(text)) {
            text = null;
        }

        const indentText = expandIcon
            ? (<span
                style={{
                    paddingLeft: `${indentSize * indent}px`
                }}
                className={`${prefixCls}-indent indent-level-${indent}`}/>)
            : null;

        if (rowSpan === 0 || colSpan === 0) {
            return null;
        }
        return (
            <td
                colSpan={colSpan}
                rowSpan={rowSpan}
                className={className}
                onClick={(e) => this.handleClick(e)}>
                {indentText}
                {expandIcon}
                {
                    !title ? text : <ClipTip placement={placement} title={title} mouseEnterDelay={0.4}>{text}</ClipTip>
                }
            </td>
        );
    }
}

export default TableCell;

