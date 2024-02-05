import { useState, useEffect } from 'react';
import { socket } from 'src/socket';
import { Rnd } from 'react-rnd';
import 'src/pages/styles/Match.css';
import newUUID from 'src/helpers/newUUID';

// Problema de renderização provavelmente tem origem no fato do emissor escutar seus próprios eventos.

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

        function onBoxResized(size: any, avatarName: any) {
            console.log('LISTEN')
            const avatarsList = [...avatars];

            console.log(size);
            console.log(avatarName);

            const avatarIndex = avatarsList.findIndex((avatar) => avatar.avatarName === avatarName);

            avatarsList[avatarIndex].size.width = size.width;
            avatarsList[avatarIndex].size.height = size.height;

            setAvatars(avatarsList);
        }

        function onBoxDeleted(avatarName: any) {
            console.log('LISTEN BOX')
            console.log(avatarName)
            const avatarsList = [...avatars];
            const newAvatars = avatarsList.filter((avatar) => avatar.avatarName !== avatarName);
            console.log(newAvatars);
            setAvatars(newAvatars);
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('Joined a room', onJoinRoom);
        socket.on('Room not found', onRoomNotFound);
        socket.on('Created a box', onCreatedBox);
        socket.on('Avatar Moved', onAvatarMoved);
        socket.on('Box Resized', onBoxResized);
        socket.on('Box Deleted', onBoxDeleted);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('Joined a room', onJoinRoom);
            socket.off('Room not found', onRoomNotFound);
            socket.off('Created a box', onCreatedBox);
            socket.off('Avatar Moved', onAvatarMoved);
            socket.off('Box Resized', onBoxResized);
            socket.off('Box Deleted', onBoxDeleted);
        };
    }, [avatars]);

    function handleJoinRoom(event: any) {
        event.preventDefault();
        socket.timeout(5000).emit('join', formValue, () => {});
        setUserId(newUUID());
    }
    const handleCreateAvatar = (event: any) => {
        event.preventDefault();
        socket.timeout(5000).emit(
            'create-box',
            roomId,
            avatarFormValue,
            userId,
            () => {}
        );
    };

    const handleStopMovement = (avatar: any, _e: any, ui: any) => {
        if (avatar.userId === userId)
            socket.timeout(5000).emit('move-box', roomId, avatar.avatarName, { x: ui.x, y: ui.y }, userId)
    }

    const handleResizeStop = (avatar: any, _e: any, ref: any) => {
        if (avatar.userId === userId)
            socket.emit('resize-box', roomId, avatar.avatarName, { width: ref.style.width, height: ref.style.height });
    }

    const handleDeleteAvatar = (avatar: any) => {
        if (avatar.userId !== userId) return;
        socket.emit('delete-box', roomId, avatar.avatarName);
    }

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
                {userId && <span>{userId}</span>}
                <ConnectionState isConnected={isConnected} />
                <ConnectionManager />
            </div>

            <div>
                <p>{roomId}</p>
            </div>

            <div className="match-map">
                {avatars.map((avatar, index) => {
                    return (
                        <Rnd
                            size={{ width: avatar.size.width, height: avatar.size.height }}
                            position={{ x: avatar.position.x, y: avatar.position.y }}
                            default={{ x: avatar.position.x, y: avatar.position.y, width: avatar.size.width, height: avatar.size.height  }}
                            onDragStop={(e, ui) => handleStopMovement(avatar, e, ui)}
                            bounds="parent"
                            onResizeStop={(e, _direction, ref, _delta, _position) => handleResizeStop(avatar, e, ref)}
                        >
                            <div className="avatar">
                                <button
                                    type="button"
                                    onClick={() => handleDeleteAvatar(avatar)}
                                >
                                    X
                                </button>
                                <p>
                                    {avatar.avatarName} - {index}
                                </p>
                            </div>
                        </Rnd>
                            // <Draggable
                            //     key={index}
                            //     defaultPosition={{ x: avatar.position.x, y: avatar.position.y }}
                            //     position={{ x: avatar.position.x, y: avatar.position.y }}
                            //     onStart={() => handleStartMovement(avatar)}
                            //     onStop={(e, ui) => handleStopMovement(avatar, e, ui)}
                            // >
                                // <Resizable
                                //     height={avatar.size.height}
                                //     width={avatar.size.width}
                                //     onResize={() => handleResize(avatar)}
                                //     onResizeStop={handleResizeStop}
                                // >
                                    
                                // </Resizable>
                            // </Draggable>
                    )
                })}
            </div>
        </section>
    );
}