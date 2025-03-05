
// Importar los modelos
const { Vuelo, Aerolinea, Aeropuerto, Avion } = require('../models');
const { Op } = require('sequelize');

const VueloService = {
  async getVuelosConFiltro(codigoOrigen, codigoDestino, fechaIda, fechaVuelta, numeroPasajeros) {
    try {
        const whereIda = {
            '$aeropuerto_origen.codigo_iata$': codigoOrigen,
            '$aeropuerto_destino.codigo_iata$': codigoDestino,
            fecha_salida: {
                [Op.gte]: fechaIda
            }
        };

        const vuelosIda = await Vuelo.findAll({
            where: whereIda,
            attributes: ['numero_vuelo', 'fecha_salida', 'fecha_llegada', 'precio_vuelo'],
            include: [
                {
                    model: Aeropuerto,
                    as: 'aeropuerto_origen',
                    attributes: ['nombre', 'ciudad', 'pais', 'codigo_iata']
                },
                {
                    model: Aeropuerto,
                    as: 'aeropuerto_destino',
                    attributes: ['nombre', 'ciudad', 'pais', 'codigo_iata']
                },
                {
                    model: Avion,
                    as: 'avion',
                    attributes: ['modelo', 'capacidad', 'distribucion_asientos', 'total_asientos']
                },
                {
                    model: Aerolinea,
                    as: 'aerolinea',
                    attributes: ['nombre', 'codigo_iata']
                }
            ],
            order: [['fecha_salida', 'ASC']]
        });

        const vuelosIdaConPrecioTotal = vuelosIda.map(vuelo => {
            const precioTotalIda = vuelo.precio_vuelo * numeroPasajeros;
            return {
                ...vuelo.toJSON(),
                precio_total_ida: precioTotalIda
            };
        });

        let vuelosVuelta = [];
        if (fechaVuelta) {
            const whereVuelta = {
                '$aeropuerto_origen.codigo_iata$': codigoDestino,
                '$aeropuerto_destino.codigo_iata$': codigoOrigen,
                fecha_salida: {
                    [Op.gte]: fechaVuelta
                }
            };

            vuelosVuelta = await Vuelo.findAll({
                where: whereVuelta,
                attributes: ['numero_vuelo', 'fecha_salida', 'fecha_llegada', 'precio_vuelo'],
                include: [
                    {
                        model: Aeropuerto,
                        as: 'aeropuerto_origen',
                        attributes: ['nombre', 'ciudad', 'pais', 'codigo_iata']
                    },
                    {
                        model: Aeropuerto,
                        as: 'aeropuerto_destino',
                        attributes: ['nombre', 'ciudad', 'pais', 'codigo_iata']
                    },
                    {
                        model: Avion,
                        as: 'avion',
                        attributes: ['modelo', 'capacidad', 'distribucion_asientos', 'total_asientos']
                    },
                    {
                        model: Aerolinea,
                        as: 'aerolinea',
                        attributes: ['nombre', 'codigo_iata']
                    }
                ],
                order: [['fecha_salida', 'ASC']]
            });

            vuelosVuelta = vuelosVuelta.map(vuelo => {
                const precioTotalVuelta = vuelo.precio_vuelo * numeroPasajeros;
                return {
                    ...vuelo.toJSON(),
                    precio_total_vuelta: precioTotalVuelta
                };
            });
        }

        return {
            ida: vuelosIdaConPrecioTotal,
            vuelta: vuelosVuelta
        };

    } catch (error) {
        console.error('Error en el servicio al obtener vuelos con filtros:', error);
        throw new Error('Error al obtener vuelos con filtros.');
    }
 }
};

module.exports = VueloService;
