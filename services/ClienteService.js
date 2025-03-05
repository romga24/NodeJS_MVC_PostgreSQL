const { Cliente } = require("../models");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

const ClienteService = {

  //ok
  async getById(id_cliente) {
    try {
      const cliente = await Cliente.findOne({ where: { id_cliente } });
      return cliente || null;
    } catch (error) {
      console.error("Error al obtener el cliente:", error);
      throw new Error("Error al obtener el cliente.");
    }
  },

  //ok
  async create(data) {
    try {
      data.contraseña = await bcrypt.hash(data.contraseña, 10);
      return await Cliente.create(data);
    } catch (error) {
      console.error("Error al crear el cliente:", error);
      throw new Error("Error al crear el cliente.");
    }
  },

  //ok
  async login(usuarioOEmail, password) {    
    try {
      const cliente = await Cliente.findOne({
        where: {
          [Op.or]: [{ nombre_usuario: usuarioOEmail }, { email: usuarioOEmail }],
        },
      });
      if (!cliente) {
        return false;
      }
      const isMatch = await bcrypt.compare(password, cliente.contraseña);     
      if(!isMatch) {
        return cliente.contraseña == password ? cliente : false;
      }
    } catch (error) {
      console.error("Error en el login:", error);
      throw new Error("Error en el login.");
    }
  },

  //ok
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
      console.error("Error al actualizar el cliente:", error);
      throw new Error("Error al actualizar el cliente.");
    }
  },

  //ok
  async deleteById(id_cliente) {
    try {
      const cliente = await Cliente.findOne({ where: { id_cliente } });
      if (!cliente) return null;
      await cliente.destroy();
      return true;
    } catch (error) {
      console.error("Error al eliminar el cliente:", error);
      throw new Error("Error al eliminar el cliente.");
    }
  },
};

module.exports = ClienteService;
