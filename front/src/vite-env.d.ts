/// <reference types="vite/client" />

// injected by `define` in vite.config.ts
declare const process: { env: { API_BASE_URL: string; FRONT_BASE_URL: string } };
