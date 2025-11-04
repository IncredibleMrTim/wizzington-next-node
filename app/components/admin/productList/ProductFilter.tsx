import { Check, ChevronDown, X } from "lucide-react";
import { FiSearch } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { TextField } from "@radix-ui/themes";
import { Product } from "@/lib/types";
import { Table } from "@tanstack/react-table";

export const ProductFilter = ({ table }: { table: Table<Product> }) => {
  return (
    <div className="flex items-center py-4 justify-between">
      <TextField.Root
        placeholder="Filter products..."
        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn("name")?.setFilterValue(event.target.value)
        }
      >
        <TextField.Slot>
          <FiSearch />
        </TextField.Slot>
      </TextField.Root>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="!ml-auto !text-sm" size="sm">
            Columns <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="bg-white shadow-md rounded-sm p-4 gap-2 z-100"
        >
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide() && column.id !== "id")
            .map((column) => {
              return (
                <div
                  key={column.id}
                  className="grid grid-cols-[20%_80%] items-center border-b-1 border-b-stone-200 py-2"
                >
                  {column.getIsVisible() ? (
                    <Check size={16} className="mr-2 text text-green-600" />
                  ) : (
                    <X size={16} className="mr-2 text text-red-600" />
                  )}
                  <p
                    className="ml-2 capitalize !text-sm text-stone-800 cursor-pointer"
                    onClick={() =>
                      column.toggleVisibility(!column.getIsVisible())
                    }
                  >
                    {column.id}
                  </p>
                </div>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
