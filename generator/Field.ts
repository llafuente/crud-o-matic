import { FieldPermissions } from "./FieldPermissions";
import { FieldType } from "./FieldType";
import { FrontControls } from "./FrontControls";

export class Field {
  parent: Field = null;

  label: string;
  type: FieldType;
  frontControl: FrontControls;

  items: Field = null;
  properties: { [s: string]: Field } = null;

  defaults: any = undefined;
  enums: string[] = null;
  labels: string[] = null;
  unique: boolean = false;
  editable: boolean = false;

  // constrains
  required: boolean = false;
  maxlength: number = null; // for strings
  minlength: number = null; // for strings
  min: number = null; // for numbers
  max: number = null; // for numbers

  // transforms
  lowercase: boolean = false;
  uppercase: boolean = false;

  permissions: FieldPermissions = new FieldPermissions();
  refTo: string;

  frontData: any;

  constructor(label: string, type: FieldType) {
    this.label = label;
    this.type = type;
    this.frontControl = FrontControls.Hidden;
    this.frontData = {};

    if (type == FieldType.Array) {
      this.setDefault([]);
    }
  }

  setFrontControl(control: FrontControls): Field {
    if (!control) {
      return this;
    }

    switch (control) {
      case FrontControls.HTTP_DROPDOWN:
        throw new Error("use setHTTPDropdown instead");
      default:
        this.frontControl = control;
    }

    return this;
  }
  // TODO maybe add filters, could be in the URL
  setHTTPDropdown(srcUrl: string, declaration: string, srcId: string, srcLabel: string): Field {
    this.frontControl = FrontControls.HTTP_DROPDOWN;

    this.frontData.srcUrl = srcUrl;
    this.frontData.declaration = declaration;
    this.frontData.srcModel = declaration + ".list";
    this.frontData.srcId = srcId;
    this.frontData.srcLabel = srcLabel;

    return this;
  }

  static fromJSON(json: Field): Field {
    if (json.type === undefined) {
      console.error(json);
      throw new Error("Field: type is required");
    }

    if (!(json.type in FieldType)) {
      console.error(json);
      throw new Error(`Field[${json.type}]: type is invalid`);
    }

    if (json.type != FieldType.Object && json.label === undefined) {
      console.error(json);
      throw new Error("Field: label is required");
    }

    return new Field(json.label, json.type)
      .setFrontControl(json.frontControl)
      .setPermissions(json.permissions || null)
      .setItems(json.items || null)
      .addProperties(json.properties || null)
      .setEnumConstraint(json.enums || null, json.labels || null)
      .setDefault(json.defaults || null)
      .setUnique(json.unique === true)
      .setRequired(json.required || false)
      .setMaxlength(json.maxlength || null)
      .setMinlength(json.minlength || null)
      .setMin(json.min || null)
      .setMax(json.max || null)
      .setLowercase(json.lowercase || false)
      .setUppercase(json.uppercase || false);
  }

  setItems(items: Field): Field {
    if (this.type == FieldType.Array && items) {
      this.items = Field.fromJSON(items);
      this.items.parent = this;
    } else {
      this.items = null;
    }

    return this;
  }

  addProperties(properties: { [s: string]: Field }): Field {
    if (this.type == FieldType.Object && properties) {
      // now cast every property
      this.properties = {};
      for (const i in properties) {
        this.properties[i] = Field.fromJSON(properties[i]);
      }
    } else {
      this.properties = null;
    }

    return this;
  }

  addProperty(name: string, type: Field): Field {
    this.properties = this.properties || {};

    this.properties[name] = type;
    type.parent = this;

    return this;
  }

  setEnumConstraint(enums: string[], labels: string[]): Field {
    this.enums = enums;
    this.labels = labels;

    return this;
  }

  setDefault(defaults: any): Field {
    this.defaults = defaults;

    return this;
  }

  setUnique(unqiue: boolean): Field {
    this.unique = unqiue;

    return this;
  }

