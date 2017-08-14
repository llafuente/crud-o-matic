export class PermissionsAllowed {
  constructor(public label: string = null, public allowed: boolean = false) {}

  static fromJSON(json: any = null): PermissionsAllowed {
    if (json) {
      return new PermissionsAllowed(json.label || null, json.allowed === true);
    }
    return new PermissionsAllowed(); // defaults
  }
}
