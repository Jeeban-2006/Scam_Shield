/**
 * React Component Example - Enhanced Category Display
 * 
 * Shows how to integrate the scam subtype detector into your UI
 */

import { Brain, Layers } from 'lucide-react';
import { getDisplayCategory } from '@/app/utils/scamSubtypeDetector';

interface EnhancedCategoryDisplayProps {
    enhancedResponse: any; // Your enhanced response object
    riskLevel: string;
}

export function EnhancedCategoryDisplay({ enhancedResponse, riskLevel }: EnhancedCategoryDisplayProps) {
    const displayCategory = getDisplayCategory(enhancedResponse);

    if (!displayCategory) {
        return null; // Legitimate URL, no category to show
    }

    // Color based on risk level
    const getColor = () => {
        if (riskLevel === 'SAFE') return '#00ff41';
        if (riskLevel === 'SUSPICIOUS') return '#ffd93d';
        return '#ff3b3b';
    };

    const color = getColor();
    const bgColor = `${color}10`;
    const borderColor = `${color}50`;

    return (
        <div className="space-y-4">
            {/* Primary Category Badge */}
            <div>
                <div className="text-sm text-gray-400 mb-2">Detected Category</div>
                <div
                    className="px-4 py-3 rounded-lg border flex items-center gap-3"
                    style={{
                        backgroundColor: bgColor,
                        borderColor: borderColor
                    }}
                >
                    <Brain className="w-5 h-5" style={{ color }} />
                    <div className="flex-1">
                        <div className="font-semibold" style={{ color }}>
                            {displayCategory.name}
                        </div>
                        {displayCategory.source === 'pattern_analysis' && (
                            <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                <Layers className="w-3 h-3" />
                                Category detected via pattern analysis layer
                            </div>
                        )}
                    </div>
                    <div className="text-right">
                        <div className="text-lg font-bold text-white">
                            {displayCategory.confidence}%
                        </div>
                        <div className="text-xs text-gray-400">Confidence</div>
                    </div>
                </div>
            </div>

            {/* Show both ML and Pattern if different */}
            {displayCategory.source === 'pattern_analysis' && (
                <div className="bg-black/20 border border-white/10 rounded-lg p-4">
                    <div className="text-xs text-gray-400 mb-2">Analysis Breakdown</div>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-300">ML Base Prediction:</span>
                            <span className="text-white font-medium">
                                {displayCategory.mlPrediction?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-300">Pattern Category:</span>
                            <span className="text-white font-medium">{displayCategory.name}</span>
                        </div>
                        {enhancedResponse.frontend_subtype?.matchedKeywords && (
                            <div className="mt-2 pt-2 border-t border-white/10">
                                <div className="text-xs text-gray-400 mb-1">Detected Keywords:</div>
                                <div className="flex flex-wrap gap-1">
                                    {enhancedResponse.frontend_subtype.matchedKeywords.map((keyword: string, idx: number) => (
                                        <span
                                            key={idx}
                                            className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-xs text-gray-300"
                                        >
                                            {keyword}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

/**
 * Alternative: Compact Badge Version
 */
export function CompactCategoryBadge({ enhancedResponse }: { enhancedResponse: any }) {
    const displayCategory = getDisplayCategory(enhancedResponse);

    if (!displayCategory) return null;

    return (
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00d9ff]/10 border border-[#00d9ff]/30 rounded-full">
            <Brain className="w-4 h-4 text-[#00d9ff]" />
            <span className="text-sm font-semibold text-[#00d9ff]">
                {displayCategory.name}
            </span>
            {displayCategory.source === 'pattern_analysis' && (
                <Layers className="w-3 h-3 text-[#00d9ff]/60" />
            )}
        </div>
    );
}
