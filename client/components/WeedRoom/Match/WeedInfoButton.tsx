import React, { FunctionComponent } from 'react';
import InfoIcon from '@mui/icons-material/Info';
import { Card, Grid, IconButton, Modal } from '@mui/material';
import { CardType } from '../../../../types/WeedTypes';
import { InGameWeedInfoItem, WeedInfoItem } from './WeedInfoCard';
import { DeckSchema } from '../../../../types/DeckSchema';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    p: 4,
};

export type WeedInfoButtonProps = {
    deckSchema?: DeckSchema;
    inGame: boolean;
};

export const WeedInfoButton: FunctionComponent<WeedInfoButtonProps> = (props) => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const deckSchema = props.deckSchema;

    const items: [CardType, number][] = deckSchema
        ? Object.entries(deckSchema) as [CardType, number][]
        : [];

    return (
        <div>
            <IconButton onClick={handleOpen} disabled={!deckSchema}>
                <InfoIcon />
            </IconButton>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Card sx={style}>
                    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                        {items.map(([cardType, count]) => (
                            <Grid item xs={2} sm={4} md={4} key={cardType}>
                                {
                                    props.inGame
                                        ? <InGameWeedInfoItem cardType={cardType} count={count} />
                                        : <WeedInfoItem cardType={cardType} count={count} />
                                }
                            </Grid>
                        ))}
                    </Grid>
                </Card>
            </Modal>
        </div>
    )
};