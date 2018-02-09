/**
 * 纸张界面
 * @flow
 * @author tangzehua
 * @since 2018-02-01
 */
import React from 'react';
import {observer} from 'mobx-react';
import HotTable from '../../../components/handsontable';


export default observer((props)=> {
    let {style, store} = props;
    let size = {
        width: store.pagerSetting.width + 60,
        height: store.pagerSetting.height + 60,
    };
    return (
        <div className='rp-pager scroll' style={{...style}}>
            <div className='rp-pager-wc'>
                <div className='rp-pager-c' style={{width: size.width + "px", height: size.height + 'px'}}>
                    { store.isLoading ? null : <HotTable settings={store.hotSetting} ref={store.setHotTable}/> }
                </div>
            </div>
        </div>
    )
})
