import PropTypes from 'prop-types';
import { useState, useEffect, useCallback, useMemo } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

const loginPaths = {
  jwt: paths.auth.jwt.login,
  auth0: paths.auth.auth0.login,
  amplify: paths.auth.amplify.login,
  firebase: paths.auth.firebase.login,
  supabase: paths.auth.supabase.login,
};

// ----------------------------------------------------------------------

export default function AuthGuard({ children }) {
  const { loading } = useAuthContext();

  return <>{loading ? <SplashScreen /> : <Container> {children}</Container>}</>;
}

AuthGuard.propTypes = {
  children: PropTypes.node,
};

// ----------------------------------------------------------------------

function Container({ children }) {
  const router = useRouter();

  const { authenticated } = useAuthContext();

  const [checked, setChecked] = useState(false);

  const method = useMemo(() => {
    // Determine the authentication method here based on your logic
    return 'supabase'; // Or return the appropriate method dynamically
  }, []);

  const check = useCallback(() => {
    if (!authenticated) {
      const { pathname, search } = window.location;

      const loginPath = loginPaths[method];

      const searchParams = new URLSearchParams();
      searchParams.append('returnTo', `${pathname}${search}`);

      // Get the shopId from the current URL
      const urlSearchParams = new URLSearchParams(window.location.search);
      const shopId = urlSearchParams.get('shopId');
      if (shopId) {
        searchParams.append('shopId', shopId);
      }

      const href = `${loginPath}?${searchParams.toString()}`;
      router.replace(href);
    } else {
      setChecked(true);
    }
  }, [authenticated, method, router]);

  useEffect(() => {
    check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!checked) {
    return null;
  }

  return <>{children}</>;
}

Container.propTypes = {
  children: PropTypes.node,
};
