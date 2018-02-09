import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router';
import NavConnect from '../NavigateTabs/containers/AddContainer';
import Location from '../location/Container';
import xt from '../../common/xt';
import Loading from '../../components/Loading';
import WebData from '../../common/WebData';

class IFrame extends Component {
    static propTypes = {
        src: PropTypes.string,
        height: PropTypes.number,
    };

    static defaultProps = {
        src: null,
        height: 0,
    };

    constructor(props) {
        super(props);
        let url = decodeURIComponent(props.src || this.props.location.query.uri);

        this.state = {
            isLoading: true,
            src: this.convertArgs(url),
            scrollHeight: '200px'
        };
    }

    convertArgs = (url) =>{
        return xt.stringTm(url, {
            userId: WebData.user.data.id
        });
    };

    handleResize = () => {
        let sch = document.body.offsetHeight;
        let scroll = sch - 100;
        this.setState({scrollHeight: sch + 'px', scroll: scroll + 'px'});
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    onBindFunc = ()=> {
        try{
            this.frameRef.contentWindow.navTabs = window.navTabs;
            this.frameRef.contentWindow.emitter = window.emitter;
            this.frameRef.contentWindow.Tip = window.Tip;
            this.frameRef.contentWindow.userAuthority = xt.getItemValue(WebData.user, 'data.permissions');
        } catch (e) {
            console.log(e);
        }
    };

    onFrameLoad = ()=>{
        setTimeout(()=>{
            this.setState({isLoading: false});
        }, 500);
        try{
            emitter.emit("iFrameOnLoad");
        } catch(e){
            console.log(e)
        }
    };

    componentDidMount() {
        this.handleResize();
        this.onBindFunc();
        window.addEventListener('resize', this.handleResize);
    }

    shouldComponentUpdate(props, state) {
        return xt.equalsObject(state, this.state);
    }

    render() {
        let height = this.props.height || this.state.scrollHeight;
        return (
            <div className="contact-fluid">
                <Loading visible={this.state.isLoading}/>
                <iframe ref={rf => this.frameRef = rf} src={this.state.src} width={'100%'}
                        height={height} style={{border: '0px'}} onLoad={this.onFrameLoad}
                />
            </div>
        )
    }
}

export default NavConnect(Location(withRouter(IFrame)));
