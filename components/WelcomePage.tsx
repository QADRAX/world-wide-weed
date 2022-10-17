import { IconButton } from '@mui/material';
import { useSession } from 'next-auth/react';
import React from 'react';
import SendIcon from '@mui/icons-material/Send';

export const WelcomePage = () => {
    const { data: session } = useSession();

    const onClick = async () => {
        await fetch('/api/game/createGame', { method: 'POST'});
    }

    const onClick2 = async () => {
        
    }

    return (
        <>
            <header>
                <title>World wide weed!!</title>
            </header>
            <div>Welcome {session?.user.name}!</div>
            <div>{session?.user.email}</div>
            <IconButton color="primary"
                sx={{ p: '10px' }}
                aria-label="Send Message"
                onClick={onClick}>
                API CALL <SendIcon />
            </IconButton>

            <IconButton color="primary"
                sx={{ p: '10px' }}
                aria-label="Send Message"
                onClick={onClick2}>
                FIRABASE ? <SendIcon />
            </IconButton>
        </>
    )
}