

export interface Window {
  api: {
    openDialog: (action: string, config: DialogConfig) => Promise<OpenDialogResult>;
    send: (action: string, config: Payload) => Promise<string>
  }
}

interface OpenDialogResult {
  filePaths: string[];
}

interface DialogConfig {
  title: string;
  buttonLabel: string;
  properties: string[];
}

interface Payload {
  id: string;
}