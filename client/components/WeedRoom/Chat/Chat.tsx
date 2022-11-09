import { Divider, styled } from '@mui/material';
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { useAuthenticatedUser } from '../../../hooks/useAuth';
import { useRoomMessages } from '../../../hooks/usePlayerRoom';
import { setHasPendingMessage, setIsPostingMessage, setTextMessage } from '../../../redux/rooms/rooms';
import { GameService } from '../../../services/GameService';
import { MessageLeft, MessageRight } from './ChatMessage';
import { TextInput } from './TextInput';

const ChatboxRoot = styled('div')({
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

export const Chat = () => {
    const messagesEndRef = React.useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();
    const chatMessages = useRoomMessages();
    const textMessage = useAppSelector((state) => state.rooms.textMessage);
    const isPostingMessage = useAppSelector((state) => state.rooms.isPostingMessage);
    const { user } = useAuthenticatedUser();

    const sendMessage = () => {
        if (textMessage) {
            dispatch(setIsPostingMessage(true));
            GameService.sendRoomMessage({
                text: textMessage,
            });
            dispatch(setTextMessage(''));
            window.setTimeout(() => {
                dispatch(setIsPostingMessage(false));
            }, 600);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
        dispatch(setHasPendingMessage(false));
    }

    useEffect(() => {
        scrollToBottom()
    }, [chatMessages]);

    return (
        <ChatboxRoot>
            <MessageContainer>
                {
                    chatMessages?.map((message, index) => {

                        if (message.sender.id != user.id) {
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
                <div ref={messagesEndRef}></div>
            </MessageContainer>
            <Divider sx={{ height: 6, m: 0.5, width: '100%' }}
                orientation="horizontal" />
            <TextInput onClick={sendMessage}
                disabled={isPostingMessage}
                value={textMessage}
                onChange={(e) => dispatch(setTextMessage(e.target.value))} />
        </ChatboxRoot>
    );
}