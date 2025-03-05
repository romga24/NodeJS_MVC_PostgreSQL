const { Billete, Reserva, Pasajero, Vuelo, Aerolinea, Aeropuerto, Avion, Asiento } = require('../models');
const { Op } = require('sequelize');

const BilleteService = {

  async obtenerInfoBillete(localizador, apellido) {
    try {
      // Validar que ambos parámetros son proporcionados
      if (!localizador || !apellido) {
        return { success: false, message: 'Se deben proporcionar tanto el localizador como los apellidos.' };
      }
  
      const billete = await Billete.findOne({
        where: {
          localizador: localizador
        },
        include: [
          {
            model: Reserva,
            as: 'reserva'
          },
          {
            model: Pasajero,
            as: 'pasajero',
            where: {
              apellidos: {
                [Op.iLike]: `%${apellido}%`
              }
            },
            required: true // Asegura que el pasajero con el apellido coincidente debe estar presente
          },
          {
            model: Vuelo,
            as: 'vuelo',
            include: [
              { model: Aerolinea, as: 'aerolinea' },
              { model: Aeropuerto, as: 'aeropuerto_origen' },
              { model: Aeropuerto, as: 'aeropuerto_destino' },
              { model: Avion, as: 'avion' }
            ]
          },
          {
            model: Asiento,
            as: 'asiento'
          }
        ]
      });
  
      // Verificar si se encontró el billete
      if (!billete) {
        return { success: false, message: 'Billete no encontrado con ese localizador o apellido.' };
      }
  
      return {
        success: true,
        data: {
          billete: {
            localizador: billete.localizador,
            precio: billete.precio
          },
          reserva: {
            fecha: billete.reserva.fecha_reserva
          },
          pasajero: {
            nombre: billete.pasajero.nombre,
            apellidos: billete.pasajero.apellidos,
            email: billete.pasajero.email,
            telefono: billete.pasajero.telefono,
            nif: billete.pasajero.nif
          },
          vuelo: {
            numero: billete.vuelo.numero_vuelo,
            fecha_salida: billete.vuelo.fecha_salida,
            fecha_llegada: billete.vuelo.fecha_llegada,
            precio_vuelo: billete.vuelo.precio_vuelo,
            aerolinea: billete.vuelo.aerolinea.nombre,
            avion: billete.vuelo.avion.modelo,
            origen: {
              aeropuerto: billete.vuelo.aeropuerto_origen.nombre,
              ciudad: billete.vuelo.aeropuerto_origen.ciudad,
              pais: billete.vuelo.aeropuerto_origen.pais
            },
            destino: {
              aeropuerto: billete.vuelo.aeropuerto_destino.nombre,
              ciudad: billete.vuelo.aeropuerto_destino.ciudad,
              pais: billete.vuelo.aeropuerto_destino.pais
            }
          },
          asiento: {
            codigo: billete.asiento.codigo_asiento,
            clase: billete.asiento.clase,
            estado: billete.asiento.estado
          }
        }
      };
    } catch (error) {
      console.error('Error al obtener información del billete:', error);
      throw error;
    }
  }
};

module.exports = BilleteService;
