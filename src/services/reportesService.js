const API_BASE_URL = 'http://192.168.10.44:5000/api';

export const reportesService = {
  /**
   * Obtener reporte de hornos
   * @param {Object} filtros
   * {
   *   fecha_desde,
   *   fecha_hasta,
   *   numero_ot,
   *   paginado: boolean,
   *   page: number,
   *   size: number
   * }
   */
  obtenerReporteHornos: async (filtros = {}) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reportes/hornos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filtros),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.error('Error al obtener reporte de hornos:', error);
      throw error;
    }
  },

/**
   * Exportar reporte a Excel (descarga directa desde backend)
   */
   exportarReporteHornosExcel: async (filtros = {}) => {
    try {
      console.log('📥 Descargando Excel con filtros:', filtros);

      const response = await fetch(`${API_BASE_URL}/reportes/hornos/excel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filtros),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al exportar Excel');
      }

      // Obtener el archivo como blob
      const blob = await response.blob();
      
      // Crear URL temporal para descarga
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Nombre del archivo con timestamp
      const timestamp = new Date().toISOString().slice(0, 10);
      link.download = `Reporte_Hornos_${timestamp}.xlsx`;
      
      // Simular click para descargar
      document.body.appendChild(link);
      link.click();
      
      // Limpiar
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log('✅ Excel descargado correctamente');
      return { success: true };

    } catch (error) {
      console.error('❌ Error al exportar Excel:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
};