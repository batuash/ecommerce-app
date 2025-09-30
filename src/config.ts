// Environment configuration
// This file centralizes all environment variables and provides type safety

interface Config {
  // API Configuration
  apiBaseUrl: string;
  // App Configuration
  appEnvironment: string;
}

// Helper function to get environment variable with fallback
const getEnvVar = (key: string, fallback: string = ''): string => {
  return import.meta.env[key] || fallback;
};

// Helper function to get boolean environment variable

const getBooleanEnvVar = (key: string, fallback: boolean = false): boolean => {
  const value = import.meta.env[key];
  if (value === undefined) return fallback;
  return value.toLowerCase() === 'true';
};

// Helper function to get number environment variable
const getNumberEnvVar = (key: string, fallback: number = 0): number => {
  const value = import.meta.env[key];
  if (value === undefined) return fallback;
  const parsed = Number(value);
  return isNaN(parsed) ? fallback : parsed;
};

// Configuration object with all environment variables
export const config: Config = {
  // API Configuration
  apiBaseUrl: getEnvVar('VITE_API_BASE_URL', 'http://localhost:3000'),
  // App Configuration
  appEnvironment: getEnvVar('VITE_APP_ENVIRONMENT', 'development'),
};

// Utility functions for common operations
export const isDevelopment = config.appEnvironment === 'development';
export const isProduction = config.appEnvironment === 'production';

export default config;
