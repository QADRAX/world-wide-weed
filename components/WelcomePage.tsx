import { useAppContext } from 'hooks/globalContext';
import React from 'react';
import { ChatBox } from './chatbox/ChatBox';



export const WelcomePage = () => {
    const appContext = useAppContext()

    return (
        <>
            <header>
                <title>World wide weed!!</title>
            </header>
            <div>Welcome {appContext.player?.name}!</div>
            <div>{appContext.player?.email}</div>
            <div style={{ height: '400px' }}>
                <ChatBox />
            </div>

        </>
    )
}