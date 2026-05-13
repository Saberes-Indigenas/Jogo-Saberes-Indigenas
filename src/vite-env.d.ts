/// <reference types="vite/client" />

declare module "*.svg?raw" {
  const content: string;
  export default content;
}

declare module "*.mp3" {
  const src: string;
  export default src;
}

declare module "*.wav" {
  const src: string;
  export default src;
}

declare module "howler";


