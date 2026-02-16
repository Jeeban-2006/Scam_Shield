/**
 * Frontend Scam Subtype Detector
 * 
 * Enhances ML predictions with keyword-based pattern analysis
 * Runs client-side only, does not affect backend logic or risk scores
 */

// Type definitions
interface ScamCategory {
    keywords: string[];
    displayName: string;
}

interface ScamCategories {
    loan_scam: ScamCategory;
    investment_scam: ScamCategory;
    job_scam: ScamCategory;
    giveaway_scam: ScamCategory;
}

interface DetectedSubtype {
    category: string;
    displayName: string;
    matchedKeywords: string[];
    matchCount: number;
}

interface FrontendSubtype extends DetectedSubtype {
    source: string;
}

interface BackendResponse {
    ml_prediction?: string;
    ml_confidence?: number;
    [key: string]: any;
}

interface EnhancedResponse extends BackendResponse {
    frontend_subtype?: FrontendSubtype;
}

interface DisplayCategory {
    name: string;
    source: string;
    confidence?: number;
    mlPrediction?: string;
}

// Scam category definitions with keywords
const SCAM_CATEGORIES: ScamCategories = {
    loan_scam: {
        keywords: ['loan', 'emi', 'interest', 'approval', 'processing-fee', 'processing fee', 'instant-loan', 'credit-score', 'collateral'],
        displayName: 'Loan Scam'
    },
    investment_scam: {
        keywords: ['crypto', 'bitcoin', 'profit', 'return', 'investment', 'trading', 'forex', 'stock', 'roi', 'ethereum', 'nft'],
        displayName: 'Investment Scam'
    },
    job_scam: {
        keywords: ['job', 'career', 'hiring', 'recruitment', 'offer-letter', 'offer letter', 'work-from-home', 'remote-job', 'vacancy', 'apply-now'],
        displayName: 'Job Scam'
    },
    giveaway_scam: {
        keywords: ['win', 'prize', 'free', 'reward', 'claim', 'winner', 'congratulations', 'lucky', 'gift', 'giveaway'],
        displayName: 'Giveaway Scam'
    }
};

/**
 * Detects scam subtype based on URL keywords
 */
export function detectScamSubtype(url: string): DetectedSubtype | null {
    if (!url || typeof url !== 'string') {
        return null;
    }

    const urlLower = url.toLowerCase();
    const matches: Record<string, { count: number; keywords: string[]; displayName: string }> = {};

    // Count keyword matches for each category
    for (const [categoryKey, categoryData] of Object.entries(SCAM_CATEGORIES)) {
        let matchCount = 0;
        const matchedKeywords: string[] = [];

        for (const keyword of categoryData.keywords) {
            if (urlLower.includes(keyword)) {
                matchCount++;
                matchedKeywords.push(keyword);
            }
        }

        if (matchCount > 0) {
            matches[categoryKey] = {
                count: matchCount,
                keywords: matchedKeywords,
                displayName: categoryData.displayName
            };
        }
    }

    // Return category with most matches, or null if no matches
    if (Object.keys(matches).length === 0) {
        return null;
    }

    // Find category with highest match count
    const bestMatch = Object.entries(matches).reduce((best, [key, data]) => {
        return data.count > best.count ? { key, ...data } : best;
    }, { count: 0, key: '', keywords: [] as string[], displayName: '' });

    return bestMatch.count > 0 ? {
        category: bestMatch.key,
        displayName: bestMatch.displayName,
        matchedKeywords: bestMatch.keywords,
        matchCount: bestMatch.count
    } : null;
}

/**
 * Enhances backend response with frontend pattern analysis
 */
export function enhanceWithSubtypeDetection(url: string, backendResponse: BackendResponse): EnhancedResponse {
    const enhanced: EnhancedResponse = { ...backendResponse };

    // Only run subtype detection if ML prediction is NOT legitimate
    if (backendResponse.ml_prediction && backendResponse.ml_prediction !== 'legitimate') {
        const detectedSubtype = detectScamSubtype(url);

        if (detectedSubtype) {
            enhanced.frontend_subtype = {
                category: detectedSubtype.category,
                displayName: detectedSubtype.displayName,
                matchedKeywords: detectedSubtype.matchedKeywords,
                matchCount: detectedSubtype.matchCount,
                source: 'pattern_analysis'
            };
        }
    }

    return enhanced;
}

/**
 * Gets the display category (frontend subtype or ML prediction)
 */
export function getDisplayCategory(enhancedResponse: EnhancedResponse): DisplayCategory | null {
    // If frontend detected a subtype, use it
    if (enhancedResponse.frontend_subtype) {
        return {
            name: enhancedResponse.frontend_subtype.displayName,
            source: 'pattern_analysis',
            confidence: enhancedResponse.ml_confidence,
            mlPrediction: enhancedResponse.ml_prediction
        };
    }

    // Otherwise, use ML prediction
    if (enhancedResponse.ml_prediction && enhancedResponse.ml_prediction !== 'legitimate') {
        return {
            name: formatMLPrediction(enhancedResponse.ml_prediction),
            source: 'ml_model',
            confidence: enhancedResponse.ml_confidence,
            mlPrediction: enhancedResponse.ml_prediction
        };
    }

    return null;
}

/**
 * Formats ML prediction for display
 */
function formatMLPrediction(prediction: string): string {
    if (!prediction) return 'Unknown';
    return prediction
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Example usage with fetch API
 */
export async function checkLinkWithEnhancement(url: string): Promise<EnhancedResponse> {
    try {
        // Call backend API
        const response = await fetch('http://localhost:7860/api/link/check/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url })
        });

        const backendData = await response.json();

        // Enhance with frontend subtype detection
        const enhancedData = enhanceWithSubtypeDetection(url, backendData);

        return enhancedData;
    } catch (error) {
        console.error('Error checking link:', error);
        throw error;
    }
}
