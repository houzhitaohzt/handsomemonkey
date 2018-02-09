import React, {PropTypes, Component} from 'react';
import Dropdown from '../../components/Dropdown';
import Menu, {Item as MenuItem} from '../../components/Menu';

export class ColorColumn extends Component {
    constructor(props) {
        super(props);
        this.emailSelect = this.emailSelect.bind(this);
        this.emailVisibleChange = this.emailVisibleChange.bind(this);
        let defaultValue = props.value;
        if (defaultValue == null) {
            defaultValue = 'foddingicon fooding-mail';
        }
        this.state = {color:
          defaultValue};
    }

    emailSelect(e) {
        e.domEvent.preventDefault();
        e.domEvent.stopPropagation();
        let {onSelect} = this.props;
        let color = e.key;
        this.setState({color: color}, ()=> {
            onSelect && onSelect(color, this.props.rowData, e);
        });
    }

    componentWillReceiveProps (props){
        if('value' in props){
            if(props.value !== this.state.color){
                this.setState({color: props.value});
            }
        }
    }

    emailVisibleChange(e) {
        let {emailVisibleChange} = this.props;
        if (emailVisibleChange) {
            emailVisibleChange(e);
        }
    }

    static propTypes = {
        onSelect: PropTypes.func,
        emailVisibleChange: PropTypes.func,
        trigger: PropTypes.array,
        dataIndex: PropTypes.string,
        rowData: PropTypes.object,
        colors: PropTypes.array,
        position: PropTypes.string,
        value: PropTypes.string,
    };

    static defaultProps = {
        onSelect(){
        },
        emailVisibleChange(){
        },
        trigger: ['click'],
        dataIndex: 'colorIndex',
        position: 'first',
        rowData: {},
        colors: [
            {color: 'foddingicon fooding-no-readly', className: 'foddingicon fooding-no-readly'},
            {color: 'foddingicon fooding-readly', className: 'foddingicon fooding-readly'},
            {color: 'foddingicon fooding-mail', className: 'foddingicon fooding-cross'}
        ]
    };

    render() {
        let {trigger, dataIndex} = this.props;
        let bgColor = this.state.color || "foddingicon fooding-mail";
        return (<Dropdown
            trigger={trigger}
            overlay={
                <Menu onSelect={this.emailSelect} style={{marginBottom:0}}>
                    {
                        this.props.colors.map((item, index) => (
                          <MenuItem className={item.className} style={{fontSize:'16px'}} key={item.color}></MenuItem>
                        ))
                    }
                </Menu>
            }
            animation="slide-up"
            emailVisibleChange={this.emailVisibleChange}
            overlayClassName='color-menu'
            destroyPopupOnHide={true}
        >
            <i  className={bgColor} style={{fontSize:'16px'}}></i>
        </Dropdown>)

    }

}

export default ColorColumn;
