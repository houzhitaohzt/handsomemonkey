import React,{Component} from 'react';


export default (props) => (
    <div style={{paddingTop: 0, width: '100%', textAlign: 'center', background: '#fff', paddingBottom: 150,
        height: document.body.offsetHeight, display: 'flex', justifyContent: 'center',   alignItems: 'center'}}>
        <img src={require('../../../styles/images/404.png')}/>
    </div>
)