  setEditable(editable: boolean): Field {
    this.editable = editable;

    return this;
  }

  setPermissions(perms: FieldPermissions): Field {
    this.permissions = FieldPermissions.fromJSON(perms);

    return this;
  }

  setRefTo(refTo: string): Field {
    this.refTo = refTo;

    return this;
  }

  setRequired(required: boolean): Field {
    this.required = required;

    return this;
  }

  setMaxlength(maxlength: number): Field {
    this.maxlength = maxlength;

    return this;
  }

  setMinlength(minlength: number): Field {
    this.minlength = minlength;

    return this;
  }

  setMin(min: number): Field {
    this.min = min;

    return this;
  }

  setMax(max: number): Field {
    this.max = max;

    return this;
  }

  setLowercase(lowercase: boolean): Field {
    this.lowercase = lowercase;

    return this;
  }

  setUppercase(uppercase: boolean): Field {
    this.uppercase = uppercase;

    return this;
  }

  getTypeScriptType() {
    switch (this.type) {
      case FieldType.Object:
        const t = [];
        for (let i in this.properties) {
          t.push(i + ":" + this.properties[i].getTypeScriptType());
        }

        return "{" + t.join(",\n") + "}";
      /*
      case FieldType.AutoPrimaryKey:
        return FieldType.Number;
*/
      case FieldType.Array:
        return `${this.items.getTypeScriptType()}[]`;
      default:
        return this.type;
    }
  }

  getMongooseType() {
    const d = [];

    switch (this.type) {
      case FieldType.Object:
        d.push(`type: Object`);

        const t = [];
        for (let i in this.properties) {
          t.push(i + ":" + this.properties[i].getMongooseType());
        }

        d.push(`properties: {${t.join(",\n")}}`);

        break;
      /*
      case FieldType.AutoPrimaryKey:
        d.push(`type: ${FieldType.Number}`);
        break;
*/
      case FieldType.Array:
        d.push(`type: Array`);
        d.push(`items: ${this.items.getMongooseType()}`);
        break;
      default:
        d.push(`type: ${this.type}`);
    }

    // common
    if (this.unique) {
      d.push(`unique: ${this.unique}`);
    }

    if (this.defaults !== undefined) {
      d.push(`default: ${JSON.stringify(this.defaults)}`);
    }

    if (this.refTo) {
      d.push(`ref: ${this.refTo}`);
    }

    if (this.enums) {
      d.push(`enum: ${JSON.stringify(this.enums)}`);
    }

    if (this.required !== false) {
      d.push(`required: ${this.required}`);
    }
    if (this.maxlength !== null) {
      d.push(`maxlength: ${this.maxlength}`);
    }
    if (this.minlength !== null) {
      d.push(`minlength: ${this.minlength}`);
    }
    if (this.min !== null) {
      d.push(`min: ${this.min}`);
    }
    if (this.max !== null) {
      d.push(`max: ${this.max}`);
    }
    if (this.lowercase !== false) {
      d.push(`lowercase: ${this.lowercase}`);
    }
    if (this.uppercase !== false) {
      d.push(`uppercase: ${this.uppercase}`);
    }

    return "{\n" + d.join(",\n") + "\n}";
  }

  getParents(): Field[] {
    let t: Field = this;
    let parents = [];
    while (this.parent !== null) {
      parents.push(t);
      t = this.parent;
    }

    return parents;
  }

  getCreateImports(): string[] {
    // if it's an object, don't need front type, just get all fields
    if (this.type == FieldType.Object) {
      let t = [];
      for (let i in this.properties) {
        t = t.concat(this.properties[i].getCreateImports());
      }

      return t;
    }

    switch (this.frontControl) {
      case FrontControls.ARRAY:
        let x = this.items.getCreateImports();
        console.log("array parents", this.getParents());

        x.push(`import {} from "./.component";`);
        return x;
      default:
        return [];
    }
  }
}
