import React, {Component, PropTypes} from "react";
import "../assets/index.less";
// upload
import Upload from 'antd/lib/upload';
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS, API_FOODING_OA} from '../../../../services/apiCall';
import ServiceTips, {errorTips} from "../../../../components/ServiceTips";
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
//引入弹层
import Dialog from "../../../../components/Dialog/Dialog";

import {I18n} from '../../../../lib/i18n';

class Picture extends Component {
    constructor(props) {
        super(props);
        this.handleResize = this.handleResize.bind(this);
        props.proPicture && props.proPicture(this);
        this.state = {
            scrollHeight: 0,
            fileList: [],
            businessId: this.props.businessId,
            businessType: this.props.businessType,
            showDilaog: false,
            dialogContent: <div></div>
        }
    }

    //每一次上传图片判断是否成功
    handleChange = (info, a, b) => {
        if (info.file.status === 'uploading') {

        }
        if (info.file.status === 'done') {
            let Fullpath = info.file.response.data[0].fullPath;
            this.initList();
            this.uploadDsPicture(Fullpath, 2)
        }
    }
    //初始化当前的值
    initList = () => {
        let that = this;
        apiGet(API_FOODING_OA, '/fastdfs/getList', {
            businessId: this.state.businessId,
            businessType: this.state.businessType
        }, response => {
            let fileList = response.data.data || [];
            that.setState({fileList: fileList})
        }, error => ServiceTips({text: error.message, type: 'error'}))
    }
    //上传之前,对图片的判断
    beforeUpload = (info) => {
        const isJPG = (info.type === 'image/jpeg' || info.type === 'image/png' || info.type === 'image/jpg' )
        if (!isJPG) {
            ServiceTips({text: I18n.t(400187/*只支持后缀名png,jpg,jpeg类型图片上传!*/), type: 'error'});
        }
        const isLt2M = info.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            ServiceTips({text: I18n.t(400188/*图片不能大于2M*/), type: 'error'});
        }
        return isJPG && isLt2M;
    }
    //删除某一张图片
    onDelClick = (obj, e) => {
        e.stopPropagation && e.stopPropagation();
        Confirm(I18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
            done: () => {
                this.delete(obj);
            },
            close: () => {
                console.log('no, close')
            }
        });

    }
    //传ds 图片
    uploadDsPicture = (imgUrl, flag) => {
        let { businessType } = this.state;
        let lefthost = businessType.split('--')[0];
        let aphost = "/" + lefthost + '/saveImgUrl';
        apiForm(API_FOODING_DS, aphost, {
            mtlId: this.state.businessId,
            flag: flag,
            imgUrl: imgUrl
        }, response => {
            //console.log(response.message)
        }, error => console.log(error.message))
    }
    //删除函数
    delete = obj => {
        let that = this;
        apiForm(API_FOODING_OA, '/fastdfs/delete', {id: obj.id}, response => {
            ServiceTips({text: response.message, type: 'success'});
            that.initList();
            that.uploadDsPicture(obj.fullPath, 0)
        }, error => ServiceTips({text: error.message, type: 'error'}))
    }
    //设置为默认
    onDefaultClick = (obj, e) => {
        e.stopPropagation && e.stopPropagation();
        let that = this;
        let uui = '/fastdfs/setDefault/' + obj.id;
        apiForm(API_FOODING_OA, uui, {
            businessType: this.state.businessType,
            businessId: this.state.businessId
        }, response => {
            that.initList();
            that.uploadDsPicture(obj.fullPath, 1)
        }, error => ServiceTips({text: error.message, type: 'error'}))
    }
    //预览图片
    onViewPirture = (obj, e) => {
        window.open(obj.fullPath);
        return false;
        // this.setState({
        //     showDilaog: true,
        //     dialogContent: <img src={decodeURIComponent(obj.fullPath)} style={{display: 'inline-block'}}/>
        // })
    }
    onClose = () => {
        this.setState({
            showDilaog: false
        })
    }

    handleResize(height) {
        let padding = 240;
        let sch = document.body.offsetHeight - height - padding;
        let scroll = sch - 135;
        this.setState({scrollHeight: sch + 'px', scroll: scroll});
    }

    componentDidMount() {
        if(!this.props.isDetail){
            this.initList();
        }
        this.handleResize(0);
        window.addEventListener('resize', this.handleResize);
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    componentWillReceiveProps(nextProps) {
        this.handleResize(0);
        window.addEventListener('resize', this.handleResize);
        if (this.props.businessId !== nextProps.businessId || this.props.businessType !== nextProps.businessType) {
            this.setState({
                businessId: nextProps.businessId,
                businessType: nextProps.businessType
            }, () => this.initList())
        }
    }

    render() {
        let that = this;
        const addUploadWJ = {
            name: 'file',
            action: API_FOODING_OA + '/fastdfs/upload',
            data: {
                businessType: this.state.businessType,
                businessId: this.state.businessId
            }
        };
        let domPicture = this.state.fileList.map((e, i) => {
            if (e.isDefaultFlag && e.isDefaultFlag == 1) {
                return (<div className={'picture-single'} key={i}>
                    <img src={decodeURIComponent(e.fullPath)} className={'picture-single-img'} onDragStart={() => {
                        return false;
                    }}/>
                    <div className={'picture-single-current'}>{I18n.t(400185/*当前默认*/)}</div>
                    <span className={'picture-single-del'} onClick={that.onDelClick.bind(that, e)}>x</span>
                    <span className={'picture-single-view'} onClick={that.onViewPirture.bind(that, e)}><i
                        className={'foddingicon fooding-preview'}
                        style={{fontSize: '12px'}}></i>{"  " + I18n.t(200087/*预览*/)}</span>
                </div>)
            } else {
                return (<div className={'picture-single'} key={i}>
                    <img src={decodeURIComponent(e.fullPath)} className={'picture-single-img'} onDragStart={() => {
                        return false;
                    }}/>
                    <div className={'picture-single-default'}
                         onClick={that.onDefaultClick.bind(that, e)}>{I18n.t(400186/*置为默认*/)}</div>
                    <span className={'picture-single-del'} onClick={that.onDelClick.bind(that, e)}>x</span>
                    <span className={'picture-single-view'} onClick={that.onViewPirture.bind(that, e)}><i
                        className={'foddingicon fooding-preview'}
                        style={{fontSize: '12px'}}></i>{"  " + I18n.t(200087/*预览*/)}</span>
                </div>)
            }

        })
        return (<div className={'product-picture'}>
            <div className={'product-picture-content scroll'} style={{height: this.state.scrollHeight}}>
                <Upload
                    {...addUploadWJ}
                    onChange={this.handleChange}
                    beforeUpload={this.beforeUpload}
                    showUploadList={false}
                >
                    <div className={'picture-single-add'}>
                        <p className={'picture-single-add-v'}></p>
                        <p className={'picture-single-add-h'}></p>
                    </div>
                </Upload>
                {domPicture}
            </div>
            <Dialog visible={this.state.showDilaog} showFooter={false} showHeader={false} isShowPicture={true}
                    onClose={this.onClose} showMask={true} width={'70%'}>
                {this.state.dialogContent}
            </Dialog>
        </div>)
    }
}

export default Picture;
