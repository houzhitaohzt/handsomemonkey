
import React from 'react';

import {getQueryString} from '../../services/apiCall';


// 嵌入页面 
import StatementHTML from "./StatementHTML";  // 全局- 报表切换


/**
 * 通用界面
 */
export default class Currency extends  React.Component {

	constructor(props){
		super(props);

	}



    render () {
        let statementAction = getQueryString('BI'); // 控制- 报表页面


        return (
            <div>
                { statementAction == 'true' ? <StatementHTML />:'' }
            </div>
        )
    }
}
