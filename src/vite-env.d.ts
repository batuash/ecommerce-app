/// <reference types="vite/client" />

// Extend the ImportMetaEnv interface to include our custom environment variables
interface ImportMetaEnv {
  // API Configuration
  readonly API_BASE_URL: string
  
  // App Configuration
  readonly APP_ENVIRONMENT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}