'use client';

import PropTypes from 'prop-types';
import { useMemo, useEffect, useReducer, useCallback } from 'react';

import { paths } from 'src/routes/paths';

import { supabase } from './lib';
import { AuthContext } from './auth-context';
import axios, {endpoints} from "../../../utils/axios";

// ----------------------------------------------------------------------
/**
 * NOTE:
 * We only build demo at basic level.
 * Customer will need to do some extra handling yourself if you want to extend the logic and other features...
 */
// ----------------------------------------------------------------------

const initialState = {
  user: null,
  loading: true,
};

const reducer = (state, action) => {
  if (action.type === 'INITIAL') {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'REGISTER') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        dispatch({
          type: 'INITIAL',
          payload: {
            user: null,
          },
        });
        console.error(error);
        throw error;
      }

      if (session?.user) {
        dispatch({
          type: 'INITIAL',
          payload: {
            user: {
              ...session?.user,
              session: {
                access_token: session.access_token,
                expires_at: session.expires_at,
                expires_in: session.expires_in,
                refresh_token: session.refresh_token,
                token_type: session.token_type,
              },
            },
          },
        });
      } else {
        dispatch({
          type: 'INITIAL',
          payload: {
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'INITIAL',
        payload: {
          user: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      dispatch({
        type: 'LOGIN',
        payload: {
          user: null,
        },
      });
      console.error(error);
      throw error;
    } else {
      dispatch({
        type: 'LOGIN',
        payload: {
          user: {
            ...data.user,
            session: {
              access_token: data.session.access_token,
              expires_at: data.session.expires_at,
              expires_in: data.session.expires_in,
              refresh_token: data.session.refresh_token,
              token_type: data.session.token_type,
            },
          },
        },
      });
    }
  }, []);

  // REGISTER
  const register = useCallback(async (email, password, firstName, lastName) => {
    console.log('hi im in register in auth provider!')
    const { user, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}${paths.dashboard.root}`,
        data: {
          display_name: `${firstName} ${lastName}`,
          role: 'user',
          application_status: 'incomplete',
        },
      },
    });

    console.log('user', user)

    if (error) {
      console.error(error);
      throw error;
    }
  }, []);

  // Update User
  const updateUser = useCallback(async (userId, storeId) => {
    console.log('hi im in update user in auth provider!', userId)
    const { data, error } = await supabase.auth.updateUser({
      data: {
        store_id: storeId,
        application_status: 'complete',
        avatar_url: "https://example.com/avatar.jpg",
      },
    });

    console.log('data', data);

    if (error) {
      console.error(error);
      throw error;
    }
  }, []);

  // Update User
  const updateUserMetadata = useCallback(async (userMetadata) => {
    const { data, error } = await supabase.auth.updateUser({
      data: userMetadata
    });

    console.log('updateUserMetadata', data);

    if (error) {
      console.error(error);
      throw error;
    }
  }, []);



  // LOGOUT
  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error);
      throw error;
    }

    dispatch({
      type: 'LOGOUT',
    });
  }, []);

  // FORGOT PASSWORD
  const forgotPassword = useCallback(async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}${paths.auth.supabase.newPassword}`,
    });

    if (error) {
      console.error(error);
      throw error;
    }
  }, []);

  // NEW PASSWORD
  const updatePassword = useCallback(async (password) => {
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      console.error(error);
      throw error;
    }
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: {
        ...state.user,
        role: 'user',
        displayName: `${state.user?.user_metadata.display_name}`,
        // applicationStatus: 'complete',
        // applicationStatus: `${state.user?.user_metadata.application_status}`,
        storeId: `${state.user?.user_metadata.store_id}`,
      },
      method: 'supabase',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      login,
      register,
      logout,
      forgotPassword,
      updatePassword,
      updateUser,
      updateUserMetadata
    }),
    [forgotPassword, login, logout, updatePassword, register, state.user, status, updateUser, updateUserMetadata]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
