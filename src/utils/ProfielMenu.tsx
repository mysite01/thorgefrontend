import React, { useState, useEffect } from "react";
import Pagination from "./PaginationProps"; // Deine Pagination-Komponente
import { useNavigate } from "react-router-dom";
import person from "../layout/image/person-vcard.svg";
import Cookies from "js-cookie"; // Importieren der Cookie-Bibliothek

interface Props {
    idOfUser: string;
    nickName: string;
}

const ProfileMenu: React.FC<Props> = ({ idOfUser, nickName }) => {
    const navigate = useNavigate();
    //const { idOfUser, nickName } = props;

    // Setzen der Benutzer-ID und des Nicknames in ein Session-Cookie
    useEffect(() => {
        if (idOfUser && nickName) {
            Cookies.set("idOfUser", idOfUser, { path: "/", sameSite: "Strict" });
            Cookies.set("nickName", nickName, { path: "/", sameSite: "Strict" });
            console.log("Cookies gesetzt:", { idOfUser, nickName });
        }
    }, [idOfUser, nickName]);

    const cards = [
        {
            id: "dashboard",
            title: "Dashboard",
            description: "Dashboard",
            icon: "fas fa-comments",
            color: "warning",
        },
        {
            id: "profile",
            title: "Your Profile (Edit)",
            description: `Name: ${nickName}`,
            icon: `${person}`,
            color: "primary",
        },
        {
            id: "history",
            title: "History (What did you do)",
            description: "as Host, as Player",
            icon: "fas fa-dollar-sign",
            color: "success",
        },
        {
            id: "tasks",
            title: "Tasks",
            description: "50% complete",
            icon: "fas fa-clipboard-list",
            color: "info",
        },
    ];

    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(4);
    const pageCount = Math.ceil(cards.length / itemsPerPage);
    const [showPagination, setShowPagination] = useState(false);

    useEffect(() => {
        const updateItemsPerPage = () => {
            if (window.innerWidth < 1024) {
                setItemsPerPage(1);
                setShowPagination(true);
            } else {
                setItemsPerPage(4);
                setShowPagination(false);
            }
        };

        updateItemsPerPage();
        window.addEventListener("resize", updateItemsPerPage);

        return () => window.removeEventListener("resize", updateItemsPerPage);
    }, []);

    const currentItems = cards.slice(
        currentPage * itemsPerPage,
        currentPage * itemsPerPage + itemsPerPage
    );

    const handlePageChange = (selectedItem: { selected: number }) => {
        setCurrentPage(selectedItem.selected);
    };

    // Navigieren zur Detailseite und Cookies lesen
    const handleCardClick = (cardId: string) => {
        // Cookies können gelesen werden, wenn sie benötigt werden
        const storedIdOfUser = Cookies.get("idOfUser");
        const storedNickName = Cookies.get("nickName");

        // Weiterleitung mit gespeicherten Daten
        navigate(`/details/${cardId}`, { state: { idOfUser: storedIdOfUser, nickName: storedNickName } });
    };

    return (
        <>
            {showPagination && (
                <div className="pagination-container">
                    <Pagination pageCount={pageCount} onPageChange={handlePageChange} />
                </div>
            )}

            <div className="row" style={{ marginLeft: "0.5rem", marginRight: "0.5rem" }}>
                {currentItems.map((card, index) => (
                    <div className="col-xl-3 col-md-6 mb-4" key={index}>
                        <div
                            className={`card border-left-${card.color} shadow h-100 py-2`}
                            onClick={() => handleCardClick(card.id)} // Cookies für den Benutzer verwenden
                            style={{ cursor: "pointer" }}
                        >
                            <div className="card-body">
                                <div className="row no-gutters align-items-center">
                                    <div className="col mr-2">
                                        <div
                                            className={`text-xs font-weight-bold text-${card.color} text-uppercase mb-1`}
                                        >
                                            {card.title}
                                        </div>
                                        <div className="h5 mb-0 font-weight-bold text-gray-800">
                                            {card.description}
                                        </div>
                                    </div>
                                    <div className="col-auto">
                                        <i
                                            className={`${card.icon} fa-2x text-gray-300`}
                                        ></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default ProfileMenu;
