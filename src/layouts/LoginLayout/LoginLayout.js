import React from 'react'
import '../CoreLayout/CoreLayout.less'
import '../../styles/core.less'
import {emitter} from '../../common/EventEmitter';
import i18n from '../../lib/i18n';

export default class extends React.Component {

    constructor (props){
        super(props);

        this.state = {
            loading: true,
        };
    }

    componentDidMount() {
        i18n.on(this.refreshChildren);
    }

    componentWillUnmount() {
        i18n.off(this.refreshChildren);
    }

    refreshChildren = ()=>{
        if( !this.state.loading) {
            this.setState({loading: true}, ()=> {
                this.setState({loading: false});
            });
        } else {
            this.setState({loading: false});
        }
    };

    render(){
        return (
            <div className='container-body'>
                <div className='core-layout__viewport'>
                    {this.state.loading?null: this.props.children}
                </div>
            </div>
        )
    }
}

