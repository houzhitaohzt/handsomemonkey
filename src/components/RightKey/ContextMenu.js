import React, { Component, PropTypes } from 'react';

import listener from './globalEventListener';
import { hideMenu } from './actions';
import { cssClasses, callIfExists } from './helpers';
import xt from '../../common/xt';

export  class ContextMenu extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        onHide: PropTypes.func,
        onShow: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.state = {
            x: 0,
            y: 0,
            isVisible: false
        };
    }

    componentDidMount() {
        this.listenId = listener.register(this.handleShow, this.handleHide);
    }

    componentDidUpdate() {
        if (this.state.isVisible) {
            const wrapper = window.requestAnimationFrame || setTimeout;

            wrapper(() => {
                const {x, y} = this.state;

                const {top, left} = this.getMenuPosition(x, y);

                wrapper(() => {
                    this.menu.style.top = `${top}px`;
                    this.menu.style.left = `${left}px`;
                    this.menu.classList.add(cssClasses.menuVisible);
                });
            });
        } else {
            this.menu.classList.remove(cssClasses.menuVisible);
        }
    }

    componentWillUnmount() {
        if (this.listenId) {
            listener.unregister(this.listenId);
        }

        this.unregisterHandlers();
    }

    registerHandlers = () => {
        document.addEventListener('mousedown', this.handleOutsideClick);
        document.addEventListener('ontouchstart', this.handleOutsideClick);
        document.addEventListener('scroll', this.handleHide);
        document.addEventListener('contextmenu', this.handleHide);
        window.addEventListener('resize', this.handleHide);
    };

    unregisterHandlers = () => {
        document.removeEventListener('mousedown', this.handleOutsideClick);
        document.removeEventListener('ontouchstart', this.handleOutsideClick);
        document.removeEventListener('scroll', this.handleHide);
        document.removeEventListener('contextmenu', this.handleHide);
        window.removeEventListener('resize', this.handleHide);
    };

    handleShow = (e) => {
        if (e.detail.id !== this.props.id) return;

        const { x, y } = e.detail.position;

        this.setState({isVisible: true, x, y});
        this.registerHandlers();
        callIfExists(this.props.onShow, e);
    };

    handleHide = (e) => {
        this.unregisterHandlers();
        this.setState({isVisible: false});
        callIfExists(this.props.onHide, e);
    };

    handleOutsideClick = (e) => {
        if (!this.menu.contains(e.target)) hideMenu();
    };

    getMenuPosition = (x, y) => {
        const {scrollTop: scrollX, scrollLeft: scrollY} = document.documentElement;
        const { innerWidth, innerHeight } = window;
        const rect = this.menu.getBoundingClientRect();
        const menuStyles = {
            top: y + scrollY,
            left: x + scrollX
        };

        if (y + rect.height > innerHeight) {
            menuStyles.top -= rect.height;
        }

        if (x + rect.width > innerWidth) {
            menuStyles.left -= rect.width;
        }

        if (menuStyles.top < 0) {
            menuStyles.top = (rect.height < innerHeight) ? (innerHeight - rect.height) / 2 : 0;
        }

        if (menuStyles.left < 0) {
            menuStyles.left = (rect.width < innerWidth) ? (innerWidth - rect.width) / 2 : 0;
        }

        return menuStyles;
    };

    menuRef = (c) => {
        this.menu = c;
    };

    shouldComponentUpdate(props, state) {
        return true;// return xt.equalsObject(state, this.state) || props.children.length !== this.props.children.length;
    }

    render() {
        const { children } = this.props;
        const { top, left } = this.state;
        const style = Object.assign({position: 'fixed', top, left}, this.props.style || {});

        return (
            <nav ref={this.menuRef} style={style} className={cssClasses.menu}
                onContextMenu={this.handleHide}>
                {children}
            </nav>
        );
    }
}
export default ContextMenu;
