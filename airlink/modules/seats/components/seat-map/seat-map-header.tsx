"use client"

interface SeatMapHeaderProps {
  leftColumns: string[]
  rightColumns: string[]
}

export function SeatMapHeader({ leftColumns, rightColumns }: SeatMapHeaderProps) {
  return (
    <div className="flex justify-center mb-4">
      <div className="w-10"></div>
      <div className="flex space-x-2 mr-8">
        {leftColumns.map((column) => (
          <div key={`header-${column}`} className="w-12 text-center font-medium">
            {column}
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        {rightColumns.map((column) => (
          <div key={`header-${column}`} className="w-12 text-center font-medium">
            {column}
          </div>
        ))}
      </div>
    </div>
  )
}
