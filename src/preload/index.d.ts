import { ElectronAPI } from '@electron-toolkit/preload'
import { SendReturnObject, SendData } from '../renderer/src/interfaces/stateInterfaces';

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      openDialog: (action: string, config: DialogConfig) => Promise<OpenDialogResult>;
      send: (route: string, data: SendData) => Promise<SendReturnObject>;
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

interface ExplorerModal {
  close: () => void;
  showModal: () => void;
}