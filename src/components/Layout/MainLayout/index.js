const styles = theme => ({
    chats: {
        borderTop: "1px solid",
        paddingTop: theme.spacing(2),
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        borderColor: "#aaa",
        flex: 1,
        height: "100%",
    },
    heading: {
        margin: theme.spacing(2)
    },
    paper: {
        marginTop: theme.spacing(2)
    },
    avatarGrid: {
        flex: 1,
        avatar: {
            cursor: "pointer",
        }
    },
    messagesGrid: {
        flex: 3,
    },
    timeGrid: {
        flex: 1,
        paddingRight: theme.spacing(2),
    }
});

export { styles };