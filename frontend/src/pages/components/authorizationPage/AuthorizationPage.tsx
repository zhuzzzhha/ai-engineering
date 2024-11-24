import { Box, TextField } from '@mui/material'
import { FC } from "react";

export const AuthorizationPage: FC = () => {
    return <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%'
    }}>
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            width: '50%'
        }}>
            <TextField label='Адрес электронной почты' sx={{ marginBottom: '2em', width: '100%' }} />
            <TextField label='Пароль' type='password' sx={{ marginBottom: '2em', width: '100%' }} />
        </Box>
    </Box>
}