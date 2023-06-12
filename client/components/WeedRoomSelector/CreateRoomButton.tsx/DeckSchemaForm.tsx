import React, { FunctionComponent } from 'react';
import { DeckSchema } from '../../../../types/DeckSchema';
import { CardType } from '../../../../types/WeedTypes';
import { Grid, Stack, TextField } from '@mui/material';
import { WeedCard } from '../../WeedRoom/Match/WeedCard';

export type DeckSchemaFormProps = {
    deckSchema?: DeckSchema;
    onDeckSchemaChange: (deckSchema: DeckSchema) => void;
};

export const DeckSchemaForm: FunctionComponent<DeckSchemaFormProps> = (props) => {
    const onDeckSchemaChange = (
        cardType: CardType,
        count: number,
    ) => {
        const newDeckSchema = Object.assign({}, props.deckSchema);
        newDeckSchema[cardType] = count;
        props.onDeckSchemaChange(newDeckSchema);
    };

    const items: [CardType, number][] = props.deckSchema
        ? Object.entries(props.deckSchema) as [CardType, number][]
        : [];

    return (
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            {items.map(([cardType, count]) => (
                <Grid item xs={2} sm={4} md={4} key={cardType}>
                    <Stack
                        direction="row"
                        alignItems="center"
                        component="form"
                        sx={{ p: '2px 4px'}}
                    >
                        <WeedCard cardType={cardType} width={20} />
                        <TextField
                            sx={{ ml: 1, flex: 1 }}
                            type="number"
                            variant="standard"
                            onChange={(e) => {
                                const value = Number(e.target.value);
                                onDeckSchemaChange(cardType, value > 0 ? value : 0);
                            }}
                            value={count}
                            
                        />
                    </Stack>
                </Grid>
            ))}
        </Grid>
    )
};