import React from 'react';
import { useCurrentPlayerRoom } from '../../hooks/usePlayerRoom';
import { MainCard } from '../Shared/MainCard';
import { Lobby } from './Lobby/Lobby';
import { LobbyFooter } from './Lobby/LobbyFooter';
import { LobbyInfo } from './Lobby/LobbyInfo';
import { Match } from './Match/Match';
import { MatchInfo } from './Match/MatchInfo';
import ChatIcon from '@mui/icons-material/Chat';
import MarkUnreadChatAltIcon from '@mui/icons-material/MarkUnreadChatAlt';
import { useInitRoom } from '../../hooks/useInitRoom';
import { Chat } from './Chat/Chat';
import { useHasPendingMesseges } from '../../hooks/useHasPendingMessages';
import { useAppSelector } from '../../hooks/redux';

export const WeedRoom = () => {
    useInitRoom();
    useHasPendingMesseges();

    const hasPendingMessages = useAppSelector((state) => state.rooms.hasPendingMessages);
    
    const currentRoom = useCurrentPlayerRoom();
    const isMatchStarted = currentRoom.matchId != null;

    return (
        <MainCard
            title={
                <>
                    {
                        !isMatchStarted
                            ? <LobbyInfo />
                            : <MatchInfo />
                    }
                </>
            }
            footer={
                !isMatchStarted && <LobbyFooter />
            }
            expandIcon={
                <>
                    {
                        !hasPendingMessages
                            ? <ChatIcon />
                            : <MarkUnreadChatAltIcon color='primary' />
                    }
                </>
            }
            innerContent={<Chat />}
        >
            {
                isMatchStarted
                    ? <Match />
                    : <Lobby />
            }
        </MainCard>
    )
}

