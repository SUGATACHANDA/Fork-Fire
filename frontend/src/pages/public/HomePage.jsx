import React, { useState, useEffect, useRef } from 'react';
import API from '../../api';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Import Components
import HeroSection from '../../components/ui/HeroSection';
import RecipeCard from '../../components/recipe/RecipeCard';
import CategoryCard from '../../components/ui/CategoryCard';
import AnimatedTitle from '../../components/ui/AnimatedTitle';
import Loader from '../../components/common/Loader';

// Import Images
import chefPortrait from '../../assets/images/chef-portrait.jpeg';
import aboutBg from '../../assets/images/about-bg.jpeg';

gsap.registerPlugin(ScrollTrigger);

const HomePage = () => {

    document.title = "Fork & Fire | A World of Taste, One Fork at a Time"

    // State Management
    const [latestRecipes, setLatestRecipes] = useState([]);
    const [featuredCategories, setFeaturedCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- REFINEMENT: Use separate refs for each animated section for clarity and stability ---
    const mainRef = useRef(null);
    const categoriesSectionRef = useRef(null); // Ref specifically for categories
    const recipesSectionRef = useRef(null);    // Ref specifically for recipes

    // Data Fetching
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [recipesRes, categoriesRes] = await Promise.all([
                    API.get('/api/recipes?limit=6'),
                    API.get('/api/categories?limit=3'),
                ]);
                setLatestRecipes(recipesRes.data);
                setFeaturedCategories(categoriesRes.data);
            } catch (error) {
                console.error("Failed to fetch homepage data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Animation Logic
    useEffect(() => {
        if (loading) return;

        const ctx = gsap.context(() => {
            // Animate Category Cards using their dedicated ref
            gsap.from(".category-card", {
                y: 100, autoAlpha: 0, stagger: 0.2, duration: 0.8,
                scrollTrigger: {
                    trigger: categoriesSectionRef.current, // Use specific ref
                    start: "top 80%",
                }
            });

            // Animate Recipe Cards using their dedicated ref
            gsap.from(".recipe-card", {
                y: 100, autoAlpha: 0, stagger: 0.15, duration: 0.8,
                scrollTrigger: {
                    trigger: recipesSectionRef.current, // Use specific ref
                    start: "top 80%",
                }
            });

            // Animate About Section elements
            gsap.from(".about-anim", {
                y: 50, autoAlpha: 0, stagger: 0.2, duration: 1,
                scrollTrigger: {
                    trigger: "#about-section",
                    start: "top 75%",
                }
            });

            // Parallax effect for the "About Section" background
            gsap.to("#about-bg-image", {
                backgroundPosition: "50% 100%",
                ease: "none",
                scrollTrigger: {
                    trigger: "#about-section",
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                }
            })

        }, mainRef);
        return () => ctx.revert();
    }, [loading]);

    // Dummy URLs for category images.
    const categoryImageUrls = [
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1484723051597-626a5d194b66?auto=format&fit=crop&q=80"
    ];

    return (
        <main ref={mainRef}>
            <HeroSection />

            {/* Section 2: Featured Categories */}
            <section ref={categoriesSectionRef} id="featured-categories" className="py-24 bg-background">
                <div className="container mx-auto px-6 text-center">
                    <AnimatedTitle>Explore by Category</AnimatedTitle>
                    <p className="mt-4 text-lg text-secondary-text max-w-2xl mx-auto">Find inspiration from our curated collections for every occasion.</p>
                    {loading ? <Loader /> : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                            {featuredCategories.map((cat, index) => (
                                <div key={cat._id} className="category-card">
                                    <CategoryCard category={cat} imageUrl={categoryImageUrls[index]} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* === THE FIX IS HERE === */}
            {/* Section 3: Latest Recipes. The ID now matches the ScrollLink's `to` prop. */}
            <section ref={recipesSectionRef} id="recipes-section" className="py-6">
                <div className="container mx-auto px-6 text-center">
                    <AnimatedTitle>Latest & Greatest Recipes</AnimatedTitle>
                    <p className="mt-4 text-lg text-secondary-text max-w-2xl mx-auto">Fresh from the kitchen, check out our newest additions.</p>
                    {loading ? <Loader /> : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-12">
                            {latestRecipes.map(recipe => (
                                <div key={recipe._id} className="recipe-card">
                                    <RecipeCard recipe={recipe} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Section 4: About Section with Parallax */}
            <section id="about-section" className="relative py-32 overflow-hidden">
                <div id="about-bg-image" className="absolute inset-0 bg-no-repeat bg-cover bg-center z-0" style={{ backgroundImage: `url(${aboutBg})` }}></div>
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10"></div>
                <div className="container mx-auto px-6 relative z-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="about-anim"><img src={chefPortrait} alt="Portrait of Sugata the chef" className="rounded-xl shadow-2xl w-full max-w-md mx-auto" /></div>
                        <div className="text-center md:text-left">
                            <h3 className="about-anim text-sm font-bold text-accent uppercase tracking-widest">A Passion For Food</h3>
                            <h2 className="about-anim text-4xl md:text-5xl font-serif font-bold mt-2">Cooking is a language that everyone can understand.</h2>
                            <p className="about-anim text-secondary-text text-lg mt-6 leading-relaxed">Welcome to Fork & Fire! What started as a personal cooking journal has blossomed into a community for food lovers. Every recipe is crafted with love, tested for simplicity, and designed to inspire you in your own kitchen.</p>
                        </div>
                    </div>
                </div>
            </section>

        </main>
    );
};

export default HomePage;