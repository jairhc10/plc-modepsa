import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function DateRangeCalendar({
  darkMode,
  year,
  month,
  onDateClick,
  dateRange,
  hoveredDate,
  onHoverDate,
  onLeaveDate,
  onMonthChange, // Función para cambiar mes
  onYearChange,  // Función para cambiar año
  onPreviousMonth, // Navegación flecha izquierda
  onNextMonth,     // Navegación flecha derecha
  showLeftArrow,   // Controlar qué flechas se muestran
  showRightArrow
}) {
  const generateCalendar = (year, month) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push({ day: '', outside: true });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, date: new Date(year, month, i), outside: false });
    }
    return days;
  };

  const calendar = generateCalendar(year, month);
  
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  // Lógica de estilos (Dark Mode vs Light Mode)
  const theme = {
    bg: darkMode ? 'bg-gray-800' : 'bg-white',
    text: darkMode ? 'text-gray-200' : 'text-gray-700',
    hover: darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
    selectBg: darkMode ? 'bg-gray-700' : 'bg-gray-100',
    selectBorder: darkMode ? 'border-gray-600' : 'border-gray-300',
    dayHover: darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200',
    inRange: darkMode ? 'bg-blue-900/40 text-blue-200' : 'bg-blue-100 text-blue-900',
    selected: 'bg-blue-600 text-white font-bold hover:bg-blue-700',
    disabled: 'invisible'
  };

  const isInRange = (date) => {
    if (!dateRange.from) return false;
    const compareDate = hoveredDate && !dateRange.to ? hoveredDate : dateRange.to;
    if (!compareDate) return false;
    // Normalizar horas para comparar solo fechas
    const d = new Date(date).setHours(0,0,0,0);
    const from = new Date(dateRange.from).setHours(0,0,0,0);
    const to = new Date(compareDate).setHours(0,0,0,0);
    return d >= from && d <= to;
  };

  const isSelected = (date) => {
    const d = new Date(date).setHours(0,0,0,0);
    return (dateRange.from && d === new Date(dateRange.from).setHours(0,0,0,0)) ||
           (dateRange.to && d === new Date(dateRange.to).setHours(0,0,0,0));
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 101 }, (_, i) => currentYear - 50 + i);

  return (
    <div className={`p-4 rounded-lg ${theme.bg} ${theme.text}`}>
      {/* Header con Selects */}
      <div className="mb-4 flex items-center justify-between gap-2">
        {/* Flecha Izquierda (Opcional) */}
        <div className="w-8">
            {showLeftArrow && (
            <button onClick={onPreviousMonth} className={`p-1 rounded-full ${theme.hover}`}>
                <ChevronLeft className="w-5 h-5" />
            </button>
            )}
        </div>

        {/* Selectores de Mes y Año */}
        <div className="flex gap-2 justify-center">
          <select 
            value={month} 
            onChange={(e) => onMonthChange(parseInt(e.target.value))}
            className={`px-2 py-1 rounded border text-sm cursor-pointer outline-none ${theme.selectBg} ${theme.selectBorder}`}
          >
            {monthNames.map((m, i) => <option key={i} value={i}>{m}</option>)}
          </select>

          <select 
            value={year} 
            onChange={(e) => onYearChange(parseInt(e.target.value))}
            className={`px-2 py-1 rounded border text-sm cursor-pointer outline-none ${theme.selectBg} ${theme.selectBorder}`}
          >
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        {/* Flecha Derecha (Opcional) */}
        <div className="w-8 flex justify-end">
            {showRightArrow && (
            <button onClick={onNextMonth} className={`p-1 rounded-full ${theme.hover}`}>
                <ChevronRight className="w-5 h-5" />
            </button>
            )}
        </div>
      </div>

      {/* Grid del Calendario */}
      <div className="grid grid-cols-7 gap-1">
        {dayNames.map(d => <div key={d} className="text-center text-xs opacity-60 font-medium py-1">{d}</div>)}
        {calendar.map((item, i) => (
          <button
            key={i}
            disabled={item.outside}
            onClick={() => !item.outside && onDateClick(item.date)}
            onMouseEnter={() => !item.outside && onHoverDate(item.date)}
            onMouseLeave={onLeaveDate}
            className={`
              w-9 h-9 text-sm rounded-md transition-colors flex items-center justify-center
              ${item.outside ? theme.disabled : ''}
              ${!item.outside && isSelected(item.date) ? theme.selected : ''}
              ${!item.outside && !isSelected(item.date) && isInRange(item.date) ? theme.inRange : ''}
              ${!item.outside && !isSelected(item.date) && !isInRange(item.date) ? theme.dayHover : ''}
            `}
          >
            {item.day}
          </button>
        ))}
      </div>
    </div>
  );
}

export default DateRangeCalendar;