
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
            },
            estado_vuelo: 'Programado'
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
                },
                estado_vuelo: 'Programado'
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
 },

 async createVuelo({ numero_vuelo, id_aeropuerto_origen, id_aeropuerto_destino, fecha_salida, fecha_llegada, id_avion, id_aerolinea, precio_vuelo }) {
    try {
      // Verificar que los aeropuertos, avión y aerolínea existan
      const aeropuertoOrigen = await Aeropuerto.findByPk(id_aeropuerto_origen);
      const aeropuertoDestino = await Aeropuerto.findByPk(id_aeropuerto_destino);
      const avion = await Avion.findByPk(id_avion);
      const aerolinea = await Aerolinea.findByPk(id_aerolinea);
  
      if (!aeropuertoOrigen || !aeropuertoDestino || !avion || !aerolinea) {
        throw new Error('Aeropuerto, avión o aerolínea no encontrados.');
      }
  
      // Crear un objeto vuelo con los datos proporcionados
      const vueloData = {
        numero_vuelo,
        id_aeropuerto_origen,
        id_aeropuerto_destino,
        fecha_salida,
        fecha_llegada,
        id_avion,
        id_aerolinea,
        precio_vuelo
      };
  
      // Crear el vuelo en la base de datos (autoIncrement se encarga de id_vuelo)
      const nuevoVuelo = await Vuelo.create(vueloData);
  
      // Retornar un mensaje de éxito
      return { message: "Vuelo creado exitosamente", vuelo: nuevoVuelo };
  
    } catch (error) {
      console.error('Error al crear el vuelo:', error);
      throw new Error('Error al crear el vuelo.');
    }
  },

  async getAllVuelos() {
    try {
        const vuelos = await Vuelo.findAll({
            attributes: ['numero_vuelo', 'fecha_salida', 'fecha_llegada', 'precio_vuelo', 'estado_vuelo'],
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

        return vuelos;
        
    } catch (error) {
        console.error('Error en el servicio al obtener vuelos con filtros:', error);
        throw new Error('Error al obtener vuelos con filtros.');
    }
 },

 async modificarEstadoVuelo(numero_vuelo, estado_vuelo) {
    try{
        const vuelo = await Vuelo.findOne({
            where: {
                numero_vuelo: numero_vuelo 
            }
        });
        if (!vuelo) {
            throw new Error('Vuelo no encontrado.');
        }
        if(estado_vuelo = 'C'){
            estado_vuelo = 'Cancelado';
        }
        vuelo.estado_vuelo = estado_vuelo;
        await vuelo.save();
    }catch(error){
        throw new Error('Error al actualizar el vuelo.');
    }
 }

}   

module.exports = VueloService;
