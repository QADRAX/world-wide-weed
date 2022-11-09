import { Divider, IconButton, InputBase, styled } from '@mui/material';
import React, { ChangeEventHandler } from 'react';
import SendIcon from '@mui/icons-material/Send';

const ChatTextForm = styled('form')(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: 'center',
    padding: '2px 4px',
    width: "100%",
    margin: `${theme.spacing(0)} auto`
}));

type TextInputProps = {
    value: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
    disabled: boolean;
    onClick: () => void;
};

export const TextInput = (props: TextInputProps) => {

    const onInputKeyDown = (key: string) => {
        if (key == 'Enter') {
            props.onClick();
        }
    };

    return (
        <ChatTextForm
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%' }}
            onSubmit={(e) => e.preventDefault()}
        >
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                value={props.value} size="small"
                onChange={props.onChange}
                onKeyDown={(e) => onInputKeyDown(e.key)}
            />
            <Divider
                sx={{ height: 28, m: 0.5 }}
                orientation="vertical" />
            <IconButton color="primary"
                sx={{ p: '10px' }}
                aria-label="Send Message"
                disabled={props.disabled || props.value == ''}
                onClick={props.onClick}>
                <SendIcon />
            </IconButton>
        </ChatTextForm>
    )
};