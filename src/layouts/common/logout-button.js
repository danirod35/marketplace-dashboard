import PropTypes from 'prop-types';

import Button from '@mui/material/Button';

import { RouterLink } from 'src/routes/components';

import { PATH_AFTER_LOGIN } from 'src/config-global';
import {useAuthContext} from "../../auth/hooks";
import { useSnackbar } from 'src/components/snackbar';
import {paths} from "../../routes/paths";

// ----------------------------------------------------------------------

export default function LogoutButton({ sx }) {

    const { enqueueSnackbar } = useSnackbar();

    const { logout } = useAuthContext();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error(error);
            enqueueSnackbar('Unable to logout!', { variant: 'error' });
        }
    };

  return (
    <Button component={RouterLink} href={paths.auth.supabase.login} onClick={handleLogout}>
      Logout
    </Button>
  );
}

LogoutButton.propTypes = {
  sx: PropTypes.object,
};
