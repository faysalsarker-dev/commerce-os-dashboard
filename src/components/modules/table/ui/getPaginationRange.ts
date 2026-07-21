// getPaginationRange.ts
// Classic "sibling + boundary" ellipsis algorithm: 1 2 3 ... 12, or
// 1 ... 4 5 6 ... 12 in the middle, or 1 ... 10 11 12 near the end.

export type PaginationRangeItem = number | "ellipsis"

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

export function getPaginationRange(
  currentPage: number,
  totalPages: number,
  siblingCount = 1
): PaginationRangeItem[] {
  // first page + last page + current + 2*siblings + 2 possible ellipses
  const totalSlots = siblingCount * 2 + 5

  if (totalPages <= totalSlots) {
    return range(1, totalPages)
  }

  const leftSibling = Math.max(currentPage - siblingCount, 1)
  const rightSibling = Math.min(currentPage + siblingCount, totalPages)

  const showLeftEllipsis = leftSibling > 2
  const showRightEllipsis = rightSibling < totalPages - 1

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftItemCount = 3 + siblingCount * 2
    return [...range(1, leftItemCount), "ellipsis", totalPages]
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightItemCount = 3 + siblingCount * 2
    return [1, "ellipsis", ...range(totalPages - rightItemCount + 1, totalPages)]
  }

  return [1, "ellipsis", ...range(leftSibling, rightSibling), "ellipsis", totalPages]
}
