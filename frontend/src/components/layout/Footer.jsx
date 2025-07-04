import React, { useState, useCallback } from 'react';
import API from '../../api';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faPinterest, faYoutube } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
    // --- State specifically for the Newsletter Form ---
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
    const [message, setMessage] = useState('');

    // --- Newsletter Submission Handler ---
    // Wrapped in useCallback for performance, though not strictly necessary in a footer
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();

        // Simple email validation
        if (!email || !email.match(/^\S+@\S+\.\S+$/)) {
            setStatus('error');
            setMessage('Please enter a valid email address.');
            return;
        }

        setStatus('loading');
        setMessage('');

        try {
            const { data } = await API.post('/api/newsletter/subscribe', { email });
            setStatus('success');
            setMessage(data.message || 'Thank you for subscribing!');
            setEmail(''); // Clear input on success
        } catch (error) {
            setStatus('error');
            setMessage(error.response?.data?.message || 'An error occurred. Please try again.');
        }
    }, [email]);

    // --- Render Logic ---
    return (
        <footer className="bg-primary-text text-gray-300 pt-16 pb-8 mt-24">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

                    {/* Column 1: Brand Information */}
                    <div className="lg:col-span-1 text-center md:text-left">
                        <h3 className="text-2xl font-serif font-bold text-white mb-4">Fork & Fire</h3>
                        <p className="text-sm leading-relaxed text-gray-400">
                            Crafted with love, tested for simplicity. Your destination for recipes that bring people together.
                        </p>
                    </div>

                    {/* Column 2: Quick Navigation Links */}
                    <div className="lg:col-span-1 text-center md:text-left">
                        <h4 className="text-base font-semibold text-white uppercase tracking-wider mb-4">Navigate</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/" className="text-gray-400 hover:text-accent transition-colors">Home</Link></li>
                            <li><Link to="/recipes" className="text-gray-400 hover:text-accent transition-colors">All Recipes</Link></li>
                            <li><Link to="/about" className="text-gray-400 hover:text-accent transition-colors">About Us</Link></li>
                            <li><Link to="/subscribe" className="text-gray-400 hover:text-accent transition-colors">Newsletter</Link></li>
                        </ul>
                    </div>

                    {/* Column 3 & 4: Newsletter Signup Form */}
                    <div className="md:col-span-2 lg:col-span-2">
                        <h4 className="text-base font-semibold text-white uppercase tracking-wider mb-4 text-center md:text-left">Join Our Weekly Journal</h4>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                            <div className="flex">
                                <input
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your.email@example.com"
                                    disabled={status === 'loading'}
                                    aria-label="Email address for newsletter"
                                    className="w-full px-4 py-2.5 bg-gray-700 text-white border border-gray-600 rounded-l-md focus:ring-2 focus:ring-accent-light focus:border-accent disabled:opacity-50 transition"
                                />
                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    aria-label="Subscribe to newsletter"
                                    className="bg-accent text-white font-semibold px-6 py-2.5 rounded-r-md hover:bg-opacity-90 transition-colors disabled:bg-accent/50 disabled:cursor-wait"
                                >
                                    {status === 'loading' ? '...' : <FontAwesomeIcon icon={faPaperPlane} />}
                                </button>
                            </div>
                            {message && (
                                <div className={`p-2 text-xs rounded-md flex items-center justify-center gap-2 transition-all ${status === 'success' ? 'text-green-300 bg-green-900/20' :
                                        status === 'error' ? 'text-red-300 bg-red-900/20' : ''
                                    }`}
                                >
                                    <FontAwesomeIcon icon={status === 'success' ? faCheckCircle : faExclamationCircle} /> {message}
                                </div>
                            )}
                        </form>
                    </div>
                </div>

                {/* Bottom Bar: Copyright and Social Icons */}
                <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col-reverse md:flex-row justify-between items-center text-center md:text-left gap-4">
                    <p className="text-sm text-gray-400">
                        © {new Date().getFullYear()} Fork & Fire Kitchen. All Rights Reserved.
                    </p>
                    <div className="flex items-center space-x-4">
                        <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors text-xl"><FontAwesomeIcon icon={faInstagram} /></a>
                        <a href="#" aria-label="Pinterest" className="text-gray-400 hover:text-white transition-colors text-xl"><FontAwesomeIcon icon={faPinterest} /></a>
                        <a href="#" aria-label="YouTube" className="text-gray-400 hover:text-white transition-colors text-xl"><FontAwesomeIcon icon={faYoutube} /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;