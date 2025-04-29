const { Vuelo, Avion, Asiento } = require("../models");

const AsientoService = { 
    
    async getAllAsientos(numeroVuelo) { 
        try {
            const vuelo = await Vuelo.findOne({
                where: { 
                    numero_vuelo: numeroVuelo,
                    estado_vuelo: 'Programado' 
                },
                include: [{
                    model: Avion,
                    as: 'avion'
                }],
            });

            if (!vuelo) throw new Error("Vuelo no encontrado");

            const avion = vuelo.avion;
            const { distribucion_asientos, total_asientos } = avion;

            const columnasPorSeccion = distribucion_asientos.split("-").map(Number);
            const letrasColumnas = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
            const totalColumnas = columnasPorSeccion.reduce((acc, num) => acc + num, 0);
            const columnasArray = letrasColumnas.slice(0, totalColumnas);

            const asientosRegistrados = await Asiento.findAll({
                where: { id_vuelo: vuelo.id_vuelo }
            });
            
            const codigosAsientosRegistrados = new Set(asientosRegistrados.map(asiento => asiento.codigo_asiento));

            let distribucionAsientos = [];
            let contadorAsientos = 0;
            let fila = 1;

            const filasTotales = Math.ceil(total_asientos / totalColumnas);
            
            while (fila <= filasTotales) {
                
                let asientosFila = [];
                let seccionIndex = 0;
                let columnaIndex = 0;
                let columnaGlobal = 0;

                for (let i = 0; i < totalColumnas; i++) {
                    if (contadorAsientos >= total_asientos) break;

                    const col = columnasArray[columnaGlobal];
                    const codigo_asiento = `${fila}${col}`;
                    const estaReservado = codigosAsientosRegistrados.has(codigo_asiento);

                    const clase = fila <= 5 ? "Business" : "Economy";

                    asientosFila.push({
                        codigo_asiento,
                        fila,
                        columna: col,
                        clase,
                        estado: estaReservado ? "reservado" : "disponible"
                    });

                    contadorAsientos++;
                    columnaIndex++;
                    columnaGlobal++;

                    if (columnaIndex >= columnasPorSeccion[seccionIndex]) {
                        columnaIndex = 0;
                        seccionIndex++;
                    }
                }

                distribucionAsientos.push({ fila, asientos: asientosFila });
                fila++;
            }

            return {
                avion: avion.modelo,
                distribucion_asientos: distribucionAsientos
            };
        } catch (error) {
            console.error("Error al generar la distribución de asientos:", error);
            throw new Error("Error al generar la distribución de asientos.");
        }
    } 
}

module.exports = AsientoService;