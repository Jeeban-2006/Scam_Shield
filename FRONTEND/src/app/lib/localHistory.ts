// Temporary local storage for link scan history
// This provides immediate feedback while backend authentication is being debugged

export interface LocalLinkScan {
    id: string;
    url: string;
    risk_level: string;
    risk_score: number;
    timestamp: string;
    result: any;
}

const STORAGE_KEY = 'scamshield_link_history';
const MAX_HISTORY = 50;

export function saveLocalLinkScan(url: string, result: any): void {
    try {
        const history = getLocalLinkHistory();
        const newScan: LocalLinkScan = {
            id: Date.now().toString(),
            url,
            risk_level: result.risk_level || 'Unknown',
            risk_score: result.risk_score || 0,
            timestamp: new Date().toISOString(),
            result
        };

        history.unshift(newScan);

        // Keep only the most recent scans
        const trimmed = history.slice(0, MAX_HISTORY);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
        console.log('✅ Saved link scan to local storage:', newScan);
    } catch (e) {
        console.error('Failed to save link scan to local storage:', e);
    }
}

export function getLocalLinkHistory(): LocalLinkScan[] {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) return [];
        return JSON.parse(data);
    } catch (e) {
        console.error('Failed to load link history from local storage:', e);
        return [];
    }
}

export function clearLocalLinkHistory(): void {
    try {
        localStorage.removeItem(STORAGE_KEY);
        console.log('✅ Cleared local link history');
    } catch (e) {
        console.error('Failed to clear link history:', e);
    }
}

export function getLocalLinkHistoryCount(): number {
    return getLocalLinkHistory().length;
}
