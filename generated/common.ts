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
}

export enum Order {
  ASC = 1,
  DESC = -1
};
