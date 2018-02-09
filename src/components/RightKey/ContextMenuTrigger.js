import React, { Component, PropTypes } from 'react';
import cx from '../classnames';
import assign from 'object-assign';

import { showMenu, hideMenu } from './actions';
import { callIfExists, cssClasses } from './helpers';

export default class ContextMenuTrigger extends Component {
    constructor(props){
        super(props);
        this.dbClick=false;
    }
    static propTypes = {
        id: PropTypes.string.isRequired,
        attributes: PropTypes.object,
        collect: PropTypes.func,
        holdToDisplay: PropTypes.number,
        renderTag: PropTypes.node,
        onLeftMouse: PropTypes.bool
    };

    static defaultProps = {
        attributes: {},
        holdToDisplay: 1000,
        renderTag: 'div',
        onLeftMouse: false
    };


    handleMouseDown = (event) => {
        /*
        if (this.props.holdToDisplay >= 0 && event.button === 0) {
            event.persist();

            this.mouseDownTimeoutId = setTimeout(
                () => this.handleContextClick(event),
                this.props.holdToDisplay
            );
        }*/
    }

    handleMouseUp = (event) => {
        /*
        if (event.button === 0) {
            clearTimeout(this.mouseDownTimeoutId);
        }
        */
    }

    handleTouchstart = (event) => {
        if (this.props.holdToDisplay >= 0) {
            event.persist();

            this.touchstartTimeoutId = setTimeout(
                () => this.handleContextClick(event),
                this.props.holdToDisplay
            );
        }
    }

    handleTouchEnd = (event) => {
        event.preventDefault();
        clearTimeout(this.touchstartTimeoutId);
    }

    handleContextClick = (event) => {
        event.preventDefault();
        event.stopPropagation();

        const x = event.clientX || (event.touches && event.touches[0].pageX);
        const y = event.clientY || (event.touches && event.touches[0].pageY);

        hideMenu();

        showMenu({
            position: {x, y},
            target: this.elem,
            id: this.props.id,
            data: callIfExists(this.props.collect, this.props)
        });
    }
    handleClick=(event)=>{
        if(this.props.onLeftMouse) return this.handleContextClick(event);

        event.preventDefault();
        event.stopPropagation();

        //window.setTimeout(()=>{
        //if(!this.dbClick){
            if(this.props.onClick){
                this.props.onClick(event);
            }
        //}
    //},0)
    }
    handleDbClick=(event)=>{
        //this.dbClick=true;
        if(this.props.onDbClick){
            this.props.onDbClick(event);
        }
        //setTimeout(()=>{
        //    this.dbClick=false;
        //},0);
    }
    onMouseEnter=(event)=>{
        if(this.props.onMouseEnter){
            this.props.onMouseEnter(event);
        }
    }
    onMouseLeave=(event)=>{
        if(this.props.onMouseLeave){
            this.props.onMouseLeave(event);
        }
    }
    elemRef = (c) => {
        this.elem = c;
    }

    render() {
        const { renderTag, attributes, children } = this.props;
        const newAttrs = assign({}, attributes, {
            className: cx(cssClasses.menuWrapper, attributes.className),
            onContextMenu: this.handleContextClick,
            //onMouseDown: this.handleMouseDown,
            //onMouseUp: this.handleMouseUp,
            //onTouchStart: this.handleTouchstart,
            //onTouchEnd: this.handleTouchEnd,
            onMouseOut: this.handleMouseUp,
            onClick:this.handleClick,
            onDoubleClick:this.handleDbClick,
            onMouseEnter:this.onMouseEnter,
            onMouseLeave:this.onMouseLeave,
            ref: this.elemRef
            });

        return React.createElement(renderTag, newAttrs, children);
    }
}

