import {
  Component,
  Directive,
  ExistingProvider,
  forwardRef,
  Inject,
  Input,
  OnInit,
  OpaqueToken,
  Optional,
  Type,
} from "@angular/core";

// original at: https://raw.githubusercontent.com/gund/ng-original-template-poc/master/src/app/directives/original-template/original-template.directive.ts

declare var global: any;

const Reflect = global.Reflect;

export const ORIGINAL_TEMPLATE_PROVIDER = new OpaqueToken("ORIGINAL_TEMPLATE_PROVIDER");

export function provideTemplateFrom(component: Type<any>): ExistingProvider {
  return {
    provide: ORIGINAL_TEMPLATE_PROVIDER,
    useExisting: forwardRef(() => component),
  };
}

@Directive({
  selector: "[example]",
})
export class BBSourceDirective implements OnInit {
  private static _templateCache = new Map<Type<any>, string>();

  @Input() example: string;
  @Input() exampleInner = true;
  @Input() examplePrecise = false;
  @Input() examplePreciseIterations = 100;

  private component: Type<any>;

  private get componentName(): string {
    return this.component.name;
  }

  constructor(
    @Inject(ORIGINAL_TEMPLATE_PROVIDER)
    @Optional()
    private componentInst: any,
  ) {
    if (!componentInst) {
      throw Error(
        "BBSourceDirective: You should provide component via `provideTemplateFrom()` function in your component`s providers!",
      );
    }

    this.component = componentInst.constructor;
  }

  ngOnInit() {
    if (this.componentInst[this.example] !== undefined) {
      console.warn(`BBSourceDirective: Overriding property '${this.example}' in component '${this.componentName}'`);
    }

    this.componentInst[this.example] = this._getPieceOfTemplate();
  }

  private _getPieceOfTemplate(): string {
    const template = this._getTemplate();
    const matchDirective = `example=`;
    const matchDirectiveRegex = `${matchDirective}["|']?${this.example}["|']?`;

    const tpl = this._getOuterTemplate(template, matchDirectiveRegex);

    if (!tpl) {
      console.warn(`BBSourceDirective: Failed to extract template for directive '${matchDirective}"${this.example}"'`);
      return "";
    }

    if (this.exampleInner) {
      return this._getInnerTemplate(this._getPreciseTemplate(tpl));
    } else if (this.examplePrecise) {
      return this._getPreciseTemplate(tpl);
    }

    return tpl;
  }

  private _getOuterTemplate(tpl: string, matchDirective: string): string {
    const regexp = new RegExp(`(<([^\\s]+).*${matchDirective}.*>[^]*<\/\\2>)`);
    const matches = tpl.match(regexp);

    if (!matches || matches.length < 2) {
      return "";
    }

    return matches[1].trim();
  }

  private _getInnerTemplate(tpl: string): string {
    const regexp = /^<([^\s]+)[^>]*>([^]*)<\/\1>$/;
    const matches = regexp.exec(tpl);

    if (!matches || matches.length < 3) {
      return "";
    }

    return matches[2];
  }

  private _getPreciseTemplate(tpl: string): string {
    const openCloseRegex = /<(\/?[^\s>]+)[^>]*>/g;
    const rootTag = tpl.match(/^<([^\s]+)/);

    if (!rootTag) {
      return tpl; // Inner template does not start with tag - no need to cut deeper
    }

    const rootTagName = rootTag[1];
    let rootTagOpened = 0;
    let i = 0;
    let lastIndex = 0;
    let lastTag = "";

    do {
      const tagMatch = openCloseRegex.exec(tpl);

      if (!tagMatch) {
        break;
      }

      const tag = tagMatch[1];
      lastIndex = tagMatch.index;
      lastTag = tag;

      if (tag === rootTagName) {
        rootTagOpened++;
      } else if (tag === `/${rootTagName}`) {
        rootTagOpened--;
      }
    } while (rootTagOpened && ++i < this.examplePreciseIterations);

    return tpl.substr(0, lastIndex) + `<${lastTag}>`;
  }

  private _getTemplate(): string {
    if (BBSourceDirective._templateCache.has(this.componentInst)) {
      return BBSourceDirective._templateCache.get(this.componentInst);
    }

    const annotations = this._getAnnotations();
    // @llafuente do not pop, that modify original meta!
    const template = annotations[annotations.length - 1].template;
    BBSourceDirective._templateCache.set(this.componentInst, template);

    return template;
  }

  private _getAnnotations(): any[] {
    const annotations = Reflect.getOwnMetadata("annotations", this.component);

    if (!Array.isArray(annotations)) {
      throw Error(`BBSourceDirective: Annotations not available for type '${this.componentName}'`);
    }

    return annotations;
  }
}

@Component({
  selector: "bb-source",
  template: `
<ul class="nav nav-tabs ui-tabs">
  <li class="nav-item" (click)="setZone('example')">
    <a class="nav-link" [class.active]="zone == 'example'">Example</a>
  </li>
  <li class="nav-item" (click)="setZone('source')">
    <a class="nav-link" [class.active]="zone == 'source'">Source</a>
  </li>
</ul>
<div style="margin-bottom: 2rem; padding: 2rem; box-shadow: 0px 1px 1px 0px rgba(0,0,0,0.2);">
  <div *ngIf="zone == 'example'">
    <ng-content></ng-content>
  </div>
  <div *ngIf="zone == 'source'">
    <pre><code highlightjs>{{source.trim()}}</code></pre>
  </div>
</div>
`,
})
export class BBSourceExampleComponent {
  public zone = "example";
  @Input() public source: string;

  constructor() {}

  setZone(zone: string) {
    this.zone = zone;
  }
}
