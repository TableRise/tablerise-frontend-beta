import { useState, useEffect } from 'react';
import { socket } from 'src/socket';
import Draggable from 'react-draggable';
import 'src/pages/styles/Match.css';
import newUUID from 'src/helpers/newUUID';

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
    const [userId, setUserId] = useState('');

    useEffect(() => {
        function onConnect() {
            setIsConnected(true);
        }

        function onDisconnect() {
            setAvatars([]);
            setIsConnected(false);
        }

        function onJoinRoom({ objects, roomId }: any) {
            setAvatars(objects);
            setRoomId(roomId);
        }

        function onRoomNotFound(value: string) {
            setRoomId(value);
        }

        function onCreatedBox(value: any) {
            setAvatars((previous) => [...previous, value]);
        }

        function onAvatarMoved(x: any, y: any, avatarName: any) {
            const avatarsList = [...avatars];

            const avatarIndex = avatarsList.findIndex((avatar) => avatar.avatarName === avatarName);

            avatarsList[avatarIndex].position.x = x;
            avatarsList[avatarIndex].position.y = y;

            setAvatars(avatarsList);
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('Joined a room', onJoinRoom);
        socket.on('Room not found', onRoomNotFound);
        socket.on('Created a box', onCreatedBox);
        socket.on('Avatar Moved', onAvatarMoved);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('Joined a room', onJoinRoom);
            socket.off('Room not found', onRoomNotFound);
            socket.off('Created a box', onCreatedBox);
            socket.off('Avatar Moved', onAvatarMoved);
        };
    }, [avatars]);

    function handleJoinRoom(event: any) {
        event.preventDefault();
        socket.timeout(5000).emit('join', formValue, () => {});
        setUserId(newUUID());
    }
    const handleCreateAvatar = (event: any) => {
        event.preventDefault();
        socket.timeout(5000).emit('create-box', roomId, avatarFormValue, userId, () => {});
    };

    const handleStopMovement = (avatar: any, e: any, ui: any) => {
        console.log(e);
        socket.timeout(5000).emit('move-box', roomId, avatar.avatarName, { x: ui.x, y: ui.y }, userId)
    }

    const handleStartMovement = (avatar: any) => {
        if (avatar.userId !== userId) {
            return false;
        }
    }

    // const handleRoleInput = (event: any) => {
    //     const { value } = event.target;
    //     setUserRole(value);
    // }

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
                {/* <input type="text" value={userRole} onChange={handleRoleInput} disabled={userId ? true : false}/> */}
                <button>Excluir Avatar</button>
            </div>

            <div className="App">
                {userId && <span>{userId}</span>}
                <ConnectionState isConnected={isConnected} />
                <ConnectionManager />
            </div>

            <div>
                <p>{roomId}</p>
            </div>

            <div className="match-map">
                {avatars.map((avatar, index) => {
                    return (<Draggable
                        key={index}
                        defaultPosition={{ x: avatar.position.x, y: avatar.position.y }}
                        position={{ x: avatar.position.x, y: avatar.position.y }}
                        onStart={() => handleStartMovement(avatar)}
                        onStop={(e, ui) => handleStopMovement(avatar, e, ui)}
                    >
                        <div className="avatar">
                            <p>
                                {avatar.avatarName} - {index}
                            </p>
                        </div>
                    </Draggable>)
                })}
            </div>
        </section>
    );
}