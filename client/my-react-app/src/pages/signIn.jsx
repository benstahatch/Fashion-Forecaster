import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import './signIn.css';

const AUTHENTICATED_HOME = '/intro';

function sanitizeSignupRole(value) {
  return value === "professor" ? "professor" : "student";
}

function isDuplicateSignupError(error) {
  const message = String(error?.message || "").toLowerCase();

  return message.includes("already registered") ||
    message.includes("already exists") ||
    message.includes("user already");
}

function isExistingAccountSignupResult(data) {
  if (!data?.user) {
    return false;
  }

  if (data.session) {
    return false;
  }

  if (Array.isArray(data.user.identities) && data.user.identities.length === 0) {
    return true;
  }

  return false;
}

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fullName, setFullName] = useState('');
  const [signUpRole, setSignUpRole] = useState('');
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsChanging(true);
    setError('');
    setMessage('');
    setTimeout(() => setIsSignUp(!isSignUp), 500);
    setTimeout(() => setIsChanging(false), 1000);
  };

  const getRedirectPath = () => location.state?.from || AUTHENTICATED_HOME;

  const handleLogin = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setError('');
    setMessage('');

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: signInEmail,
      password: signInPassword
    });

    if (signInError) {
      setError(signInError.message.toUpperCase());
      setIsSubmitting(false);
      return;
    }

    try {
      setIsChanging(true);
      setTimeout(() => {
        navigate(getRedirectPath(), { replace: true });
      }, 600);
    } catch (_requestError) {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setError('');
    setMessage('');

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: signUpEmail,
      password: signUpPassword,
      options: {
        data: {
          full_name: fullName,
          requested_role: sanitizeSignupRole(signUpRole)
        }
      }
    });

    if (signUpError) {
      if (isDuplicateSignupError(signUpError)) {
        setSignInEmail(signUpEmail);
        setSignInPassword("");
        setIsSignUp(false);
        setError("AN ACCOUNT WITH THIS EMAIL ALREADY EXISTS. PLEASE SIGN IN.");
        setMessage("");
        setIsSubmitting(false);
        return;
      }

      setError(signUpError.message.toUpperCase());
      setIsSubmitting(false);
      return;
    }

    if (isExistingAccountSignupResult(data)) {
      setSignInEmail(signUpEmail);
      setSignInPassword("");
      setIsSignUp(false);
      setError("AN ACCOUNT WITH THIS EMAIL ALREADY EXISTS. PLEASE SIGN IN.");
      setMessage("");
      setIsSubmitting(false);
      return;
    }

    if (data.session) {
      setIsChanging(true);
      setTimeout(() => {
        navigate(getRedirectPath(), { replace: true });
      }, 600);
      return;
    }

    setMessage('ACCOUNT CREATED. CHECK YOUR EMAIL TO CONFIRM ACCESS.');
    setIsSubmitting(false);
  };

  return (
    <div className={`auth-stage ${isSignUp ? 'mode-signup' : 'mode-signin'}`}>
      
      {/* BLACK SHUTTER PANEL */}
      <div className="shutter-panel">
        <div className="shutter-content">
          <div className={`msg-box ${isSignUp ? 'hide' : 'show'}`}>
            <h2 style={{color: 'white'}}>NEW TO FORECASTING?</h2>
            <button className="ghost-btn" onClick={handleToggle}>JOIN NOW</button>
          </div>
          <div className={`msg-box ${isSignUp ? 'show' : 'hide'}`}>
            <h2 style={{color: 'white'}}>RETURNING ANALYST?</h2>
            <button className="ghost-btn" onClick={handleToggle}>SIGN IN</button>
          </div>
        </div>
      </div>

      {/* FORM AREA */}
      <div className={`form-area ${isChanging ? 'form-invisible' : 'form-visible'}`}>
        {!isSignUp ? (
          <form className="form-node" onSubmit={handleLogin}>
            <h1>SIGN IN</h1>
            {error && <p style={{color: 'red', fontSize: '10px', marginBottom: '10px', letterSpacing: '1px'}}>{error}</p>}
            {message && <p style={{color: 'green', fontSize: '10px', marginBottom: '10px', letterSpacing: '1px'}}>{message}</p>}
            
            <input 
              type="email" 
              placeholder="EMAIL" 
              className="vogue-input" 
              value={signInEmail} 
              onChange={(e) => setSignInEmail(e.target.value)} 
              required 
            />
            <input 
              type="password" 
              placeholder="PASSWORD" 
              className="vogue-input" 
              value={signInPassword} 
              onChange={(e) => setSignInPassword(e.target.value)} 
              required 
            />
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? "ACCESSING..." : "ACCESS PORTAL"}
            </button>
          </form>
        ) : (
          <form className="form-node" onSubmit={handleRegister}>
            <h1>REGISTER</h1>
            {error && <p style={{color: 'red', fontSize: '10px', marginBottom: '10px', letterSpacing: '1px'}}>{error}</p>}
            {message && <p style={{color: 'green', fontSize: '10px', marginBottom: '10px', letterSpacing: '1px'}}>{message}</p>}
            <input
              type="text"
              placeholder="FULL NAME"
              className="vogue-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="EMAIL"
              className="vogue-input"
              value={signUpEmail}
              onChange={(e) => setSignUpEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="PASSWORD"
              className="vogue-input"
              value={signUpPassword}
              onChange={(e) => setSignUpPassword(e.target.value)}
              minLength={6}
              required
            />
            <select
              className="vogue-input vogue-select"
              value={signUpRole}
              onChange={(e) => setSignUpRole(sanitizeSignupRole(e.target.value))}
              required
            >
              <option value="" disabled>
                Select A Role
              </option>
              <option value="student">STUDENT</option>
              <option value="professor">PROFESSOR</option>
            </select>
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? "CREATING..." : "CREATE ACCOUNT"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
