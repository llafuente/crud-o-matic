export enum Operators {
  LIKE = "LIKE",
  EQUALS = "EQUALS",
}

export class WhereQuery {
  constructor(
    public operator: Operators,
    public value: any,
  ) {

  }
}

export class Pagination<T> {
  constructor(
    public list: T[],
    public count: number,
    public offset: number,
    public limit: number,
  ) {
  }

  static fromJSON<T>(T, obj: any) {
    if (obj) {
      obj.list.map((item) => {
        return T.fromJSON(item);
      })
      return new Pagination<T>(
        obj.list,
        obj.count,
        obj.offset,
        obj.limit,
      );
    }
  }
}

export enum Order {
  ASC = 1,
  DESC = -1
}

export class ListQueryParams {
  constructor(
    public limit: number = null,
    public offset: number = null,
    public sort: { [s: string]: Order } = null,
    public where: { [s: string]: WhereQuery } = null,
    public populate: string[] = null,
    public fields: string[] = [],
  ) {
  }

  static fromJSON(obj: any) {
    if (obj) {
      return new ListQueryParams(
        obj.limit ? parseInt(obj.limit, 10) : 0,
        obj.offset ? parseInt(obj.offset, 10) : 0,
        obj.sort,
        obj.where,
        obj.populate,
        obj.fields || [],
      );
    }
    return new ListQueryParams();
  }
}
