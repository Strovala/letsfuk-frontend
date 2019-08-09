import React from "react";
import EnableNotificationsButton
    from "../../components/Buttons/EnableNotificationsButton";
import LogoutButton from "../../components/Buttons/LogoutButton";
import BottomNav from "../../components/BottomNav";
import ImageUploadPreview from "../../components/ImageUploadPreview";

export default (props) => (
    <div className="layout">
        <div className="layout__header">
            <h3 className="layout-heading">Settings</h3>
        </div>
        <div className="layout__content">
            <EnableNotificationsButton
                fullWidth
                variant="contained"
                color="primary"
            />
            <LogoutButton />
            <ImageUploadPreview />
        </div>
        <div className="layout__footer">
            <BottomNav />
        </div>
    </div>
)