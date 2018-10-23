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
  openebsjivaversion: string;
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
export interface pvc {
  numberofPvc: number;
  pvc: [
    {
      name: string;
      volumeName: string;
    }
  ];
}
export interface overAllStatus {
  status: string;
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
      openebsjivaversion: string;
      adjacency: string;
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
  pvc: [
    {
      numberofPvc: number;
      pvc: [
        {
          name: string;
          volumeName: string;
        }
      ];
    }
  ];
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
