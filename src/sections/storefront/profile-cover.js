import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import { alpha, useTheme } from '@mui/material/styles';
import { bgGradient } from 'src/theme/css';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

export default function ProfileCover({ name, avatarUrl, city, state, coverUrl, onAvatarChange }) {
    const theme = useTheme();
    const fileInputRef = useRef(null);

    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        onAvatarChange(file);
    };

    return (
        <Box
            sx={{
                ...bgGradient({
                    color: alpha(theme.palette.primary.darker, 0.8),
                    imgUrl: coverUrl,
                }),
                height: 1,
                color: 'common.white',
            }}
        >
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                sx={{
                    left: { md: 24 },
                    bottom: { md: 24 },
                    zIndex: { md: 10 },
                    pt: { xs: 6, md: 0 },
                    position: { md: 'absolute' },
                }}
            >
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    <Avatar
                        alt={name}
                        src={avatarUrl}
                        sx={{
                            mx: 'auto',
                            width: { xs: 64, md: 128 },
                            height: { xs: 64, md: 128 },
                            border: `solid 2px lightgray`,
                            cursor: 'pointer', // Make the avatar clickable
                        }}
                        onClick={handleAvatarClick} // Trigger file input click when the avatar is clicked
                    >
                        {name?.charAt(0).toUpperCase()}
                    </Avatar>
                    <div
                        style={{
                            position: 'absolute',
                            top: '50%',
                            right: '-8px', // Adjust the position of the camera icon
                            transform: 'translate(-70%, 130%)',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '30px',
                                height: '30px',
                                background: 'gray',
                                borderRadius: '50%',
                                cursor: 'pointer',
                            }}
                        >
                            <CameraAltIcon style={{ color: 'white', fontSize: 20 }} />
                        </div>
                    </div>
                </div>
                {/*<Avatar*/}
                {/*    alt={name}*/}
                {/*    src={avatarUrl}*/}
                {/*    sx={{*/}
                {/*        mx: 'auto',*/}
                {/*        width: { xs: 64, md: 128 },*/}
                {/*        height: { xs: 64, md: 128 },*/}
                {/*        border: `solid 2px ${theme.palette.common.white}`,*/}
                {/*        cursor: 'pointer', // Make the avatar clickable*/}
                {/*    }}*/}
                {/*    onClick={handleAvatarClick} // Trigger file input click when the avatar is clicked*/}
                {/*>*/}
                {/*    {name?.charAt(0).toUpperCase()}*/}
                {/*</Avatar>*/}

                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileInputChange}
                    style={{ display: 'none' }} // Hide the file input element
                />

                <ListItemText
                    sx={{
                        mt: 3,
                        ml: { md: 3 },
                        textAlign: { xs: 'center', md: 'unset' },
                    }}
                    primary={name}
                    secondary={`${city}, ${state}`}
                    primaryTypographyProps={{
                        typography: 'h4',
                    }}
                    secondaryTypographyProps={{
                        mt: 0.5,
                        color: 'inherit',
                        component: 'span',
                        typography: 'body2',
                        sx: { opacity: 0.48 },
                    }}
                />
            </Stack>
        </Box>
    );
}

ProfileCover.propTypes = {
    avatarUrl: PropTypes.string,
    coverUrl: PropTypes.string,
    name: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    onAvatarChange: PropTypes.func.isRequired, // Callback function to handle avatar change
};
