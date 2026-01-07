import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Home as HomeIcon,
  Settings,
  LogOut,
  Search,
  Filter,
  Download,
  Eye,
  CalendarIcon,
  Moon,
  Sun,
  Bell,
  ChevronDown,
  ChevronRight,
  Folder,
  Database,
  Cpu,
  Activity,
  AlertCircle,
  Clock,
  User,
  Shield,
  BarChart3,
  Layers,
  FileBarChart,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '../../components/ui/pagination';
import { Button } from '../../components/ui/button';
import { Calendar } from '../../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { Toaster, toast } from '../../components/ui/sonner';
import { Input } from '../../components/ui/input';
import { cn } from '@/lib/utils';

function CollapsibleMenuItem({ icon: Icon, label, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const { state: sidebarState } = useSidebar();
  
  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-all duration-200",
          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          sidebarState === "collapsed" && "justify-center px-2"
        )}
      >
        <div className="flex items-center gap-2">
          {Icon && (
            <Icon className={cn(
              "h-5 w-5 flex-shrink-0 transition-all duration-200",
              sidebarState === "collapsed" && "mx-auto"
            )} />
          )}
          <span className={cn(
            "truncate transition-all duration-200",
            sidebarState === "collapsed" ? "w-0 opacity-0 overflow-hidden" : "w-full opacity-100 ml-1"
          )}>
            {label}
          </span>
        </div>
        {sidebarState !== "collapsed" && (
          <div className="transition-all duration-200">
            {isOpen ? (
              <ChevronDown className="h-4 w-4 shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 shrink-0" />
            )}
          </div>
        )}
      </button>
      
      {isOpen && sidebarState !== "collapsed" && (
        <div className="ml-6 space-y-1 border-l-2 border-sidebar-border pl-3">
          {children}
        </div>
      )}
    </div>
  );
}

