import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../api';
import Loader from '../../components/common/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

// Correct imports for jsPDF and the autoTable plugin
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const PrintRecipePage = () => {
    // --- State Management ---
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);

    // --- Data Fetching Logic ---
    useEffect(() => {
        const fetchRecipe = async () => {
            setLoading(true);
            try {
                const { data } = await API.get(`/api/recipes/${id}`);
                setRecipe(data);
            } catch (err) {
                console.log(err)
                setError('Could not load recipe data. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchRecipe();
    }, [id]);

    // --- Definitive PDF Download Handler using jspdf-autotable ---
    const handleDownloadPdf = () => {
        if (!recipe) return;

        setIsDownloading(true);
        setError(null);

        try {
            // 1. Initialize the PDF document
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageMargin = 15;
            let finalY = pageMargin; // autoTable will manage this for us

            // 2. Add the Header section using autoTable
            autoTable(pdf, {
                startY: finalY + 5,
                body: [
                    [{ content: recipe.category?.name.toUpperCase() || 'RECIPE', styles: { halign: 'center', fontSize: 10, textColor: '#e67e22', font: 'helvetica', fontStyle: 'bold' } }],
                    [{ content: recipe.title, styles: { halign: 'center', fontSize: 26, font: 'times', fontStyle: 'bold', textColor: '#2c3e50', cellPadding: { top: 2, bottom: 2 } } }],
                    [{ content: `From the kitchen of Fork & Fire`, styles: { halign: 'center', fontSize: 10, font: 'helvetica', fontStyle: 'italic', textColor: '#718096' } }],
                ],
                theme: 'plain', // Removes all table borders for a clean look
            });
            finalY = pdf.lastAutoTable.finalY + 8; // Update Y position

            // 3. Add the Meta Info Bar
            autoTable(pdf, {
                startY: finalY,
                body: [[
                    { content: `Prep: ${recipe.prepTime || 'N/A'}` },
                    { content: `Cook: ${recipe.cookTime || 'N/A'}` },
                    { content: `Serves: ${recipe.servings || 'N/A'}` },
                ]],
                theme: 'plain',
                styles: { fontSize: 9, font: 'helvetica', textColor: '#2c3e50', halign: 'center' },
            });
            finalY = pdf.lastAutoTable.finalY + 12;

            // 4. Add Ingredients and Instructions in a two-column layout
            autoTable(pdf, {
                startY: finalY,
                body: [
                    [
                        {
                            content: 'Ingredients\n\n' + recipe.ingredients.map(ing => `• ${ing}`).join('\n'),
                            styles: { valign: 'top' }
                        },
                        {
                            content: 'Instructions\n\n' + recipe.steps.map((step, index) => `${index + 1}. ${step.description}`).join('\n\n'),
                            styles: { valign: 'top' }
                        }
                    ]
                ],
                theme: 'plain',
                styles: { fontSize: 10, font: 'helvetica', textColor: '#333' },
                columnStyles: { 0: { cellWidth: 65 } }, // Give ingredients column a fixed width
                // Hook to style the titles "Ingredients" and "Instructions"
                didParseCell: (data) => {
                    const cellText = data.cell.raw.toString();
                    if (cellText.startsWith('Ingredients') || cellText.startsWith('Instructions')) {
                        data.cell.styles.font = 'times';
                        data.cell.styles.fontStyle = 'bold';
                        data.cell.styles.fontSize = 18;
                        data.cell.styles.textColor = '#2c3e50';
                        // Add some space after the title before the content starts
                        data.cell.text = data.cell.text[0].split('\n');
                        data.cell.styles.minCellHeight = 15;
                    }
                },
            });
            finalY = pdf.lastAutoTable.finalY;

            // 5. Add a simple footer at the bottom of the last page
            pdf.setFont('helvetica', 'normal').setFontSize(9).setTextColor('#7A6C66');
            pdf.text(
                `Find more recipes at ${window.location.origin}`,
                pageWidth / 2,
                pdf.internal.pageSize.getHeight() - 10,
                { align: 'center' }
            );

            // 6. Save the final document
            const fileName = `${recipe.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
            pdf.save(fileName);

        } catch (err) {
            console.error("PDF generation failed:", err);
            setError("Sorry, an unexpected error occurred while creating the PDF.");
        } finally {
            setIsDownloading(false);
        }
    };

    // --- Render Logic for the On-Screen Preview ---
    if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader /></div>;
    if (error) return <div className="flex items-center justify-center min-h-screen text-red-500 font-semibold p-8">{error}</div>;
    if (!recipe) return <div className="flex items-center justify-center min-h-screen">Recipe not found.</div>;

    const siteUrl = window.location.origin;

    return (
        <div className="bg-gray-100 min-h-screen">
            <header id="print-controls" className="w-full bg-white p-4 flex justify-between items-center shadow-md sticky top-0 z-10">
                <Link to={`/recipe/${id}`} className="text-gray-600 hover:text-accent font-semibold flex items-center gap-2 text-sm">
                    <FontAwesomeIcon icon={faArrowLeft} />
                    Back to Full Recipe
                </Link>
                <button onClick={handleDownloadPdf} disabled={isDownloading} className="bg-accent text-white font-bold py-2 px-5 rounded-md hover:bg-opacity-90 transition-colors flex items-center gap-2 disabled:bg-accent/50 disabled:cursor-wait">
                    <FontAwesomeIcon icon={faDownload} />
                    {isDownloading ? 'Generating...' : 'Download PDF'}
                </button>
            </header>

            <main>
                <div id="pdf-preview-content" className="max-w-4xl mx-auto p-10 md:p-16 bg-white shadow-lg my-8 font-serif">
                    <header className="text-center mb-10">
                        <p className="text-sm font-bold text-accent uppercase tracking-widest font-sans">{recipe.category?.name || "Recipe"}</p>
                        <h1 className="text-4xl lg:text-5xl font-extrabold my-2 text-primary-text">{recipe.title || "Untitled Recipe"}</h1>
                        <p className="text-base text-gray-500 font-sans">from Fork & Fire Kitchen</p>
                    </header>

                    <section className="bg-accent-light/60 font-sans p-4 rounded-lg text-center grid grid-cols-3 divide-x divide-accent/50 my-10">
                        <div><h4 className="font-bold text-xs uppercase text-secondary-text tracking-wider">Prep</h4><p className="text-xl font-serif font-bold text-primary-text mt-1">{recipe.prepTime || 'N/A'}</p></div>
                        <div><h4 className="font-bold text-xs uppercase text-secondary-text tracking-wider">Cook</h4><p className="text-xl font-serif font-bold text-primary-text mt-1">{recipe.cookTime || 'N/A'}</p></div>
                        <div><h4 className="font-bold text-xs uppercase text-secondary-text tracking-wider">Serves</h4><p className="text-xl font-serif font-bold text-primary-text mt-1">{recipe.servings || 'N/A'}</p></div>
                    </section>

                    {recipe.description && <p className="text-lg text-gray-600 my-8 leading-relaxed font-sans">{recipe.description}</p>}

                    <section className="grid grid-cols-1 md:grid-cols-3 gap-x-10 mt-10">
                        <div className="md:col-span-1 border-r-0 md:border-r-2 md:border-gray-100 md:pr-10 mb-8 md:mb-0">
                            <h2 className="text-3xl font-bold border-b-2 border-accent pb-2 mb-6">Ingredients</h2>
                            <ul className="list-disc list-outside space-y-3 text-gray-700 ml-4 font-sans">
                                {recipe.ingredients?.map((ing, i) => <li key={`ing-${i}`} className="pl-2 leading-snug">{ing}</li>)}
                            </ul>
                        </div>
                        <div className="md:col-span-2">
                            <h2 className="text-3xl font-bold border-b-2 border-accent pb-2 mb-6">Instructions</h2>
                            <ol className="list-decimal list-outside space-y-6 ml-5 font-sans">
                                {recipe.steps?.map((step, index) => (
                                    <li key={`step-${index}`} className="pl-2">
                                        <p className="text-lg text-gray-800 leading-relaxed">{step.description}</p>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </section>

                    <footer className="text-center mt-16 pt-8 border-t border-gray-200">
                        <h3 className="text-2xl font-bold text-accent">Fork & Fire</h3>
                        <p className="text-sm text-gray-400 mt-2 font-sans">Enjoy! Find more recipes at <a href={siteUrl}>Fork & Fire</a></p>
                    </footer>
                </div>
            </main>
        </div>
    );
};

export default PrintRecipePage;