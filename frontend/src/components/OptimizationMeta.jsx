import React from 'react';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';

const OptimizationMeta = ({ optimizedData, onOptimize, loading }) => {
    if (!optimizedData) return null;

    const data = optimizedData?.optimized || {};
    const meta = optimizedData || {};

    const confidence = data.confidence_score || meta.confidence_score;
    const explanation = data.improvement_explanation || meta.improvement_explanation;
    const model = meta.model || meta.ai_model_used;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Confidence Score */}
            <Card className="border-none shadow-premium bg-white">
                <CardContent className="p-6 flex flex-col justify-center">
                    <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-1">AI Confidence</span>
                    <div className="flex items-end gap-3">
                        <span className="text-4xl font-extrabold text-surface-900 leading-none">{confidence || '--'}%</span>
                        <div className="flex-1 pb-2">
                            <div className="w-full h-2 bg-surface-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary-500 transition-all duration-1000"
                                    style={{ width: `${confidence || 0}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* AI Engine & Actions */}
            <Card className="border-none shadow-premium bg-white">
                <CardContent className="p-6 flex items-center justify-between h-full">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-2">Intelligence Source</span>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-bold text-surface-700">
                                {model?.split('/').pop() || 'Llama 3.3'}
                            </span>
                        </div>
                    </div>
                    <Button
                        onClick={onOptimize}
                        isLoading={loading}
                        variant="primary"
                        size="sm"
                        className="rounded-lg shadow-premium px-6"
                    >
                        ✨ Regenerate
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default OptimizationMeta;
