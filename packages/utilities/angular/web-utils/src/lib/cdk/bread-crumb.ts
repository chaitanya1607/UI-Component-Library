import { Directive, OnDestroy } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { Subject } from "rxjs";
import { filter, takeUntil } from "rxjs/operators";
import { AbstractComponent } from "../abstract-component";
import { ContentService } from "../services/content/content.service";

@Directive()
export class BaseBreadCrumbComponent extends AbstractComponent implements OnDestroy {

  public breadCrumbs: BreadCrumb[];

  private _onDestroy$: Subject<void>;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    contentService: ContentService
  ) {
    super(contentService);
    this.breadCrumbs = [];
    this._onDestroy$ = new Subject();
    this.handleRouting();
  }

  ngOnDestroy() {
    this._onDestroy$.next();
    this._onDestroy$.complete();
  }

  private handleRouting() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this._onDestroy$)
      )
      .subscribe(() => {
        this.breadCrumbs = this.constructBreadCrumbs(this.activatedRoute.root);
      });
  }

  private constructBreadCrumbs(route: ActivatedRoute): BreadCrumb[] {
    const breadCrumbs: BreadCrumb[] = [];
    const currentRouteBreadCrumb = this.getBreadCrumbForRoute(route);
    if (currentRouteBreadCrumb) {
      breadCrumbs.push(currentRouteBreadCrumb);
    }
    if (route.firstChild) {
      const childBreadCrumbs = this.constructBreadCrumbs(route.firstChild);
      breadCrumbs.push(...childBreadCrumbs);
    }
    return breadCrumbs;
  }

  private getBreadCrumbForRoute(route: ActivatedRoute): BreadCrumb {
    const breadCrumbConfig: BreadCrumbConfig = route?.routeConfig?.data?.breadcrumb;
    if (!breadCrumbConfig) {
      return;
    }

    const path = '/' + route.pathFromRoot
      .map(route => route.snapshot.url.map(segement => segement.path).join('/'))
      .join('/');

    return {
      name: breadCrumbConfig.name,
      path,
      isHome: breadCrumbConfig.isHome
    };
  }
}

export class BreadCrumb {
  /**
   * the name of the path in bread crumb
   */
  name: string;
  /**
   * the route path (from root). to be used to route on click
   */
  path: string;

  isHome?: boolean;
}

/**
 * the config to be provided in route data with bread crumb as property name
 */
export class BreadCrumbConfig {
  name: string;
  isHome?: boolean;
}
