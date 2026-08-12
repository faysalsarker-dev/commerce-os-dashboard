
// import { ChevronLeft, ChevronRight } from "lucide-react"

// import { cn } from "@/lib/utils"
// import {
//   Pagination,
//   PaginationContent,
//   PaginationEllipsis,
//   PaginationItem,
//   PaginationLink,
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui"
// import { getPaginationRange } from "./getPaginationRange"


// interface DataTablePaginationProps {
//   page: number
//   pageCount: number

//   pageSize: number
//   totalRows?: number

//   resourceName?: string

//   onPageChange: (page: number) => void
//   onPageSizeChange?: (size: number) => void

//   pageSizeOptions?: number[]
//   siblingCount?: number
// }

// export function DataTablePagination({
//   page,
//   pageCount,
//   pageSize,
//   totalRows = 0,
//   resourceName,

//   onPageChange,
//   onPageSizeChange,

//   pageSizeOptions = [10, 20, 50],

//   siblingCount = 1,
// }: DataTablePaginationProps) {
//   const pages = getPaginationRange(page, pageCount, siblingCount)

//   const from = totalRows === 0 ? 0 : (page - 1) * pageSize + 1

//   const to =
//     totalRows === 0
//       ? 0
//       : Math.min(page * pageSize, totalRows)

//   return (
//     <div className="rounded border bg-card px-5 py-4 shadow">
//       {/* Desktop */}

//       <div className="hidden md:flex items-center justify-between gap-6">
//         {/* Left */}

//         <div className="text-sm text-muted-foreground whitespace-nowrap">
//           Showing{" "}
//           <span className="font-semibold text-foreground">
//             {from}-{to}
//           </span>{" "}
//           of{" "}
//           <span className="font-semibold text-foreground">
//             {totalRows}
//           </span>{" "}
//           {resourceName}
//         </div>

//         {/* Right */}

//         <div className="flex items-center gap-6">
//           {onPageSizeChange && (
//             <div className="flex items-center gap-2">
//               <span className="text-sm text-muted-foreground">
//                 Show
//               </span>

//               <Select
//                 value={String(pageSize)}
//                 onValueChange={(value) =>
//                   onPageSizeChange(Number(value))
//                 }
//               >
//                 <SelectTrigger className="h-9 w-[78px]">
//                   <SelectValue />
//                 </SelectTrigger>

//                 <SelectContent side="top">
//                   {pageSizeOptions.map((size) => (
//                     <SelectItem
//                       key={size}
//                       value={String(size)}
//                     >
//                       {size}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>

//               <span className="text-sm text-muted-foreground">
//                 entries
//               </span>
//             </div>
//           )}

//           <div className="text-sm whitespace-nowrap text-muted-foreground">
//             Page{" "}
//             <span className="font-semibold text-foreground">
//               {page}
//             </span>{" "}
//             of{" "}
//             <span className="font-semibold text-foreground">
//               {pageCount}
//             </span>
//           </div>

//           <Pagination className="mx-0 w-auto">
//             <PaginationContent>
//               {/* Previous */}

//               <PaginationItem className="mr-3">
//                 <PaginationLink
//                   aria-label="Previous Page"
//                   onClick={(e) => {
//                     e.preventDefault()

//                     if (page > 1)
//                       onPageChange(page - 1)
//                   }}
//                   className={cn(
//                     "h-9 px-3 transition-all",
//                     page <= 1 &&
//                       "pointer-events-none opacity-40"
//                   )}
//                 >
//                   <ChevronLeft className="mr-1 h-4 w-4" />
//                   Prev
//                 </PaginationLink>
//               </PaginationItem>

//               {/* Numbers */}

//               {pages.map((item, index) =>
//                 item === "ellipsis" ? (
//                   <PaginationItem key={index}>
//                     <PaginationEllipsis />
//                   </PaginationItem>
//                 ) : (
//                   <PaginationItem key={item}>
//                     <PaginationLink
//                       href="#"
//                       isActive={item === page}
//                       onClick={(e) => {
//                         e.preventDefault()

