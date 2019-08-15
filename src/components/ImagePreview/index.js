import React, {useState} from 'react';
import './ImagePreview.scss';

export default (props) => {
    const [hideButtonsClass, sethideButtonsClass] = useState("");
    let imagePreviewSend = null;
    if (props.onSend)
        imagePreviewSend = (
            <div className="image-preview__send" onClick={(event) => {
                props.onSend(event);
                props.onClose();
            }}>
                <i className="fa fa-paper-plane"/>
            </div>
        );
    return (
        <div className={`image-preview ${hideButtonsClass}`} onClick={(event) => {
            if (hideButtonsClass === "") {
                sethideButtonsClass("image-preview--hide");
            } else {
                sethideButtonsClass("");
            }
        }}>
            <div className="image-preview__close" onClick={(event) => {
                props.onClose(event)
            }}>
                <i className="fa fa-times"/>
            </div>
            {imagePreviewSend}
            <img alt="Preview" className="image-preview__img" src={props.imageSource}/>
        </div>
    )
}