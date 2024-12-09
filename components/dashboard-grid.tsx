import { cn } from "@/lib/utils"

export function DashboardGrid({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-4", className)}
      {...props}
    >
      {children}
    </div>
  )
}

