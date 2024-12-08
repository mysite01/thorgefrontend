import React, { useState, useEffect } from "react";
import Cookies from "js-cookie"; // Importiere die Cookie-Bibliothek
import ProfileMenu from "../../utils/ProfielMenu"; // Profilmenu-Komponente

const ProfileDetail: React.FC = () => {
    const [storedIdOfUser, setIdOfUser] = useState<string>("");
    const [storedNickName, setNickName] = useState<string>("");

    // Beim Laden der Komponente: Cookies auslesen
    useEffect(() => {
        const cookieIdOfUser = Cookies.get("idOfUser");
        const cookieNickName = Cookies.get("nickName");

        // Wenn Cookies vorhanden sind, setze den Zustand
        if (cookieIdOfUser) {
            setIdOfUser(cookieIdOfUser);
        }
        if (cookieNickName) {
            setNickName(cookieNickName);
        }

        console.log("Cookies geladen:", { cookieIdOfUser, cookieNickName });
    }, []);

    return (

        <div style={{ padding: "1rem" }}>
            <div style={{ marginBottom: "1rem" }}>
                <ProfileMenu idOfUser={storedIdOfUser} nickName={storedNickName} />
            </div>

            <div className="card shadow mb-4" style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}>
                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 className="m-0 font-weight-bold text-primary">Profile Details</h6>
                </div>

                <div className="card-body">
                    <p><strong>User ID:</strong> {storedIdOfUser}</p>
                    <p><strong>Nickname:</strong> {storedNickName}</p>
                    <p><strong>Email:</strong> user@example.com</p>
                    <p><strong>Password:</strong> *******</p>
                </div>
            </div>
        </div>
    );
};

export default ProfileDetail;
