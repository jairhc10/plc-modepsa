const API_BASE_URL = 'http://localhost:5000/api';

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
};
