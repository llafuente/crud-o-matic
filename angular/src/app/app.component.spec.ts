import { TestBed } from "@angular/core/testing";

import { AppComponent } from "./app.component";
import { declarations, imports } from "./app.module";

describe("AppComponent", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports,
      declarations,
      providers: [],
    });
  });

  it("should work", () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance instanceof AppComponent).toBe(true, "should create AppComponent");
  });
});
