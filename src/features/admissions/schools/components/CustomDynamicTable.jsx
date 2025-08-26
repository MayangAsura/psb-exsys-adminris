import { Fragment, ReactNode, useCallback } from "react";
import { cn } from "../../../../lib/utils";
import { splitStringByUnderscore } from "../../../../lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/UI/shadcn/table";

// type StringKeys<T> = Extract<keyof T, string>;

// export interface CustomDynamicTableProps<T> {
//   tableData: T[]; // Array of table row data
//   tableColumns: StringKeys<T>[]; // Array of column keys to display
//   excludeColumns?: StringKeys<T>[];
//   className?: string;
//   rowClassName?: string | ((row: T) => string);
//   customHeadRender?: (col: StringKeys<T>) => ReactNode | null | undefined; // Custom render function for table headers
//   customBodyRender?: (
//     rowData: T,
//     col: StringKeys<T>
//   ) => ReactNode | null | undefined; // Custom render function for table cells
//   onRowClick?: (rowData: T) => void; // Click handler for table rows
// }

const CustomDynamicTable = (
  props
) => {
  const {
    tableColumns,
    tableData,
    excludeColumns = [],
    className,
    rowClassName = "",
    customHeadRender,
    customBodyRender,
    onRowClick,
  } = props;

  function shouldRender(key) {
    if (excludeColumns.includes(key)) return false;
    return true;
  }

  const whatToRenderHeader = (col) => {
    if (!shouldRender(col)) return null;
    const renderedContent = customHeadRender ? customHeadRender(col) : null;
    return renderedContent || splitStringByUnderscore(col);
  };

  const whatToRenderBody = (row, col) => {
    if (!shouldRender(col)) return null;
    const renderedContent = customBodyRender
      ? customBodyRender(row, col)
      : null;
    return renderedContent || (row[col]);
  };

  // Memoized row click handler to prevent unnecessary re-renders
  const handleRowClick = useCallback(
    (row) => {
      if (!onRowClick) return;
      onRowClick(row);
    },
    [onRowClick]
  );

  return (
    <div className={cn("relative w-full overflow-auto", className)}>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted">
            {tableColumns.map((col) => {
              return (
                <Fragment key={col}>
                  {shouldRender(col) ? (
                    <TableHead
                      className={cn(
                        "whitespace-nowrap first-letter:capitalize"
                      )}
                    >
                      {whatToRenderHeader(col)}
                    </TableHead>
                  ) : null}
                </Fragment>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((row, idx) => {
            return (
              <TableRow
                key={idx}
                className={cn(
                  typeof rowClassName === "function"
                    ? rowClassName(row)
                    : rowClassName
                )}
                onClick={() => handleRowClick(row)}
              >
                {tableColumns.map((col) => {
                  return (
                    <Fragment key={col}>
                      {shouldRender(col) ? (
                        <TableCell className="whitespace-nowrap">
                          {whatToRenderBody(row, col)}
                        </TableCell>
                      ) : null}
                    </Fragment>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomDynamicTable;