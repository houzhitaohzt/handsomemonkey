/**
 * Created by iyimu on 2017/5/8.
 */

import React, {Component} from 'react';

import {NavTabsMenu} from '../NavigateTabs/containers/Container'

export default class NavigateControl extends Component {

    constructor (props){
        super(props);
    }

    render () {
        let {tabs, currentTab} = this.props;
        let {rightItemClick = ()=>{}, leftItemClick = ()=>{}, visible = true, navWidth = 0} = this.props;
        let dis = visible ? 'block' : 'none';
        return (
            <div>
                <div className="noselect" style={{ zIndex: 20, position: 'relative', float: 'left', marginTop: 'auto', marginBottom: 'auto',  textAlign: 'center',
                    background: '#eee', lineHeight: '38px', color:'#888', width: navWidth, display: dis, cursor: 'pointer', borderRight: '1px solid #ddd'}}
                     onClick={rightItemClick}>←</div>
                <div className="noselect" style={{position: 'absolute', marginTop: 'auto', marginBottom: 'auto', bottom:0, right:20, textAlign: 'center',
                    background: '#eee', lineHeight: '38px', color:'#888', width: navWidth, display: dis, cursor: 'pointer', borderLeft: '1px solid #ddd'}}
                     onClick={leftItemClick}>→</div>

                <NavTabsMenu tabs={tabs} currentTab={currentTab} style={{
                    position: 'absolute', marginTop: 'auto', marginBottom: 'auto', top:0, right:0, textAlign: 'center',
                    background: '#eee', lineHeight: '38px', color:'#888', width: navWidth, cursor: 'pointer'
                }}/>
            </div>
        )
    }
}