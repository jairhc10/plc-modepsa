// import * as React from "react"
// import { cn } from "../../lib/utils"

// const PopoverContext = React.createContext(null)

// function usePopover() {
//   const context = React.useContext(PopoverContext)
//   if (!context) {
//     throw new Error("usePopover must be used within a PopoverProvider")
//   }
//   return context
// }

// function Popover({ children, open: openProp, onOpenChange }) {
//   const [openState, setOpenState] = React.useState(false)
//   const open = openProp ?? openState
//   const setOpen = onOpenChange ?? setOpenState

//   const contextValue = React.useMemo(() => ({
//     open,
//     setOpen,
//   }), [open, setOpen])

//   return (
//     <PopoverContext.Provider value={contextValue}>
//       <div className="relative inline-block">
//         {children}
//       </div>
//     </PopoverContext.Provider>
//   )
// }

// const PopoverTrigger = React.forwardRef(({ 
//   className, 
//   children, 
//   asChild = false,
//   ...props 
// }, ref) => {
//   const { setOpen, open } = usePopover()

//   const handleClick = () => {
//     setOpen(!open)
//   }

//   if (asChild && React.isValidElement(children)) {
//     return React.cloneElement(children, {
//       ref,
//       onClick: (e) => {
//         handleClick()
//         children.props.onClick?.(e)
//       },
//       ...props
//     })
//   }

//   return (
//     <div
//       ref={ref}
//       className={cn("cursor-pointer", className)}
//       onClick={handleClick}
//       {...props}
//     >
//       {children}
//     </div>
//   )
// })
// PopoverTrigger.displayName = "PopoverTrigger"

// const PopoverContent = React.forwardRef(({ 
//   className, 
//   align = "center", 
//   children, 
//   sideOffset = 8,
//   ...props 
// }, ref) => {
//   const { open, setOpen } = usePopover()
//   const contentRef = React.useRef(null)

//   React.useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (contentRef.current && 
//           !contentRef.current.contains(event.target) &&
//           !event.target.closest('.popover-trigger')) {
//         setOpen(false)
//       }
//     }

//     const handleEscape = (event) => {
//       if (event.key === 'Escape') {
//         setOpen(false)
//       }
//     }

//     if (open) {
//       document.addEventListener('mousedown', handleClickOutside)
//       document.addEventListener('keydown', handleEscape)
//     }

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside)
//       document.removeEventListener('keydown', handleEscape)
//     }
//   }, [open, setOpen])

//   if (!open) return null

//   const positionClasses = {
//     start: "left-0",
//     center: "left-1/2 -translate-x-1/2",
//     end: "right-0"
//   }

//   return (
//     <div
//       ref={(node) => {
//         contentRef.current = node
//         if (typeof ref === 'function') ref(node)
//         else if (ref) ref.current = node
//       }}
//       className={cn(
//         "popover-content absolute z-50 w-auto rounded-lg border shadow-lg outline-none animate-in fade-in-0 zoom-in-95",
//         // Colores que se adaptan automáticamente al theme
//         "bg-card text-card-foreground border-border",
//         // Dark mode específico
//         "dark:bg-card dark:text-card-foreground dark:border-border",
//         positionClasses[align],
//         className
//       )}
//       style={{ marginTop: `${sideOffset}px` }}
//       {...props}
//     >
//       {children}
//     </div>
//   )
// })
// PopoverContent.displayName = "PopoverContent"

// export { Popover, PopoverTrigger, PopoverContent, usePopover }