
import React, {Component} from 'react';

import Tooltip from 'antd/lib/tooltip';
import xt from '../../common/xt';

export default class extends Component {

    onCopy = ()=>{
        let element = this._spanRef;
        if (element.hasAttribute('contenteditable')) element.focus();

        let selection = window.getSelection();
        let range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
        // let selectedText = selection.toString();
        try{
            document.execCommand('copy');
        } catch (e) {
            alert("Not supported copy!");
        }
    };

    overlayRender = () => {
        let {title} = this.props;
        return (
            <div className="card-toolip-context">
                <i onClick={this.onCopy} className="foddingicon card-toolip-copy" title ={'Copy'}/>
                <span ref={rf=>this._spanRef=rf}>{title}</span>
            </div>
        )
    };

    render () {
        return (
            <Tooltip {...this.props} overlay={this.overlayRender} mouseLeaveDelay={0.1}>
                {this.props.children}
            </Tooltip>
        )
    }
}