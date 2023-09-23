

export interface RootState {
  project: {
    nodeInfo: AjaxRequest[];
    server: Server;
    serverPath: string;
    components: Components;
    componentName: string;
    componentPath: string;
  };

  detail: {
    active: null | string;
    activeComponentCode: string;
    treeContainerClick: boolean;
    activeRoute: { endPointName: string, methodName: string }
  }

  search: {
    searchValue: string;
    showSearch: boolean;
  }

}

interface AjaxRequest {
  route: string;
  fullRoute: string;
  method: string;
}

interface Server {
  [key: string]: Endpoint;
}

interface Endpoint {
  [key: string]: Schemas;
}

interface Schemas {
  [key: string]: SchemaObject;
}

interface SchemaObject {
  [key: string]: any;
}

interface Components {
  [key:string]: Component;
}

export interface Component {
  data: { label: string, active: boolean };
  children: string[];
  ajaxRequests: AjaxRequest[];
  id: string;
}