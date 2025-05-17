const { Reserva, Pasajero, Vuelo, Asiento, Billete, Aeropuerto, Aerolinea } = require('../models');
const emailService = require("../services/EmailService");
const fs = require('fs').promises;
const path = require('path');
const ejs = require('ejs');
const generarLocalizador = require('./../utils/generarLocalizador');


const ReservaService = {

  async realizarReserva(id_cliente, codigo_vuelo_ida, codigo_vuelo_vuelta, pasajeros) {

    try {

      const reserva = await this.crearReserva(id_cliente);

      // Procesar cada pasajero
      for (const pasajero of pasajeros) {
        const [existingPasajero, created] = await Pasajero.findOrCreate({
          where: { nif: pasajero.nif },
          defaults: {
            nombre: pasajero.nombre,
            apellidos: pasajero.apellidos,
            email: pasajero.email,
            telefono: pasajero.telefono,
          }
        });

        const pasajeroId = existingPasajero.id_pasajero;

        // Buscar el vuelo de ida
        const vueloIda = await Vuelo.findOne({ where: { numero_vuelo: codigo_vuelo_ida } });

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
          localizador: generarLocalizador(),
          precio: pasajero.ida.precio
        });

        // Si hay vuelo de vuelta, procesarlo
        if (codigo_vuelo_vuelta) {

          const vueloVuelta = await Vuelo.findOne({ where: { numero_vuelo: codigo_vuelo_vuelta } });

          const asientoVuelta = await Asiento.create({
            id_avion: vueloVuelta.id_avion,
            id_vuelo: vueloVuelta.id_vuelo,
            fila: pasajero.vuelta.fila,
            columna: pasajero.vuelta.columna,
            codigo_asiento: pasajero.vuelta.codigo_asiento,
            estado: 'reservado'
          });

          await Billete.create({
            id_reserva: reserva.id_reserva,
            id_vuelo: vueloVuelta.id_vuelo,
            id_pasajero: pasajeroId,
            id_asiento: asientoVuelta.id_asiento,
            localizador: generarLocalizador(),
            precio: pasajero.vuelta.precio
          });
        }
      }

      return reserva;
    } catch (error) {
      console.error('Error al realizar la reserva:', error);
      throw error;
    }
  },

  
  // Crear la reserva
  async crearReserva(id_cliente) {
    return await Reserva.create({
      id_cliente: id_cliente,
      fecha_reserva: new Date()
    });
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

  // obtenerAsientoAleatorio(distribucionAsientos) {   
  //   const asientosDisponibles = []; 
  //   for (const fila of distribucionAsientos) {
  //     for (const asiento of fila.asientos) {
  //       if (asiento.estado === 'disponible') {
  //         asientosDisponibles.push(asiento);
  //       }
  //     }
  //   } 
  //   if (asientosDisponibles.length === 0) {
  //     throw new Error('No hay asientos disponibles en este vuelo');
  //   } 
  //   const indexAleatorio = Math.floor(Math.random() * asientosDisponibles.length);
  //   return asientosDisponibles[indexAleatorio];
  // }

  async obtenerReservaConDetalles(id_reserva) {
    return Reserva.findOne({
      where: { id_reserva },
      include: [
        {
          model: Billete,
          as: 'billetes',
          include: [
            {
              model: Vuelo,
              as: 'vuelo',
              include: [
                { model: Aeropuerto, as: 'aeropuerto_origen' },
                { model: Aeropuerto, as: 'aeropuerto_destino' },
                { model: Aerolinea, as: 'aerolinea' }
              ]
            },
            { model: Asiento, as: 'asiento' },
            { model: Pasajero, as: 'pasajero' }
          ]
        }
      ]
    });
  },

  async renderPdfReserva(reserva) {
    const templatePath = path.join(__dirname, '../templates/pdfs/detalleBilletePDF.ejs');

    const logoPath = path.join(__dirname, '../public/images/airlink_logo.png');
    const logoBuffer = await fs.readFile(logoPath);
    const logoDataUrl = `data:image/png;base64,${logoBuffer.toString('base64')}`;

    return ejs.renderFile(templatePath, {
      id_reserva: reserva.id,
      billetes: reserva.billetes,
      logoDataUrl
    });
  }

};

module.exports = ReservaService;
