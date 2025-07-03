import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useScreenSize } from '../../hooks/useScreenSize';
import { gsap } from 'gsap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faUserCircle } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
    // === Hooks ===
    const { userInfo, logout } = useAuth();
    const isMobile = useScreenSize();
    const navigate = useNavigate();

    // === State ===
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // === Refs for Animation ===
    const mobileMenuRef = useRef(null);
    const tl = useRef(gsap.timeline({ paused: true, reversed: true }));

    // --- Animation Setup Effect ---
    useEffect(() => {
        // This sets up the GSAP timeline animation for the mobile menu.
        // It's defined once when the component mounts.
        const ctx = gsap.context(() => {
            tl.current.to(mobileMenuRef.current, {
                x: 0,
                duration: 0.5,
                ease: 'power3.inOut'
            }).fromTo(".mobile-link", {
                y: 30,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                stagger: 0.1,
                duration: 0.4,
                ease: 'power3.out'
            }, "-=0.3");
        }, mobileMenuRef);

        return () => ctx.revert(); // Cleanup
    }, []);

    // --- Animation Trigger Effect ---
    useEffect(() => {
        // This effect plays or reverses the timeline based on the menu state.
        if (isMenuOpen) {
            tl.current.play();
            // Prevent body scroll when menu is open
            document.body.style.overflow = 'hidden';
        } else {
            tl.current.reverse();
            document.body.style.overflow = 'auto';
        }
    }, [isMenuOpen]);

    // Close mobile menu if screen resizes to desktop view
    useEffect(() => {
        if (!isMobile) {
            setIsMenuOpen(false);
        }
    }, [isMobile]);

    // --- Event Handlers ---
    const handleLogout = () => {
        logout();
        setIsMenuOpen(false); // Ensure menu closes on logout
        navigate('/');
    };

    // --- Reusable Component for Nav Links ---
    const NavLinks = ({ mobile = false }) => {
        const linkClass = mobile ? "mobile-link py-3" : "desktop-link hover:text-accent transition-colors duration-200";
        const activeStyle = { color: '#E86E45' };

        const closeMenu = () => setIsMenuOpen(false);

        return (
            <>
                <NavLink to="/" style={({ isActive }) => (isActive ? activeStyle : undefined)} className={linkClass} onClick={closeMenu}>Home</NavLink>
                <NavLink to="/recipes" style={({ isActive }) => (isActive ? activeStyle : undefined)} className={linkClass} onClick={closeMenu}>All Recipes</NavLink>
                {userInfo && (
                    <NavLink to="/favorites" style={({ isActive }) => (isActive ? activeStyle : undefined)} className={linkClass} onClick={closeMenu}>Favorites</NavLink>
                )}
                {userInfo?.isAdmin && (
                    // This link will not render if isMobile is true inside the menu
                    <NavLink to="/admin" style={({ isActive }) => (isActive ? activeStyle : undefined)} className={`${linkClass} text-accent`} onClick={closeMenu}>Admin Panel</NavLink>
                )}
            </>
        );
    };


    // --- RENDER ---
    return (
        <header className="bg-background/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-2xl font-serif font-bold text-primary-text z-50">
                    Fork & Fire
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center space-x-8 text-sm font-semibold tracking-wide uppercase text-secondary-text">
                    <NavLinks />
                </nav>

                {/* Desktop User Actions */}
                <div className="hidden lg:flex items-center space-x-4 z-50">
                    {userInfo ? (
                        <div className="flex items-center gap-3">
                            <FontAwesomeIcon icon={faUserCircle} className="text-accent text-2xl" />
                            <span className="font-semibold text-primary-text">{userInfo.name.split(' ')[0]}</span>
                            <span className="text-gray-300">|</span>
                            <button onClick={handleLogout} className="text-sm text-secondary-text font-semibold uppercase hover:text-accent transition-colors">Logout</button>
                        </div>
                    ) : (
                        <NavLink to="/login" className="bg-accent text-white px-5 py-2.5 rounded-full hover:bg-opacity-90 transition-colors text-xs font-bold uppercase">
                            Login / Signup
                        </NavLink>
                    )}
                </div>

                {/* Hamburger Menu Icon (Mobile) */}
                <div className="lg:hidden flex items-center z-50">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Open menu" className="text-primary-text text-2xl focus:outline-none">
                        <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} className="transition-transform duration-300 transform" style={{ transform: isMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)' }} />
                    </button>
                </div>
            </div>

            {/* Mobile Menu Panel */}
            <div
                ref={mobileMenuRef}
                className="lg:hidden fixed top-0 left-0 w-full h-screen bg-background transform -translate-x-full z-40"
            >
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <nav className="flex flex-col space-y-8 text-2xl uppercase tracking-widest text-primary-text font-semibold">
                        <NavLinks mobile={true} />
                    </nav>

                    {/* Mobile User Actions */}
                    <div className="absolute bottom-20 text-center mobile-link">
                        {userInfo ? (
                            <div className="flex flex-col items-center gap-4">
                                <p className="text-secondary-text">Signed in as {userInfo.name}</p>
                                <button onClick={handleLogout} className="font-bold text-lg text-accent uppercase">
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <NavLink to="/login" onClick={() => setIsMenuOpen(false)} className="bg-accent text-white px-8 py-3 rounded-full text-lg font-bold uppercase">
                                Login / Signup
                            </NavLink>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;