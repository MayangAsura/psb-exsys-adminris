export const CreateColumn = (
  key,
  headerName
)=> ({
  accessorKey: key ,
  header: ({ column }) => (
    <TableColumnHeader column={column} title={headerName} />
  ),
  cell: ({ row }) => {
    const value = row.original[key]
    // <button className="btn btn-sm btn-square btn-ghost hover:bg-green-200" onClick={() => detailCurrentSchedule(l.id)}><EyeIcon className="w-5"/></button>
    //                                     <button className="btn btn-sm btn-square btn-ghost hover:bg-orange-200" onClick={() => editCurrentSchedule(l.id)}><PencilIcon className="w-5"/></button>
    //                                     <button className="btn btn-sm btn-square btn-ghost hover:bg-red-200" onClick={() => deleteCurrentSchedule(l.id)}><TrashIcon className="w-5"/></button>
    if(key=== 'act'){
        const actionValue= row.original[key];
        <button className="btn btn-sm btn-square btn-ghost hover:bg-green-200" onClick={action.callback}><EyeIcon className="w-5"/></button>
        // {actionValue?.map((action, index) => (
        // <>
        //     <button className="btn btn-sm btn-square btn-ghost hover:bg-orange-200" onClick={action.callback}><PencilIcon className="w-5"/></button>
        //     <button className="btn btn-sm btn-square btn-ghost hover:bg-red-200" onClick={action.callback}><TrashIcon className="w-5"/></button>
        // </>
        // ))}
    }

    // Handle different cell types based on the key
    if (key === "action") {
      const actionValue= row.original[key];
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="pl-2">
              <div className="flex gap-2 flex-col items-start">
                {actionValue?.map((action, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    onClick={action.callback}
                    className="text-xs py-1 hover:bg-transparent h-auto"
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    } else if (key === "image") {
      return (
        <Image
          src={`${row.original.image}`}
          alt={row.original.title}
          className="w-16 h-16 object-cover rounded-md"
        />
      );
    }

    return <div>{value}</div>;
  },
});