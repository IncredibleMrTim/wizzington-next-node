"use client";
import { useCallback, useState } from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteProduct } from "@/actions";

import {
  columns,
  ProductListCustomCellContextProps,
} from "./productListColumnDefs";
import { ProductTableFooter } from "./ProductTableFooter";
import { ProductFilter } from "./ProductFilter";

import { useRouter } from "next/navigation";
import { ProductDTO } from "@/lib/types";
import { DialogBox } from "../../dialogBox/DialogBox";
import { Button } from "../../ui/button";
import { LuOctagonAlert } from "react-icons/lu";

const ProductList = ({ products }: { products: ProductDTO[] }) => {
  const router = useRouter();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [showDeleteDialog, setShowDeleteDialog] = useState<{
    show: boolean;
    id: string;
    name: string;
  } | null>(null);

  const table = useReactTable({
    data: products,
    columns,
    defaultColumn: {
      minSize: 50,
      maxSize: 300,
      size: 100,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility: {
        ...columnVisibility,
        id: false,
      },
      rowSelection,
    },
  });

  const renderHeaders = useCallback(
    () => (
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="border-stone-200">
            {headerGroup.headers.map((header) => {
              return (
                <TableHead
                  key={header.id}
                  style={{
                    width: `${header.column.columnDef.size}px!important`, // Apply explicit size
                  }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
    ),
    [table],
  );

  const renderBody = useCallback(
    () => (
      <TableBody className="overflow-scroll">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              draggable
              onDragOver={(e) => e.preventDefault()}
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
              className="border-0 odd:bg-violet-100 even:bg-violet-50"
            >
              {row.getVisibleCells().map((cell) => {
                return (
                  <TableCell
                    key={cell.id}
                    style={{
                      width: `${cell.column.columnDef.size}px`, // Apply explicit size
                    }}
                    className="overflow-hidden text-ellipsis truncate whitespace-nowrap py-4"
                  >
                    {flexRender(cell.column.columnDef.cell, {
                      ...cell.getContext(),

                      onClick: async ({
                        view,
                        delete: shouldDelete,
                      }: ProductListCustomCellContextProps) => {
                        const productId = cell.row.original.id;

                        if (shouldDelete && productId) {
                          setShowDeleteDialog({
                            show: true,
                            id: productId,
                            name: cell.row.original.name,
                          });
                        }

                        if (view && productId) {
                          router.push(`/product/${productId}`);
                        }
                      },
                    })}
                  </TableCell>
                );
              })}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    ),
    [table, router],
  );

  return (
    <>
      <div className="w-full bg-violet-50 p-4 rounded-sm  shadow-md shadow-gray-300 mt-4">
        <ProductFilter table={table} />
        <div className="">
          <div>
            {/* <Table className="table-fixed">{renderHeaders()}</Table> */}
            <div className="min-h-124 overflow-scroll border border-stone-100 rounded-sm">
              <Table className="table-fixed">
                {renderHeaders()}
                {renderBody()}
              </Table>
            </div>
          </div>
        </div>
      </div>
      <ProductTableFooter table={table} allRowCount={products.length} />
      {showDeleteDialog && (
        <DialogBox
          onOpenChange={(open) => !open && setShowDeleteDialog(null)}
          open={showDeleteDialog?.show}
          content={
            <div className="flex items-center gap-4">
              <LuOctagonAlert size={200} className="text-red-500" />

              <div className="flex flex-col gap-2">
                <div className="font-bold text-2xl">
                  Are you sure you wish to delete:
                </div>
                <div className="text-xl">{showDeleteDialog.name}</div>
                <div className="border border-red-300 p-4 rounded">
                  Deleting this product will remove it from the product
                  listings. If you wish to un-delete the product click on the
                  Show Deleted button and chose the product to un-delete.
                </div>
              </div>
            </div>
          }
          footer={
            <div className="flex gap-2">
              <Button
                onClick={async () => {
                  await deleteProduct(showDeleteDialog.id);
                  setShowDeleteDialog(null);
                }}
              >
                Delete
              </Button>
              <Button
                onClick={() => setShowDeleteDialog(null)}
                className="bg-red-500 text-white"
              >
                Cancel
              </Button>
            </div>
          }
        />
      )}
    </>
  );
};

export default ProductList;
