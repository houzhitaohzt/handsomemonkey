import React, {Component, PropTypes} from 'react';
import {createForm, FormWrapper} from '../../../../components/Form';
import Checkbox from '../../../../components/CheckBox';
import Tree from '../../../../components/Tree';
//引入ajax
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS} from '../../../../services/apiCall';
import {errorTips, successTips} from '../../../../components/ServiceTips';

export class AuthorityConfigDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gData: [],
            checkedKeys: [],
            checkedNames: [],
            expandedKeys: [],
            isChecked: false,
        };
        this.loadTreeIdMap = [];
    }

    //初始化树节点
    initTree() {
        let that = this;
        this.setState({isChecked: false});
        apiGet(API_FOODING_ES, '/party/getPartySyncTreeByLoginUser', null, (response) => {
            that.setState({gData: response.data || []}, () => this.setState({isChecked: true}));
        }, error => {
            errorTips(error.message);
        });
    }

    onTreeCheck = (keys, {checkedNodes}) => {
        let checkedKeys = [];
        checkedNodes.forEach(node => {
            checkedKeys.push(node.key);
        });
        this.setState({checkedKeys});
    };

    onTreeExpand = (expandedKeys, {node}) =>{
        let expand = children =>{
            if( !children) return;
            children.forEach(da => {
                expand(da.props.children);

                let ix;
                if( ( ix = expandedKeys.indexOf(da.key)) !== -1){
                    expandedKeys.splice(ix, 1);
                }
            });
        };
        expand(node.props.children);
        this.setState({expandedKeys});
    };

    requestAclParty = props => {
        apiGet(API_FOODING_ES, '/acl/getFormAclParty', {
            menuId: props.menuId, partyId: props.partyId
        }, response => {
            let expandedKeys = (response.data || []).map(da => da.id);
            let checkedNames = (response.data || []).map(da => da.localName);
            this.setState({checkedKeys: expandedKeys, expandedKeys, checkedNames});
        }, error => {
            this.setState({checkedKeys: [], expandedKeys: []});
            // errorTips(error.message);
        });
    };

    onSaveAndClose = () => {
        this.props.onSaveAndClose(3, this.state.checkedKeys);
    };

    componentDidMount() {
        this.initTree();
        this.requestAclParty(this.props);
    }

    componentWillReceiveProps(props) {
        if (props.menuId !== this.props.menuId || props.partyId !== this.props.partyId) {
            this.requestAclParty(props);
        }
    }

    onTreeSelect = (ids, {node}) =>{
        let {checkedKeys} = this.state;
        let treeId = node.props.eventKey;
        let ix = 0;
        if ( (ix = checkedKeys.indexOf(treeId)) === -1){
            checkedKeys.push(treeId)
        } else {
            checkedKeys.splice(ix, 1);
        }

        let select = children =>{
            if( !children) return;
            children.forEach(da => {
                select(da.props.children);

                let cix;
                if(ix !== -1){
                    if((cix = checkedKeys.indexOf(da.key)) !== -1){
                        checkedKeys.splice(cix, 1);
                    }
                } else {
                    checkedKeys.push(da.key);
                }
            });
        };
        select(node.props.children);
        this.setState({checkedKeys});
    };

    render() {
        return (
            <FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.props.onCancel}>
                <div className='action-normal-buttons'>
                    <div className="client-normal-add scroll">
                        <Tree
                            style={{display: 'inline-block'}}
                            showIcon={false}
                            selectable={true}
                            checkStrictly={true}
                            checkable={this.state.isChecked}
                            gData={this.state.gData}
                            checkedKeys={this.state.isChecked ? this.state.checkedKeys : undefined}
                            onCheck={this.onTreeCheck}
                            expandedKeys={this.state.expandedKeys}
                            onExpand={this.onTreeExpand}
                            onSelect={this.onTreeSelect}
                        >
                        </Tree>
                        <div style={{display: 'inline-block', float: 'right', width: 300}}>
                            {this.state.checkedNames.map((da, ix) => <li key={ix}>{da}</li>)}
                        </div>
                    </div>
                </div>
            </FormWrapper>
        );
    }
}

export default createForm()(AuthorityConfigDialog);
