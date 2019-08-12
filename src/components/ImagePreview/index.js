import React, {useState} from 'react';
import './ImagePreview.scss';

export default (props) => {
    const [hideCloseClass, sethideCloseClass] = useState("image-preview__close--hide");
    return (
        <div className="image-preview" onClick={(event) => {
            if (hideCloseClass === "") {
                sethideCloseClass("image-preview__close--hide");
            } else {
                sethideCloseClass("");
            }
        }}>
            <div className={`image-preview__close ${hideCloseClass}`} onClick={(event) => {
                props.onClose(event)
            }}>
                <i className="fa fa-times"/>
            </div>
            <img alt="Preview" className="image-preview__img" src={props.imageSource}/>
        </div>
    )
}