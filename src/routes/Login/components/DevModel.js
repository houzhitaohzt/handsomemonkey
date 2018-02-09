import i18n from './../../../lib/i18n';
/**
 * Created by iyimu on 2017/4/26.
 */

import React, {Component, PropTypes} from 'react';
import Select from 'react-select';
import WebData, {defaultPort, devLcPort} from '../../../common/WebData';
import Dialog from '../../../components/Dialog';

export default class DevModel extends Component {

        constructor(props) {
        super(props);

        this.state = {
            rpValue: WebData.foodingHostRpRUI,
            uri: WebData.foodingHostURI,
            host: WebData.foodingHostName,
            visible: false
        };
        let port = defaultPort ? ":" + defaultPort : '';
        this.locationList = [
            `192.168.1.33${port}`,
            `192.168.1.75${port}`,
            `192.168.1.86${port}`,
            `https://dev.noohle.com:7443`
        ];
        this.apiUri = {
            'fooding-erp': 'ERP',
            'fooding-ds': 'DS',
            'fooding-es': 'ES',
            'fooding_oa': 'OA',
            'fooding-mail': 'EMail',
            'noohle-message': 'Message',
            'fooding-workflow': 'WorkFlow'
        };
        if (this.locationList.indexOf(location.host) === -1
            && this.locationList.indexOf(location.origin) === -1) {
            this.locationList.push(location.host);
        }
    }

    componentDidMount() {
        window.addEventListener('keydown', this.onKeyEvent);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.onKeyEvent);
    }

    onKeyEvent = event =>{
        if(event.ctrlKey && event.shiftKey && event.altKey && event.keyCode === 68){
            this.setState({visible: true});

        }
    };

    onRpInput = (event) => {
        let rpValue = event.target.value;

        this.setState({rpValue});
    };

    onHost = host => {
        this.setState({host});
    };

    onUri = uri => {
        this.setState({uri});
    };

    onSave = ()=>{
        WebData.foodingHostRpRUI = this.state.rpValue;
        WebData.foodingHostName = this.state.host;
        WebData.foodingHostURI = this.state.uri;
        this.onChanel();
    };

    onChanel = ()=>{
        this.setState({visible: false});
    };

    render() {
        let {rpValue, uri, host} = this.state;
        return (
            <Dialog visible={this.state.visible} width={426} showHeader={false}>
                <div style={{background: '#7b0442', borderRadius: 4, padding: 10, margin: '-17px -17px -7px -17px'}}>
                    <div style={{paddingBottom: 6, textAlign: 'center'}}>
                        <Select
                            simpleValue
                            wrapperStyle={{width: 400}}
                            clearable={false} value={host}
                            onChange={this.onHost}
                            options={
                                this.locationList.map((da, di) =>
                                    ({label: da, value: da})
                                )
                            }
                        />
                    </div>
                    <div>
                        <Select
                            pageSize={7}
                            menuStyle={{maxHeight: 'initial'}}
                            menuContainerStyle={{maxHeight: 'initial'}}
                            simpleValue
                            wrapperStyle={{width: 197, marginRight: 3, display: 'inline-block'}}
                            value={uri} clearable={false}
                            onChange={this.onUri}
                            options={
                                Object.keys(this.apiUri).map((da, di) =>
                                    ({label: this.apiUri[da], value: da})
                                )
                            }
                        />
                        <div style={{
                            display: 'inline-block',
                            marginLeft: 3,
                            background: '#fff',
                            borderRadius: 3,
                            width: 197,
                            height: 36,
                            float: 'right'
                        }} className="Select-input">
                            <input type="text" disabled={!uri} style={{cursor: 'initial'}} value={rpValue} onChange={this.onRpInput}/>
                        </div>
                    </div>
                    <div style={{textAlign: 'center'}}>
                        <button type="button" className="btn btn-default" onClick={this.onSave}>
                            <span style={{padding: 10}}>{i18n.t(100430/*保存*/)}</span>
                        </button>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <button type="button" className="btn btn-default btn-add" onClick={this.onChanel}>
                            <span style={{padding: 10}}>{i18n.t(100461/*取消*/)}</span>
                        </button>
                    </div>
                </div>
            </Dialog>
        )
    }
}
