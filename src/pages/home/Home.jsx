import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Home as HomeIcon,
  FileText,
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
  File,
  Database,
  Cpu,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  Shield,
  BarChart3,
  Layers,
  Server,
  FileBarChart,
  TrendingUp,
  Workflow
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
      toast.info('Modo oscuro activado');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      toast.info('Modo claro activado');
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
    <div className="min-h-screen bg-background text-foreground">
      <Toaster />
      
      <SidebarProvider defaultOpen={true}>
        <Sidebar collapsible="icon">
          {/* Header bien contenido */}
          <SidebarHeader className="border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg bg-primary flex-shrink-0",
                sidebarState === "collapsed" && "h-8 w-8 mx-auto"
              )}>
                <Shield className="h-5 w-5 text-primary-foreground" />
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
          
          <SidebarContent className="flex-1">
            <div className="p-2">
              {/* Barra de búsqueda - SE OCULTA COMPLETAMENTE cuando colapsado */}
              <div className={cn(
                "mb-3 transition-all duration-300",
                sidebarState === "collapsed" ? "h-0 opacity-0 overflow-hidden mb-0" : "h-auto opacity-100"
              )}>
                
              </div>
              
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
            </div>
          </SidebarContent>
          
          {/* Footer bien contenido */}
          <SidebarFooter className="border-t border-sidebar-border p-3">
            <div className="space-y-3">
              {/* Usuario - Bien contenido */}
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
              
              {/* Logout */}
              <SidebarMenuButton
                onClick={handleLogout}
                tooltip="Cerrar sesión"
                className={cn(
                  "text-destructive hover:bg-destructive/10 hover:text-destructive w-full",
                  sidebarState === "collapsed" && "justify-center"
                )}
              >
                <LogOut className="h-4 w-4 flex-shrink-0" />
                Cerrar sesión
              </SidebarMenuButton>
            </div>
          </SidebarFooter>
        </Sidebar>
        
        <SidebarInset>
          <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-xl font-semibold">Dashboard PLC</h1>
                <p className="text-sm text-muted-foreground">Sistema de monitoreo en tiempo real</p>
              </div>
            </div>
            
            <div className="ml-auto flex items-center gap-4">
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
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive"></span>
              </Button>
              
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-primary-foreground">
                    {user?.name?.charAt(0) || 'A'}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">{user?.name || 'Administrador'}</p>
                  <p className="text-xs text-muted-foreground">{user?.role || 'Admin'}</p>
                </div>
              </div>
            </div>
          </header>
          
          <main className="flex-1 space-y-6 p-6 w-full">
            {/* Estadísticas */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Total PLCs', value: '12', icon: Cpu, color: 'bg-primary' },
                { label: 'Registros Hoy', value: '1,245', icon: Database, color: 'bg-green-500 dark:bg-green-600' },
                { label: 'Alertas Activas', value: '8', icon: AlertCircle, color: 'bg-red-500 dark:bg-red-600' },
                { label: 'OOT Activas', value: '24', icon: Activity, color: 'bg-purple-500 dark:bg-purple-600' },
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="rounded-lg border bg-card p-6 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </div>
                      <div className={`${stat.color} rounded-lg p-3 transition-colors duration-200`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Filtros */}
            <div className="rounded-lg border bg-card p-6 transition-colors duration-200">
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Filtros de Búsqueda</h2>
                </div>
                <Button variant="ghost" size="sm" onClick={clearFilters} className="self-start sm:self-center">
                  Limpiar Todo
                </Button>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Buscar</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="ID, Variable, OOT..."
                      className="pl-9 w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Fecha</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal border-input hover:bg-accent hover:text-accent-foreground"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, 'PPP', { locale: es }) : 'Seleccionar fecha'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-popover text-popover-foreground border" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        className="rounded-md border"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">OOT</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors duration-200"
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
                  <label className="text-sm font-medium">PLC</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors duration-200"
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
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 flex-1 sm:flex-none transition-colors duration-200">
                  <Search className="mr-2 h-4 w-4" />
                  Buscar
                </Button>
                <Button variant="outline" onClick={() => setDate(new Date())} className="flex-1 sm:flex-none transition-colors duration-200">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Hoy
                </Button>
              </div>
            </div>
            
            {/* Tabla */}
            <div className="rounded-lg border bg-card transition-colors duration-200 overflow-hidden">
              <div className="flex flex-col items-start justify-between gap-4 border-b p-4 sm:p-6 sm:flex-row sm:items-center">
                <div>
                  <h3 className="text-lg font-semibold">Registros PLC</h3>
                  <p className="text-sm text-muted-foreground">
                    {filteredRegistros.length} registros encontrados
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleExportCSV}
                  className="self-start sm:self-center transition-colors duration-200"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Exportar CSV
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <div className="min-w-full">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="whitespace-nowrap">ID Registro</TableHead>
                        <TableHead className="whitespace-nowrap">Fecha y Hora</TableHead>
                        <TableHead className="whitespace-nowrap">PLC</TableHead>
                        <TableHead className="whitespace-nowrap">OOT</TableHead>
                        <TableHead className="whitespace-nowrap">Variable</TableHead>
                        <TableHead className="whitespace-nowrap">Valor</TableHead>
                        <TableHead className="whitespace-nowrap">Estado</TableHead>
                        <TableHead className="whitespace-nowrap">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRegistros.map((registro) => (
                        <TableRow key={registro.id} className="hover:bg-muted/50 transition-colors duration-200">
                          <TableCell className="font-medium whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="rounded-md bg-primary/10 p-1 dark:bg-primary/20 shrink-0">
                                <Cpu className="h-4 w-4 text-primary" />
                              </div>
                              {registro.id}
                            </div>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">{registro.fecha}</TableCell>
                          <TableCell className="whitespace-nowrap">
                            <span className="inline-flex items-center rounded-full bg-primary/10 dark:bg-primary/20 px-3 py-1 text-xs font-medium text-primary whitespace-nowrap">
                              {registro.plc}
                            </span>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">{registro.oot}</TableCell>
                          <TableCell className="whitespace-nowrap">
                            <code className="rounded bg-muted px-2 py-1 text-xs whitespace-nowrap">
                              {registro.variable}
                            </code>
                          </TableCell>
                          <TableCell className="font-semibold whitespace-nowrap">{registro.valor}</TableCell>
                          <TableCell className="whitespace-nowrap">
                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors duration-200 ${
                              registro.estado === 'Finalizado' 
                                ? 'bg-green-500 dark:bg-green-600 text-white' 
                                : 'bg-orange-500 dark:bg-orange-600 text-white'
                            }`}>
                              {registro.estado}
                            </span>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleViewDetails(registro.id)}
                              className="h-8 w-8 transition-colors duration-200"
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
            </div>
            
            {/* Paginación */}
            <div className="rounded-lg border bg-card p-4 transition-colors duration-200">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </main>
          
          <footer className="border-t py-4 px-6 transition-colors duration-200">
            <p className="text-sm text-muted-foreground text-center">
              © 2024 PLC MODEPSA Control System
            </p>
          </footer>
        </SidebarInset>
      </SidebarProvider>
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