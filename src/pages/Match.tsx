import { useState, useEffect } from 'react';
import { socket } from 'src/socket';
import 'src/pages/styles/Match.css';

export function ConnectionState({ isConnected }: any): any {
    return <p>State: {'' + isConnected}</p>;
}

export function ConnectionManager() {
    function connect() {
        socket.connect();
    }

    function disconnect() {
        socket.disconnect();
    }

    return (
        <>
            <button onClick={connect}>Connect</button>
            <button onClick={disconnect}>Disconnect</button>
        </>
    );
}

export default function Match() {
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [roomId, setRoomId] = useState('');
    const [formValue, setFormValue] = useState('');
    const [avatarFormValue, setAvatarFormValue] = useState('Avatar');
    const [avatars, setAvatars] = useState<any[]>([]);

    useEffect(() => {
        function onConnect() {
            setIsConnected(true);
        }

        function onDisconnect() {
            setIsConnected(false);
        }

        function onJoinRoom({ objects, roomId }: any) {
            console.info('se juntou a uma sala');
            setAvatars(objects);
            setRoomId(roomId);
        }

        function onRoomNotFound(value: string) {
            setRoomId(value);
        }

        function onCreatedBox(value: any) {
            console.info('avatar ' + value.avatarName + ' criado');
            setAvatars((previous) => [...previous, value]);
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('Joined a room', onJoinRoom);
        socket.on('Room not found', onRoomNotFound);
        socket.on('Created a box', onCreatedBox);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('Joined a room', onJoinRoom);
            socket.off('Room not found', onRoomNotFound);
            socket.off('Created a box', onCreatedBox);
        };
    }, []);

    function handleJoinRoom(event: any) {
        event.preventDefault();

        socket.timeout(5000).emit('join', formValue, () => {});
    }
    const handleCreateAvatar = (event: any) => {
        event.preventDefault();

        socket.timeout(5000).emit('create-box', roomId, avatarFormValue, () => {});
    };

    return (
        <section className="match-page">
            <div className="match-items">
                <form onSubmit={handleJoinRoom}>
                    <input onChange={(e) => setFormValue(e.target.value)} placeholder="insira o id da sala" />

                    <button type="submit">Entrar na sala</button>
                </form>
                <form onSubmit={handleCreateAvatar}>
                    <input
                        onChange={(e) => setAvatarFormValue(e.target.value)}
                        placeholder="Nome do personagem"
                        value={avatarFormValue}
                    />

                    <button type="submit">Criar Avatar</button>
                </form>
                <button>Excluir Avatar</button>
            </div>

            <div className="App">
                <ConnectionState isConnected={isConnected} />
                <ConnectionManager />
            </div>

            <div>
                <p>{roomId}</p>
            </div>

            <div className="match-map">
                {avatars.map((avatar, index) => (
                    <div className="avatar" key={index}>
                        <p>
                            {avatar.avatarName} - {index}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}