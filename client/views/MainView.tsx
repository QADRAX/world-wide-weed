import { Button, Container } from "@mui/material";
import React, { FunctionComponent } from "react";
import { OngoingMatchCard } from "../components/OngoingMatchCard";
import { firebaseClient } from "../firebaseClient";
import { useOngoingMatches } from "../hooks/getters/getOngoingMatches";
import { useInitApp } from "../hooks/useInitApp";

export const MainView: FunctionComponent = () => {
    useInitApp();
    const matches = useOngoingMatches();

    const createMatch = async () => {
        const response = await fetch('/api/createMatch');
        const data = await response.json();
        console.log(data);
    }

    const getMatches = async () => {
        const database = firebaseClient.database();

        const matchesRef = database.ref().child('ongoingMatches');
        const snap = await matchesRef.once('value');

        const value = snap.val();
        console.log(value);
    }

    return (
        <Container>
            {
                matches.map((match) => {
                    return <OngoingMatchCard key={match.id} match={match} />
                })
            }

            <Button onClick={createMatch}>
                Create match
            </Button>

            <Button onClick={getMatches}>
                test button
            </Button>
        </Container>
    );
}