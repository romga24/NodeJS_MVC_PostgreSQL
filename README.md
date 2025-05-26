# ✈️ Sistema de Reservas de Vuelos - API REST

Este proyecto es una aplicación backend desarrollada con **Node.js**, utilizando el framework **Express.js** y una base de datos **PostgreSQL**. Implementa una arquitectura **MVC (Modelo-Vista-Controlador)** y ofrece funcionalidades específicas para usuarios con roles de **User** y **Admin**.

---

## 📚 Tabla de Contenidos

1. [Acerca del Proyecto](#acerca-del-proyecto)
2. [Características](#características)
   - [Funcionalidades de Usuario (User)](#funcionalidades-de-usuario-user)
   - [Funcionalidades de Administrador (Admin)](#funcionalidades-de-administrador-admin)
3. [Primeros Pasos](#primeros-pasos)
   - [Prerequisitos](#prerequisitos)
   - [Instalación](#instalación)
   - [Configuración de Variables de Entorno](#configuración-de-variables-de-entorno)
   - [Sincronización de la Base de Datos](#sincronización-de-la-base-de-datos)
4. [Estructura del Proyecto](#estructura-del-proyecto)
5. [Uso de APIs](#uso-de-apis)
6. [Autenticación](#autenticación)
7. [Despliegue](#despliegue)
8. [Herramientas Utilizadas](#herramientas-utilizadas)
9. [Contacto](#contacto)

---

## 📌 Acerca del Proyecto

API RESTful diseñada para gestionar un sistema de reservas (vuelos). Utiliza un enfoque modular con patrón **MVC**, priorizando la mantenibilidad y escalabilidad. La comunicación se realiza vía HTTP con respuestas en **JSON**.

---

## 🧱 Construido con

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Sequelize](https://sequelize.org/)
- [JWT](https://jwt.io/) para autenticación
- [Bcrypt](https://www.npmjs.com/package/bcrypt) para hashing de contraseñas
- [Nodemailer](https://nodemailer.com/about/) para envío de correos
- [EJS](https://ejs.co/) para plantillas de correo y generación de PDFs
- [Dotenv](https://github.com/motdotla/dotenv) para variables de entorno
- [CORS](https://expressjs.com/en/resources/middleware/cors.html)
- [Puppeteer](https://pptr.dev/) para generación de PDFs automatizados

---

## ✨ Características

### Funcionalidades de Usuario (User)

- **Autenticación:**
  - Registro: `POST /clientes`
  - Login clásico: `POST /clientes/login`
  - Login con código por email: `POST /clientes/enviar-codigo`, `POST /clientes/verificar-codigo`

- **Búsqueda y Reservas:**
  - Listar aeropuertos: `GET /aeropuertos`
  - Buscar vuelos: `POST /vuelos/buscador-vuelos`
  - Ver asientos disponibles: `GET /asientos/vuelo/:numero_vuelo`
  - Reservar vuelo: `PUT /reservas/realizar-reserva`
  - Confirmación con descarga de billete en PDF

- **Gestión de Cuenta:**
  - Actualizar datos: `PUT /clientes`
  - Eliminar cuenta: `DELETE /clientes`
  - Consultar reservas: `GET /reservas/mis-reservas`
  - Eliminar billete de una reserva: `DELETE /reservas/:id_reserva/billetes/:id_billete`

---

### Funcionalidades de Administrador (Admin)

- **Gestión de vuelos:**
  - Formulario para insertar vuelos (usando aerolíneas, aviones y aeropuertos)
  - Crear nuevo vuelo: `POST /vuelos`
  - Listar vuelos: `GET /vuelos`
  - Cambiar estado del vuelo: `PUT /vuelos/modificar-estado-vuelo`

---

## 🚀 Primeros Pasos

### Prerequisitos

- Node.js v14+
- npm
- PostgreSQL

### Instalación

```bash
git clone https://github.com/tu_usuario/tu_proyecto.git
cd tu_proyecto
npm install
