import { useState, useEffect, useCallback } from 'react';
import { socket } from 'src/socket';
import { Rnd } from 'react-rnd';
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
    const [bgImg, setBgImg] = useState('');

    const onConnect = useCallback(() => {
        setIsConnected(true);
    }, []);

    const onDisconnect = useCallback(() => {
        setAvatars([]);
        setIsConnected(false);
    }, []);

    const onJoinRoom = useCallback(({ objects, roomId }: any) => {
        setAvatars(objects);
        setRoomId(roomId);
    }, []);

    const onRoomNotFound = useCallback((value: string) => {
        setRoomId(value);
    }, []);

    const onCreatedBox = useCallback((value: any) => {
        setAvatars((previous) => [...previous, value]);
    }, []);

    const onAvatarMoved = useCallback((x: any, y: any, avatarName: any) => {
        const avatarsList = [...avatars];

        const avatarIndex = avatarsList.findIndex((avatar) => avatar.avatarName === avatarName);

        avatarsList[avatarIndex].position.x = x;
        avatarsList[avatarIndex].position.y = y;

        setAvatars(avatarsList);
    }, [avatars]);

    const onBoxResized = useCallback((size: any, avatarName: any) => {
        const avatarsList = [...avatars];

        const avatarIndex = avatarsList.findIndex((avatar) => avatar.avatarName === avatarName);

        avatarsList[avatarIndex].size.width = size.width;
        avatarsList[avatarIndex].size.height = size.height;

        setAvatars(avatarsList);
    }, [avatars]);

    const onBoxDeleted = useCallback((avatarName: any) => {
        const avatarsList = [...avatars];
        const newAvatars = avatarsList.filter((avatar) => avatar.avatarName !== avatarName);
        setAvatars(newAvatars);
    }, [avatars]);

    const onUploadPicture = useCallback((avatarName: any, imageLink: any) => {
        const avatarsList = [...avatars];

        const avatarIndex = avatarsList.findIndex((avatar) => avatar.avatarName === avatarName);

        avatarsList[avatarIndex].picture = imageLink;

        setAvatars(avatarsList);
    }, [avatars]);

    const onChangeBg = useCallback((imageLink: any) => {
        setBgImg(imageLink);
    }, []);

    useEffect(() => {
        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('Joined a room', onJoinRoom);
        socket.on('Room not found', onRoomNotFound);
        socket.on('Created a box', onCreatedBox);
        socket.on('Avatar Moved', onAvatarMoved);
        socket.on('Box Resized', onBoxResized);
        socket.on('Box Deleted', onBoxDeleted);
        socket.on('Avatar Picture Uploaded', onUploadPicture);
        socket.on('Background Changed', onChangeBg);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('Joined a room', onJoinRoom);
            socket.off('Room not found', onRoomNotFound);
            socket.off('Created a box', onCreatedBox);
            socket.off('Avatar Moved', onAvatarMoved);
            socket.off('Box Resized', onBoxResized);
            socket.off('Box Deleted', onBoxDeleted);
            socket.off('Avatar Picture Uploaded', onUploadPicture);
            socket.off('Background Changed', onChangeBg);
        };
    }, [
        avatars,
        onConnect,
        onDisconnect,
        onJoinRoom,
        onRoomNotFound,
        onCreatedBox,
        onAvatarMoved,
        onBoxResized,
        onBoxDeleted,
        onUploadPicture,
        onChangeBg
    ]);

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
        if (avatar.userId === userId) {
            onAvatarMoved(ui.x, ui.y, avatar.avatarName);
            socket.timeout(5000).emit('move-box', roomId, avatar.avatarName, { x: ui.x, y: ui.y }, userId, socket.id)
        }
    }

    const handleResizeStop = (avatar: any, _e: any, ref: any) => {
        if (avatar.userId === userId) {
            console.log(ref)
            onBoxResized(ref.style, avatar.avatarName);
            socket.emit('resize-box', roomId, avatar.avatarName, { width: ref.style.width, height: ref.style.height }, socket.id);
        }
    }

    const handleDeleteAvatar = (avatar: any) => {
        if (avatar.userId !== userId) return;
        socket.emit('delete-box', roomId, avatar.avatarName);
    }

    const handleUpload = (avatar: any) => {
        console.log('OI')
        if (avatar.userId === userId)
            socket.emit('set-avatar-image', roomId, avatar.avatarName, avatarFormValue);
    }

    const handleChangeBackground = () => {
        socket.emit('change-background', roomId, avatarFormValue);
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
                <button
                    type="button"
                    onClick={handleChangeBackground}
                >
                    Mudar background
                </button>
            </div>

            <div className="App">
                {userId && <span>{userId}</span>}
                <ConnectionState isConnected={isConnected} />
                <ConnectionManager />
            </div>

            <div>
                <p>{roomId}</p>
            </div>

            <div
                className="match-map"
                style={{
                    backgroundImage: `url(${bgImg})`,
                    backgroundSize: 'cover'
                }}
            >
                {avatars.map((avatar, index) => {
                    return (
                        <Rnd
                            size={{ width: avatar.size.width, height: avatar.size.height }}
                            position={{ x: avatar.position.x, y: avatar.position.y }}
                            default={{ x: avatar.position.x, y: avatar.position.y, width: avatar.size.width, height: avatar.size.height  }}
                            onDragStop={(e, ui) => handleStopMovement(avatar, e, ui)}
                            onResizeStop={(e, _direction, ref, _delta, _position) => handleResizeStop(avatar, e, ref)}
                            bounds="parent"
                            style={{
                                backgroundImage: `url(${avatar.picture})`,
                                backgroundSize: 'cover'
                            }}
                        >
                            <div className="avatar">
                                <button
                                    type="button"
                                    onClick={() => handleDeleteAvatar(avatar)}
                                >
                                    X
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleUpload(avatar)}
                                >
                                    UP
                                </button>
                                <p>
                                    {avatar.avatarName} - {index}
                                </p>
                            </div>
                        </Rnd>
                    )
                })}
            </div>
        </section>
    );
}