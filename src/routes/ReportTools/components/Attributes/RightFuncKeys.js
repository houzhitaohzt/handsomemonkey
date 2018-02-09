import React, {Component, PropTypes} from 'react';

export default (props)=> {

    let {iconArray, position, active} = props;
    let dom = iconArray.map((e, i) => {
        if ( active.indexOf(e.action) === -1 ) return null;
        return (
            <div className={'single'} key={i} onClick={props.handClick.bind(this, e.action)}>
                <i className={e.classn}/><span>{e.title}</span>
            </div>
        )
    });
    return (
        <div className={'right-func-keys'} style={{top: position.y + 'px', left: position.x + 'px'}}
             onBlur={props.onBlur} id={'rightfunckey'}
             tabIndex="-1">
            {dom}
        </div>
    )
};
