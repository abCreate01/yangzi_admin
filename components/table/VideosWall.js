import React from 'react';
import MyConfig from '../../myConfig/MyConfig';
import { Upload, Icon, Modal, message, Button } from 'antd';
import reqwest from 'reqwest';

class VideosWall extends React.Component {
    state = {
        fileList: [],
        uploading: false,
        hasLoaded: false,

        position: "",
        isAdd: "",
    }

    componentDidMount() {
        this.setState({
            position: this.props.position,
            isAdd: this.props.isAdd
        })
    }

    handleUpload = () => {
        const { fileList, position, isAdd} = this.state;
        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append('fileName', file);
        });

        this.setState({
            uploading: true,
        });

        reqwest({
            url: MyConfig.UPLOAD_URL,
            method: 'post',
            processData: false,
            data: formData,
            success: (res) => {
                this.setState({
                    fileList: [],
                    uploading: false,
                    hasLoaded: true
                }, isAdd ? () => { this.props.onChange(MyConfig.API_PIC_URL + this.state.position + res.path) } :
                        () => { this.props.getVidUrl(MyConfig.API_PIC_URL + this.state.position + res.path) }
                );
                message.success('上传成功');
            },
            error: () => {
                this.setState({
                    uploading: false,
                });
                message.error('上传失败');
            },
        });
    }

    beforeUpload = (file) => {
        const isVideo = file.type.includes('video/mp4');
        if (!isVideo) {
            message.error('只能上传mp4视频！');
        }
        const isLt50M = file.size / 1024 / 1024 < 50;
        if (!isLt50M) {
            message.error('视频大于50MB!');
        }

        if (isVideo && isLt50M) {
            this.setState(({ fileList }) => ({
                fileList: [...fileList, file],
            }));
        }
        return false;
    }

    render() {
        const { uploading, fileList, hasLoaded} = this.state;
        const props = {
            action: MyConfig.UPLOAD_URL,
            onRemove: (file) => {
                this.setState(({ fileList }) => {
                    const index = fileList.indexOf(file);
                    const newFileList = fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: this.beforeUpload,
            fileList: fileList,
        };

        return (
            <div>
                <Upload {...props}>
                    <Button disabled={fileList.length === 1 || hasLoaded}>
                        <Icon type="upload" /> 选择文件
                    </Button>
                </Upload>
                <Button
                    className="upload-demo-start"
                    type="primary"
                    onClick={this.handleUpload}
                    disabled={fileList.length === 0 || hasLoaded}
                    loading={uploading}
                    >
                    {hasLoaded ? "已经上传" : uploading ? '正在上传' : '开始上传'}
                </Button>
            </div>
        );
    }
}

export default VideosWall;