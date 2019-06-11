export interface personDetail {
  rNumber: number;
  name: string;
  email: string;
  age: number;
}
export interface getResponse {
  u: [
    {
      rNumber: number;
      name: string;
      email: string;
      age: number;
      id: string;
    }
  ];
  status: number;
  message: string;
}
export interface postResponse {
  status: number;
  message: string;
}

export interface deletePerson {
  rNumber: number;
  name: string;
}
export interface personDetails {
  name: string;
  email: string;
  age: string;
}
export interface yaml {
  workloadyaml: string;
  nameSpaceyaml: string;
  workloadName: string;
  openebsEngine: string;
  applicationType: string;
  dashboardurl: string;
  urlApi:string;
}
export interface statefulSet {
  kind: string;
  name: string;
  namespace: string;
  volumes: string;
  pvc: string;
  status: string;
  nodeName: string;
  adjacency: string;
  dockerImage: string;
  imageName: string;
}

export interface jivaReplica {
  kind: string;
  name: string;
  namespace: string;
  pvc: string;
  vsm: string;
  nodeName: string;
  status: string;
  openebsjivaversion: string;
}
export interface jivaController {
  kind: string;
  name: string;
  namespace: string;
  pvc: string;
  vsm: string;
  nodeName: string;
  status: string;
  openebsVersion: string;
  adjacency: string;
}

export interface applicationPod {
  kind: string;
  name: string;
  namespace: string;
  nodeName: string;
  status: string;
  dockerImage: string;
}
export interface pvcs {
  numberofPVC: number;
  pvc: 
    {
      name: string;
      volumeName: string;
    }
}

export interface mayaPvc {
      name: string;
      volumeName: string;
}
export interface overAllStatus {
  status: string;
  openebsAppName: string;
  statefulSet: [
    {
      kind: string;
      name: string;
      namespace: string;
      volumes: string;
      pvc: string;
      status: string;
      nodeName: string;
      adjacency: string;
      dockerImage: string;
      node:string;
      imageName: string;
    }
  ];
  jivaReplica: [
    {
      kind: string;
      name: string;
      namespace: string;
      pvc: string;
      vsm: string;
      nodeName: string;
      status: string;
      openebsjivaversion: string;
      node:string;
    }
  ];
  jivaController: [
    {
      kind: string;
      name: string;
      namespace: string;
      pvc: string;
      vsm: string;
      nodeName: string;
      status: string;
      openebsVersion: string;
      adjacency: string;
      node:string;
    }
  ];
  applicationPod: [
    {
      kind: string;
      name: string;
      namespace: string;
      nodeName: string;
      status: string;
      dockerImage: string;
    }
  ];
  pvcs: 
    {
      numberofPVC: number;
      pvc:
        {
          name: string;
          volumeName: string;
        },
      nodes:any
    }
}

export interface litmusstatus {
  runnigPos: [
    {
      name: string;
      status: string;
    }
  ];
  completes: [
    {
      name: string;
      status: string;
    }
  ];
}
export interface runnigPos {
  name: string;
  status: string;
}
export interface completes {
  name: string;
  status: string;
}
export interface link {
  id: string;
  x: number;
  y: number;
}
export interface listNamespace {
  jiva: [
    {
      workloadName: string;
      engine: string;
    }
  ];
  cstor: [
    {
      workloadName: string;
      engine: string;
    }
  ];
}

export interface jiva {
  workloadName: string;
  engine: string;
}
export interface cstor {
  workloadName: string;
  engine: string;
}

// export interface overallstatus {
//     cstorVolumes: [],
//     jivaVolumes: []
// }

// export interface cstorVolumes{
//     status:string,
//     pod:[]
// }
// export interface jivaVolumes{
//     status:string,
//     pod:[]
// }
export interface status {
  status: string;
}
export interface contactDetails {
  name: string;
  email: string;
  company: string;
  tag: string;
}
export interface litmuslog {
  podname: string;
  startingstatus: boolean;
  runnigstatus: boolean;
  completesstatus: boolean;
}
export interface jobName{
  jobname:string;
  litmusName:string;
}

export interface allApplication{
  status: string;
  name: string;
  namespace: string;
  kind: string;
  apiurl: string;
  Deployment: {};
  statefulSet: {};
  group: string;
  numberOfDeployment:number;
  numberOfStatefulset:number;
}