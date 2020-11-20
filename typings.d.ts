declare module '*.png';
declare module '*.svg' {
  const content: any;
  export default content;
}
declare module '*.less';

/**
 * ResizeObserver 兼容性需要注意
 */
declare class ResizeObserver {
  constructor(callback: (entries) => void);
  observe(node: Node): void;
  disconnect(): void;
  unobserve(): void;
}
