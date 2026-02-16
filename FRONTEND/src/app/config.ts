/**
 * Application Configuration
 * 
 * This file centralizes all configuration values for the frontend.
 * Environment variables are loaded from .env file.
 */

// API Base URLs
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
export const MONGO_SERVICE_URL = import.meta.env.VITE_MONGO_URL || 'http://localhost:5000';

// Firebase Configuration
export const FIREBASE_CONFIG = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// App Configuration
export const APP_CONFIG = {
    name: 'ScamShield',
    version: '2.0.0',
    environment: import.meta.env.MODE, // 'development' | 'production'
};

// API Endpoints
export const API_ENDPOINTS = {
    // Message Analysis
    analyzeMessage: `${API_BASE_URL}/api/analyze/`,

    // Link Validation
    checkLink: `${API_BASE_URL}/api/link/check/`,
    linkHistory: `${API_BASE_URL}/api/link/history/`,

    // User Management
    userProfile: `${API_BASE_URL}/api/user/profile/`,
    userStats: `${API_BASE_URL}/api/user/stats/`,
    updateProfile: `${API_BASE_URL}/api/user/update/`,
    deleteAccount: `${API_BASE_URL}/api/user/delete/`,
    changePassword: `${API_BASE_URL}/api/user/change-password/`,

    // Message History
    messageHistory: `${API_BASE_URL}/api/message/history/`,

    // Quiz
    quizQuestions: `${API_BASE_URL}/api/quiz/questions/`,
    quizSubmit: `${API_BASE_URL}/api/quiz/submit/`,
    quizHistory: `${API_BASE_URL}/api/quiz/history/`,

    // Reports
    submitReport: `${API_BASE_URL}/api/report/submit/`,
    myReports: `${API_BASE_URL}/api/report/my-reports/`,

    // Stats
    globalStats: `${API_BASE_URL}/api/stats/`,

    // MongoDB Service
    saveUrl: `${MONGO_SERVICE_URL}/api/urls`,
    getUrls: `${MONGO_SERVICE_URL}/api/urls`,
};

// Development mode check
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;

// Debug logging helper
export const debugLog = (...args: any[]) => {
    if (isDevelopment) {
        console.log('[ScamShield Debug]', ...args);
    }
};
