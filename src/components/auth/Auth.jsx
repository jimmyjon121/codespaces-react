import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';

const Auth = ({ onLogin }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isSignUp, setIsSignUp] = useState(false);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const handleAuthAction = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError('');
		try {
			if (isSignUp) {
				const userCredential = await createUserWithEmailAndPassword(auth, email, password);
				const user = userCredential.user;
				const userRef = doc(db, "users", user.uid);
				await setDoc(userRef, {
					uid: user.uid,
					email: user.email,
					organizationId: "org_family_first",
					role: "Clinical Coach",
					createdAt: new Date(),
				});
				onLogin(user);
			} else {
				await signInWithEmailAndPassword(auth, email, password);
			}
		} catch (err) {
			setError(err.message.replace('Firebase: ', ''));
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900">
			<div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg dark:bg-slate-800">
				<div className="text-center">
					<svg className="mx-auto h-12 w-auto text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 7L12 12L22 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 17L17 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 17L7 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
					<h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
						ClearHiveHQ
					</h2>
					<p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
						{isSignUp ? 'Create a new account' : 'Sign in to your account'}
					</p>
				</div>
				<form className="space-y-6" onSubmit={handleAuthAction}>
					<div>
						<label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
						<input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 placeholder-slate-400 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
					</div>
					<div>
						<label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
						<input id="password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 placeholder-slate-400 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
					</div>
					{error && <p className="text-sm text-red-600">{error}</p>}
					<div>
						<button type="submit" disabled={loading} className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400">
							{loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
						</button>
					</div>
				</form>
				<p className="text-sm text-center text-slate-600 dark:text-slate-400">
					{isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
					<button onClick={() => setIsSignUp(!isSignUp)} className="font-medium text-blue-600 hover:text-blue-500">{isSignUp ? 'Sign In' : 'Sign Up'}</button>
				</p>
			</div>
		</div>
	);
};

export default Auth;
