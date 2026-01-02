import React from 'react';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';

const AsinInput = ({ asin, setAsin, onFetch, loading }) => {
    return (
        <div className="relative group mb-12">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-violet-500 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-white border border-surface-200 rounded-xl flex items-center p-1.5 shadow-premium hover:border-primary-300 transition-colors">
                <div className="pl-4 text-surface-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                </div>
                <input
                    type="text"
                    value={asin}
                    onChange={(e) => setAsin(e.target.value.toUpperCase())}
                    placeholder="Enter ASIN (e.g. B07ZPKZSSC)"
                    className="flex-1 bg-transparent border-none focus:ring-0 text-surface-800 placeholder-surface-400 text-sm font-semibold px-4 h-12"
                />
                <Button
                    onClick={onFetch}
                    isLoading={loading}
                    disabled={!asin || loading}
                    size="md"
                    className="rounded-lg px-8 h-12"
                >
                    Analyze
                </Button>
            </div>
        </div>
    );
};

export default AsinInput;
