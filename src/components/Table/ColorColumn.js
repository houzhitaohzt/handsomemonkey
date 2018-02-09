import React, {PropTypes, Component} from 'react';
import Dropdown from '../../components/Dropdown';
import Menu, {Item as MenuItem} from '../../components/Menu';

export class ColorColumn extends Component {
    constructor(props) {
        super(props);
        this.onSelect = this.onSelect.bind(this);
        this.onVisibleChange = this.onVisibleChange.bind(this);
        let defaultValue = props.value;
        if (defaultValue == null) {
            defaultValue = '';
        }
        this.state = {color: defaultValue};
    }

    onSelect(e) {
        e.domEvent.preventDefault();
        e.domEvent.stopPropagation();
        let {onSelect} = this.props;
        let color = e.key === 'transparent' ? '' : e.key;
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

    onVisibleChange(e) {
        let {onVisibleChange} = this.props;
        if (onVisibleChange) {
            onVisibleChange(e);
        }
    }

    static propTypes = {
        onSelect: PropTypes.func,
        onVisibleChange: PropTypes.func,
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
        onVisibleChange(){
        },
        trigger: ['click'],
        dataIndex: 'colorIndex',
        position: 'first',
        rowData: {},
        colors: [
            {color: '#ff001f', className: 'color-menu-item'},
            {color: '#e8a82c', className: 'color-menu-item'},
            {color: '#c030ef', className: 'color-menu-item'},
            {color: '#16c42b', className: 'color-menu-item'},
            {color: 'transparent', className: 'color-menu-item'},
        ]
    };

    render() {
        let {trigger, dataIndex} = this.props;
        let bgColor = this.state.color || "#fff";
        return (<Dropdown
            trigger={trigger}
            overlay={
                <Menu onSelect={this.onSelect}>
                    {
                        this.props.colors.map((item, index) => (<MenuItem key={item.color}><span className={item.className} style={{backgroundColor: item.color}}></span></MenuItem>))
                    }
                </Menu>
            }
            animation="slide-up"
            onVisibleChange={this.onVisibleChange}
            overlayClassName='color-menu'
            destroyPopupOnHide={true}
        >
            <button style={{backgroundColor: bgColor}} className={'btn btn-default btn-sm dropdown-toggle'}/>
        </Dropdown>)

    }

}

export default ColorColumn;

