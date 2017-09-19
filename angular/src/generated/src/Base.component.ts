import { Injector, OnDestroy, OnInit } from "@angular/core";
import { Response } from "@angular/http";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { ToastData, ToastOptions, ToastyService } from "ng2-toasty";
import { Subscription } from "rxjs/Rx";
import { Config } from "./Config.service";

interface IErrorResponse {
  message: string;
}

export class BaseComponent implements /*OnInit, */ OnDestroy {
  timeouts: number[] = [];
  intervals: number[] = [];
  subscriptions: Subscription[] = [];
  config: Config = null;
  toastyService: ToastyService;

  get domain(): string {
    return this.config.get("domain");
  }

  constructor(
    public injector: Injector,
    public activatedRoute: ActivatedRoute,
  ) {
    this.config = injector.get(Config);
    this.toastyService = injector.get(ToastyService);
  }

  errorHandler(errorResponse: Response | IErrorResponse) {
    const er: IErrorResponse =
      errorResponse instanceof Response
        ? (errorResponse as Response).json()
        : (errorResponse as any).error;

    console.log("Error occured.", er);
    this.errGrowl(er.message || "Error inesperado");
  }

  handleSubscription(s: Subscription) {
    this.subscriptions.push(s);
  }

  /*
  ngOnInit() {
  }
*/
  ngOnDestroy() {
    this.subscriptions.forEach((subs) => {
      subs.unsubscribe();
    });
    for (let i = 0; i < this.timeouts.length; ++i) {
      clearTimeout(this.timeouts[i]);
    }
    for (let i = 0; i < this.intervals.length; ++i) {
      clearTimeout(this.intervals[i]);
    }
  }

  /**
   * Reverse ActivatedRoute and return the first non-undefined key in params
   */
  getRouteParameter(key: string): string | null {
    let snapshot: ActivatedRouteSnapshot = this.activatedRoute.snapshot;

    do {
      const d = snapshot.params as any;
      // console.log("route.params", snapshot.params);
      if (d && d[key] !== undefined) {
        // console.log("getParameter", key, d[key]);
        return d[key];
      }

      snapshot = snapshot.parent;
    } while (snapshot);

    // console.log("getParameter", key, null);
    return null;
  }

  getRouteData(key: string) {
    let route = this.activatedRoute;
    do {
      const d = route.snapshot.data as any;
      if (d && d[key] !== undefined) {
        return d[key];
      }

      route = route.parent;
    } while (route);

    return null;
  }

  timeout(fn: Function, miliseconds: number): number {
    const t = setTimeout(fn, miliseconds);
    this.timeouts.push(t);
    return t;
  }

  interval(fn: Function, miliseconds: number): number {
    const t = setInterval(fn, miliseconds);
    this.intervals.push(t);
    return t;
  }

  errGrowl(str: string, timeout: number = 10000) {
    const toastOptions: ToastOptions = {
      title: str,
      showClose: true,
      timeout,
      theme: "bootstrap",
      onAdd: (toast: ToastData) => {
        console.log("Toast " + toast.id + " has been added!", str);
      },
      onRemove(toast: ToastData) {
        console.log("Toast " + toast.id + " has been removed!", str);
      },
    };

    // Add see all possible types in one shot
    this.toastyService.info(toastOptions);
  }

  growl(str: string, timeout: number = 5000) {
    const toastOptions: ToastOptions = {
      title: str,
      showClose: true,
      timeout,
      theme: "bootstrap",
      onAdd: (toast: ToastData) => {
        console.log("Toast " + toast.id + " has been added!", str);
      },
      onRemove(toast: ToastData) {
        console.log("Toast " + toast.id + " has been removed!", str);
      },
    };

    // Add see all possible types in one shot
    this.toastyService.info(toastOptions);
  }
}
