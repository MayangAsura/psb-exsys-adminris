// // "use client";

// import * as React from "react";
// import { DataTable } from "../../../components/DataTable/data-table";
// import { DataTableAdvancedToolbar } from "../../../components/DataTable/data-table-advanced-toolbar";
// import { DataTableFilterList } from "../../../components/DataTable/data-table-filter-list";
// import { DataTableFilterMenu } from "../../../components/DataTable/data-table-filter-menu";
// import { DataTableSortList } from "../../../components/DataTable/data-table-sort-list";
// import { DataTableToolbar } from "../../../components/DataTable/data-table-toolbar";
// // import type { Task } from "@/db/schema";
// import { useDataTable } from "../../../hooks/use-data-table";
// // import type { DataTableRowAction } from "@/types/data-table";
// // import type {
// //   getEstimatedHoursRange,
// //   getTaskPriorityCounts,
// //   getTaskStatusCounts,
// //   getTasks,
// // } from "../_lib/queries";
// import { DeleteTasksDialog } from "../../../components/DataTable/_components/delete-tasks-dialog";
// import { useFeatureFlags } from "../../../components/DataTable/_components/feature-flags-provider";
// import { TasksTableActionBar } from "../../../components/DataTable/_components/tasks-table-action-bar";
// import { getTasksTableColumns } from "../../../components/DataTable/_components/tasks-table-columns";
// import { UpdateTaskSheet } from "../../../components/DataTable/_components/update-task-sheet";

// // interface TasksTableProps {
// //   promises: Promise<
// //     [
// //       Awaited<ReturnType<typeof getTasks>>,
// //       Awaited<ReturnType<typeof getTaskStatusCounts>>,
// //       Awaited<ReturnType<typeof getTaskPriorityCounts>>,
// //       Awaited<ReturnType<typeof getEstimatedHoursRange>>,
// //     ]
// //   >;
// // }

// export function TasksTable({ promises }) {
//   const { enableAdvancedFilter, filterFlag } = useFeatureFlags();

//   const [
//     { data, pageCount },
//     statusCounts,
//     priorityCounts,
//     estimatedHoursRange,
//   ] = React.use(promises);

//   const [rowAction, setRowAction] =
//     React.useState(null);

//   const columns = React.useMemo(
//     () =>
//       getTasksTableColumns({
//         statusCounts,
//         priorityCounts,
//         estimatedHoursRange,
//         setRowAction,
//       }),
//     [statusCounts, priorityCounts, estimatedHoursRange],
//   );

//   const { table, shallow, debounceMs, throttleMs } = useDataTable({
//     data,
//     columns,
//     pageCount,
//     enableAdvancedFilter,
//     initialState: {
//       sorting: [{ id: "createdAt", desc: true }],
//       columnPinning: { right: ["actions"] },
//     },
//     getRowId: (originalRow) => originalRow.id,
//     shallow: false,
//     clearOnDefault: true,
//   });
                                                                                                                                                                                                                                                                                                                    
//   return (
//     <>
//       <DataTable
//         table={table}
//         actionBar={<TasksTableActionBar table={table} />}
//       >
//         {enableAdvancedFilter ? (
//           <DataTableAdvancedToolbar table={table}>
//             <DataTableSortList table={table} align="start" />
//             {filterFlag === "advancedFilters" ? (
//               <DataTableFilterList
//                 table={table}
//                 shallow={shallow}
//                 debounceMs={debounceMs}
//                 throttleMs={throttleMs}
//                 align="start"
//               />
//             ) : (
//               <DataTableFilterMenu
//                 table={table}
//                 shallow={shallow}
//                 debounceMs={debounceMs}
//                 throttleMs={throttleMs}
//               />
//             )}
//           </DataTableAdvancedToolbar>
//         ) : (
//           <DataTableToolbar table={table}>
//             <DataTableSortList table={table} align="end" />
//           </DataTableToolbar>
//         )}
//       </DataTable>
//       <UpdateTaskSheet
//         open={rowAction?.variant === "update"}
//         onOpenChange={() => setRowAction(null)}
//         task={rowAction?.row.original ?? null}
//       />
//       <DeleteTasksDialog
//         open={rowAction?.variant === "delete"}
//         onOpenChange={() => setRowAction(null)}
//         tasks={rowAction?.row.original ? [rowAction?.row.original] : []}
//         showTrigger={false}
//         onSuccess={() => rowAction?.row.toggleSelected(false)}
//       />
//     </>
//   );
// }
