import React, { useState } from 'react';
import API from '../../api'; // Your configured Axios instance
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
    // State for the form input
    const [email, setEmail] = useState('');
    // State to manage the submission process (loading, success, error)
    const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setStatus('error');
            setMessage('Please enter a valid email address.');
            return;
        }

        setStatus('loading');
        setMessage('');

        try {
            // Make the API call to our new newsletter endpoint
            const { data } = await API.post('/api/newsletter/subscribe', { email });
            setStatus('success');
            setMessage(data.message);
            setEmail(''); // Clear the input field on success
        } catch (error) {
            setStatus('error');
            // Use the error message from the backend if it exists, otherwise a generic one
            setMessage(error.response?.data?.message || 'An error occurred. Please try again.');
        }
    };

    return (
        <footer className="bg-white border-t border-gray-200 mt-24">
            <div className="container mx-auto px-6 py-12 text-center text-secondary-text">
                <h3 className="text-2xl font-serif font-bold text-primary-text">Sign up for our Newsletter</h3>
                <p className="max-w-md mx-auto my-4">Get the latest recipes, tips, and articles delivered straight to your inbox.</p>

                {/* --- The Functional Form --- */}
                <form onSubmit={handleSubmit} className="max-w-sm mx-auto flex flex-col gap-2">
                    <div className="flex">
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Your email address"
                            disabled={status === 'loading'}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-l-md focus:ring-accent focus:border-accent disabled:bg-gray-100"
                        />
                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="bg-accent text-white font-semibold px-6 py-2.5 rounded-r-md hover:bg-opacity-90 transition-colors disabled:bg-accent/50 disabled:cursor-wait"
                        >
                            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                        </button>
                    </div>

                    {/* --- Status Message Display --- */}
                    {message && (
                        <div
                            className={`p-2 text-sm rounded-md flex items-center justify-center gap-2 ${status === 'success' ? 'text-green-700 bg-green-100' :
                                status === 'error' ? 'text-red-700 bg-red-100' : ''
                                }`}
                        >
                            <FontAwesomeIcon icon={status === 'success' ? faCheckCircle : faExclamationCircle} />
                            {message}
                        </div>
                    )}
                </form>

                <div className="mt-10 pt-8 border-t border-gray-200">
                    <p>© {new Date().getFullYear()} Fork & Fire. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;