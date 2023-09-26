declare global {
  interface Window {
    api: {
      send: (channel: string, data: any) => Promise<any>;
    };
  }
}

export {};
