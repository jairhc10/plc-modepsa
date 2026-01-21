import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Filter, Calendar as CalendarIcon, Database } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import DateRangeCalendar from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "../../components/ui/pagination";

export default function Reportes2({ darkMode }) {
  // --- estados (solo UI, sin backend todavía) ---
  const [loadingReporte, setLoadingReporte] = useState(false);
  const [reporte, setReporte] = useState([]); // vacío por ahora

  // filtros
  const [numeroOt, setNumeroOt] = useState("");

  // calendario (mismo patrón que Home)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [hoveredDate, setHoveredDate] = useState(null);
  const calendarRef = useRef(null);

  const now = new Date();
  const [leftDate, setLeftDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1));
  const [rightDate, setRightDate] = useState(new Date(now.getFullYear(), now.getMonth() + 1, 1));

  const monthNames = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
  ];

  const handleLeftMonthChange = (newMonth) => {
    const newDate = new Date(leftDate);
    newDate.setMonth(newMonth);
    setLeftDate(newDate);
  };
  const handleLeftYearChange = (newYear) => {
    const newDate = new Date(leftDate);
    newDate.setFullYear(newYear);
    setLeftDate(newDate);
  };
  const prevMonthLeft = () => handleLeftMonthChange(leftDate.getMonth() - 1);
  const nextMonthLeft = () => handleLeftMonthChange(leftDate.getMonth() + 1);

  const handleRightMonthChange = (newMonth) => {
    const newDate = new Date(rightDate);
    newDate.setMonth(newMonth);
    setRightDate(newDate);
  };
  const handleRightYearChange = (newYear) => {
    const newDate = new Date(rightDate);
    newDate.setFullYear(newYear);
    setRightDate(newDate);
  };
  const prevMonthRight = () => handleRightMonthChange(rightDate.getMonth() - 1);
  const nextMonthRight = () => handleRightMonthChange(rightDate.getMonth() + 1);

  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsCalendarOpen(false);
      }
    }
    if (isCalendarOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCalendarOpen]);

  const handleDateClick = (date) => {
    if (!dateRange.from || (dateRange.from && dateRange.to)) {
      setDateRange({ from: date, to: null });
    } else if (date >= dateRange.from) {
      setDateRange({ ...dateRange, to: date });
      setIsCalendarOpen(false);
    } else {
      setDateRange({ from: date, to: null });
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    return `${date.getDate()} de ${monthNames[date.getMonth()]}, ${date.getFullYear()}`;
  };

  const clearDateSelection = () => setDateRange({ from: null, to: null });

  // paginación (UI)
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const buildPages = (page, pages) => {
    if (pages <= 5) return Array.from({ length: pages }, (_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, "...", pages];
    if (page >= pages - 2) return [1, "...", pages - 2, pages - 1, pages];
    return [1, "...", page - 1, page, page + 1, "...", pages];
  };

  // acciones demo
  const onBuscar = () => {
    // aquí después conectas tu backend
    setLoadingReporte(true);
    setTimeout(() => {
      setReporte([]); // sigue vacío por ahora
      setTotal(0);
      setPages(1);
      setPage(1);
      setLoadingReporte(false);
    }, 400);
  };

  const onLimpiar = () => {
    setNumeroOt("");
    setDateRange({ from: null, to: null });
    setReporte([]);
    setTotal(0);
    setPages(1);
    setPage(1);
  };

  return (
    // ✅ ESTE WRAPPER ES EL QUE TE CENTRA TODO Y LO HACE IGUAL A REPORTS
    <div className="w-full space-y-6 animate-in fade-in duration-500">
      {/* Filtros */}
      <div className={cn("rounded-lg border p-6", darkMode ? "bg-card border-border" : "bg-card")}>
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className={cn("h-5 w-5", darkMode ? "text-blue-400" : "text-primary")} />
            <h2 className="text-lg font-semibold">Filtros de Búsqueda</h2>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={onBuscar}
              disabled={loadingReporte}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              {loadingReporte ? "Consultando..." : "Buscar Datos"}
            </Button>
            <Button variant="ghost" size="sm" onClick={onLimpiar}>
              Limpiar Todo
            </Button>
          </div>
        </div>

        {/* Layout igual a Reports: OT + Calendario + (columna libre) */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Número OT */}
          <div className="space-y-2">
            <label className={cn("text-sm font-medium", darkMode ? "text-foreground" : "")}>
              Número OT
            </label>
            <Input
              placeholder="Ej: 0000100603"
              value={numeroOt}
              onChange={(e) => setNumeroOt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onBuscar();
              }}
            />
          </div>

          {/* Columna 3/4 libres (para que se vea igual al otro layout) */}
          <div />
          <div />
        </div>
      </div>

      {/* Tabla (igual a Reports) */}
      <div className={cn("rounded-lg border shadow-sm", darkMode ? "bg-card border-border" : "bg-card")}>
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold">Registros Recientes</h3>
          <p className="text-sm text-muted-foreground">Mostrando últimos movimientos del sistema</p>
        </div>

        {/* Sin datos */}
        {!loadingReporte && reporte.length === 0 && (
          <div className="p-12 text-center">
            <Database className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
            <p className="text-muted-foreground">
              No hay datos para mostrar. Haz clic en <strong>"Buscar Datos"</strong> para cargar el reporte.
            </p>
          </div>
        )}

        {/* Loading */}
        {loadingReporte && (
          <div className="p-12 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">Cargando datos...</p>
          </div>
        )}

        {/* Tabla (si luego metes data) */}
        {reporte.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <Table className="min-w-[1200px]">
                <TableHeader>
                  <TableRow className={darkMode ? "border-gray-800 hover:bg-gray-800/50" : ""}>
                    <TableHead>Columna 1</TableHead>
                    <TableHead>Columna 2</TableHead>
                    <TableHead>Columna 3</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reporte.map((r, i) => (
                    <TableRow key={i}>
                      <TableCell>{r.col1}</TableCell>
                      <TableCell>{r.col2}</TableCell>
                      <TableCell>{r.col3}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Paginación estilo tu ejemplo */}
            <div className="p-4 border-t border-border flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Mostrando {reporte.length} de {total} — Página {page} / {pages}
              </span>

              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      className={cn(darkMode ? "hover:bg-gray-800" : "", page <= 1 ? "pointer-events-none opacity-50" : "")}
                      onClick={(e) => {
                        e.preventDefault();
                        if (page > 1) setPage(page - 1);
                      }}
                    />
                  </PaginationItem>

                  {buildPages(page, pages).map((p, idx) => (
                    <PaginationItem key={`${p}-${idx}`}>
                      {p === "..." ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          href="#"
                          isActive={p === page}
                          className={cn(darkMode ? "hover:bg-gray-800" : "")}
                          onClick={(e) => {
                            e.preventDefault();
                            setPage(p);
                          }}
                        >
                          {p}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      className={cn(darkMode ? "hover:bg-gray-800" : "", page >= pages ? "pointer-events-none opacity-50" : "")}
                      onClick={(e) => {
                        e.preventDefault();
                        if (page < pages) setPage(page + 1);
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
