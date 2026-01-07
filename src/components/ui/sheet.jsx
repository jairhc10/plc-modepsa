import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const Sheet = ({ open, onOpenChange, children }) => {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50">
          <div 
            className="fixed inset-0 bg-black/80" 
            onClick={() => onOpenChange(false)}
          />
          {children}
        </div>
      )}
    </>
  )
}

const SheetContent = React.forwardRef(({ 
  className, 
  children, 
  side = "right",
  style,
  ...props 
}, ref) => {
  const sideClasses = {
    right: "right-0 border-l",
    left: "left-0 border-r",
    top: "top-0 border-b",
    bottom: "bottom-0 border-t"
  }

  return (
    <div
      ref={ref}
      style={style}
      className={cn(
        "fixed z-50 bg-white shadow-lg transition-transform duration-300",
        side === "right" || side === "left" ? "h-full" : "w-full",
        sideClasses[side],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
SheetContent.displayName = "SheetContent"

const SheetHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
)
SheetHeader.displayName = "SheetHeader"

const SheetTitle = ({ className, ...props }) => (
  <h2 className={cn("text-lg font-semibold text-slate-950", className)} {...props} />
)
SheetTitle.displayName = "SheetTitle"

const SheetDescription = ({ className, ...props }) => (
  <p className={cn("text-sm text-slate-500", className)} {...props} />
)
SheetDescription.displayName = "SheetDescription"

export { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription }