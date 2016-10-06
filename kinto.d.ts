declare module "kinto" {
  interface Options {
    remote?: string;
    headers?: Object;
    adapter?: string;
    adapterOptions?: Object;
    requestMode?: string;
    tiemout?: number;
    bucket?: string;
    dbPrefix?: string;
  }

  export interface Record {
    id: string;
    last_modified?: number;
  }

  export class Collection {
    readonly lastModified: string; 

    create(record: Object): Promise<Record>;
    get(id: string): Promise<Record>;
    getAny(id: string): Promise<Record> | undefined;
    update(record: Record): Promise<Record>;
    upsert(record: Record): Promse<Record>;
    delete(id: string): Promise<Record>;
    deleteAny(id: string): Promise<Record>;
    list(arg?: {filters?: Object, order?: string}): Promise<{
      data: Record[]
    }>;
    loadDump(records: Record[]): Promise<Record[]>;
    clear(): Promise<Object>
  }
  
  export default class Kinto {
    constructor(options?: Options);

    collection(name: string): Collection
  }
}
