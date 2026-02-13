import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, CheckCircle2, XCircle, AlertTriangle, Globe, Lock, Server, Check, Brain, Sparkles, ChevronDown, ChevronUp, Cpu, Layers } from 'lucide-react';
import { Progress } from '@/app/components/ui/progress';
import { useState, useEffect } from 'react';
import type { LinkCheckResult } from '@/app/api/link';
import { enhanceWithSubtypeDetection, getDisplayCategory } from '@/app/utils/scamSubtypeDetector';

export function LinkResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { url?: string; result?: LinkCheckResult } | null;
  const url = state?.url || '';
  const apiResult = state?.result;

  // 🆕 Enhance backend result with frontend subtype detection
  const [enhancedResult, setEnhancedResult] = useState<any>(null);

  useEffect(() => {
    if (url && apiResult) {
      const enhanced = enhanceWithSubtypeDetection(url, apiResult);
      setEnhancedResult(enhanced);
    }
  }, [url, apiResult]);

  const targetScore = enhancedResult ? enhancedResult.risk_score : 0;
  const targetMLConfidence = enhancedResult?.ml_confidence || 0;
  const [displayScore, setDisplayScore] = useState(0);
  const [displayMLConfidence, setDisplayMLConfidence] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  useEffect(() => {
    let step = 0;
    const steps = 60;
    const duration = 1500;
    const interval = duration / steps;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setDisplayScore(Math.floor(targetScore * progress));
      setDisplayMLConfidence(Math.floor(targetMLConfidence * progress));
      if (step >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, [targetScore, targetMLConfidence]);

  useEffect(() => {
    if (!url) navigate('/link-checker');
  }, [url, navigate]);

  if (!url || !enhancedResult) return null;

  // Get dynamic red flags from backend
  const redFlags = enhancedResult?.red_flags || [];
  const hasRedFlags = redFlags.length > 0;

  const domainInfo = {
    domain: enhancedResult?.domain || null,
    ssl: enhancedResult?.ssl_valid ?? false,
    isSafe: enhancedResult?.is_safe ?? false,
  };

  const getStatus = (riskLevel: string) => {
    if (riskLevel === 'SAFE')
      return { label: 'Safe', color: '#00ff41', icon: CheckCircle2, bg: 'bg-[#00ff41]/10', border: 'border-[#00ff41]/50', progressBg: 'bg-[#00ff41]' };
    if (riskLevel === 'SUSPICIOUS')
      return { label: 'Suspicious', color: '#ffd93d', icon: AlertTriangle, bg: 'bg-[#ffd93d]/10', border: 'border-[#ffd93d]/50', progressBg: 'bg-[#ffd93d]' };
    return { label: 'High Risk', color: '#ff3b3b', icon: XCircle, bg: 'bg-[#ff3b3b]/10', border: 'border-[#ff3b3b]/50', progressBg: 'bg-[#ff3b3b]' };
  };

  const status = getStatus(enhancedResult?.risk_level || 'SAFE');
  const StatusIcon = status.icon;
  const analysisText = enhancedResult?.analysis || 'Analysis unavailable.';

  // 🆕 Get display category (frontend subtype or ML prediction)
  const displayCategory = getDisplayCategory(enhancedResult);

  // Format ML prediction for display
  const formatScamType = (prediction: string | undefined) => {
    if (!prediction || prediction === 'legitimate') return null;
    return prediction.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const mlPrediction = enhancedResult?.ml_prediction || 'unknown';
  const scamType = displayCategory?.name || formatScamType(mlPrediction);
  const isLegitimate = mlPrediction === 'legitimate';
  const mlPatterns = enhancedResult?.ml_patterns || [];

  return (
    <div className="min-h-screen pt-20 sm:pt-24 px-4 sm:px-6 pb-8 sm:pb-12">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* URL Display */}
          <div className="mb-6 sm:mb-8 p-4 sm:p-6 rounded-xl bg-[#1a1f3a]/50 border border-[#00d9ff]/20">
            <div className="flex items-center gap-4">
              <Globe className="w-8 h-8 text-[#00d9ff]" />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-gray-400 mb-1">Scanned URL</div>
                <div className="text-white font-mono text-lg truncate">{url}</div>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="px-4 py-2 bg-[#00d9ff]/10 text-[#00d9ff] rounded-lg hover:bg-[#00d9ff]/20 transition-all text-sm flex items-center gap-2 shrink-0 cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4" /> : null}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Risk Score */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="p-8 rounded-xl bg-[#1a1f3a]/50 border border-[#00d9ff]/20 shadow-[0_0_30px_rgba(0,217,255,0.1)]"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Risk Score</h2>
                  {scamType && (
                    <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${status.bg} ${status.border} border`}>
                      <Sparkles className="w-3 h-3" style={{ color: status.color }} />
                      <span style={{ color: status.color }}>{scamType}</span>
                    </div>
                  )}
                </div>
                <div className="mb-4">
                  <div className="flex items-end gap-2 mb-2">
                    <div className="text-5xl font-bold text-white">{displayScore}</div>
                    <div className="text-gray-400 mb-2">/100</div>
                  </div>
                  <Progress
                    value={displayScore}
                    className="h-3"
                    style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                  />
                  <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                    <Layers className="w-3 h-3" />
                    Hybrid ML + Rule Engine Fusion
                  </p>
                </div>
              </motion.div>

              {/* AI Classification Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="p-8 rounded-xl bg-[#1a1f3a]/50 border border-[#00d9ff]/20"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Brain className="w-6 h-6 text-[#00d9ff]" />
                  <h2 className="text-2xl font-bold text-white">AI Classification</h2>
                </div>

                <div className="space-y-4">
                  {/* Predicted Category */}
                  <div>
                    <div className="text-sm text-gray-400 mb-2">Predicted Category</div>
                    {isLegitimate ? (
                      <div className="px-4 py-3 rounded-lg bg-[#00ff41]/10 border border-[#00ff41]/30 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#00ff41]" />
                        <span className="text-[#00ff41] font-semibold">Legitimate</span>
                      </div>
                    ) : (
                      <div>
                        <div className={`px-4 py-3 rounded-lg ${status.bg} border ${status.border} flex items-center gap-2`}>
                          <AlertTriangle className="w-5 h-5" style={{ color: status.color }} />
                          <div className="flex-1">
                            <span className="font-semibold" style={{ color: status.color }}>
                              {scamType || 'Unknown Threat'}
                            </span>
                            {/* 🆕 Show pattern analysis indicator */}
                            {enhancedResult.frontend_subtype && displayCategory?.source === 'pattern_analysis' && (
                              <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                <Layers className="w-3 h-3" />
                                Category detected via pattern analysis layer
                              </div>
                            )}
                          </div>
                        </div>
                        {/* Show ML base prediction if different from pattern category */}
                        {enhancedResult.frontend_subtype && displayCategory?.source === 'pattern_analysis' && (
                          <div className="mt-2 text-xs text-gray-400">
                            ML Base: <span className="text-gray-300">{formatScamType(mlPrediction)}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* ML Confidence */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">AI Confidence</span>
                      <span className="text-lg font-bold text-white">{displayMLConfidence}%</span>
                    </div>
                    <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${displayMLConfidence}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className={`h-full ${status.progressBg} rounded-full`}
                        style={{
                          boxShadow: `0 0 10px ${status.color}40`
                        }}
                      />
                    </div>
                  </div>

                  {/* Top Patterns (only if not legitimate) */}
                  {!isLegitimate && mlPatterns.length > 0 && (
                    <div>
                      <div className="text-sm text-gray-400 mb-2">Detected Patterns</div>
                      <ul className="space-y-1">
                        {mlPatterns.slice(0, 5).map((pattern: string, idx: number) => (
                          <li key={idx} className="text-sm text-gray-300 flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-[#00d9ff]"></span>
                            <code className="bg-black/30 px-2 py-0.5 rounded text-xs font-mono">{pattern}</code>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Risk Analysis */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="p-8 rounded-xl bg-[#1a1f3a]/50 border border-[#00d9ff]/20"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Technical Analysis</h2>
                <div className="space-y-4">
                  {domainInfo.domain && (
                    <div className="flex items-center justify-between py-3 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <Server className="w-5 h-5 text-[#00d9ff]" />
                        <span className="text-gray-300">Domain</span>
                      </div>
                      <span className="text-white font-mono text-sm truncate max-w-[200px]">{domainInfo.domain}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between py-3 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5 text-[#00d9ff]" />
                      <span className="text-gray-300">SSL Certificate</span>
                    </div>
                    {domainInfo.ssl ? (
                      <span className="flex items-center gap-1.5 text-[#00ff41]">
                        <CheckCircle2 className="w-4 h-4" />
                        Valid
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-[#ff3b3b]">
                        <XCircle className="w-4 h-4" />
                        Missing
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-[#00d9ff]" />
                      <span className="text-gray-300">Safety Status</span>
                    </div>
                    {domainInfo.isSafe ? (
                      <span className="flex items-center gap-1.5 text-[#00ff41]">
                        <CheckCircle2 className="w-4 h-4" />
                        Safe
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-[#ff3b3b]">
                        <XCircle className="w-4 h-4" />
                        Risky
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Red Flags Section - Only show if there are red flags */}
              {hasRedFlags && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="p-8 rounded-xl bg-[#1a1f3a]/50 border border-[#00d9ff]/20"
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Red Flags Detected</h2>
                  <div className="flex flex-wrap gap-2">
                    {redFlags.map((flag: string, index: number) => (
                      <div
                        key={index}
                        className="px-3 py-2 rounded-lg bg-[#ff3b3b]/10 border border-[#ff3b3b]/30 flex items-center gap-2 group hover:bg-[#ff3b3b]/20 transition-all"
                      >
                        <XCircle className="w-4 h-4 text-[#ff3b3b] flex-shrink-0" />
                        <span className="text-sm text-[#ff3b3b] font-medium">{flag}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Collapsible Explanation Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="p-6 rounded-xl bg-[#1a1f3a]/50 border border-[#00d9ff]/20"
              >
                <button
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="w-full flex items-center justify-between text-left group"
                >
                  <div className="flex items-center gap-3">
                    <Cpu className="w-5 h-5 text-[#00d9ff]" />
                    <h3 className="text-lg font-bold text-white group-hover:text-[#00d9ff] transition-colors">
                      Why was this classified this way?
                    </h3>
                  </div>
                  {showExplanation ? (
                    <ChevronUp className="w-5 h-5 text-[#00d9ff]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#00d9ff]" />
                  )}
                </button>

                <AnimatePresence>
                  {showExplanation && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 space-y-4 pt-4 border-t border-white/10">
                        {/* ML Prediction */}
                        <div>
                          <div className="text-sm font-semibold text-[#00d9ff] mb-2">Machine Learning Analysis</div>
                          <div className="bg-black/30 p-3 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-gray-400">Prediction:</span>
                              <span className={`text-sm font-semibold ${isLegitimate ? 'text-[#00ff41]' : 'text-[#ff3b3b]'}`}>
                                {formatScamType(mlPrediction) || 'Legitimate'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-400">Confidence:</span>
                              <span className="text-sm font-semibold text-white">{displayMLConfidence}%</span>
                            </div>
                          </div>
                        </div>

                        {/* Detected Patterns */}
                        {mlPatterns.length > 0 && (
                          <div>
                            <div className="text-sm font-semibold text-[#00d9ff] mb-2">Suspicious Patterns</div>
                            <div className="bg-black/30 p-3 rounded-lg">
                              <ul className="space-y-1">
                                {mlPatterns.map((pattern: string, idx: number) => (
                                  <li key={idx} className="text-xs text-gray-300 font-mono">
                                    • {pattern}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}

                        {/* Rule-based Triggers */}
                        {hasRedFlags && (
                          <div>
                            <div className="text-sm font-semibold text-[#00d9ff] mb-2">Rule-Based Triggers</div>
                            <div className="bg-black/30 p-3 rounded-lg">
                              <ul className="space-y-1">
                                {redFlags.map((flag: string, idx: number) => (
                                  <li key={idx} className="text-xs text-gray-300">
                                    • {flag}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}

                        {/* Hybrid Fusion Info */}
                        <div>
                          <div className="text-sm font-semibold text-[#00d9ff] mb-2">Hybrid Decision Logic</div>
                          <div className="bg-black/30 p-3 rounded-lg text-xs text-gray-300 space-y-1">
                            <p>• ML Model: Logistic Regression with TF-IDF + Structural Features</p>
                            <p>• Scoring: 60% Rule-Based + 40% ML Confidence</p>
                            <p>• Features: URL patterns, domain entropy, SSL validation</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* AI Analysis Box */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className={`p-6 rounded-xl border-2 ${status.bg} ${status.border}`}
                style={{
                  background: `linear-gradient(135deg, ${status.color}08 0%, ${status.color}15 100%)`
                }}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className={`p-3 rounded-lg ${status.bg} border ${status.border}`}>
                    <Brain className="w-6 h-6" style={{ color: status.color }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1" style={{ color: status.color }}>
                      Analysis Summary
                    </h3>
                    <p className="text-sm text-gray-400">Comprehensive threat assessment</p>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-black/20 border border-white/10">
                  <p className="text-gray-200 leading-relaxed">{analysisText}</p>
                </div>
              </motion.div>

              {/* Recommendation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className={`p-8 rounded-xl border-2 ${status.bg} ${status.border}`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-4 rounded-full ${status.bg}`}>
                    <StatusIcon className="w-8 h-8" style={{ color: status.color }} />
                  </div>
                  <h2 className="text-2xl font-bold" style={{ color: status.color }}>
                    {status.label}
                  </h2>
                </div>
                <div className="space-y-2 text-gray-300">
                  <p className="font-semibold">Recommendation:</p>
                  {displayScore >= 40 && (
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Do not enter any personal information</li>
                      <li>Do not download any files</li>
                      <li>Close this page immediately</li>
                      <li>Report this link to authorities</li>
                    </ul>
                  )}
                  {displayScore < 40 && (
                    <p className="text-sm">This link appears safe, but always verify the sender before clicking unknown links.</p>
                  )}
                </div>
              </motion.div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => navigate('/link-checker')}
                  className="w-full px-6 py-3 bg-gradient-to-r from-[#00d9ff] to-[#00a3cc] text-[#0a0e27] rounded-lg hover:shadow-[0_0_20px_rgba(0,217,255,0.5)] transition-all duration-300 hover:-translate-y-0.5 font-semibold"
                >
                  Check Another Link
                </button>
                <button
                  onClick={() => navigate('/report')}
                  className="w-full px-6 py-3 bg-[#ff3b3b]/20 text-[#ff3b3b] border border-[#ff3b3b]/30 rounded-lg hover:bg-[#ff3b3b]/30 transition-all duration-300 hover:-translate-y-0.5 font-semibold"
                >
                  Report False Positive
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
