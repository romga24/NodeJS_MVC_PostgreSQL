const { Cliente } = require("../models");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

const ClienteService = {

  async getById(id_cliente) {
    try {
      const cliente = await Cliente.findOne({ where: { id_cliente } });
      return cliente || null;
    } catch (error) {
      throw new Error("Error al obtener el cliente.");
    }
  },

  async create(data) {
    try {
      data.contraseña = await bcrypt.hash(data.contraseña, 10);
      return await Cliente.create(data);
    } catch (error) {
      throw new Error("Error al crear el cliente.");
    }
  },

  async login(usuarioOEmail, password) {
    try {
      const cliente = await this.getByEmailOUsuario(usuarioOEmail);
      if (!cliente) return false;
      const isMatch = await bcrypt.compare(password, cliente.contraseña);
      if (!isMatch) {
        return cliente.contraseña === password ? cliente : false;
      }
      return cliente;
    } catch (error) {
      throw new Error("Error en el login.");
    }
  },

   async getByEmailOUsuario(usuarioOEmail) {
    try {
     const cliente = await Cliente.findOne({
        where: {
          [Op.or]: [
            { nombre_usuario: usuarioOEmail },
            { email: usuarioOEmail }
          ],
        },
      });
      return cliente;
    } catch (error) {
      throw new Error("Error al buscar cliente por email");
    }
 },

  async update(id_cliente, data) {
    try {
      const cliente = await Cliente.findOne({ where: { id_cliente } });
      if (!cliente) return null;

      if (data.contraseña) {
        data.contraseña = await bcrypt.hash(data.contraseña, 10);
      }

      await cliente.update(data);
      return cliente;
    } catch (error) {
      throw new Error("Error al actualizar el cliente.");
    }
  },

  async deleteById(id_cliente) {
    try {
      const cliente = await Cliente.findOne({ where: { id_cliente } });
      if (!cliente) return null;
      await cliente.destroy();
      return true;
    } catch (error) {
      throw new Error("Error al eliminar el cliente.");
    }
  }

};

module.exports = ClienteService;
