"use client"

import { useState, useRef, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ResizableColumn {
  id: string
  title: string
  width: number
  minWidth?: number
  maxWidth?: number
}

interface ResizableTableProps {
  columns: ResizableColumn[]
  onColumnResize?: (columnId: string, width: number) => void
  children: React.ReactNode
  className?: string
}

export function ResizableTable({ 
  columns: initialColumns, 
  onColumnResize, 
  children, 
  className = "" 
}: ResizableTableProps) {
  const [columns, setColumns] = useState(initialColumns)
  const [isResizing, setIsResizing] = useState<string | null>(null)
  const [startX, setStartX] = useState(0)
  const [startWidth, setStartWidth] = useState(0)
  const tableRef = useRef<HTMLTableElement>(null)

  const handleMouseDown = (e: React.MouseEvent, columnId: string) => {
    const column = columns.find(col => col.id === columnId)
    if (!column) return

    setIsResizing(columnId)
    setStartX(e.clientX)
    setStartWidth(column.width)
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return

    const column = columns.find(col => col.id === isResizing)
    if (!column) return

    const deltaX = e.clientX - startX
    let newWidth = startWidth + deltaX

    // 应用最小和最大宽度限制
    if (column.minWidth && newWidth < column.minWidth) {
      newWidth = column.minWidth
    }
    if (column.maxWidth && newWidth > column.maxWidth) {
      newWidth = column.maxWidth
    }

    setColumns(prev => prev.map(col => 
      col.id === isResizing ? { ...col, width: newWidth } : col
    ))

    if (onColumnResize) {
      onColumnResize(isResizing, newWidth)
    }
  }

  const handleMouseUp = () => {
    setIsResizing(null)
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  return (
    <div className={`overflow-x-auto ${className}`}>
      <Table ref={tableRef} style={{ minWidth: columns.reduce((sum, col) => sum + col.width, 0) }}>
        <TableHeader>
          <TableRow className="bg-gray-50">
            {columns.map((column, index) => (
              <TableHead 
                key={column.id}
                className="relative border-r border-gray-200 last:border-r-0"
                style={{ 
                  width: column.width,
                  minWidth: column.width,
                  maxWidth: column.width
                }}
              >
                {column.title}
                {index < columns.length - 1 && (
                  <div
                    className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-400 transition-colors"
                    onMouseDown={(e) => handleMouseDown(e, column.id)}
                    style={{ 
                      backgroundColor: isResizing === column.id ? '#3b82f6' : 'transparent',
                      width: '4px',
                      marginRight: '-2px'
                    }}
                  />
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {children}
        </TableBody>
      </Table>
    </div>
  )
}

// 用于表格行中的单元格组件
interface ResizableTableCellProps {
  columnId: string
  columns: ResizableColumn[]
  children: React.ReactNode
  className?: string
}

export function ResizableTableCell({ 
  columnId, 
  columns, 
  children, 
  className = "" 
}: ResizableTableCellProps) {
  const column = columns.find(col => col.id === columnId)
  const width = column?.width || 'auto'

  return (
    <TableCell 
      className={className}
      style={{ 
        width,
        minWidth: width,
        maxWidth: width
      }}
    >
      {children}
    </TableCell>
  )
}