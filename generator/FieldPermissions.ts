export class FieldPermissions {
  constructor(
    public read: boolean = true,
    public list: boolean = true,
    public create: boolean = true,
    public update: boolean = true,
  ) {}

  static fromJSON(json): FieldPermissions {
    if (json) {
      return new FieldPermissions(json.read === true, json.list === true, json.create === true, json.update === true);
    }

    return new FieldPermissions();
  }
}
