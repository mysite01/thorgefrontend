import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:3443"; // Passe die URL deines Servers an

export interface Message {
    type: "join" | "leave";
    id: string; // Spieler-ID
    playerName: string; // Spielername
    teamId: string; // Team-ID
}

export const useSocketIO = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        const socketInstance = io(SOCKET_URL);
        setSocket(socketInstance);

        // Nachrichten vom Server empfangen
        socketInstance.on("message", (msg: Message) => {
            console.log("Message received:", msg); // Debugging
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    // Nachrichten senden
    const sendMessage = (event: string, data: any) => {
        if (socket) {
            socket.emit(event, data);
        }
    };

    return { socket, messages, sendMessage };
};
