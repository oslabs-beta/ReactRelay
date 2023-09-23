

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


  }

  search: {

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

interface Component {
  data: { label: string };
  children: string[];
  ajaxRequests: AjaxRequest[];
  id: string;
}