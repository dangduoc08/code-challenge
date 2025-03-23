export interface IGetResourcesQuery {
  limit?: number;
  offset?: number;
}

export interface ICreateResourceBody {
  title: string;
  scores: number;
}

export interface IUpdateResourceBody {
  title: string;
  scores: number;
}
