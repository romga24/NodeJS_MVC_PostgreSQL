const { Reserva, Pasajero, Vuelo, Asiento, Billete } = require('../models');
  
const MAX_CARACTERES = 6; 

const ReservaService = {  

  // Crear la reserva
  async crearReserva(id_cliente) {
    return await Reserva.create({ 
      id_cliente: id_cliente, 
      fecha_reserva: new Date() 
    });
  },

  // Realizar la reserva (procesar pasajeros, asientos y billetes)
  async realizarReserva(id_cliente, codigo_vuelo_ida, codigo_vuelo_vuelta, pasajeros) {
    try {
      // Crear la reserva
      const reserva = await this.crearReserva(id_cliente);

      // Procesar cada pasajero
      for (const pasajero of pasajeros) {
        
        const [existingPasajero, created] = await Pasajero.findOrCreate({
          where: {
            nif: pasajero.nif,  // Usamos el `nif` como identificador único
          },
          defaults: {
            nombre: pasajero.nombre,
            apellidos: pasajero.apellidos,
            email: pasajero.email,
            telefono: pasajero.telefono,
          }
        });

        const pasajeroId = existingPasajero.id_pasajero;

        // Buscar el vuelo de ida
        const vueloIda = await Vuelo.findOne({
          where: { numero_vuelo: codigo_vuelo_ida }
        });

        // Reservar asiento de ida
        const asientoIda = await Asiento.create({
          id_avion: vueloIda.id_avion,
          id_vuelo: vueloIda.id_vuelo,
          fila: pasajero.ida.fila,
          columna: pasajero.ida.columna,
          codigo_asiento: pasajero.ida.codigo_asiento,
          estado: 'reservado'
        });

        // Crear el billete de ida
        await Billete.create({
          id_reserva: reserva.id_reserva,
          id_vuelo: vueloIda.id_vuelo,
          id_pasajero: pasajeroId,
          id_asiento: asientoIda.id_asiento,
          localizador: this.generarLocalizador(),
          precio: pasajero.ida.precio
        });

        // Si hay vuelo de vuelta, realizar la misma lógica
        if (codigo_vuelo_vuelta != null) {
          
          const vueloVuelta = await Vuelo.findOne({
            where: { numero_vuelo: codigo_vuelo_vuelta }
          });

          // Reservar asiento de vuelta
          const asientoVuelta = await Asiento.create({
            id_avion: vueloVuelta.id_avion,
            id_vuelo: vueloVuelta.id_vuelo,
            fila: pasajero.vuelta.fila,
            columna: pasajero.vuelta.columna,
            codigo_asiento: pasajero.vuelta.codigo_asiento,
            estado: 'reservado'
          });

          // Crear el billete de vuelta
          await Billete.create({
            id_reserva: reserva.id_reserva,
            id_vuelo: vueloVuelta.id_vuelo,
            id_pasajero: pasajeroId,
            id_asiento: asientoVuelta.id_asiento,
            localizador: this.generarLocalizador(),
            precio: pasajero.vuelta.precio
          });
        }
      }

      return { success: true, reservaId: reserva.id_reserva };

    } catch (error) {
      // Si algo sale mal, lanzamos el error para que pueda ser manejado en otro lado
      console.error('Error al realizar la reserva:', error);
      throw error;
    }
  },
  
  async eliminarBillete(id_cliente, id_reserva, id_billete) {
    try {

      const reserva = await Reserva.findOne({
        where: { id_reserva, id_cliente },
      });

      const billete = await Billete.findOne({
        where: { id_billete, id_reserva },
      });

      const asiento = await Asiento.findByPk(billete.id_asiento);
      
      if (asiento) {
        await asiento.destroy();
      }

      await billete.destroy();

      // Verificar si quedan billetes en la reserva
      const billetesRestantes = await Billete.count({
        where: { id_reserva }
      });

      if (billetesRestantes === 0) await reserva.destroy();

      return { success: true, message: 'Billete eliminado exitosamente.' };

    } catch (error) {
      console.error('Error al eliminar el billete:', error);
      throw error;
    }
  },

    // Obtener reservas del cliente
    async obtenerReservasPorCliente(id_cliente) {
      try {
        const reservas = await Reserva.findAll({
          where: { id_cliente },
          include: [
            {
              model: Billete,
              as: 'billetes', // Asegúrate de usar el alias correcto
              include: [
                {
                  model: Vuelo,
                  as: 'vuelo', // Alias correcto en las asociaciones
                  attributes: ['numero_vuelo', 'fecha_salida', 'fecha_llegada', 'precio_vuelo'] // Solo los campos relevantes
                },
                {
                  model: Asiento,
                  as: 'asiento',
                  attributes: ['codigo_asiento', 'fila', 'columna', 'clase'] // Solo los campos relevantes
                },
                {
                  model: Pasajero,
                  as: 'pasajero',
                  attributes: ['nombre', 'apellidos', 'email', 'telefono', 'nif'] // Solo los campos relevantes
                }
              ]
            }
          ],
          order: [['fecha_reserva', 'DESC']],
        });
    
        // Mapeo de la respuesta para formatear el JSON como lo quieres
        const reservasFormateadas = reservas.map((reserva) => {
          return {
            id_reserva: reserva.id_reserva,
            fecha_reserva: reserva.fecha_reserva,
            billetes: reserva.billetes.map((billete) => {
              return {
                id_billete: billete.id_billete,
                localizador: billete.localizador,
                precio: billete.precio,
                vuelo: billete.vuelo,
                asiento: billete.asiento,
                pasajero: billete.pasajero
              };
            })
          };
        });
    
        return reservasFormateadas;
    
      } catch (error) {
        console.error('Error al obtener las reservas:', error);
        throw error;
      }
    },

  // Eliminar reserva del cliente
  async eliminarReserva(id_cliente, id_reserva) {
    try {
      const reserva = await Reserva.findOne({
        where: { id_reserva, id_cliente },
        include: [Billete]
      });

      if (!reserva) {
        return { success: false, message: 'Reserva no encontrada.' };
      }

      // Liberar asientos y eliminar billetes relacionados
      for (const billete of reserva.Billetes) {
        const asiento = await Asiento.findByPk(billete.id_asiento);
        if (asiento) {
          await asiento.destroy();
        }
        await billete.destroy();
      }

      await reserva.destroy();

      return { success: true };

    } catch (error) {
      console.error('Error al eliminar la reserva:', error);
      throw error;
    }
  },

  generarLocalizador() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let localizador = '';
    for (let i = 0; i < MAX_CARACTERES; i++) {
      localizador += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return localizador;
  },

  obtenerAsientoAleatorio(distribucionAsientos) {
    
    const asientosDisponibles = [];
  
    for (const fila of distribucionAsientos) {
      for (const asiento of fila.asientos) {
        if (asiento.estado === 'disponible') {
          asientosDisponibles.push(asiento);
        }
      }
    }
  
    if (asientosDisponibles.length === 0) {
      throw new Error('No hay asientos disponibles en este vuelo');
    }
  
    const indexAleatorio = Math.floor(Math.random() * asientosDisponibles.length);
    return asientosDisponibles[indexAleatorio];
  }
};

module.exports = ReservaService;
