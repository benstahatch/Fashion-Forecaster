import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

// Pages
import IntroPage from "./pages/intro.jsx";
import AboutPage from "./pages/about.jsx";
import CollagePage from "./pages/collageCreator.jsx";
import ColorPage from "./pages/features/colorForecasting/colorForecasting.jsx";
import MarketPage from "./pages/marketResearch.jsx";
import StreetStylePage from "./pages/streetStyle.jsx";
import TrendPage from "./pages/trendForecasting.jsx";
import FashionPage from "./pages/fashionWeek.jsx";
import TestPage from "./pages/test.jsx";
import ForecastDemo from "./pages/features/colorForecasting/ForecastDemo.jsx";
import TrendBoards from "./pages/features/colorForecasting/TrendBoards.jsx";
import TrendBoardDetail from "./pages/features/colorForecasting/TrendBoardDetail.jsx"; 
import SignPage from "./pages/signIn.jsx";
import UserProfile from "./pages/userProfile.jsx"; 

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import { supabase } from "./lib/supabaseClient";
import { ensureProfile } from "./lib/profileService";

const AUTHENTICATED_HOME = "/intro";

function AuthLoadingScreen() {
    return (
        <div
            style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "48px 24px",
                letterSpacing: "0.12em",
                fontSize: "12px"
            }}
        >
            LOADING SESSION...
        </div>
    );
}

function ProtectedRoute({ session, authLoading, children }) {
    const location = useLocation();

    if (authLoading) {
        return <AuthLoadingScreen />;
    }

    if (!session) {
        return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
    }

    return children;
}

function PublicOnlyRoute({ session, authLoading, children }) {
    const location = useLocation();
    const redirectPath = location.state?.from || AUTHENTICATED_HOME;

    if (authLoading) {
        return <AuthLoadingScreen />;
    }

    if (session) {
        return <Navigate to={redirectPath} replace />;
    }

    return children;
}

function AuthAwareRedirect({ authLoading }) {
    if (authLoading) {
        return <AuthLoadingScreen />;
    }

    return <Navigate to={AUTHENTICATED_HOME} replace />;
}

function App() {
    const [session, setSession] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const syncProfile = async (nextSession) => {
            if (!nextSession?.user) {
                return;
            }

            try {
                await ensureProfile(nextSession.user);
            } catch (error) {
                console.error("Profile sync failed:", error);
            }
        };

        const initializeSession = async () => {
            const { data, error } = await supabase.auth.getSession();

            if (!isMounted) {
                return;
            }

            if (error) {
                console.error("Failed to load Supabase session:", error.message);
                setSession(null);
            } else {
                setSession(data.session);
                void syncProfile(data.session);
            }

            setAuthLoading(false);
        };

        void initializeSession();

        const {
            data: { subscription }
        } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
            if (!isMounted) {
                return;
            }

            setSession(nextSession);
            setAuthLoading(false);
            void syncProfile(nextSession);
        });

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error("Failed to sign out:", error.message);
        }
    };

    const isLoggedIn = Boolean(session);
    const user = session?.user ?? null;

    return (
        <BrowserRouter>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                {/* Pass isLoggedIn to Navbar to swap the "Sign In" button */}
                <Navbar isLoggedIn={isLoggedIn} />
                
                <Routes>
                    <Route path="/" element={<AuthAwareRedirect authLoading={authLoading} />} />
                    <Route path="/intro" element={<IntroPage />} />
                    <Route path="/about" element={<AboutPage />} /> 
                    <Route path="/trend" element={<TrendPage />} />  
                    <Route
                        path="/color"
                        element={
                            <ProtectedRoute session={session} authLoading={authLoading}>
                                <ColorPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/forecast-demo"
                        element={
                            <ProtectedRoute session={session} authLoading={authLoading}>
                                <ForecastDemo />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/trend-boards"
                        element={
                            <ProtectedRoute session={session} authLoading={authLoading}>
                                <TrendBoards />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/boards/:boardId"
                        element={
                            <ProtectedRoute session={session} authLoading={authLoading}>
                                <TrendBoardDetail />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/collage" element={<CollagePage />} />
                    <Route path="/market" element={<MarketPage />} />
                    <Route path="/fashionWeek" element={<FashionPage />} /> 
                    <Route path="/street" element={<StreetStylePage />} />
                    
                    {/* If logged in, redirect away from sign-in page to profile */}
                    <Route 
                        path="/signin" 
                        element={
                            <PublicOnlyRoute session={session} authLoading={authLoading}>
                                <SignPage />
                            </PublicOnlyRoute>
                        } 
                    />
                    
                    <Route 
                        path="/profile" 
                        element={
                            <ProtectedRoute session={session} authLoading={authLoading}>
                                <UserProfile user={user} onLogout={handleLogout} />
                            </ProtectedRoute>
                        } 
                    />
                    
                    <Route path="*" element={<AuthAwareRedirect authLoading={authLoading} />} />
                </Routes>
                <Chatbot />
                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;
