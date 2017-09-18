import { PermissionsAllowed } from "./PermissionsAllowed";
export * from "./PermissionsAllowed";

export class ApiAccessPermissions {
  read: PermissionsAllowed = new PermissionsAllowed();
  list: PermissionsAllowed = new PermissionsAllowed();
  create: PermissionsAllowed = new PermissionsAllowed();
  update: PermissionsAllowed = new PermissionsAllowed();
  delete: PermissionsAllowed = new PermissionsAllowed();

  constructor(
    read: PermissionsAllowed,
    list: PermissionsAllowed,
    create: PermissionsAllowed,
    update: PermissionsAllowed,
    _delete: PermissionsAllowed,
  ) {
    this.read = read;
    this.list = list;
    this.create = create;
    this.update = update;
    this.delete = _delete;
  }

  static fromJSON(json): ApiAccessPermissions {
    if (json) {
      return new ApiAccessPermissions(
        PermissionsAllowed.fromJSON(json.read),
        PermissionsAllowed.fromJSON(json.list),
        PermissionsAllowed.fromJSON(json.create),
        PermissionsAllowed.fromJSON(json.update),
        PermissionsAllowed.fromJSON(json.delete),
      );
    }

    return new ApiAccessPermissions(
      new PermissionsAllowed(),
      new PermissionsAllowed(),
      new PermissionsAllowed(),
      new PermissionsAllowed(),
      new PermissionsAllowed(),
    );
  }
}
