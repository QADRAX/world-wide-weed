import React from 'react';
import { Box, Button, Container, Modal, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { GameService } from '../../../services/GameService';
import { DeckSchema, classicSchema } from '../../../../types/DeckSchema';
import { DeckSchemaForm } from './DeckSchemaForm';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

export const CreateRoomButton = () => {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [roomName, setRoomName] = React.useState('');
    const [deckSchema, setDeckSchema] = React.useState<DeckSchema>(classicSchema);

    const createMatch = async () => {
        setIsSubmitting(true);
        setIsModalOpen(false);
        setRoomName('');
        await GameService.createRoom({
            roomName,
            deckSchema,
        });
        setDeckSchema(classicSchema);
        setIsSubmitting(false);
    }

    const handleModalClose = () => {
        setIsModalOpen(false);
        setDeckSchema(classicSchema);
    }

    const handleModalOpen = () => {
        setIsModalOpen(true);
    }

    return (
        <>
            <LoadingButton
                size="small"
                type="submit"
                color="primary"
                loading={isSubmitting}
                onClick={handleModalOpen}
                fullWidth
            >
                {isSubmitting ? "loading..." : "Create Room"}
            </LoadingButton>
            <Modal
                open={isModalOpen}
                onClose={handleModalClose}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Box sx={{ ...style, width: 400 }}>
                    <Container>
                        <TextField
                            fullWidth
                            type="text"
                            size='small'
                            variant="standard"
                            label="Room name"
                            onChange={(e) => setRoomName(e.target.value)}
                            value={roomName}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                            <DeckSchemaForm deckSchema={deckSchema} onDeckSchemaChange={setDeckSchema} />
                        </Box>
                        

                        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                            <Button onClick={createMatch}
                                size="small"
                                variant="contained"
                                color="primary">
                                Create Room
                            </Button>
                        </Box>

                    </Container>
                </Box>
            </Modal>
        </>
    )
};