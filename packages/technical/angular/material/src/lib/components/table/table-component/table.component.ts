import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  ColumnConfig,
  TableConfig,
  TablePageState,
  TableViewChange,
} from '../table.model';
import { PaginatedDataSource } from '../paginated-data-source';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent<T> implements OnInit, AfterViewInit, OnChanges {
  /**
   * @description the table title
   */
  @Input() title: string;

  /**
   * @description the caption for the table
   */
  @Input() caption: string;

  /**
   * @description the table configuration
   */
  @Input() config: TableConfig;

  /**
   * @description the data to be rendered in the table
   */
  @Input() data: Array<T>;

  @ViewChild(MatSort) tableSorter: MatSort;
  @ViewChild(MatPaginator) tablePaginator: MatPaginator;

  /**
   * @description event emitted whenever sorting or pagination is changed in the table
   */
  @Output() tableViewChange = new EventEmitter<TableViewChange>();

  public dataSource: MatTableDataSource<T> | PaginatedDataSource<T>;

  ngOnChanges(changes: SimpleChanges): void {
    const tableDataChange = changes.data;
    if (tableDataChange && !tableDataChange.isFirstChange()) {
      this.dataSource.data = tableDataChange.currentValue;
    }
  }

  ngOnInit(): void {
    this.createDataSource();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.tableSorter;
    this.handleSorting();
    if (this.config.hasPagination) {
      this.dataSource.paginator = this.tablePaginator;
    }

    this.handleTableEvents();
  }

  public getCellValue(columnConfig: ColumnConfig, rowData: T): any {
    if (columnConfig.dataAccessor) {
      return columnConfig.dataAccessor(rowData);
    }
    if (typeof rowData !== 'object' || Array.isArray(rowData) || !rowData) {
      console.warn('cannot get column value from row data');
      return '';
    }

    return (rowData as any)[columnConfig.name];
  }

  public get displayedColumns(): string[] {
    return this.config?.columns
      ?.filter((column) => !column.hidden)
      .map((column) => column.name);
  }

  /**
   * the data to a table can be given all at once or fetched on request
   * the mat table data source works for client side pagination but not for server side pagination
   * if the length of data given initially doesn't match the table length in config if any then
   * it is considered as dynamic fetching of data. Here the user of the component needs to listen
   * to the various events and set the table data
   */
  private createDataSource(): void {
    if (
      !this.config?.pagination?.totalItems ||
      this.config.pagination.totalItems === this.data?.length
    ) {
      this.dataSource = new MatTableDataSource(this.data);
    } else {
      // not all data is present. mat table data source doesn't work in this scenrio
      this.dataSource = new PaginatedDataSource(
        this.config.pagination.totalItems,
        this.data
      );
    }
  }

  private handleSorting(): void {
    this.dataSource.sortData = (data, sort) => {
      if (sort.direction === '') {
        return this.data;
      }
      const sortingColumn = this.config.columns?.find(
        (column) => column.name === sort.active
      );
      if (!sortingColumn) {
        return this.data;
      }
      const sortedData = data?.sort((a, b) => {
        const aVal = sortingColumn.dataAccessor
          ? sortingColumn.dataAccessor(a)
          : (a as any)[sortingColumn.name];
        const bVal = sortingColumn.dataAccessor
          ? sortingColumn.dataAccessor(b)
          : (b as any)[sortingColumn.name];

        if (sortingColumn.sortFunction) {
          return sortingColumn.sortFunction(aVal, bVal);
        }

        return aVal < bVal ? -1 : aVal === bVal ? 0 : 1;
      });
      if (sort.direction === 'desc') {
        return sortedData.reverse();
      } else if (sort.direction === 'asc') {
        return sortedData;
      }
      return this.data;
    };
  }

  private handleTableEvents(): void {
    if (this.config.hasPagination) {
      this.tablePaginator.page.subscribe(() => this.emitTableViewState());
    }
    this.tableSorter.sortChange.subscribe(() => this.emitTableViewState());
  }

  private emitTableViewState(): void {
    let pagingState: TablePageState | undefined;

    if (this.config?.hasPagination) {
      pagingState = {
        pageIndex: this.tablePaginator.pageIndex,
        pageSize: this.tablePaginator.pageSize,
      };
    }

    const sortState = {
      sortedColumn: this.tableSorter.active,
      sortDirection: this.tableSorter.direction as any,
    };

    this.tableViewChange.emit({
      page: pagingState,
      sort: sortState,
    });
  }
}
