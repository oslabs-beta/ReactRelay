import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      openDialog: (action: string, config: DialogConfig) => Promise<OpenDialogResult>;
      send: (route: string, data: Payload) => Promise<any>;
    };
    openExplorerModal: ExplorerModal;
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

type Payload = 
  | {
    id: string;
  }
  | {
    filePath: string;
  }

interface ExplorerModal {
  close: () => void;
  showModal: () => void;
}