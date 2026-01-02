import React from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';

const ProductDetails = ({ product, hideDescription = false }) => {
    if (!product) return null;

    return (
        <div className="space-y-6">
            <Card className="border-none shadow-premium bg-white group hover:shadow-premium-lg transition-all duration-300">
                <CardHeader title="Original Title" className="bg-transparent border-none pb-0" />
                <CardContent className="pt-2">
                    <p className="text-surface-600 leading-relaxed text-sm font-medium">
                        {product.original_title || product.title}
                    </p>
                </CardContent>
            </Card>

            <Card className="border-none shadow-premium bg-white group hover:shadow-premium-lg transition-all duration-300">
                <CardHeader title="Key Features" className="bg-transparent border-none pb-0" />
                <CardContent className="pt-2">
                    <ul className="list-disc list-inside space-y-2 marker:text-surface-300">
                        {(Array.isArray(product.original_bullets || product.bullets) ? (product.original_bullets || product.bullets) : []).map((bullet, index) => (
                            <li key={index} className="text-sm text-surface-500 leading-relaxed outline-none pl-1">
                                <span className="relative -left-2">{bullet}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            {!hideDescription && (
                <Card className="border-none shadow-premium bg-white">
                    <CardHeader title="Original Description" className="bg-transparent border-none pb-0" />
                    <CardContent className="pt-2">
                        <p className="text-sm text-surface-500 leading-relaxed max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                            {product.original_description || product.description}
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default ProductDetails;
