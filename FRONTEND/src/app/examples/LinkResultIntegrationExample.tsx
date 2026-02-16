/**
 * Example: How to integrate frontend subtype detection into existing LinkResult.tsx
 * 
 * This shows the minimal changes needed to add pattern analysis
 */

import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { enhanceWithSubtypeDetection, getDisplayCategory } from '@/app/utils/scamSubtypeDetector';
import { EnhancedCategoryDisplay } from '@/app/components/EnhancedCategoryDisplay';
import type { LinkCheckResult } from '@/app/api/link';

export function LinkResult() {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as { url?: string; result?: LinkCheckResult } | null;

    const url = state?.url || '';
    const backendResult = state?.result;

    // 🆕 Enhance backend result with frontend pattern analysis
    const [enhancedResult, setEnhancedResult] = useState<any>(null);

    useEffect(() => {
        if (url && backendResult) {
            const enhanced = enhanceWithSubtypeDetection(url, backendResult);
            setEnhancedResult(enhanced);
            console.log('Enhanced Result:', enhanced);
        }
    }, [url, backendResult]);

    if (!url || !enhancedResult) return null;

    return (
        <div className="min-h-screen pt-20 px-4 pb-8">
            <div className="max-w-6xl mx-auto">
                {/* Your existing URL display */}
                <div className="mb-6 p-4 rounded-xl bg-[#1a1f3a]/50 border border-[#00d9ff]/20">
                    <div className="text-white font-mono">{url}</div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-8">
                        {/* Your existing Risk Score card */}
                        <div className="p-8 rounded-xl bg-[#1a1f3a]/50 border border-[#00d9ff]/20">
                            <h2 className="text-2xl font-bold text-white mb-4">Risk Score</h2>
                            <div className="text-5xl font-bold text-white">
                                {enhancedResult.risk_score}
                            </div>
                            <div className="text-xs text-gray-400 mt-2">
                                Hybrid ML + Rule Engine Fusion
                            </div>
                        </div>

                        {/* 🆕 Enhanced AI Classification with Pattern Analysis */}
                        <div className="p-8 rounded-xl bg-[#1a1f3a]/50 border border-[#00d9ff]/20">
                            <h2 className="text-2xl font-bold text-white mb-6">AI Classification</h2>

                            {/* Use the new enhanced category display component */}
                            <EnhancedCategoryDisplay
                                enhancedResponse={enhancedResult}
                                riskLevel={enhancedResult.risk_level}
                            />
                        </div>

                        {/* Your existing Technical Analysis */}
                        <div className="p-8 rounded-xl bg-[#1a1f3a]/50 border border-[#00d9ff]/20">
                            <h2 className="text-2xl font-bold text-white mb-6">Technical Analysis</h2>
                            {/* ... existing content ... */}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                        {/* Your existing Red Flags section */}
                        {enhancedResult.red_flags?.length > 0 && (
                            <div className="p-8 rounded-xl bg-[#1a1f3a]/50 border border-[#00d9ff]/20">
                                <h2 className="text-2xl font-bold text-white mb-6">Red Flags Detected</h2>
                                {/* ... existing red flags display ... */}
                            </div>
                        )}

                        {/* Your existing Analysis Summary */}
                        <div className="p-6 rounded-xl bg-[#1a1f3a]/50 border border-[#00d9ff]/20">
                            <h3 className="text-lg font-bold text-white mb-4">Analysis Summary</h3>
                            <p className="text-gray-200">{enhancedResult.analysis}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Alternative: Minimal Integration (Just add the badge)
 */
export function MinimalIntegration() {
    const [result, setResult] = useState<any>(null);
    const url = "http://instant-loan-approval.tk";

    useEffect(() => {
        async function checkLink() {
            const response = await fetch('/api/link/check/', {
                method: 'POST',
                body: JSON.stringify({ url })
            });
            const backendData = await response.json();

            // 🆕 Just add this one line
            const enhanced = enhanceWithSubtypeDetection(url, backendData);
            setResult(enhanced);
        }
        checkLink();
    }, []);

    return (
        <div>
            {/* Your existing UI */}
            <div>Risk: {result?.risk_score}</div>

            {/* 🆕 Add enhanced category display */}
            {result?.frontend_subtype && (
                <div className="mt-4">
                    <div className="text-sm text-gray-400 mb-1">Detected Category</div>
                    <div className="px-3 py-2 bg-[#00d9ff]/10 border border-[#00d9ff]/30 rounded-lg">
                        <div className="font-semibold text-[#00d9ff]">
                            {result.frontend_subtype.displayName}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                            Category detected via pattern analysis layer
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
