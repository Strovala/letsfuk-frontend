import React, {Component} from "react";
import {API} from "../../globals/methods";
import {connect} from "react-redux";
import Button from '../Button';
import './ImageUploadPreview.scss';

import Resizer from 'react-image-file-resizer';
import {AxiosInstance as axios} from "axios";

class UploadImagePreview extends Component {
    state = {
        file: null,
        imageBinary: null,
        previewStyle: null
    };

    componentDidMount() {
        API.whoAmI({
            response: response => {
                API.getPhotoUrl({
                    user: this.props.user,
                    data: {
                        key: response.data.user.avatarKey
                    }
                })
                    .then(response => {
                        console.log(response);
                        this.setState({
                            previewStyle: {
                                backgroundImage: `url(${response.data.url})`
                            }
                        })
                    })
            }
        });
    }

    handleChange(event) {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            Resizer.imageFileResizer(
                file,
                300,
                300,
                'JPEG',
                100,
                0,
                uri => {
                    console.log(uri);
                    this.setState({
                        previewStyle: {
                            backgroundImage: `url(${uri})`
                        }
                    });
                    const buf = new Buffer(uri.replace(/^data:image\/\w+;base64,/, ""),'base64');

                    this.setState({
                        file: buf
                    })
                },
                "base64"
            );
            // const reader = new FileReader();
            // reader.onload = (event) => {
            //     this.setState({
            //         previewStyle: {
            //             backgroundImage: `url(${event.target.result})`
            //         }
            //     });
            // };
            // reader.readAsDataURL(file);
            // this.setState({
            //     file: file
            // })
        }
    }

    handleClick(event) {
        if (this.state.file) {
            // const reader = new FileReader();
            // reader.onload = (event) => {
            //     const imageBinary = event.target.result;
            //     this.setState({
            //         imageBinary: imageBinary
            //     });
            //     API.uploadPhoto({
            //         user: this.props.user,
            //         data: imageBinary
            //     })
            // };
            // reader.readAsArrayBuffer(this.state.file);
            API.uploadPhoto({
                user: this.props.user,
                data: this.state.file
            })
        }
    }

    render() {
        return (
            <div>
                <div className="avatar-upload">
                    <div className="avatar-edit">
                        <input type="file" id="imageUpload" accept="image/*" onChange={(event) => this.handleChange(event)}/>
                        <label htmlFor="imageUpload"/>
                    </div>
                    <div className="avatar-preview">
                        <div id="imagePreview" style={this.state.previewStyle}>
                        </div>
                    </div>
                    <Button className="avatar-button" onClick={() => this.handleClick()} >Update</Button>
                </div>
            </div>
        );
    }
}


const mapStateToProps = state => {
    return {
        user: state.user
    }
};

export default connect(mapStateToProps)(UploadImagePreview);
