import {deepPurple} from "@material-ui/core/colors";

const styles = theme => ({
    chats: {
        borderTop: "1px solid",
        paddingTop: theme.spacing(2),
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        borderColor: "rgb(170,170,170, 0.7)",
        flex: 1,
        height: "100%",
    },
    heading: {
        margin: theme.spacing(2)
    },
    chatHeading: {
        borderBottom: "1px solid",
        paddingBottom: theme.spacing(2),
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        borderColor: "rgb(170,170,170, 0.7)",
    },
    paper: {
        marginTop: theme.spacing(2)
    },
    avatarGrid: {
        flex: 1,
    },
    avatar: {
        color: '#fff',
        backgroundColor: deepPurple[500],
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
    messagesGrid: {
        marginLeft: theme.spacing(1),
        flex: 4,
    },
    timeGrid: {
        flex: 1,
        paddingRight: theme.spacing(2),
    },
    gridList: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    }
});

export { styles };