function HomeContent() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { open, setOpen } = useSidebar();
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [date, setDate] = useState();
  const [ootFilter, setOotFilter] = useState('all');
  const [plcFilter, setPlcFilter] = useState('all');
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
           document.documentElement.classList.contains('dark');
  });
  const [searchTerm, setSearchTerm] = useState('');
  
  const { state: sidebarState } = useSidebar();

  const registros = [
    { id: 'RR0281', fecha: '24 Oct 2023, 10:45:22', plc: 'PLC-01', oot: 'OOT-BB21', variable: 'TEMP_SENSOR_A1', valor: '85.4°C', estado: 'Finalizado' },
    { id: 'RR0282', fecha: '24 Oct 2023, 10:45:25', plc: 'PLC-01', oot: 'OOT-BB21', variable: 'PRESSURE_V2', valor: '121 Bar', estado: 'Pendiente' },
    { id: 'RR0283', fecha: '24 Oct 2023, 10:46:01', plc: 'PLC-03', oot: 'OOT-BB24', variable: 'SPEED_ROTOR', valor: '1200 RPM', estado: 'Finalizado' },
    { id: 'RR0284', fecha: '24 Oct 2023, 10:46:15', plc: 'PLC-02', oot: 'OOT-BB22', variable: 'FLOW_METER_IN', valor: '450 L/h', estado: 'Pendiente' },
    { id: 'RR0285', fecha: '24 Oct 2023, 10:47:00', plc: 'PLC-01', oot: 'OOT-BB21', variable: 'TEMP_SENSOR_A1', valor: '86.2°C', estado: 'Finalizado' },
  ];

  const menuItems = [
    {
      type: 'item',
      id: 'dashboard',
      label: 'Dashboard',
      icon: HomeIcon,
    },
    {
      type: 'group',
      id: 'active-file',
      label: 'Active File',
      icon: Folder,
      items: [
        { id: 'compress', label: 'Compress', icon: Layers },
        { id: 'inference', label: 'Inference', icon: Cpu },
        { id: 'playground', label: 'Playground', icon: Activity },
        { id: 'history', label: 'History', icon: Clock },
      ]
    },
    {
      type: 'group',
      id: 'project',
      label: 'Project',
      icon: Database,
      items: [
        { id: 'design', label: 'Design Engineering', icon: Settings },
        { id: 'sales', label: 'Sales & Marketing', icon: BarChart3 },
        { id: 'travel', label: 'Travel', icon: Activity },
      ]
    },
    {
      type: 'item',
      id: 'reports',
      label: 'Reports',
      icon: FileBarChart,
    },
    {
      type: 'item',
      id: 'settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  const handleLogout = () => {
    logout();
    toast.success('Sesión cerrada correctamente');
    navigate('/login');
  };

  const clearFilters = () => {
    setDate(undefined);
    setOotFilter('all');
    setPlcFilter('all');
    setSearchTerm('');
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

  const handleExportCSV = () => {
    toast.success('Exportando datos a CSV...');
  };

  const handleViewDetails = (id) => {
    toast.info(`Viendo detalles del registro ${id}`);
  };

  return (
    <div className={cn(
      "min-h-screen w-full flex",
      darkMode ? "bg-background text-gray-100" : "bg-background text-foreground"
    )}>
      <Toaster 
        position="top-center"
        richColors
        closeButton
        expand={false}
        className="z-[9999]"
      />
      
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg",
              darkMode ? "bg-blue-600" : "bg-primary",
              sidebarState === "collapsed" && "h-8 w-8 mx-auto"
            )}>
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div className={cn(
              "flex flex-col transition-all duration-300 overflow-hidden",
              sidebarState === "collapsed" ? "w-0 opacity-0" : "w-full opacity-100"
            )}>
              <span className="font-bold text-sm leading-tight">PLC MODEPSA</span>
              <span className="text-xs text-muted-foreground leading-tight">Control System</span>
            </div>
          </div>
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => {
              if (item.type === 'group') {
                const GroupIcon = item.icon;
                return (
                  <SidebarMenuItem key={item.id}>
                    <CollapsibleMenuItem 
                      icon={GroupIcon} 
                      label={item.label}
                      defaultOpen={item.id === 'active-file'}
                    >
                      {item.items.map((subItem) => {
                        const SubIcon = subItem.icon;
                        return (
                          <SidebarMenuButton
                            key={subItem.id}
                            isActive={activeMenu === subItem.id}
                            onClick={() => setActiveMenu(subItem.id)}
                            tooltip={subItem.label}
                            className="pl-2"
                          >
                            <SubIcon className="h-4 w-4 flex-shrink-0" />
                            {subItem.label}
                          </SidebarMenuButton>
                        );
                      })}
                    </CollapsibleMenuItem>
                  </SidebarMenuItem>
                );
              }
              
              const Icon = item.icon;
              return (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeMenu === item.id}
                    onClick={() => setActiveMenu(item.id)}
                    tooltip={item.label}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {item.label}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
        
        <SidebarFooter>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted flex-shrink-0">
                <User className="h-4 w-4" />
              </div>
              <div className={cn(
                "flex flex-col transition-all duration-300 overflow-hidden",
                sidebarState === "collapsed" ? "w-0 opacity-0" : "w-full opacity-100"
              )}>
                <span className="text-xs font-medium truncate">Administrador</span>
                <span className="text-[10px] text-muted-foreground truncate">Admin</span>
              </div>
            </div>
            
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip="Cerrar sesión"
              className={cn(
                "w-full",
                darkMode 
                  ? "text-red-400 hover:bg-red-400/10 hover:text-red-300" 
                  : "text-red-600 hover:bg-red-600/10 hover:text-red-700",
                sidebarState === "collapsed" && "justify-center"
              )}
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              Cerrar sesión
            </SidebarMenuButton>
          </div>
        </SidebarFooter>
      </Sidebar>
      
      <SidebarInset className="flex-1">
        <header className={cn(
          "sticky top-0 z-10 border-b px-6 py-4",
          darkMode 
            ? "bg-card/95 border-border backdrop-blur-xl" 
            : "bg-background border-border"
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-2xl font-bold">Dashboard PLC</h1>
                <p className="text-sm text-muted-foreground">Sistema de monitoreo en tiempo real</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className="h-9 w-9"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              
              <Button variant="ghost" size="icon" className="relative h-9 w-9">
                <Bell className="h-5 w-5" />
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
              </Button>
              
              <div className="flex items-center gap-2">
                <div className={cn(
                  "h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0",
                  darkMode ? "bg-blue-600" : "bg-primary"
                )}>
                  <span className="text-sm font-semibold text-white">
                    {user?.name?.charAt(0) || 'A'}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">{user?.name || 'Administrador'}</p>
                  <p className="text-xs text-muted-foreground">{user?.role || 'Admin'}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6 space-y-6 w-full">
          {/* Estadísticas - Colores que cambian con dark mode */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { 
                label: 'Total PLCs', 
                value: '12', 
                icon: Cpu, 
                light: 'bg-blue-500', 
                dark: 'bg-blue-600',
                text: 'text-white'
              },
              { 
                label: 'Registros Hoy', 
                value: '1,245', 
                icon: Database, 
                light: 'bg-green-500', 
                dark: 'bg-green-600',
                text: 'text-white'
              },
              { 
                label: 'Alertas Activas', 
                value: '8', 
                icon: AlertCircle, 
                light: 'bg-red-500', 
                dark: 'bg-red-600',
                text: 'text-white'
              },
              { 
                label: 'OOT Activas', 
                value: '24', 
                icon: Activity, 
                light: 'bg-purple-500', 
                dark: 'bg-purple-600',
                text: 'text-white'
              },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className={cn(
                  "rounded-lg border p-6",
                  darkMode ? "bg-card border-border" : "bg-card"
                )}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={cn(
                        "text-sm font-medium",
                        darkMode ? "text-muted-foreground" : "text-muted-foreground"
                      )}>{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <div className={cn(
                      "rounded-lg p-3",
                      darkMode ? stat.dark : stat.light,
                      stat.text
                    )}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Filtros */}
          <div className={cn(
            "rounded-lg border p-6",
            darkMode ? "bg-card border-border" : "bg-card"
          )}>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Filter className={cn(
                  "h-5 w-5",
                  darkMode ? "text-blue-400" : "text-primary"
                )} />
                <h2 className="text-lg font-semibold">Filtros de Búsqueda</h2>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters} 
                className="self-start sm:self-center"
              >
                Limpiar Todo
              </Button>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <label className={cn(
                  "text-sm font-medium",
                  darkMode ? "text-foreground" : ""
                )}>Buscar</label>
                <div className="relative">
                  <Search className={cn(
                    "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2",
                    darkMode ? "text-muted-foreground" : "text-muted-foreground"
                  )} />
                  <Input
                    placeholder="ID, Variable, OOT..."
                    className="pl-9 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className={cn(
                  "text-sm font-medium",
                  darkMode ? "text-foreground" : ""
                )}>Fecha</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        darkMode && "border-border bg-background text-foreground hover:bg-accent"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, 'PPP', { locale: es }) : 'Seleccionar fecha'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className={cn(
                    "w-auto p-0",
                    darkMode ? "bg-card border-border" : ""
                  )} align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      className={darkMode ? "bg-card" : ""}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <label className={cn(
                  "text-sm font-medium",
                  darkMode ? "text-foreground" : ""
                )}>OOT</label>
                <select
                  className={cn(
                    "flex h-10 w-full rounded-md border px-3 py-2 text-sm",
                    darkMode 
                      ? "border-border bg-background text-foreground focus:ring-ring" 
                      : "border-input bg-background"
                  )}
                  value={ootFilter}
                  onChange={(e) => setOotFilter(e.target.value)}
                >
                  <option value="all">Todos los OOT</option>
                  <option value="OOT-BB21">OOT-BB21</option>
                  <option value="OOT-BB22">OOT-BB22</option>
                  <option value="OOT-BB24">OOT-BB24</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className={cn(
                  "text-sm font-medium",
                  darkMode ? "text-foreground" : ""
                )}>PLC</label>
                <select
                  className={cn(
                    "flex h-10 w-full rounded-md border px-3 py-2 text-sm",
                    darkMode 
                      ? "border-border bg-background text-foreground focus:ring-ring" 
                      : "border-input bg-background"
                  )}
                  value={plcFilter}
                  onChange={(e) => setPlcFilter(e.target.value)}
                >
                  <option value="all">Todos los PLC</option>
                  <option value="PLC-01">PLC-01</option>
                  <option value="PLC-02">PLC-02</option>
                  <option value="PLC-03">PLC-03</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6 flex flex-wrap gap-2">
              <Button className={cn(
                "text-white",
                darkMode 
                  ? "bg-blue-600 hover:bg-blue-700" 
                  : "bg-primary hover:bg-primary/90"
              )}>
                <Search className="mr-2 h-4 w-4" />
                Buscar
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setDate(new Date())}
                className={darkMode ? "border-border hover:bg-accent" : ""}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                Hoy
              </Button>
            </div>
          </div>
          
          {/* Tabla */}
          <div className={cn(
            "rounded-lg border overflow-hidden",
            darkMode ? "bg-card border-border" : "bg-card"
          )}>
            <div className={cn(
              "flex flex-col items-start justify-between gap-4 border-b p-4 sm:p-6 sm:flex-row sm:items-center",
              darkMode ? "border-border" : ""
            )}>
              <div>
                <h3 className="text-lg font-semibold">Registros PLC</h3>
                <p className={cn(
                  "text-sm",
                  darkMode ? "text-muted-foreground" : "text-muted-foreground"
                )}>
                  {filteredRegistros.length} registros encontrados
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleExportCSV}
                className={darkMode ? "border-border hover:bg-accent" : ""}
              >
                <Download className="mr-2 h-4 w-4" />
                Exportar CSV
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className={darkMode ? "hover:bg-accent/50" : ""}>
                    <TableHead className={cn(
                      "whitespace-nowrap",
                      darkMode ? "text-foreground" : ""
                    )}>ID Registro</TableHead>
                    <TableHead className={cn(
                      "whitespace-nowrap",
                      darkMode ? "text-foreground" : ""
                    )}>Fecha y Hora</TableHead>
                    <TableHead className={cn(
                      "whitespace-nowrap",
                      darkMode ? "text-foreground" : ""
                    )}>PLC</TableHead>
                    <TableHead className={cn(
                      "whitespace-nowrap",
                      darkMode ? "text-foreground" : ""
                    )}>OOT</TableHead>
                    <TableHead className={cn(
                      "whitespace-nowrap",
                      darkMode ? "text-foreground" : ""
                    )}>Variable</TableHead>
                    <TableHead className={cn(
                      "whitespace-nowrap",
                      darkMode ? "text-foreground" : ""
                    )}>Valor</TableHead>
                    <TableHead className={cn(
                      "whitespace-nowrap",
                      darkMode ? "text-foreground" : ""
                    )}>Estado</TableHead>
                    <TableHead className={cn(
                      "whitespace-nowrap",
                      darkMode ? "text-foreground" : ""
                    )}>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRegistros.map((registro) => (
                    <TableRow key={registro.id} className={darkMode ? "hover:bg-accent/30" : "hover:bg-muted/50"}>
                      <TableCell className="font-medium whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "rounded-md p-1 shrink-0",
                            darkMode ? "bg-blue-500/20" : "bg-primary/10"
                          )}>
                            <Cpu className={cn(
                              "h-4 w-4",
                              darkMode ? "text-blue-400" : "text-primary"
                            )} />
                          </div>
                          {registro.id}
                        </div>
                      </TableCell>
                      <TableCell className={darkMode ? "text-foreground" : ""}>{registro.fecha}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <span className={cn(
                          "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap",
                          darkMode 
                            ? "bg-blue-500/20 text-blue-300" 
                            : "bg-primary/10 text-primary"
                        )}>
                          {registro.plc}
                        </span>
                      </TableCell>
                      <TableCell className={darkMode ? "text-foreground" : ""}>{registro.oot}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <code className={cn(
                          "rounded px-2 py-1 text-xs whitespace-nowrap",
                          darkMode ? "bg-accent text-foreground" : "bg-muted"
                        )}>
                          {registro.variable}
                        </code>
                      </TableCell>
                      <TableCell className={cn(
                        "font-semibold whitespace-nowrap",
                        darkMode ? "text-foreground" : ""
                      )}>{registro.valor}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <span className={cn(
                          "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap",
                          registro.estado === 'Finalizado' 
                            ? darkMode 
                              ? 'bg-green-500/20 text-green-300' 
                              : 'bg-green-100 text-green-800'
                            : darkMode 
                              ? 'bg-orange-500/20 text-orange-300' 
                              : 'bg-orange-100 text-orange-800'
                        )}>
                          {registro.estado}
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleViewDetails(registro.id)}
                          className="h-8 w-8"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          
          {/* Paginación */}
          <div className={cn(
            "rounded-lg border p-4",
            darkMode ? "bg-card border-border" : "bg-card"
          )}>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" className={darkMode ? "hover:bg-accent" : ""} />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink 
                    href="#" 
                    isActive 
                    className={cn(
                      darkMode 
                        ? "bg-blue-600 hover:bg-blue-700 text-white" 
                        : ""
                    )}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" className={darkMode ? "hover:bg-accent" : ""}>2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" className={darkMode ? "hover:bg-accent" : ""}>3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis className={darkMode ? "text-muted-foreground" : ""} />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" className={darkMode ? "hover:bg-accent" : ""} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}

function Home() {
  return (
    <SidebarProvider defaultOpen={true}>
      <HomeContent />
    </SidebarProvider>
  );
}

export default Home;