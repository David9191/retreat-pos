import React, { useEffect, useState } from 'react';
import '../styles/Home.css';
import Home from './Home';
import supabase from '../supabaseClient';

const Login = () => {
  const [session, setSession] = useState();

  async function checkLogin() {
    const authInfo = await supabase.auth.getSession();
    const session = authInfo.data.session;
    setSession(session);
  }
  async function signInWithGithub() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: <Home />,
      },
    });
    if (error) console.log(error);
    console.log(data);
  }
  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) console.log(error);
    checkLogin();
  }

  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <>
      {session === undefined || session === null ? (
        <input type='button' value='login' id='login' onClick={signInWithGithub} />
      ) : (
        <input type='button' value='logout' id='logout' onClick={signOut} />
      )}
      ;
    </>
  );
};

export default Login;
