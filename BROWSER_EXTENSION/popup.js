document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');
    const msgInput = document.getElementById('message-input');
    const linkInput = document.getElementById('link-input');
    const analyzeBtn = document.getElementById('analyze-msg-btn');
    const checkLinkBtn = document.getElementById('check-link-btn');
    const resultArea = document.getElementById('result-area');
    const loading = document.getElementById('loading');
    const resultContent = document.getElementById('content');
    const errorDiv = document.getElementById('error');
    const refreshBtn = document.getElementById('refresh-btn');

    // Tab Switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(`${tab.dataset.tab}-tab`).classList.add('active');
            clearResults();
        });
    });

    refreshBtn.addEventListener('click', () => {
        msgInput.value = '';
        linkInput.value = '';
        clearResults();
    });

    analyzeBtn.addEventListener('click', () => analyze('message'));
    checkLinkBtn.addEventListener('click', () => analyze('link'));

    function clearResults() {
        resultArea.classList.add('hidden');
        loading.classList.add('hidden');
        resultContent.classList.add('hidden');
        errorDiv.classList.add('hidden');
        errorDiv.innerText = '';
    }

    async function analyze(type) {
        let payload = {};
        let endpoint = '';

        if (type === 'message') {
            const text = msgInput.value.trim();
            if (!text) return showError('Please enter a message to analyze.');
            payload = { message: text };
            endpoint = 'http://localhost:8000/api/analyze/';
        } else {
            const url = linkInput.value.trim();
            if (!url) return showError('Please enter a URL to check.');
            // Basic URL validation
            if (!url.startsWith('http')) return showError('URL must start with http:// or https://');
            payload = { url: url };
            endpoint = 'http://localhost:8000/api/link/check/';
        }

        clearResults();
        resultArea.classList.remove('hidden');
        loading.classList.remove('hidden');

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Analysis failed. Is the backend running?');
            }

            const data = await response.json();
            displayResults(data, type);

        } catch (err) {
            console.error(err);
            loading.classList.add('hidden');
            showError(err.message || 'Network error. Ensure backend is running at localhost:8000.');
        }
    }

    function showError(msg) {
        resultArea.classList.remove('hidden');
        loading.classList.add('hidden');
        errorDiv.innerText = msg;
        errorDiv.classList.remove('hidden');
    }

    function displayResults(data, type) {
        loading.classList.add('hidden');
        resultContent.classList.remove('hidden');

        const badge = document.getElementById('risk-badge');
        const scoreBar = document.getElementById('score-bar');
        const scoreText = document.getElementById('risk-score');
        const reasonsList = document.getElementById('reasons-list');
        const tipsList = document.getElementById('tips-list');

        // Normalize response data structure
        let riskLevel = (data.risk_level || 'UNKNOWN').toUpperCase();
        let score = data.scam_score || data.risk_score || 0;
        let reasons = data.red_flags || data.detailed_reasons || [];

        // Extract plain strings if reasons are objects
        if (reasons.length && typeof reasons[0] === 'object') {
            reasons = reasons.map(r => r.description || r.message || JSON.stringify(r));
        }

        // Determine badge style and ensure all states are visible
        badge.className = 'risk-badge';
        let barColor = '#00ff41';

        // Handle all possible risk level formats
        const isHighRisk = riskLevel.includes('DANGEROUS') || riskLevel.includes('HIGH') || riskLevel.includes('SCAM');
        const isSuspicious = riskLevel.includes('SUSPICIOUS') || riskLevel.includes('LIKELY');
        const isSafe = riskLevel.includes('SAFE');

        if (isHighRisk) {
            badge.classList.add('risk-danger');
            badge.innerText = '✕ HIGH RISK SCAM';
            badge.style.display = 'block';
            barColor = '#ff3b3b';
            riskLevel = 'DANGEROUS'; // Normalize for tips
        } else if (isSuspicious) {
            badge.classList.add('risk-suspicious');
            badge.innerText = '⚠ SUSPICIOUS';
            badge.style.display = 'block';
            barColor = '#ffd93d';
            riskLevel = 'SUSPICIOUS'; // Normalize for tips
        } else if (isSafe) {
            badge.classList.add('risk-safe');
            badge.innerText = '✓ SAFE';
            badge.style.display = 'block';
            barColor = '#00ff41';
            riskLevel = 'SAFE'; // Normalize for tips
        } else {
            badge.classList.add('risk-suspicious');
            badge.innerText = '? UNKNOWN';
            badge.style.display = 'block';
            barColor = '#888';
        }

        // Animate score bar
        scoreBar.style.width = '0%';
        scoreBar.style.backgroundColor = barColor;
        scoreBar.style.boxShadow = `0 0 10px ${barColor}`;
        setTimeout(() => {
            scoreBar.style.transition = 'width 0.8s ease-out';
            scoreBar.style.width = `${score}%`;
        }, 100);

        scoreText.innerText = `Risk Score: ${score}/100`;
        scoreText.style.display = 'block';

        // Populate reasons list
        reasonsList.innerHTML = '';
        if (Array.isArray(reasons) && reasons.length > 0) {
            reasons.forEach(r => {
                const li = document.createElement('li');
                li.innerText = typeof r === 'string' ? r : String(r);
                li.style.opacity = '0';
                reasonsList.appendChild(li);
                setTimeout(() => {
                    li.style.transition = 'opacity 0.3s ease-in';
                    li.style.opacity = '1';
                }, 50);
            });
        } else {
            const li = document.createElement('li');
            li.innerText = riskLevel === 'SAFE'
                ? 'No threats detected. This appears to be legitimate.'
                : 'No specific flags detected.';
            li.style.color = riskLevel === 'SAFE' ? '#00ff41' : '#ccc';
            reasonsList.appendChild(li);
        }

        // Populate tips list with defaults if not provided
        let tips = data.safety_tips || data.tips || [];

        // Add default tips based on risk level if none provided
        if (!Array.isArray(tips) || tips.length === 0) {
            if (riskLevel === 'DANGEROUS' || riskLevel === 'HIGH_RISK') {
                tips = [
                    '✅ Do NOT click this link or enter any information',
                    '✅ Do NOT share passwords, OTPs, or banking details',
                    '✅ Report this link to authorities',
                    '✅ Delete the message containing this link'
                ];
            } else if (riskLevel === 'SUSPICIOUS' || riskLevel === 'LIKELY_SCAM') {
                tips = [
                    '✅ Verify the sender through official channels',
                    '✅ Check the URL carefully for misspellings',
                    '✅ Do not enter sensitive information',
                    '✅ When in doubt, contact the organization directly'
                ];
            } else if (riskLevel === 'SAFE') {
                tips = [
                    '✅ Always verify before sharing sensitive information',
                    '✅ Keep your software and antivirus updated',
                    '✅ Use strong, unique passwords',
                    '✅ Enable two-factor authentication when available'
                ];
            } else {
                tips = [
                    '✅ Exercise caution with unknown links',
                    '✅ Verify sources before clicking',
                    '✅ Never share passwords or OTPs',
                    '✅ Report suspicious activity'
                ];
            }
        }

        if (tipsList) {
            tipsList.innerHTML = '';
            if (Array.isArray(tips) && tips.length > 0) {
                tips.forEach(t => {
                    const li = document.createElement('li');
                    li.innerText = typeof t === 'string' ? t : String(t);
                    li.style.opacity = '0';
                    tipsList.appendChild(li);
                    setTimeout(() => {
                        li.style.transition = 'opacity 0.3s ease-in';
                        li.style.opacity = '1';
                    }, 100);
                });
            }
        }

        // Add fade-in animation to result content
        resultContent.style.opacity = '0';
        setTimeout(() => {
            resultContent.style.transition = 'opacity 0.4s ease-in';
            resultContent.style.opacity = '1';
        }, 50);
    }
});
