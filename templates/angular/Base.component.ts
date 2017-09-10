import { OnInit, OnDestroy, Injector } from '@angular/core';
import { Subscription } from 'rxjs/Rx' ;
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Config } from './Config.service';


export class BaseComponent implements /*OnInit, */OnDestroy {
  timeouts: number[] = [];
  intervals: number[] = [];
  subscriptions: Subscription[] = [];
  config: Config = null;

  constructor(
    public injector: Injector,
    public activatedRoute: ActivatedRoute
  ) {
    this.config = injector.get(Config);
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
  getRouteParameter(key: string): string|null {
    let snapshot: ActivatedRouteSnapshot = this.activatedRoute.snapshot;

    do {
      const d = snapshot.params as any;
      // console.log("route.params", snapshot.params);
      if (d && d[key] !== undefined) {
        //console.log("getParameter", key, d[key]);
        return d[key];
      }

      snapshot = snapshot.parent;
    } while (snapshot);

    //console.log("getParameter", key, null);
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
}