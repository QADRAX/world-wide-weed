import React from 'react';
import { useCurrentPlayerRoom } from '../../hooks/usePlayerRoom';
import { MainCard } from '../Shared/MainCard';
import { Lobby } from './Lobby/Lobby';
import { LobbyFooter } from './Lobby/LobbyFooter';
import { LobbyInfo } from './Lobby/LobbyInfo';
import { Match } from './Match/Match';
import { MatchInfo } from './Match/MatchInfo';
import ChatIcon from '@mui/icons-material/Chat';

export const WeedRoom = () => {
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
            expandIcon={<ChatIcon />}
        >
            {
                isMatchStarted
                    ? <Match />
                    : <Lobby />
            }
        </MainCard>
    )
}

