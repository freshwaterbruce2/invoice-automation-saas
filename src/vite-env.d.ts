/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STRIPE_PUBLIC_KEY: string
  readonly VITE_API_URL: string
  readonly VITE_EMAIL_SERVICE_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}