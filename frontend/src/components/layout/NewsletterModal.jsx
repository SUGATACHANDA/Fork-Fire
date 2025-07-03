import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import API from '../../api';
import Modal from '../common/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faEnvelope, faTimes } from '@fortawesome/free-solid-svg-icons';

// --- Configuration Constants ---
// We now use a sessionStorage key. The data will be cleared when the tab is closed or refreshed.
const NEWSLETTER_MODAL_SEEN_KEY = 'hasSeenNewsletterModalInSession';
const MODAL_APPEAR_DELAY = 5000; // 3 seconds
const MODAL_IMAGE_URL = 'https://res.cloudinary.com/dlw562sfr/image/upload/f_auto,q_auto/v1/samples/food/salad';

const NewsletterModal = () => {
    // --- State Management (no changes needed) ---
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('');
    const location = useLocation();

    // === Effect to control modal visibility using sessionStorage ===
    useEffect(() => {
        // Don't show on admin routes
        if (location.pathname.startsWith('/admin')) {
            setIsOpen(false);
            return;
        }

        // --- THE FIX IS HERE (1/2): Use sessionStorage.getItem ---
        // Check if the user has seen the modal *in this specific session*.
        const hasSeenModal = sessionStorage.getItem(NEWSLETTER_MODAL_SEEN_KEY);

        // If they haven't seen it in this session...
        if (!hasSeenModal) {
            const timer = setTimeout(() => {
                setIsOpen(true);
                // --- THE FIX IS HERE (2/2): Use sessionStorage.setItem ---
                // Mark as "seen" only for the current session.
                sessionStorage.setItem(NEWSLETTER_MODAL_SEEN_KEY, 'true');
            }, MODAL_APPEAR_DELAY);

            // Cleanup timer if the component unmounts (e.g., user navigates away before it appears)
            return () => clearTimeout(timer);
        }
    }, [location.pathname]);


    // --- Form Submission Handler (no changes needed) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setStatus('error');
            setMessage('Please enter a valid email address.');
            return;
        }
        setStatus('loading');
        try {
            const { data } = await API.post('/api/newsletter/subscribe', { email });
            setStatus('success');
            setMessage(data.message || "Thank you!");
        } catch (error) {
            setStatus('error');
            setMessage(error.response?.data?.message || "An error occurred.");
        }
    };

    const handleClose = () => setIsOpen(false);

    // --- JSX (no changes needed) ---
    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-4xl w-full grid md:grid-cols-2 relative">
                <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 w-8 h-8 bg-black/20 rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-colors z-10 md:hidden"
                    aria-label="Close modal"
                >
                    <FontAwesomeIcon icon={faTimes} />
                </button>

                <div className="hidden md:block">
                    <img src={MODAL_IMAGE_URL} alt="Fresh vibrant salad" className="w-full h-full object-cover" />
                </div>

                <div className="p-8 md:p-12 flex flex-col justify-center text-center">
                    {status === 'success' ? (
                        <div className="flex flex-col items-center">
                            <FontAwesomeIcon icon={faCheckCircle} className="text-6xl text-green-500 mb-4" />
                            <h2 className="text-3xl font-bold font-serif text-primary-text">You're In!</h2>
                            <p className="text-secondary-text mt-2">{message}</p>
                            <button onClick={handleClose} className="mt-6 bg-accent text-white font-semibold py-2 px-6 rounded-md hover:bg-opacity-90 transition-colors">
                                Explore Recipes
                            </button>
                        </div>
                    ) : (
                        <>
                            <FontAwesomeIcon icon={faEnvelope} className="text-4xl text-accent mb-4" />
                            <h2 className="text-3xl font-bold font-serif text-primary-text">Join Our Kitchen</h2>
                            <p className="text-secondary-text mt-2 max-w-sm mx-auto">
                                Get our best recipes and pro tips delivered to your inbox, free!
                            </p>
                            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
                                <input
                                    type="email"
                                    placeholder="your.email@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={status === 'loading'}
                                    className="w-full text-center px-4 py-3 bg-gray-100 border border-gray-200 rounded-md focus:ring-2 focus:ring-accent-light focus:border-accent"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full bg-accent text-white font-bold py-3 rounded-md hover:bg-opacity-90 transition-colors disabled:bg-accent/50 disabled:cursor-wait"
                                >
                                    {status === 'loading' ? 'Submitting...' : 'Subscribe Now'}
                                </button>
                                {status === 'error' && <p className="text-red-600 text-sm mt-2">{message}</p>}
                            </form>
                            <button onClick={handleClose} className="mt-4 text-sm text-gray-500 hover:underline">
                                No, thanks
                            </button>
                        </>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default NewsletterModal;