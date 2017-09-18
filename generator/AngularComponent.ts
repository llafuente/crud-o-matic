import * as fs from "fs";
import * as path from "path";
import { Schema } from "./Schema";
const ejs = require("ejs");

const templateHTML = fs.readFileSync(path.join(__dirname, "..", "templates", "angular", "component.ts"), "utf8");
const template = ejs.compile(templateHTML);

export class AngularComponent {
  typeName: string;
  interfaceName: string;
  selector: string;
  template: string = "";
  declarations: string = "";
  initialization: string = "";
  methods: string = "";

  constructor(public componentName: string, schema: Schema) {
    this.typeName = schema.typeName;
    this.interfaceName = schema.interfaceName;
  }

  save(destination: string) {
    fs.writeFileSync(destination, template(this));
  }
}
