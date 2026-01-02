import React from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';

const ListingDescription = ({ original, optimized }) => {
    return (
        <Card className="border-none shadow-premium bg-white overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Original Description */}
                <div className="p-8 border-b md:border-b-0 md:border-r border-surface-50">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-1.5 h-1.5 bg-surface-300 rounded-full"></div>
                        <h3 className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Original Description</h3>
                    </div>
                    <div className="text-sm text-surface-500 leading-relaxed font-medium whitespace-pre-wrap max-h-[500px] overflow-y-auto custom-scrollbar pr-4">
                        {original || "Fetching original description..."}
                    </div>
                </div>

                {/* Optimized Description */}
                <div className="p-8 bg-primary-50/[0.15]">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                        <h3 className="text-[10px] font-bold text-primary-600 uppercase tracking-widest">AI Transformation</h3>
                    </div>
                    <div className="text-sm text-surface-900 leading-relaxed font-bold whitespace-pre-wrap max-h-[500px] overflow-y-auto custom-scrollbar pr-4">
                        {optimized || "AI is generating a persuasive transformation..."}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ListingDescription;
