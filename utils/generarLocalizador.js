
const MAX_CARACTERES = 6;

const generarLocalizador = () => {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let localizador = '';
    for (let i = 0; i < MAX_CARACTERES; i++) {
      localizador += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return localizador;
}

module.exports = generarLocalizador;