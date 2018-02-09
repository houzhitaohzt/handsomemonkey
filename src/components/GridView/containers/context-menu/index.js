import * as React from "react";

// モデル情報
import Operation from "../../model/operation";
import Sheet from "../../model/sheet";
import Extension from "../../model/extension";

import "./index.less";


export default class ContextMenu extends React.Component {
    //const ContextMenu = React.createClass({
    static displayName = "React-Sheet-ContextMenu";

    render() {
        return (
            <div className="rs-context-menu">
                メニュー
                </div>
        );
    }
}
