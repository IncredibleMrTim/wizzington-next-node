"use client";
import { useEffect, useState } from "react";
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
import { useGetProductsQuery } from "@/app/services/product/useGetProductsQuery";
import { useProductStore } from "@/stores/product/useProductStore";

import {
  columns,
  ProductListCustomCellContextProps,
} from "./productListColumnDefs";
import { ProductTableFooter } from "./ProductTableFooter";
import { ProductFilter } from "./ProductFilter";

import { useRouter } from "next/navigation";
import { Product } from "@/lib/types";

const ProductList = () => {
  const { data: allProducts } = useGetProductsQuery();
  const { setCurrentProduct, setProducts } = useProductStore();

  const router = useRouter();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState<Product[]>([]);

  useEffect(() => {
    if (allProducts) {
      setData(allProducts);
      setProducts(allProducts);
    }
  }, [allProducts, setProducts]);

  const table = useReactTable({
    data,
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

  const renderHeaders = () => (
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
                      header.getContext()
                    )}
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </TableHeader>
  );

  const renderBody = () => (
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
                  className="overflow-hidden text-ellipsis whitespace-nowrap py-4"
                >
                  {flexRender(cell.column.columnDef.cell as any, {
                    ...cell.getContext(),

                    onClick: ({
                      viewProduct,
                      deleteProduct,
                    }: ProductListCustomCellContextProps) => {
                      setCurrentProduct(cell.row.original);

                      // TODO: Need to add confirmation modal for delete
                      if (deleteProduct) {
                        // TODO: Implement delete mutation
                        // For now, just remove from local state
                        const updatedProductList = data.filter(
                          (product) => product.id !== cell.row.original.id
                        );

                        setProducts(updatedProductList);
                        setData(updatedProductList);
                      }

                      if (viewProduct && !deleteProduct) {
                        router.push(
                          `/product/${cell.row.original.name?.replace(
                            /\s+/g,
                            "-"
                          )}`
                        );
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
  );

  return (
    <>
      <div className="w-full bg-violet-50 p-4 rounded-sm  shadow-md shadow-gray-300 mt-4">
        <ProductFilter table={table} />
        <div className="">
          <div>
            {/* <Table className="table-fixed">{renderHeaders()}</Table> */}
            <div className="min-h-124 overflow-scroll border-1 border-stone-100 rounded-sm">
              <Table className="table-fixed">
                {renderHeaders()}
                {renderBody()}
              </Table>
            </div>
          </div>
        </div>
      </div>
      <ProductTableFooter table={table} allRowCount={data.length} />
    </>
  );
};

export default ProductList;
