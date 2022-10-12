import { useAppContext } from 'hooks/globalContext';
import React, { useState } from 'react';
import { useAppSelector } from 'hooks/redux';
import { ChatRoom } from 'redux/chatRoom/chatRoomSlice';
import { Divider, Paper, styled } from '@mui/material';
import { TextInput } from './TextInput/TextInput';
import { MessageLeft } from './Message/MessageRight';
import { MessageRight } from './Message/MessageLeft';

const ChatboxRoot = styled(Paper)({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: 'center',
    width: "100%",
    height: "100%",
});

const MessageContainer = styled('div')({
    flex: 1,
    width: '100%',
    overflowY: "auto",
    padding: '2px 4px',
});

export const ChatBox = () => {
    const [inputValue, setInputValue] = useState<string>('');
    const appContext = useAppContext();
    const chatRooms = useAppSelector((state) => state.chat.chatRooms);
    const currentChatRoom = useAppSelector((state) => state.chat.currentChatRoom);

    const general: ChatRoom | undefined = chatRooms[currentChatRoom];

    const sendMessage = () => {
        if (inputValue) {
            appContext.actions.sendChatMessage({
                message: inputValue,
                roomId: 'general',
            });
            setInputValue('');
        }
    };

    const currentPlayerId = appContext.player?.id;

    return (
        <ChatboxRoot>
            <MessageContainer>
                {
                    general?.messages?.map((message, index) => {

                        if (message.sender.id != currentPlayerId) {
                            return (
                                <MessageLeft key={index}
                                    message={message.text}
                                    timestamp={message.date}
                                    photoURL={message.sender.avatarUrl}
                                    displayName={message.sender.name}
                                />
                            );
                        } else {
                            return (
                                <MessageRight key={index}
                                    message={message.text}
                                    timestamp={message.date}
                                    photoURL={message.sender.avatarUrl}
                                    displayName={message.sender.name}
                                />
                            );
                        }
                    })
                }
            </MessageContainer>
            <Divider sx={{ height: 6, m: 0.5, width: '100%' }}
                orientation="horizontal" />
            <TextInput onClick={sendMessage}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)} />
        </ChatboxRoot>
    );
}