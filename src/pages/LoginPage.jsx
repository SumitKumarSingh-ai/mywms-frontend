import React, { useState } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { useAuth } from '../context/AuthContext';
import { getAuth, GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';
import app from '../firebaseConfig'; 

const EyeIcon = ({ className = "h-5 w-5" }) => ( <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /> <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /> </svg> );
const EyeSlashIcon = ({ className = "h-5 w-5" }) => ( <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.575M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-18-18" /></svg> );
const GoogleIcon = () => ( <svg className="w-5 h-5 mr-3" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg"><path d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z" fill="#4285f4"/><path d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z" fill="#34a853"/><path d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z" fill="#fbbc04"/><path d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 340.1 0 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z" fill="#ea4335"/></svg> );

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const handleRegularLogin = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        const result = await login(username, password);
        if (result.success) {
            window.location.href = '/dashboard';
        } else {
            Swal.fire('Login Failed', result.message, 'error');
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        const auth = getAuth(app);
        const provider = new GoogleAuthProvider();
        await signInWithRedirect(auth, provider);
    };

    return (
        <div className="min-h-screen w-full flex bg-cover bg-center" style={{ backgroundImage: "url('/back1.png')" }}>
            <div className="w-full md:w-1/2 lg:w-2/5 xl:w-1/3 flex items-center justify-center p-6 sm:p-8 md:p-12 ml-auto">
                <div className="bg-white/50 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up">
                    <form onSubmit={handleRegularLogin} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-semibold text-slate-800 mb-1">Username</label>
                            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 bg-white/80 border border-slate-400/70 text-slate-800 rounded-lg focus:ring-2 focus:ring-sky-500"
                                placeholder="Enter your username" required disabled={isLoading} />
                        </div>
                        <div className="relative">
                            <label htmlFor="password" className="block text-sm font-semibold text-slate-800 mb-1">Password</label>
                            <input type={showPassword ? "text" : "password"} id="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-white/80 border border-slate-400/70 text-slate-800 rounded-lg focus:ring-2 focus:ring-sky-500"
                                placeholder="••••••••" required disabled={isLoading} />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} disabled={isLoading} className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center text-slate-500">
                                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                            </button>
                        </div>
                        <button type="submit" disabled={isLoading}
                                className={`w-full py-3 px-4 rounded-lg text-white font-semibold text-lg transition-all duration-300 ${isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-sky-600 to-blue-700 hover:scale-105'}`}>
                            {isLoading ? 'Signing In...' : 'SIGN IN'}
                        </button>
                    </form>
                    <div className="my-6 flex items-center">
                        <div className="flex-grow border-t border-slate-400/60"></div><span className="mx-4 text-sm text-slate-600">or</span><div className="flex-grow border-t border-slate-400/60"></div>
                    </div>
                    <button type="button" onClick={handleGoogleLogin} disabled={isLoading}
                            className={`w-full flex items-center justify-center py-3 px-4 text-blue-700 bg-transparent hover:bg-white/30 border border-blue-500/50 rounded-lg group transition-all ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        {isLoading ? 'Processing...' : <><GoogleIcon /> <span className="font-medium">Sign in with Google</span></>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;