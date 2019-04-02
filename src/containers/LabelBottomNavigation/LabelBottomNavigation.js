import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import ChatIcon from '@material-ui/icons/Chat';
import SettingsIcon from '@material-ui/icons/Settings';

const styles = {
    root: {
        width: 300,
    },
};

class LabelBottomNavigation extends React.Component {
    state = {
        value: 'recents',
    };

    handleChange = (event, value) => {
        this.setState({ value });
    };

    render() {
        const { classes } = this.props;
        const { value } = this.state;

        return (
            <BottomNavigation value={value} onChange={this.handleChange} className={classes.root}>
                <BottomNavigationAction label="Chat" value="chat" icon={<ChatIcon />} />
                <BottomNavigationAction label="Group chat" value="question_answer" icon={<QuestionAnswerIcon />} />
                <BottomNavigationAction label="Settings" value="settings" icon={<SettingsIcon />} />
            </BottomNavigation>
        );
    }
}

LabelBottomNavigation.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LabelBottomNavigation);
