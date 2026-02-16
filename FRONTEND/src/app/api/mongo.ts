const MONGO_API_URL = 'http://localhost:5000/api';

export async function saveUrlToMongo(url: string, riskLevel: string, user: string) {
    try {
        await fetch(`${MONGO_API_URL}/urls`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url, riskLevel, user })
        });
    } catch (err) {
        console.error('Failed to save URL to Mongo:', err);
    }
}

export async function saveMessageToMongo(message: string, analysis: any, user: string) {
    try {
        await fetch(`${MONGO_API_URL}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, analysis, user })
        });
    } catch (err) {
        console.error('Failed to save message to Mongo:', err);
    }
}

export async function saveReportToMongo(reportType: string, description: string, evidence: string, user: string) {
    try {
        await fetch(`${MONGO_API_URL}/reports`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reportType, description, evidence, user })
        });
    } catch (err) {
        console.error('Failed to save report to Mongo:', err);
    }
}
