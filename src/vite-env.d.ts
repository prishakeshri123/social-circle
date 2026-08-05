/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 'true' (default) reads data from src/mock via axios-mock-adapter; 'false' calls the real backend. */
  readonly VITE_USE_MOCK: string;
  /** Base URL the axios client sends requests to. Only takes effect when VITE_USE_MOCK is 'false'. */
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
