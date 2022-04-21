export class TableConfig {
  columns: ColumnConfig[];

  /**
   * does the table have pagination. defaults to false
   */
  hasPagination?: boolean;

  /**
   * the pagination config for table. used only if `hasPagination` is `true`
   *
   * TODO Add event
   */
  pagination?: PaginationOptions;

  /**
   * the sort config for the table
   */
  sortOptions?: SortingOptions;
}

export class ColumnConfig {
  /**
   * the column heading
   * TODO: title
   */
  title: string;
  /**
   * the name of the column.
   * #### Used for accessing the value of a cell from the data object if no accessor is passed
   */
  name: string;
  /**
   * is the column hidden
   */
  hidden?: boolean;

  /**
   * is the column sortable
   */
  sortable?: boolean;
  /**
   * a custom sort function. the value of the cells under comparision will be passed.
   * The sort fucntion is expected to
   * 1. return -1 if a < b
   * 2. return  0 if a = b
   * 3. return  1 in other cases
   *
   * TODO add a event
   */
  sortFunction?: (a: any, b: any) => number;

  /**
   * Custom data accessor for retreiving a cell value from a object. by default the column name is used
   * for retreiving the value
   */
  dataAccessor?: (rowValue: any) => any;
}

export class PaginationOptions {
  /**
   * the page sizes applicable
   */
  pageSizes: number[];

  /**
   * the total number of items. defaults to the number of items given to mat table data
   */
  totalItems?: number;
}

/**
 * Table level sorting options
 */
export class SortingOptions {
  /**
   * the name of column that is sorted by default in the table
   */
  defaultSortedColumn?: string;
  /**
   * the sort order for the `defaultSortedColumn`
   */
  defaultSortDirection?: SortDirection;
}

export class TableViewChange {
  /**
   * the current paging status if applicable
   */
  page?: TablePageState;

  /**
   * the current sort status if applicable
   */
  sort?: TableSortState;
}

export class TablePageState {
  pageSize?: number;
  pageIndex: number;
}

export class TableSortState {
  /**
   * the name of the column that is currently sorted. undefined if none sorted
   */
  sortedColumn?: string;
  sortDirection?: SortDirection;
}

export type SortDirection = 'asc' | 'desc';
