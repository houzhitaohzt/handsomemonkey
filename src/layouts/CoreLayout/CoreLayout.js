import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Header from '../../components/Header';
import './CoreLayout.less';
import '../../styles/core.less';
import {browserHistory, Router, Route, IndexRoute, hashHistory, Link} from 'react-router';

export default class extends Component {

    static propTypes = {
        children: PropTypes.element.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            paddingTop: 80
        };
    }

    render() {
        return (
            <div className={'detail-layout__viewport'} style={{paddingTop: this.state.paddingTop}}>
                {this.props.children}
            </div>
        );
    }
}

