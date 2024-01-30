import { ReactNode, useState, useEffect } from 'react';
import socket from 'src/connection/SocketIO';
import newUUID from 'src/helpers/newUUID';
import 'src/pages/styles/Match.css';

export default function Match() {
    const [squares, setSquares] = useState<ReactNode[]>([]);
    const [roomId, setRoomId] = useState<string>('');
    const [input, setInput] = useState({
        roomName: ''
    });

    useEffect(() => {
        socket.on('createAvatar', (room: any) => {
            console.log('quadrado');
            setSquares((prevState) => [...prevState, <div key={room.squareId} className="match-squares"/>]);
        });
    });

    const handleCreateAvatar = () => {
        const squareId = newUUID();
        // setSquares((prevState) => [...prevState, <div key={squareId} className="match-squares"/>]);

        const roomNewSquare = {
            roomId,
            roomName: input.roomName,
            squareId
        };

        socket.emit('createAvatar', roomNewSquare);
    };

    const handleCreateRoom = () => {
        const roomId = newUUID();

        setRoomId(roomId);

        const roomInfo = {
            roomId,
            roomName: input.roomName
        };

        socket.emit('join', roomInfo);
    };
    // Ajustar tipagem
    const handleRoomName = (event: any) => {
        const { name, value } = event.target;

        setInput({
            ...input,
            [name]: value
        })
    };

    return (
        <section className="match-page">
            <form className="match-items">
                <input
                    type="text"
                    name="roomName"
                    onChange={handleRoomName}
                />

                <button
                    onClick={handleCreateRoom}
                    type="button"
                >
                    Entrar na sala
                </button>
                <button
                    onClick={handleCreateAvatar}
                    type="button"
                >
                    Criar Avatar
                </button>

                <button>Excluir Avatar</button>
            </form>

            <div className="match-map">
                {squares}
            </div>
        </section>
    )
}
