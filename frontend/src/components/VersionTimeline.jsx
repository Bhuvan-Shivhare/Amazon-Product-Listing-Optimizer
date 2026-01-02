import React from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';

const VersionTimeline = ({ history, onRollback, loading }) => {
    if (!history || history.length === 0) return null;

    return (
        <Card className="border-none shadow-premium bg-white overflow-visible">
            <CardHeader title="Version History" className="bg-transparent border-none" />
            <CardContent className="pt-0 relative">
                <div className="absolute left-[31px] top-0 bottom-6 w-px bg-surface-100"></div>
                <div className="space-y-8 mt-4">
                    {history.map((version, index) => {
                        const isLatest = index === 0;
                        return (
                            <div key={version.id} className="relative flex gap-4 group">
                                <div className={cn(
                                    "z-10 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shadow-sm shrink-0",
                                    isLatest ? "bg-primary-500" : "bg-surface-200"
                                )}>
                                    <span className={cn(
                                        "text-[10px] font-bold",
                                        isLatest ? "text-white" : "text-surface-500"
                                    )}>
                                        V{version.version_number}
                                    </span>
                                </div>

                                <div className="flex-1 pt-0.5">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[11px] font-bold text-surface-400 uppercase tracking-widest">
                                            {new Date(version.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        {!isLatest && (
                                            <button
                                                onClick={() => onRollback(version.version_number)}
                                                disabled={loading}
                                                className="text-[10px] font-bold text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity hover:underline disabled:opacity-0"
                                            >
                                                Rollback
                                            </button>
                                        )}
                                    </div>

                                    <h4 className="text-sm font-semibold text-surface-900 line-clamp-1 mb-2">
                                        {version.optimized_title || "Initial Optimization"}
                                    </h4>

                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 bg-surface-50 border border-surface-100 rounded text-[9px] font-bold text-surface-500 uppercase tracking-tight">
                                            {version.ai_model_used?.split('/').pop() || 'Llama 3.3'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
};

export default VersionTimeline;
