import * as React from "react"
import { cn } from "@/lib/utils"

const PopoverContext = React.createContext(null)

function usePopover() {
  const context = React.useContext(PopoverContext)
  if (!context) {
    throw new Error("usePopover must be used within a PopoverProvider")
  }
  return context
}

function Popover({ children, open: openProp, onOpenChange }) {
  const [openState, setOpenState] = React.useState(false)
  const open = openProp ?? openState
  const setOpen = onOpenChange ?? setOpenState

  const contextValue = React.useMemo(() => ({
    open,
    setOpen,
  }), [open, setOpen])

  return (
    <PopoverContext.Provider value={contextValue}>
      <div className="relative inline-block">
        {children}
      </div>
    </PopoverContext.Provider>
  )
}

const PopoverTrigger = React.forwardRef(({ 
  className, 
  children, 
  asChild = false,
  ...props 
}, ref) => {
  const { setOpen, open } = usePopover()

  const handleClick = () => {
    setOpen(!open)
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ref,
      onClick: (e) => {
        handleClick()
        children.props.onClick?.(e)
      },
      ...props
    })
  }

  return (
    <div
      ref={ref}
      className={cn("cursor-pointer", className)}
      onClick={handleClick}
      {...props}
    >
      {children}
    </div>
  )
})
PopoverTrigger.displayName = "PopoverTrigger"

const PopoverContent = React.forwardRef(({ 
  className, 
  align = "center", 
  children, 
  ...props 
}, ref) => {
  const { open, setOpen } = usePopover()

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.popover-content') && 
          !event.target.closest('.popover-trigger')) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open, setOpen])

  if (!open) return null

  const positionClasses = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0"
  }

  return (
    <div
      ref={ref}
      className={cn(
        "popover-content absolute z-50 mt-2 w-72 rounded-md border bg-popover text-popover-foreground p-0 shadow-lg outline-none animate-in fade-in-80",
        positionClasses[align],
        className
      )}
      {...props}
    >
      <div className="p-4">
        {children}
      </div>
    </div>
  )
})
PopoverContent.displayName = "PopoverContent"

export { Popover, PopoverTrigger, PopoverContent, usePopover }