//                         onPageChange(item)
//                       }}
//                       className={cn(
//                         "h-9 min-w-9 rounded-md transition-all",

//                         item === page &&
//                           "bg-primary text-primary-foreground shadow-sm hover:bg-primary hover:text-primary-foreground"
//                       )}
//                     >
//                       {item}
//                     </PaginationLink>
//                   </PaginationItem>
//                 )
//               )}

//               {/* Next */}

//               <PaginationItem>
//                 <PaginationLink
//                   href="#"
//                   aria-label="Next Page"
//                   onClick={(e) => {
//                     e.preventDefault()

//                     if (page < pageCount)
//                       onPageChange(page + 1)
//                   }}
//                   className={cn(
//                     "h-9 px-3 transition-all",
//                     page >= pageCount &&
//                       "pointer-events-none opacity-40"
//                   )}
//                 >
//                   Next
//                   <ChevronRight className="ml-1 h-4 w-4" />
//                 </PaginationLink>
//               </PaginationItem>
//             </PaginationContent>
//           </Pagination>
//         </div>
//       </div>

//       {/* Mobile */}

//       <div className="flex flex-col gap-4 md:hidden">
//         <div className="flex items-center justify-between text-sm">
//           <span className="text-muted-foreground">
//             {from}-{to} of {totalRows}
//           </span>

//           <span className="font-medium">
//             {page}/{pageCount}
//           </span>
//         </div>

//         <div className="flex items-center justify-between">
//           <PaginationLink
//             href="#"
//             onClick={(e) => {
//               e.preventDefault()

//               if (page > 1)
//                 onPageChange(page - 1)
//             }}
//             className={cn(
//               page <= 1 &&
//                 "pointer-events-none opacity-40"
//             )}
//           >
//             <ChevronLeft className="mr-1 h-4 w-4" />
//             Prev
//           </PaginationLink>

//           <PaginationLink
//             href="#"
//             onClick={(e) => {
//               e.preventDefault()

//               if (page < pageCount)
//                 onPageChange(page + 1)
//             }}
//             className={cn(
//               page >= pageCount &&
//                 "pointer-events-none opacity-40"
//             )}
//           >
//             Next
//             <ChevronRight className="ml-1 h-4 w-4" />
//           </PaginationLink>
//         </div>

//         {onPageSizeChange && (
//           <div className="flex justify-center">
//             <Select
//               value={String(pageSize)}
//               onValueChange={(value) =>
//                 onPageSizeChange(Number(value))
//               }
//             >
//               <SelectTrigger className="w-[120px]">
//                 <SelectValue />
//               </SelectTrigger>

//               <SelectContent>
//                 {pageSizeOptions.map((size) => (
//                   <SelectItem
//                     key={size}
//                     value={String(size)}
//                   >
//                     {size} rows
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui"
import { getPaginationRange } from "./getPaginationRange"

interface DataTablePaginationProps {
  page: number
  pageCount: number

  pageSize: number
  totalRows?: number

  resourceName?: string

  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void

  pageSizeOptions?: number[]
  siblingCount?: number
}

export function DataTablePagination({
  page,
  pageCount,
  pageSize,
  totalRows = 0,
  

  onPageChange,
  onPageSizeChange,

  pageSizeOptions = [10, 20, 50],

  siblingCount = 1,
}: DataTablePaginationProps) {
   const pages = getPaginationRange(page, pageCount, siblingCount)
  
 
  const from = totalRows === 0 ? 0 : (page - 1) * pageSize + 1

  const to = totalRows === 0 ? 0 : Math.min(page * pageSize, totalRows)

  const navLink =
    "h-9 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"

  return (
    <div className="rounded-2xl border border-border/60 bg-card px-4 py-3 shadow-sm ring-1 ring-black/2 sm:px-5">
      {/* Desktop */}

      <div className="hidden items-center justify-between gap-6 md:flex">
        {/* Left */}
<div className="flex items-center gap-6">
 <div className="hidden text-sm whitespace-nowrap text-muted-foreground lg:block">
            Page <span className="font-semibold text-foreground">{page}</span>{" "}
            of <span className="font-semibold text-foreground">{pageCount}</span>
          </div>

   {onPageSizeChange && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows</span>

              <Select
                value={String(pageSize)}
                onValueChange={(value) => onPageSizeChange(Number(value))}
              >
                <SelectTrigger className="h-9 w-19 rounded-lg border-border/60 bg-muted/40 text-sm font-medium">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent side="top" className="rounded-xl">
                  {pageSizeOptions.map((size) => (
                    <SelectItem
                      key={size}
                      value={String(size)}
                      className="rounded-lg"
                    >
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

         
</div>

        {/* Right */}

       <Pagination className="mx-0 w-auto">
  <PaginationContent className="gap-0">
    {/* Previous */}
    <PaginationItem className="mr-4">
      <PaginationLink
        aria-label="Previous Page"
        onClick={(e) => {
          e.preventDefault();

          if (page > 1) onPageChange(page - 1);
        }}
        className={cn(
          navLink,
          "h-9 gap-1.5 rounded-lg border border-border/60 bg-background px-3",
          page <= 1 && "pointer-events-none opacity-40",
        )}
      >
        <ChevronLeft className="size-4" />
        Prev
      </PaginationLink>
    </PaginationItem>

    {/* Page Numbers */}
    <div className="flex items-center gap-1 rounded-xl bg-muted/40 p-1">
      {pages.map((item, index) =>
        item === "ellipsis" ? (
          <PaginationItem key={index}>
            <PaginationEllipsis className="size-9 text-muted-foreground" />
          </PaginationItem>
        ) : (
          <PaginationItem key={item}>
            <PaginationLink
              href="#"
              isActive={item === page}
              onClick={(e) => {
                e.preventDefault();
                onPageChange(item);
              }}
              className={cn(
                "size-9 rounded-lg text-sm font-medium transition-all",
                item === page
                  ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary hover:text-primary-foreground"
                  : "text-muted-foreground hover:bg-background hover:text-foreground",
              )}
            >
              {item}
            </PaginationLink>
          </PaginationItem>
        ),
      )}
    </div>

    {/* Next */}
    <PaginationItem className="ml-4">
      <PaginationLink
        href="#"
        aria-label="Next Page"
        onClick={(e) => {
          e.preventDefault();

          if (page < pageCount) onPageChange(page + 1);
        }}
        className={cn(
          navLink,
          "h-9 gap-1.5 rounded-lg border border-border/60 bg-background px-3",
          page >= pageCount && "pointer-events-none opacity-40",
        )}
      >
        Next
        <ChevronRight className="size-4" />
      </PaginationLink>
    </PaginationItem>
  </PaginationContent>
</Pagination>
      </div>

      {/* Mobile */}

      <div className="flex flex-col gap-3 md:hidden">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {from}-{to} of {totalRows}
          </span>

          <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold">
            {page}/{pageCount}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault()

              if (page > 1) onPageChange(page - 1)
            }}
            className={cn(
              navLink,
              "flex-1 gap-1 border border-border/60",
              page <= 1 && "pointer-events-none opacity-40"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </PaginationLink>

          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault()

              if (page < pageCount) onPageChange(page + 1)
            }}
            className={cn(
              navLink,
              "flex-1 gap-1 border border-border/60",
              page >= pageCount && "pointer-events-none opacity-40"
            )}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </PaginationLink>
        </div>

        {onPageSizeChange && (
          <div className="flex justify-center">
            <Select
              value={String(pageSize)}
              onValueChange={(value) => onPageSizeChange(Number(value))}
            >
              <SelectTrigger className="h-9 w-32.5 rounded-lg border-border/60 bg-muted/40 text-sm font-medium">
                <SelectValue />
              </SelectTrigger>

              <SelectContent className="rounded-xl">
                {pageSizeOptions.map((size) => (
                  <SelectItem
                    key={size}
                    value={String(size)}
                    className="rounded-lg"
                  >
                    {size} rows
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  )
}
