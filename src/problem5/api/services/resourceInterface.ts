export interface IGetResourcesInput {
  limit: number;
  offset: number;
}

export interface ICreateResourceInput {
  title: string;
  scores: number;
}

export interface IUpdateResourceInput {
  id: number;
  title: string;
  scores: number;
}
