import React, {useState} from "react";
import {connect} from "react-redux";
import {API} from "../../../../globals/methods";
import IconButton from "@material-ui/core/IconButton/IconButton";
import SendIcon from "@material-ui/icons/Send";
import TextField from "@material-ui/core/TextField/TextField";
import Aux from "../../../../hoc/Aux";
import {withStyles} from "@material-ui/core";


const styles = theme => ({
    textField: {
        flex: 8
    },
    sendMessageButton: {
        marginLeft: "3vh",
        padding: 0
    }
});

const sendMessageComponent = (props) => {
    const [text, setText] = useState("");
    let messageTextField = React.createRef();

    function sendMessage() {
        let data = {
            "text": text
        };
        if (!props.receiver.isStation) {
            data['user_id'] = props.receiver.userId;
        }
        API.sendMessage({
            user: props.user,
            data: data
        });
        messageTextField.focus();
        setText("");
    }

    return (
        <Aux>
            <TextField
                id="standard-multiline-flexible"
                inputRef={(ref) => { messageTextField = ref; }}
                multiline
                rowsMax="4"
                className={props.classes.textField}
                margin="none"
                inputProps={{
                    value: text,
                    onChange: (event) => {
                        setText(event.target.value);
                        console.log(event.target.value);
                    },
                    onKeyPress: (event) => {
                        if (event.key === 'Enter' && !event.shiftKey) {
                            sendMessage();
                            if(event.preventDefault) event.preventDefault();
                            return false;
                        }
                    }
                }}
                autoFocus
            />
            <IconButton className={props.classes.sendMessageButton} onClick={() => {
                sendMessage()
            }}>
                <SendIcon/>
            </IconButton>
        </Aux>

    );
};

const mapStateToProps = state => {
    return {
        receiver: state.receiver,
        user: state.user,
    }
};

export default connect(mapStateToProps)(withStyles(styles)(sendMessageComponent))