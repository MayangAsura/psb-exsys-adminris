    // src/components/columns.js
    import { ColumnDef } from "@tanstack/react-table";
    import { DataTableColumnHeader } from "@/components/data-table/column-header"; // Assuming you have a custom header component

    export const columns = [
      {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      },
      {
        accessorKey: "email",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
      },
      // ... add more columns as needed
    ];
