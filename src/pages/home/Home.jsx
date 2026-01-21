import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Home as HomeIcon,
  Settings,
  LogOut,
  Search,
  Filter,
  Download,
  Eye,
  Calendar as CalendarIcon,
  Moon,
  Sun,
  Bell,
  Database,
  Cpu,
  Activity,
  AlertCircle,
  User,
  Shield,
  FileBarChart,
  X,
  ChevronDown,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from '../../components/ui/sidebar';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from '../../components/ui/pagination';
import { Button } from '../../components/ui/button';
import { Toaster, toast } from '../../components/ui/sonner';
import { Input } from '../../components/ui/input';
import { cn } from '@/lib/utils';
import DateRangeCalendar from '@/components/ui/calendar';
import { reportesService } from '../../services/reportesService';
import { FileSpreadsheet } from "lucide-react";
import Reportes2 from "./reportes2";
// =========================================================================
// 1. COMPONENTE INTERNO: AQUÍ VA TODA TU LÓGICA, ESTADOS Y VISTAS
// =========================================================================
function DashboardInternal() {
  const { state: sidebarState } = useSidebar();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // --- ESTADO INICIAL ---
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const [ootFilter, setOotFilter] = useState('all');
  const [plcFilter, setPlcFilter] = useState('all');
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || document.documentElement.classList.contains('dark');
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Date Range Picker State
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [hoveredDate, setHoveredDate] = useState(null);
  const calendarRef = useRef(null);

  // Lógica del Calendario
  const now = new Date();
  const [leftDate, setLeftDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1));
  const [rightDate, setRightDate] = useState(new Date(now.getFullYear(), now.getMonth() + 1, 1));

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  const handleLeftMonthChange = (newMonth) => { const newDate = new Date(leftDate); newDate.setMonth(newMonth); setLeftDate(newDate); };
  const handleLeftYearChange = (newYear) => { const newDate = new Date(leftDate); newDate.setFullYear(newYear); setLeftDate(newDate); };
  const prevMonthLeft = () => handleLeftMonthChange(leftDate.getMonth() - 1);
  const nextMonthLeft = () => handleLeftMonthChange(leftDate.getMonth() + 1);

  const handleRightMonthChange = (newMonth) => { const newDate = new Date(rightDate); newDate.setMonth(newMonth); setRightDate(newDate); };
  const handleRightYearChange = (newYear) => { const newDate = new Date(rightDate); newDate.setFullYear(newYear); setRightDate(newDate); };
  const prevMonthRight = () => handleRightMonthChange(rightDate.getMonth() - 1);
  const nextMonthRight = () => handleRightMonthChange(rightDate.getMonth() + 1);

  const [reporteHornos, setReporteHornos] = useState([]);

  const [loadingReporte, setLoadingReporte] = useState(false);
  const [errorReporte, setErrorReporte] = useState(null);

  // ✅ paginación real
  const [page, setPage] = useState(1);
  const [size] = useState(10); // 10 por hoja
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  // ✅ filtro OT real (input)
  const [numeroOt, setNumeroOt] = useState('');

  // ---------------------------
  // IMPLEMENTACIÓN: helpers (para que 0 se muestre)
  // ---------------------------
  const hasValue = (v) => v !== null && v !== undefined;
  const safeDate = (v) => {
    if (!v) return null;
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
  };
  const isEpoch = (v) => {
    const d = safeDate(v);
    return d && d.getFullYear() === 1970;
  };
  const buildPages = (page, pages) => {
  // estilo como tu ejemplo: 1 2 3 ... (con current y cerca)
  if (pages <= 5) return Array.from({ length: pages }, (_, i) => i + 1);

  // Si estás al inicio: 1 2 3 ... pages
  if (page <= 3) return [1, 2, 3, '...', pages];

  // Si estás al final: 1 ... (pages-2) (pages-1) pages
  if (page >= pages - 2) return [1, '...', pages - 2, pages - 1, pages];

  // En medio: 1 ... (page-1) page (page+1) ... pages
  return [1, '...', page - 1, page, page + 1, '...', pages];
};


  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsCalendarOpen(false);
      }
    }
    if (isCalendarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
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
    if (!date) return '';
    return `${date.getDate()} de ${monthNames[date.getMonth()]}, ${date.getFullYear()}`;
  };

  const clearDateSelection = () => setDateRange({ from: null, to: null });

  // DATOS MOCKEADOS
  const registros = [
    { id: 'RR0281', fecha: '24 Oct 2023, 10:45:22', plc: 'PLC-01', oot: 'OOT-BB21', variable: 'TEMP_SENSOR_A1', valor: '85.4°C', estado: 'Finalizado' },
    { id: 'RR0282', fecha: '24 Oct 2023, 10:45:25', plc: 'PLC-01', oot: 'OOT-BB21', variable: 'PRESSURE_V2', valor: '121 Bar', estado: 'Pendiente' },
    { id: 'RR0283', fecha: '24 Oct 2023, 10:46:01', plc: 'PLC-03', oot: 'OOT-BB24', variable: 'SPEED_ROTOR', valor: '1200 RPM', estado: 'Finalizado' },
    { id: 'RR0284', fecha: '24 Oct 2023, 10:46:15', plc: 'PLC-02', oot: 'OOT-BB22', variable: 'FLOW_METER_IN', valor: '450 L/h', estado: 'Pendiente' },
    { id: 'RR0285', fecha: '24 Oct 2023, 10:47:00', plc: 'PLC-01', oot: 'OOT-BB21', variable: 'TEMP_SENSOR_A1', valor: '86.2°C', estado: 'Finalizado' },
  ];

  const menuItems = [
    { type: 'item', id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
    { type: 'item', id: 'reports', label: 'Reports', icon: FileBarChart },
    { type: 'item', id: 'reports2', label: 'Reportes 2', icon: FileBarChart },
    { type: 'item', id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    toast.success('Sesión cerrada correctamente');
    navigate('/login');
  };

  const clearFilters = () => {
    setDateRange({ from: null, to: null });
    setOotFilter('all');
    setPlcFilter('all');
    setSearchTerm('');

    // reset paginación + tabla + OT input
    setNumeroOt('');
    setPage(1);
    setTotal(0);
    setPages(1);
    setReporteHornos([]);

    toast.info('Filtros limpiados');
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const filteredRegistros = registros.filter(registro => {
    const matchesSearch = searchTerm === '' ||
      registro.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registro.variable.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registro.oot.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOOT = ootFilter === 'all' || registro.oot === ootFilter;
    const matchesPLC = plcFilter === 'all' || registro.plc === plcFilter;
    return matchesSearch && matchesOOT && matchesPLC;
  });

  const handleExportCSV = () => toast.success('Exportando datos a CSV...');
  const handleViewDetails = (id) => toast.info(`Viendo detalles del registro ${id}`);

  // Función para obtener reporte de hornos
  const obtenerReporteHornos = async (targetPage = 1) => {
    setLoadingReporte(true);
    setErrorReporte(null);

    try {
      const filtrosBase = {
        fecha_desde: dateRange.from ? dateRange.from.toISOString().split('T')[0] : null,
        fecha_hasta: dateRange.to ? dateRange.to.toISOString().split('T')[0] : null,
        numero_ot: (numeroOt && numeroOt.trim() !== '')
          ? numeroOt.trim()
          : (ootFilter !== 'all' ? ootFilter : null),

        // backend paginado
        page: targetPage,
        size: size,
      };

      const resp = await reportesService.obtenerReporteHornos(filtrosBase);

      if (!resp?.success) {
        throw new Error(resp?.error || 'Error al obtener reporte');
      }

      setReporteHornos(resp.data || []);
      setTotal(Number(resp.total || 0));
      setPage(Number(resp.page || targetPage));
      setPages(Number(resp.pages || 1));

      toast.success(`Se encontraron ${Number(resp.total || 0)} registros`);
    } catch (error) {
      setErrorReporte(error.message || 'Error desconocido');
    } finally {
      setLoadingReporte(false);
    }
  };

  // Función para exportar a Excel
  const handleExportExcel = async () => {
    if (loadingReporte) {
      toast.warning("Espera a que termine la consulta actual");
      return;
    }

    try {
      setLoadingReporte(true);

      // Construir filtros (mismos que "Buscar Datos")
      const filtrosBase = {
        fecha_desde: dateRange.from
          ? dateRange.from.toISOString().split('T')[0]
          : null,
        fecha_hasta: dateRange.to
          ? dateRange.to.toISOString().split('T')[0]
          : null,
        numero_ot: (numeroOt && numeroOt.trim() !== '')
          ? numeroOt.trim()
          : (ootFilter !== 'all' ? ootFilter : null),
      };

      const resultado = await reportesService.exportarReporteHornosExcel(filtrosBase);

      if (resultado.success) {
        toast.success("Excel descargado correctamente");
      } else {
        toast.error(resultado.error || "Error al exportar Excel");
      }

    } catch (error) {
      toast.error("Error al exportar Excel");
      console.error(error);
    } finally {
      setLoadingReporte(false);
    }
  };

  // --- VISTA REPORTES (Contenido completo) ---
  const renderReportsView = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Estadísticas */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total PLCs', value: '12', icon: Cpu, light: 'bg-blue-500', dark: 'bg-blue-600', text: 'text-white' },
          { label: 'Registros Hoy', value: '1,245', icon: Database, light: 'bg-green-500', dark: 'bg-green-600', text: 'text-white' },
          { label: 'Alertas Activas', value: '8', icon: AlertCircle, light: 'bg-red-500', dark: 'bg-red-600', text: 'text-white' },
          { label: 'OOT Activas', value: '24', icon: Activity, light: 'bg-purple-500', dark: 'bg-purple-600', text: 'text-white' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={cn("rounded-lg border p-6", darkMode ? "bg-card border-border" : "bg-card")}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={cn("text-sm font-medium", darkMode ? "text-muted-foreground" : "text-muted-foreground")}>{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={cn("rounded-lg p-3", darkMode ? stat.dark : stat.light, stat.text)}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filtros */}
      <div className={cn("rounded-lg border p-6", darkMode ? "bg-card border-border" : "bg-card")}>
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className={cn("h-5 w-5", darkMode ? "text-blue-400" : "text-primary")} />
            <h2 className="text-lg font-semibold">Filtros de Búsqueda</h2>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => { setPage(1); obtenerReporteHornos(1); }}
              disabled={loadingReporte}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              {loadingReporte ? 'Consultando...' : 'Buscar Datos'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="self-start sm:self-center"
            >
              Limpiar Todo
            </Button>
          </div>
        </div>

        {/* TU LAYOUT: Input OT + Calendario + Export */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <label className={cn("text-sm font-medium", darkMode ? "text-foreground" : "")}>
              Número OT
            </label>
            <Input
              placeholder="Ej: 0000100603"
              value={numeroOt}
              onChange={(e) => setNumeroOt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setPage(1);
                  obtenerReporteHornos(1);
                }
              }}
            />
          </div>

          {/* Calendario Range Picker */}
          <div className="space-y-3 relative" ref={calendarRef}>
            <label className={cn("text-sm font-medium block", darkMode ? "text-foreground" : "")}>Rango de Fechas</label>
            <button
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              className={cn("w-full flex items-center justify-start gap-2 px-5 py-2 h-10 rounded-md border transition text-sm",
                darkMode ? "bg-background border-border text-foreground hover:bg-accent" : "bg-white border-input text-gray-900 hover:bg-gray-50")}
            >
              <CalendarIcon className="w-4 h-4" />
              <span className={dateRange.from ? '' : 'text-gray-400'}>
                {dateRange.from ? (dateRange.to ? `${formatDate(dateRange.from)} - ${formatDate(dateRange.to)}` : formatDate(dateRange.from)) : 'Seleccionar rango de fechas'}
              </span>
            </button>
            {isCalendarOpen && (
              <div className={`absolute z-50 mt-2 rounded-lg shadow-2xl border left-0 w-[680px] ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="px-6 py-4 flex gap-6 justify-center">
                  <DateRangeCalendar
                    darkMode={darkMode}
                    year={leftDate.getFullYear()}
                    month={leftDate.getMonth()}
                    onDateClick={handleDateClick}
                    dateRange={dateRange}
                    hoveredDate={hoveredDate}
                    onHoverDate={setHoveredDate}
                    onLeaveDate={() => setHoveredDate(null)}
                    onMonthChange={handleLeftMonthChange}
                    onYearChange={handleLeftYearChange}
                    onPreviousMonth={prevMonthLeft}
                    onNextMonth={nextMonthLeft}
                    showLeftArrow={true}
                    showRightArrow={false}
                    showNavigation={true}
                  />
                  <div className={`w-px my-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                  <DateRangeCalendar
                    darkMode={darkMode}
                    year={rightDate.getFullYear()}
                    month={rightDate.getMonth()}
                    onDateClick={handleDateClick}
                    dateRange={dateRange}
                    hoveredDate={hoveredDate}
                    onHoverDate={setHoveredDate}
                    onLeaveDate={() => setHoveredDate(null)}
                    onMonthChange={handleRightMonthChange}
                    onYearChange={handleRightYearChange}
                    onPreviousMonth={prevMonthRight}
                    onNextMonth={nextMonthRight}
                    showLeftArrow={false}
                    showRightArrow={true}
                    showNavigation={true}
                  />
                </div>
                <div className={`px-4 py-3 border-t flex justify-end ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                  {dateRange.from && (
                    <button
                      onClick={clearDateSelection}
                      className={cn("flex items-center gap-2 px-3 py-1.5 text-xs rounded-md transition", darkMode ? "bg-red-500/10 text-red-400 hover:bg-red-500/20" : "bg-red-50 text-red-600 hover:bg-red-100")}
                    >
                      Limpiar Fechas
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Exportar Excel */}
          <div className="flex justify-center">
            <div className="space-y-2">
              <label className={cn("text-sm font-medium", darkMode ? "text-muted-foreground" : "text-gray-700")}>
                Exportar
              </label>

              <Button
                onClick={handleExportExcel}
                disabled={loadingReporte}
                title="Exportar a Excel"
                className={cn(
                  "w-full h-10 text-sm font-medium bg-green-600 hover:bg-green-700 text-white",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                {loadingReporte ? 'Exportando...' : 'Excel'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className={cn("rounded-lg border shadow-sm", darkMode ? "bg-card border-border" : "bg-card")}>
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold">Registros Recientes</h3>
          <p className="text-sm text-muted-foreground">Mostrando últimos movimientos del sistema</p>
        </div>

        {/* error */}
        {!loadingReporte && errorReporte && (
          <div className="p-4 border-b border-border text-sm text-red-500">
            {errorReporte}
          </div>
        )}

        {/* Mensaje de sin datos */}
        {!loadingReporte && reporteHornos.length === 0 && (
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
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando datos...</p>
          </div>
        )}

        {/* Tabla solo si hay datos */}
        {reporteHornos.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <Table className="min-w-[2000px]">
                <TableHeader>
                  <TableRow className={darkMode ? "border-gray-800 hover:bg-gray-800/50" : ""}>
                    <TableHead className="min-w-[120px]">Fecha Registro</TableHead>
                    <TableHead className="min-w-[120px]">Número OT</TableHead>
                    <TableHead className="min-w-[110px]">Peso Unit.</TableHead>
                    <TableHead className="min-w-[110px]">Peso Total</TableHead>
                    <TableHead className="min-w-[180px]">Fecha Fin Manual</TableHead>
                    <TableHead className="min-w-[180px]">Fecha Fin Auto</TableHead>
                    <TableHead className="min-w-[140px]">Modo Ingreso</TableHead>
                    <TableHead className="min-w-[100px]">Dureza 1</TableHead>
                    <TableHead className="min-w-[100px]">Dureza 2</TableHead>
                    <TableHead className="min-w-[100px]">Dureza 3</TableHead>
                    <TableHead className="min-w-[180px]">Fecha Modificación</TableHead>
                    <TableHead className="min-w-[120px]">Usuario</TableHead>
                    <TableHead className="min-w-[110px]">Temp. H1</TableHead>
                    <TableHead className="min-w-[110px]">Temp. H2</TableHead>
                    <TableHead className="min-w-[110px]">Temp. H3</TableHead>
                    <TableHead className="min-w-[110px]">Temp. H4</TableHead>
                    <TableHead className="min-w-[110px]">Temp. H5</TableHead>
                    <TableHead className="min-w-[110px]">Temp. H6</TableHead>
                    <TableHead className="min-w-[110px]">Temp. H7</TableHead>
                    <TableHead className="text-center sticky right-0 z-10 bg-background">Acciones</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {reporteHornos.map((registro, index) => {
                    const fr = safeDate(registro.Fecha_Registro);
                    const ffm = safeDate(registro.Fecha_Fin_Manual);
                    const ffa = safeDate(registro.Fecha_Fin_Auto);
                    const fmod = safeDate(registro.Fecha_Modificacion);

                    const t1 = registro["TEMPERATURA HORNO1"];
                    const t2 = registro["TEMPERATURA HORNO2"];
                    const t3 = registro["TEMPERATURA HORNO3"];
                    const t4 = registro["TEMPERATURA HORNO4"];
                    const t5 = registro["TEMPERATURA HORNO5"];
                    const t6 = registro["TEMPERATURA HORNO6"];
                    const t7 = registro["TEMPERATURA HORNO7"];

                    return (
                      <TableRow key={index} className={darkMode ? "border-gray-800 hover:bg-gray-800/50" : ""}>
                        {/* Fecha Registro */}
                        <TableCell className="font-medium sticky left-0 z-10 bg-background">
                          {fr ? fr.toLocaleString('es-PE', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                          }) : "Fecha inválida"}
                        </TableCell>

                        {/* Número OT */}
                        <TableCell>
                          <span className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-900/20 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-400 ring-1 ring-inset ring-blue-700/10">
                            {registro.Numero_OT}
                          </span>
                        </TableCell>

                        {/* Peso Unitario */}
                        <TableCell>
                          {hasValue(registro.Peso_Unitario) ? (
                            <span className="font-medium">{Number(registro.Peso_Unitario).toFixed(2)}</span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                              N/A
                            </span>
                          )}
                        </TableCell>

                        {/* Peso Total */}
                        <TableCell className="font-medium">
                          {hasValue(registro.Peso_Total) ? (
                            <span className="font-semibold text-green-600 dark:text-green-400">{Number(registro.Peso_Total).toFixed(2)}</span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                              N/A
                            </span>
                          )}
                        </TableCell>

                        {/* Fecha Fin Manual */}
                        <TableCell className="text-sm">
                          {ffm ? (
                            <span className="text-muted-foreground">
                              {ffm.toLocaleString('es-PE', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                              Sin registro
                            </span>
                          )}
                        </TableCell>

                        {/* Fecha Fin Auto */}
                        <TableCell className="text-sm">
                          {ffa && !isEpoch(registro.Fecha_Fin_Auto) ? (
                            <span className="text-muted-foreground">
                              {ffa.toLocaleString('es-PE', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                              Sin registro
                            </span>
                          )}
                        </TableCell>

                        {/* Modo Ingreso Carga */}
                        <TableCell>
                          {registro.Modo_Ingreso_Carga ? (
                            <span className={cn("inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                              registro.Modo_Ingreso_Carga === 'Automatico'
                                ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 ring-1 ring-green-600/20"
                                : "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 ring-1 ring-blue-600/20"
                            )}>
                              {registro.Modo_Ingreso_Carga}
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                              No definido
                            </span>
                          )}
                        </TableCell>

                        {/* Dureza 1 */}
                        <TableCell>
                          {hasValue(registro.Dureza_1) ? (
                            <span className="inline-flex items-center rounded-full bg-purple-50 dark:bg-purple-900/20 px-2 py-1 text-xs font-medium text-purple-700 dark:text-purple-400 ring-1 ring-purple-600/20">
                              {Number(registro.Dureza_1).toFixed(1)}
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                              Sin dato
                            </span>
                          )}
                        </TableCell>

                        {/* Dureza 2 */}
                        <TableCell>
                          {hasValue(registro.Dureza_2) ? (
                            <span className="inline-flex items-center rounded-full bg-purple-50 dark:bg-purple-900/20 px-2 py-1 text-xs font-medium text-purple-700 dark:text-purple-400 ring-1 ring-purple-600/20">
                              {Number(registro.Dureza_2).toFixed(1)}
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                              Sin dato
                            </span>
                          )}
                        </TableCell>

                        {/* Dureza 3 */}
                        <TableCell>
                          {hasValue(registro.Dureza_3) ? (
                            <span className="inline-flex items-center rounded-full bg-purple-50 dark:bg-purple-900/20 px-2 py-1 text-xs font-medium text-purple-700 dark:text-purple-400 ring-1 ring-purple-600/20">
                              {Number(registro.Dureza_3).toFixed(1)}
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                              Sin dato
                            </span>
                          )}
                        </TableCell>

                        {/* Fecha Modificación */}
                        <TableCell className="text-sm">
                          {fmod ? (
                            <span className="text-muted-foreground">
                              {fmod.toLocaleString('es-PE', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                              Sin cambios
                            </span>
                          )}
                        </TableCell>

                        {/* Usuario */}
                        <TableCell>
                          {registro.Usuario ? (
                            <span className="inline-flex items-center gap-1">
                              <User className="h-3 w-3 text-muted-foreground" />
                              {registro.Usuario}
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                              Sin asignar
                            </span>
                          )}
                        </TableCell>

                        {/* Temperaturas (0 debe mostrarse) */}
                        <TableCell>
                          {hasValue(t1) ? (
                            <span className={cn("inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                              darkMode ? "bg-orange-900/20 text-orange-400 ring-1 ring-orange-500/20" : "bg-orange-100 text-orange-800 ring-1 ring-orange-600/20")}>
                              {Number(t1).toFixed(1)}°C
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                              Inactivo
                            </span>
                          )}
                        </TableCell>

                        <TableCell>
                          {hasValue(t2) ? (
                            <span className={cn("inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                              darkMode ? "bg-orange-900/20 text-orange-400 ring-1 ring-orange-500/20" : "bg-orange-100 text-orange-800 ring-1 ring-orange-600/20")}>
                              {Number(t2).toFixed(1)}°C
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                              Inactivo
                            </span>
                          )}
                        </TableCell>

                        <TableCell>
                          {hasValue(t3) ? (
                            <span className={cn("inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                              darkMode ? "bg-orange-900/20 text-orange-400 ring-1 ring-orange-500/20" : "bg-orange-100 text-orange-800 ring-1 ring-orange-600/20")}>
                              {Number(t3).toFixed(1)}°C
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                              Inactivo
                            </span>
                          )}
                        </TableCell>

                        <TableCell>
                          {hasValue(t4) ? (
                            <span className={cn("inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                              darkMode ? "bg-orange-900/20 text-orange-400 ring-1 ring-orange-500/20" : "bg-orange-100 text-orange-800 ring-1 ring-orange-600/20")}>
                              {Number(t4).toFixed(1)}°C
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                              Inactivo
                            </span>
                          )}
                        </TableCell>

                        <TableCell>
                          {hasValue(t5) ? (
                            <span className={cn("inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                              darkMode ? "bg-orange-900/20 text-orange-400 ring-1 ring-orange-500/20" : "bg-orange-100 text-orange-800 ring-1 ring-orange-600/20")}>
                              {Number(t5).toFixed(1)}°C
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                              Inactivo
                            </span>
                          )}
                        </TableCell>

                        <TableCell>
                          {hasValue(t6) ? (
                            <span className={cn("inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                              darkMode ? "bg-orange-900/20 text-orange-400 ring-1 ring-orange-500/20" : "bg-orange-100 text-orange-800 ring-1 ring-orange-600/20")}>
                              {Number(t6).toFixed(1)}°C
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                              Inactivo
                            </span>
                          )}
                        </TableCell>

                        <TableCell>
                          {hasValue(t7) ? (
                            <span className={cn("inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                              darkMode ? "bg-orange-900/20 text-orange-400 ring-1 ring-orange-500/20" : "bg-orange-100 text-orange-800 ring-1 ring-orange-600/20")}>
                              {Number(t7).toFixed(1)}°C
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                              Inactivo
                            </span>
                          )}
                        </TableCell>

                        {/* Acciones */}
                        <TableCell className="sticky right-0 z-10 bg-background w-24 px-2">
                          <div className="flex w-full justify-center items-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                              onClick={() => handleViewDetails(registro.Numero_OT)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Paginación */}
<div className="p-4 border-t border-border flex items-center justify-between">
  <span className="text-sm text-muted-foreground">
    Mostrando {reporteHornos.length} de {total} — Página {page} / {pages}
  </span>

  <Pagination>
    <PaginationContent>
      <PaginationItem>
        <PaginationPrevious
          href="#"
          className={cn(darkMode ? "hover:bg-gray-800" : "", (page <= 1 || loadingReporte) ? "pointer-events-none opacity-50" : "")}
          onClick={(e) => {
            e.preventDefault();
            if (page > 1 && !loadingReporte) {
              const np = page - 1;
              setPage(np);
              obtenerReporteHornos(np);
            }
          }}
        />
      </PaginationItem>

      {buildPages(page, pages).map((p, idx) => (
        <PaginationItem key={`${p}-${idx}`}>
          {p === '...' ? (
            <PaginationEllipsis />
          ) : (
            <PaginationLink
              href="#"
              isActive={p === page}
              className={cn(darkMode ? "hover:bg-gray-800" : "", loadingReporte ? "pointer-events-none opacity-50" : "")}
              onClick={(e) => {
                e.preventDefault();
                if (!loadingReporte && p !== page) {
                  setPage(p);
                  obtenerReporteHornos(p);
                }
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
          className={cn(darkMode ? "hover:bg-gray-800" : "", (page >= pages || loadingReporte) ? "pointer-events-none opacity-50" : "")}
          onClick={(e) => {
            e.preventDefault();
            if (page < pages && !loadingReporte) {
              const np = page + 1;
              setPage(np);
              obtenerReporteHornos(np);
            }
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

  // --- VISTA DASHBOARD (BLANCO) ---
  const renderDashboardView = () => (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4 animate-in fade-in duration-500">
      <div className={cn("p-4 rounded-full bg-muted", darkMode ? "bg-gray-800" : "bg-gray-100")}>
        <Activity className="h-12 w-12 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-semibold">Panel Principal</h2>
      <p className="text-muted-foreground max-w-md">
        Bienvenido. Selecciona <b>Reports</b> en el menú para ver los datos del sistema.
      </p>
      <Button onClick={() => setActiveMenu('reports')}>
        Ir a Reportes
      </Button>
    </div>
  );

  return (
    <div className={cn("flex min-h-screen w-full font-sans transition-colors duration-300",
      darkMode ? "bg-[#09090b] text-foreground" : "bg-[#f4f7fc] text-gray-900")}>

      {/* SIDEBAR */}
      <Sidebar collapsible="icon"
        className={cn("border-r shadow-sm z-50 transition-all duration-300 group/sidebar",
          darkMode ? "bg-[#09090b] border-gray-800" : "bg-white border-gray-200")}>
        <SidebarHeader className="h-16 flex items-center px-4 border-b border-border">
          <div className="flex items-center gap-2 font-bold text-xl overflow-hidden">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0">
              <Shield className="h-5 w-5" /></div>
            <span className="group-data-[state=collapsed]:hidden transition-all duration-200">Modepsa</span>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  tooltip={item.label}
                  onClick={() => setActiveMenu(item.id)}
                  isActive={activeMenu === item.id}
                  className={cn("w-full justify-start gap-3 px-3 py-6 rounded-md transition-all duration-200 group relative overflow-hidden",
                    activeMenu === item.id
                      ? (darkMode ? "bg-blue-600/10 text-blue-400 font-medium shadow-[inset_3px_0_0_0_#3b82f6]" : "bg-blue-50 text-blue-700 font-medium shadow-[inset_3px_0_0_0_#2563eb]")
                      : (darkMode ? "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900")
                  )}
                >
                  <item.icon className={cn("h-5 w-5 shrink-0 transition-transform duration-200",
                    activeMenu === item.id ? "scale-110" : "group-hover:scale-110")} />
                  <span className="group-data-[state=collapsed]:hidden animate-in fade-in duration-200">{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="border-t border-border p-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="flex items-center gap-3 mb-2 transition-all group-data-[state=collapsed]:justify-center">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-bold shadow-sm">
                  A
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[state=collapsed]:hidden">
                  <span className="font-semibold">{user?.email || 'Administrador'}</span>
                  <span className="text-xs text-muted-foreground">Admin</span>
                </div>
              </div>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleLogout}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 justify-start group-data-[state=collapsed]:justify-center"
              >
                <LogOut className="h-4 w-4" />
                <span className="group-data-[state=collapsed]:hidden">Cerrar sesión</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* CONTENIDO PRINCIPAL */}
      <SidebarInset className={cn("flex flex-col flex-1 transition-all duration-300 w-full overflow-hidden", sidebarState === 'collapsed' ? 'ml-0' : '')}>
        <header className={cn("h-16 flex items-center justify-between px-4 border-b transition-colors z-40 sticky top-0 backdrop-blur-sm", darkMode ? "bg-[#09090b]/80 border-gray-800" : "bg-white/80 border-gray-200")}>
          <div className="flex items-center gap-4">
            <SidebarTrigger className="-ml-2" />
            <div className="h-6 w-px bg-border" />
            <h1 className="text-lg font-semibold tracking-tight">
              {activeMenu === 'dashboard' && 'Dashboard General'}
              {activeMenu === 'reports' && 'Reportes del Sistema'}
              {activeMenu === 'reports2' && 'Reportes2'}
              {activeMenu === 'settings' && 'Configuración'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-background"></span>
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="text-muted-foreground hover:text-foreground">
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </header>

        <main className={cn("flex-1 p-6 overflow-auto scrollbar-thin", darkMode ? "scrollbar-thumb-gray-700 scrollbar-track-transparent" : "scrollbar-thumb-gray-200")}>
          {activeMenu === 'dashboard' && renderDashboardView()}
          {activeMenu === 'reports' && renderReportsView()}
          {activeMenu === 'reports2' && <Reportes2 darkMode={darkMode} />}
          {activeMenu === 'settings' && (
            <div className="flex flex-col items-center justify-center h-[50vh] text-muted-foreground animate-in fade-in duration-500">
              <Settings className="h-16 w-16 mb-4 opacity-20" />
              <h3 className="text-xl font-medium">Configuración</h3>
              <p>Ajustes del sistema próximamente...</p>
            </div>
          )}
        </main>
      </SidebarInset>

      <Toaster position="top-right" theme={darkMode ? 'dark' : 'light'} />
    </div>
  );
}

// =========================================================================
// 2. COMPONENTE PADRE (WRAPPER): ESTE SE EXPORTA
// SOLO SIRVE PARA DAR CONTEXTO AL DE ARRIBA
// =========================================================================
export default function HomeContent() {
  return (
    <SidebarProvider defaultOpen={true}>
      <DashboardInternal />
    </SidebarProvider>
  );
}
