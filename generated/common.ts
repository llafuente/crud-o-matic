export enum Operators {
  LIKE = 'LIKE',
  EQUALS = 'EQUALS',
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
};


/**
 * clean req.body from data that never must be created/updated
 */
export function cleanBody(body) {
  delete body._id;
  //delete body.id;
  delete body.__v;

  delete body.create_at;
  delete body.updated_at;
}
