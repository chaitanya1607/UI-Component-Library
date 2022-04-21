import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BehaviorSubject, Observable } from 'rxjs';

export class PaginatedDataSource<T> implements DataSource<T> {
  private data$: BehaviorSubject<T[]>;
  public totalItemsCount: number;

  constructor(length: number, initialData?: Array<any>) {
    this.totalItemsCount = length;
    this.data$ = new BehaviorSubject(initialData ?? []);
  }

  connect(): Observable<T[]> {
    return this.data$.asObservable();
  }

  disconnect(): void {
    this.data$.complete();
  }

  set data(data: T[]) {
    this.data$.next(data);
  }

  set paginator(paginator: MatPaginator) {
    // no op
  }

  set sort(sort: MatSort) {
    // no op
  }

  set sortData(fn: (a: T[], b: MatSort) => number) {
    // no op
  }
}
