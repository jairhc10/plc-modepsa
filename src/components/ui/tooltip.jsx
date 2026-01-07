import * as React from "react"
import { cn } from "@/lib/utils"

const TooltipProvider = ({ 
  children, 
  delayDuration = 0,
  skipDelayDuration = 0,
  disableHoverableContent = false
}) => {
  return (
    <div className="relative">
      {children}
    </div>
  )
}

const Tooltip = ({ children }) => {
  const [open, setOpen] = React.useState(false)
  
  return React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      if (child.type.displayName === "TooltipTrigger") {
        return React.cloneElement(child, {
          onMouseEnter: () => setOpen(true),
          onMouseLeave: () => setOpen(false),
        })
      }
      if (child.type.displayName === "TooltipContent") {
        return React.cloneElement(child, { open })
      }
    }
    return child
  })
}
Tooltip.displayName = "Tooltip"

const TooltipTrigger = React.forwardRef(({ 
  children, 
  asChild = false, 
  onMouseEnter,
  onMouseLeave,
  ...props 
}, ref) => {
  const Comp = asChild ? React.Fragment : "div"
  
  const handleMouseEnter = (e) => {
    onMouseEnter?.(e)
  }
  
  const handleMouseLeave = (e) => {
    onMouseLeave?.(e)
  }
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ref,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      ...props
    })
  }
  
  return (
    <Comp
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </Comp>
  )
})
TooltipTrigger.displayName = "TooltipTrigger"

const TooltipContent = React.forwardRef(({ 
  className, 
  open = false,
  side = "top",
  align = "center",
  sideOffset = 4,
  hidden = false,
  children,
  ...props 
}, ref) => {
  if (hidden || !open) return null
  
  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 -translate-y-1 mb-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
    bottom: "top-full left-1/2 -translate-x-1/2 -translate-y-1 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
  }
  
  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 animate-in fade-in-0 zoom-in-95",
        positionClasses[side],
        className
      )}
      style={{
        animationDuration: "150ms"
      }}
      {...props}
    >
      <div className={cn(
        "rounded-md bg-slate-900 px-3 py-1.5 text-xs text-slate-50",
        "shadow-md"
      )}>
        {children}
      </div>
    </div>
  )
})
TooltipContent.displayName = "TooltipContent"

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }