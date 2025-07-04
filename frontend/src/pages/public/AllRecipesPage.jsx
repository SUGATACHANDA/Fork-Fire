import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../../api/index';
import RecipeCard from '../../components/recipe/RecipeCard';
import Loader from '../../components/common/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import noResultsImage from '../../assets/images/no-results.png';
import clsx from 'clsx'; // <-- Import the clsx utility
import Preloader from '../../components/layout/Preloader';

const AllRecipesPage = () => {
    // --- State Management & Hooks (No changes needed here) ---
    const [allRecipes, setAllRecipes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();

    // --- Data Fetching Effect (No changes needed) ---
    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const [recipesRes, categoriesRes] = await Promise.all([
                    API.get('/api/recipes'),
                    API.get('/api/categories'),
                ]);

                // ✅ Validate and set recipes
                if (Array.isArray(recipesRes.data)) {
                    setAllRecipes(recipesRes.data);
                } else {
                    console.error('Invalid recipes response:', recipesRes.data);
                    setAllRecipes([]);
                }

                // ✅ Validate and set categories
                if (Array.isArray(categoriesRes.data)) {
                    setCategories(categoriesRes.data);
                } else {
                    console.error('Invalid categories response:', categoriesRes.data);
                    setCategories([]); // fallback to empty array to prevent map crash
                }

                const categoryFromUrl = searchParams.get('category') || '';
                const searchFromUrl = searchParams.get('search') || '';
                setSelectedCategory(categoryFromUrl);
                setSearchTerm(searchFromUrl);

            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Could not load recipes. Please try again later.');
                setAllRecipes([]);
                setCategories([]); // Ensure fallback state on error
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [searchParams]);

    // --- Event Handlers (No changes needed) ---
    const handleCategoryChange = (e) => {
        const categoryId = e.target.value;
        setSelectedCategory(categoryId);
        setSearchParams(prev => {
            const newParams = Object.fromEntries(prev.entries());
            if (categoryId) newParams.category = categoryId;
            else delete newParams.category;
            return newParams;
        });
    };

    const handleSearchChange = (e) => {
        const newSearchTerm = e.target.value;
        setSearchTerm(newSearchTerm);
        setSearchParams(prev => {
            const newParams = Object.fromEntries(prev.entries());
            if (newSearchTerm) newParams.search = newSearchTerm;
            else delete newParams.search;
            return newParams;
        });
    };

    const clearFilters = () => {
        setSelectedCategory('');
        setSearchTerm('');
        setSearchParams({});
    };

    const getPageTitle = () => {
        if (!selectedCategory) return 'All Recipes';
        const category = categories.find(cat => cat._id === selectedCategory);
        return category ? `${category.name} Recipes` : 'Filtered Recipes';
    };

    // --- Derived state to check if any filter is active ---
    const isFilterActive = !!searchTerm || !!selectedCategory;
    document.title = "Search from a vast sea of recipes created with love - Fork & Fire"

    return (
        <div className="bg-background">
            <div className="container mx-auto py-16 px-4 sm:px-6 min-h-screen">
                <header className="text-center mb-12">
                    <p className="text-sm font-bold text-accent uppercase tracking-widest">{selectedCategory ? 'Filtered View' : 'Our Collection'}</p>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-extrabold text-primary-text mt-2">
                        {getPageTitle()}
                    </h1>
                </header>

                {/* === THE FIX IS HERE: Dynamically Centered Filter Bar === */}
                <div className="top-20 z-40 bg-background/90 backdrop-blur-md p-4 rounded-xl shadow-sm mb-12">
                    {/* The outer container uses flexbox and `justify-center` */}
                    <div className="flex justify-center">
                        {/* 
                          The inner container's classes change based on `isFilterActive`.
                          We use the `clsx` utility to make this clean.
                        */}
                        <div className={clsx(
                            "grid gap-4 items-center w-full transition-all duration-300",
                            {
                                // IF a filter is active, use this 3-column layout
                                'grid-cols-1 md:grid-cols-3': isFilterActive,
                                // ELSE, use this 2-column layout (on medium screens)
                                'grid-cols-1 md:grid-cols-2 max-w-4xl': !isFilterActive
                            }
                        )}>

                            {/* --- Search Input --- */}
                            <div className="relative">
                                <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                <input
                                    type="text"
                                    placeholder="Search by recipe name..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-light focus:border-accent transition"
                                />
                            </div>

                            {/* --- Category Select --- */}
                            <div className="">
                                <select
                                    value={selectedCategory}
                                    onChange={handleCategoryChange}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-light focus:border-accent transition appearance-none"
                                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                                >
                                    <option value="">Filter by Category...</option>
                                    {categories.map(cat => (<option key={cat._id} value={cat._id}>{cat.name}</option>))}
                                </select>
                            </div>

                            {/* --- Clear Filter Button --- */}
                            {/* This div and button are now only rendered if a filter is active */}
                            {isFilterActive && (
                                <div className="">
                                    <button
                                        onClick={clearFilters}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition"
                                    >
                                        <FontAwesomeIcon icon={faTimes} /> Clear Filters
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <main>
                    {/* Main Content Grid (no changes needed) */}
                    {loading ? (
                        <div className="min-h-screen">
                            <Preloader fullScreen={true} />
                        </div>
                    ) : error ? (
                        <div className="text-center py-20 text-red-500">{error}</div>
                    ) : (
                        (() => {
                            const recipesToDisplay = allRecipes
                                .filter(recipe => searchTerm === '' || recipe.title.toLowerCase().includes(searchTerm.toLowerCase()))
                                .filter(recipe => selectedCategory === '' || recipe.category?._id === selectedCategory);

                            if (recipesToDisplay.length > 0) {
                                return (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-12">
                                        {recipesToDisplay.map(recipe => (<RecipeCard key={recipe._id} recipe={recipe} />))}
                                    </div>
                                );
                            } else {
                                return (
                                    <div className="text-center py-20 flex flex-col items-center"><img src={noResultsImage} alt="No recipes found" className="w-64 h-64 mb-6" /><h3 className="text-2xl font-semibold text-primary-text">No Recipes Found</h3><p className="text-secondary-text mt-2 max-w-md">We couldn't find any recipes matching your criteria.</p>{isFilterActive && (<button onClick={clearFilters} className="mt-6 flex items-center justify-center gap-2 px-6 py-2 bg-accent text-white font-semibold rounded-lg hover:bg-opacity-90 transition"><FontAwesomeIcon icon={faTimes} /> Clear All Filters</button>)}</div>
                                );
                            }
                        })()
                    )}
                </main>
            </div>
        </div>
    );
};

export default AllRecipesPage;