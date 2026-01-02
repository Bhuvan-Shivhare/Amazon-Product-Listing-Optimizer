import React from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';
import { Button } from './ui/Button';

const OptimizedDetails = ({ optimizedData, product, onOptimize, loading, hideDescription = false }) => {
    if (!optimizedData && !loading) {
        return (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-surface-200 rounded-3xl bg-white/50 backdrop-blur-sm">
                <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                    <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                </div>
                <h3 className="text-lg font-bold text-surface-900 mb-2">Ready to Transform</h3>
                <p className="text-surface-500 text-sm mb-8 max-w-xs leading-relaxed font-medium">
                    Our agentic AI will transform this listing using Amazon-specific SEO benchmarks.
                </p>
                <Button onClick={onOptimize} isLoading={loading} size="lg" className="rounded-xl px-8 shadow-premium-lg">
                    ✨ Optimize Listing
                </Button>
            </div>
        );
    }

    const data = optimizedData?.optimized || {};
    const meta = optimizedData || {};
    const density = data.keyword_density_analysis || meta.keyword_density_analysis;

    return (
        <div className="space-y-6">
            {/* Content Display */}
            <div className="space-y-6">
                <Card className="border-none shadow-premium bg-white group hover:shadow-premium-lg transition-all duration-300">
                    <CardHeader title="Optimized Title" className="bg-transparent border-none pb-0" />
                    <CardContent className="pt-2">
                        <p className="text-surface-900 leading-relaxed font-bold text-sm">
                            {data.optimized_title}
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-premium bg-white group hover:shadow-premium-lg transition-all duration-300">
                    <CardHeader title="Optimized Bullets" className="bg-transparent border-none pb-0" />
                    <CardContent className="pt-2">
                        <ul className="space-y-4">
                            {data.optimized_bullets?.map((bullet, i) => (
                                <li key={i} className="flex gap-4 items-start">
                                    <span className="flex-shrink-0 w-6 h-6 bg-primary-50 text-primary-600 rounded-lg flex items-center justify-center text-xs font-black shadow-sm">
                                        {i + 1}
                                    </span>
                                    <span className="text-sm text-surface-700 leading-relaxed font-medium pt-0.5">{bullet}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {!hideDescription && (
                    <Card className="border-none shadow-premium bg-white group hover:shadow-premium-lg transition-all duration-300">
                        <CardHeader title="Strategic Content" className="bg-transparent border-none pb-0" />
                        <CardContent className="pt-2">
                            <p className="text-sm text-surface-600 leading-relaxed font-medium">
                                {data.optimized_description}
                            </p>
                        </CardContent>
                    </Card>
                )}

                <Card className="border-none shadow-premium bg-white overflow-hidden relative group hover:shadow-premium-lg transition-all duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                    <CardHeader title="Target Keywords & SEO" className="bg-transparent border-none pb-0 text-surface-900 relative z-10" />
                    <CardContent className="pt-4 relative z-10">
                        <div className="flex flex-wrap gap-2 mb-6">
                            {data.keywords?.map((kw, i) => (
                                <span key={i} className="px-3 py-1.5 bg-primary-50 text-primary-700 text-xs font-bold rounded-lg border border-primary-100 hover:bg-primary-100 transition-colors cursor-default">
                                    {kw}
                                </span>
                            ))}
                        </div>
                        <div className="pt-4 border-t border-surface-50">
                            <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest block mb-2">Keyword Density Analysis</span>
                            <p className="text-[11px] text-surface-600 italic leading-relaxed font-medium">
                                {density || "Strategic distribution achieved through benefit-first writing."}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default OptimizedDetails;
