import React, { useState } from 'react';
import apiClient from '../api/apiClient';
import AsinInput from '../components/AsinInput';
import ProductDetails from '../components/ProductDetails';
import OptimizedDetails from '../components/OptimizedDetails';
import OptimizationMeta from '../components/OptimizationMeta';
import ListingDescription from '../components/ListingDescription';
import VersionTimeline from '../components/VersionTimeline';
import { Toast } from '../components/ui/Toast';
import { Skeleton } from '../components/ui/Skeleton';

const Home = () => {
    const [asin, setAsin] = useState('');
    const [product, setProduct] = useState(null);
    const [optimizedData, setOptimizedData] = useState(null);
    const [history, setHistory] = useState([]);

    const [loading, setLoading] = useState(false);
    const [optimizing, setOptimizing] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchProduct = async () => {
        if (!asin) return;
        setLoading(true);
        setProduct(null);
        setOptimizedData(null);
        setHistory([]);

        try {
            const productRes = await apiClient.get(`/products/${asin}`);
            setProduct(productRes.data);
            fetchHistory();
        } catch (err) {
            console.error('Fetch error:', err);
            showToast(err.response?.data?.error || 'Failed to fetch product', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchHistory = async () => {
        try {
            const historyRes = await apiClient.get(`/history/${asin}`);
            setHistory(historyRes.data);
        } catch (err) {
            console.error('History fetch error:', err);
        }
    };

    const handleOptimize = async () => {
        if (!product) return;
        setOptimizing(true);

        try {
            const optimizeRes = await apiClient.post('/optimize', {
                asin: asin,
                title: product.original_title || product.title,
                bullets: product.original_bullets || product.bullets,
                description: product.original_description || product.description
            });

            const newOptimization = optimizeRes.data;
            setOptimizedData(newOptimization);

            // Auto-save history
            try {
                await apiClient.post('/history/save', {
                    asin: asin,
                    domain: 'com',
                    original_title: product.original_title || product.title,
                    original_bullets: product.original_bullets || product.bullets,
                    original_description: product.original_description || product.description,
                    optimized_title: newOptimization.optimized.optimized_title,
                    optimized_bullets: newOptimization.optimized.optimized_bullets,
                    optimized_description: newOptimization.optimized.optimized_description,
                    keywords: newOptimization.optimized.keywords,
                    ai_model_used: newOptimization.model,
                    confidence_score: newOptimization.optimized.confidence_score,
                    keyword_density_analysis: newOptimization.optimized.keyword_density_analysis,
                    improvement_explanation: newOptimization.optimized.improvement_explanation
                });
                showToast('Optimization saved to history!', 'success');
                fetchHistory();
            } catch (saveErr) {
                console.warn('Auto-save failed:', saveErr);
                showToast('Optimized, but failed to save history.', 'warning');
            }

        } catch (err) {
            console.error('Optimization error:', err);
            showToast(err.response?.data?.error || 'Optimization failed', 'error');
        } finally {
            setOptimizing(false);
        }
    };

    const handleRollback = async (targetVersion) => {
        try {
            await apiClient.post(`/history/${asin}/rollback`, { version: targetVersion });
            showToast(`Rolled back to version ${targetVersion}`, 'success');
            fetchHistory();
        } catch (err) {
            console.error('Rollback error:', err);
            showToast('Failed to rollback', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD] pb-32">
            {/* Minimalist Header */}
            <header className="sticky top-0 z-50 glass border-b border-surface-100">
                <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 bg-primary-600 rounded-md flex items-center justify-center text-white text-[10px] font-black">
                            AO
                        </div>
                        <span className="text-sm font-bold text-surface-900 tracking-tight">Listing Optimizer</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-bold text-surface-400 bg-surface-100 px-2 py-0.5 rounded-full uppercase tracking-widest">v1.2 Beta</span>
                        <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-primary-500 to-violet-400 border border-white shadow-sm"></div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-16">
                <div className="max-w-2xl mx-auto text-center mb-16">
                    <h2 className="text-4xl font-extrabold text-surface-900 tracking-tight mb-4">
                        Refine your Amazon presence.
                    </h2>
                    <p className="text-lg text-surface-500 leading-relaxed font-medium">
                        Leverage agentic AI to transform basic listings into high-converting assets in seconds.
                    </p>
                </div>

                <div className="max-w-2xl mx-auto">
                    <AsinInput
                        asin={asin}
                        setAsin={setAsin}
                        onFetch={fetchProduct}
                        loading={loading}
                    />
                </div>

                {loading && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                        <div className="space-y-4">
                            <Skeleton className="h-64 w-full" />
                            <Skeleton className="h-32 w-full" />
                        </div>
                        <div className="space-y-4">
                            <Skeleton className="h-64 w-full" />
                            <Skeleton className="h-32 w-full" />
                        </div>
                    </div>
                )}

                {product && !loading && (
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mt-12 items-start">
                        {/* Main Comparison Area (8 cols) */}
                        <div className="xl:col-span-8">
                            {optimizedData && (
                                <OptimizationMeta
                                    optimizedData={optimizedData}
                                    onOptimize={handleOptimize}
                                    loading={optimizing}
                                />
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 mb-2 px-1">
                                        <div className="w-1.5 h-1.5 bg-surface-300 rounded-full"></div>
                                        <h3 className="text-xs font-bold text-surface-400 uppercase tracking-widest">Initial Analysis</h3>
                                    </div>
                                    <ProductDetails product={product} hideDescription={!!optimizedData} />
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 mb-2 px-1">
                                        <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                                        <h3 className="text-xs font-bold text-primary-600 uppercase tracking-widest">AI Transformation</h3>
                                    </div>
                                    <OptimizedDetails
                                        product={product}
                                        optimizedData={optimizedData}
                                        onOptimize={handleOptimize}
                                        loading={optimizing}
                                        hideDescription={!!optimizedData}
                                    />
                                </div>
                            </div>
                            {optimizedData && (
                                <div className="mt-12">
                                    <ListingDescription
                                        original={product.original_description || product.description}
                                        optimized={optimizedData?.optimized?.optimized_description}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Sidebar History (4 cols) */}
                        <div className="xl:col-span-4 sticky top-24">
                            <VersionTimeline
                                history={history}
                                onRollback={handleRollback}
                            />
                        </div>
                    </div>
                )}
            </main>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default Home;
