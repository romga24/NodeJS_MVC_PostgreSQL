-- Creating enum type for flight status
CREATE TYPE public.enum_t_vuelos_estado_vuelo AS ENUM ('Programado', 'Cancelado', 'Retrasado', 'Completado');

-- Creating table for airlines
CREATE TABLE IF NOT EXISTS public.t_aerolineas
(
    id_aerolinea integer NOT NULL DEFAULT nextval('t_aerolineas_id_aerolinea_seq'::regclass),
    nombre character varying(255) COLLATE pg_catalog."default" NOT NULL,
    codigo_iata character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT t_aerolineas_pkey PRIMARY KEY (id_aerolinea),
    CONSTRAINT t_aerolineas_codigo_iata_key UNIQUE (codigo_iata)
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.t_aerolineas
    OWNER to airlink;

-- Creating table for airports
CREATE TABLE IF NOT EXISTS public.t_aeropuertos
(
    id_aeropuerto integer NOT NULL DEFAULT nextval('t_aeropuertos_id_aeropuerto_seq'::regclass),
    nombre character varying(255) COLLATE pg_catalog."default" NOT NULL,
    ciudad character varying(255) COLLATE pg_catalog."default" NOT NULL,
    pais character varying(255) COLLATE pg_catalog."default" NOT NULL,
    codigo_iata character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT t_aeropuertos_pkey PRIMARY KEY (id_aeropuerto),
    CONSTRAINT t_aeropuertos_codigo_iata_key UNIQUE (codigo_iata)
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.t_aeropuertos
    OWNER to airlink;

-- Creating table for aircraft
CREATE TABLE IF NOT EXISTS public.t_aviones
(
    id_avion integer NOT NULL DEFAULT nextval('t_aviones_id_avion_seq'::regclass),
    modelo character varying(255) COLLATE pg_catalog."default" NOT NULL,
    capacidad integer NOT NULL,
    distribucion_asientos character varying(255) COLLATE pg_catalog."default" NOT NULL,
    total_asientos integer NOT NULL,
    CONSTRAINT t_aviones_pkey PRIMARY KEY (id_avion)
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.t_aviones
    OWNER to airlink;

-- Creating table for clients
CREATE TABLE IF NOT EXISTS public.t_clientes
(
    id_cliente integer NOT NULL DEFAULT nextval('t_clientes_id_cliente_seq'::regclass),
    nombre character varying(255) COLLATE pg_catalog."default" NOT NULL,
    apellidos character varying(255) COLLATE pg_catalog."default" NOT NULL,
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    telefono character varying(255) COLLATE pg_catalog."default" NOT NULL,
    nif character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "contraseña" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    es_admin boolean DEFAULT false,
    nombre_usuario character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT t_clientes_pkey PRIMARY KEY (id_cliente),
    CONSTRAINT t_clientes_email_key UNIQUE (email),
    CONSTRAINT t_clientes_nif_key UNIQUE (nif),
    CONSTRAINT t_clientes_nombre_usuario_key UNIQUE (nombre_usuario)
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.t_clientes
    OWNER to airlink;

-- Creating table for passengers
CREATE TABLE IF NOT EXISTS public.t_pasajeros
(
    id_pasajero integer NOT NULL DEFAULT nextval('t_pasajeros_id_pasajero_seq'::regclass),
    nombre character varying(255) COLLATE pg_catalog."default" NOT NULL,
    apellidos character varying(255) COLLATE pg_catalog."default" NOT NULL,
    email character varying(255) COLLATE pg_catalog."default",
    telefono character varying(255) COLLATE pg_catalog."default",
    nif character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT t_pasajeros_pkey PRIMARY KEY (id_pasajero)
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.t_pasajeros
    OWNER to airlink;

-- Creating table for reservations
CREATE TABLE IF NOT EXISTS public.t_reservas
(
    id_reserva integer NOT NULL DEFAULT nextval('t_reservas_id_reserva_seq'::regclass),
    id_cliente integer,
    fecha_reserva timestamp with time zone NOT NULL,
    CONSTRAINT t_reservas_pkey PRIMARY KEY (id_reserva),
    CONSTRAINT t_reservas_id_cliente_fkey FOREIGN KEY (id_cliente)
        REFERENCES public.t_clientes (id_cliente) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.t_reservas
    OWNER to airlink;

-- Creating table for flights
CREATE TABLE IF NOT EXISTS public.t_vuelos
(
    id_vuelo integer NOT NULL DEFAULT nextval('t_vuelos_id_vuelo_seq'::regclass),
    numero_vuelo character varying(255) COLLATE pg_catalog."default" NOT NULL,
    id_aeropuerto_origen integer,
    id_aeropuerto_destino integer,
    fecha_salida timestamp with time zone NOT NULL,
    fecha_llegada timestamp with time zone NOT NULL,
    id_avion integer,
    id_aerolinea integer,
    precio_vuelo double precision NOT NULL,
    estado_vuelo enum_t_vuelos_estado_vuelo NOT NULL DEFAULT 'Programado'::enum_t_vuelos_estado_vuelo,
    CONSTRAINT t_vuelos_pkey PRIMARY KEY (id_vuelo),
    CONSTRAINT t_vuelos_numero_vuelo_key UNIQUE (numero_vuelo),
    CONSTRAINT t_vuelos_id_aerolinea_fkey FOREIGN KEY (id_aerolinea)
        REFERENCES public.t_aerolineas (id_aerolinea) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION,
    CONSTRAINT t_vuelos_id_aeropuerto_destino_fkey FOREIGN KEY (id_aeropuerto_destino)
        REFERENCES public.t_aeropuertos (id_aeropuerto) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION,
    CONSTRAINT t_vuelos_id_aeropuerto_origen_fkey FOREIGN KEY (id_aeropuerto_origen)
        REFERENCES public.t_aeropuertos (id_aeropuerto) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION,
    CONSTRAINT t_vuelos_id_avion_fkey FOREIGN KEY (id_avion)
        REFERENCES public.t_aviones (id_avion) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.t_vuelos
    OWNER to airlink;

-- Creating table for seats
CREATE TABLE IF NOT EXISTS public.t_asientos
(
    id_asiento integer NOT NULL DEFAULT nextval('t_asientos_id_asiento_seq'::regclass),
    id_avion integer,
    id_vuelo integer,
    fila integer NOT NULL,
    columna character(255) COLLATE pg_catalog."default" NOT NULL,
    codigo_asiento character varying(255) COLLATE pg_catalog."default" NOT NULL,
    clase character varying(255) COLLATE pg_catalog."default" DEFAULT 'economica'::character varying,
    estado character varying(255) COLLATE pg_catalog."default" DEFAULT 'disponible'::character varying,
    CONSTRAINT t_asientos_pkey PRIMARY KEY (id_asiento),
    CONSTRAINT t_asientos_id_avion_fkey FOREIGN KEY (id_avion)
        REFERENCES public.t_aviones (id_avion) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT t_asientos_id_vuelo_fkey FOREIGN KEY (id_vuelo)
        REFERENCES public.t_vuelos (id_vuelo) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.t_asientos
    OWNER to airlink;

-- Creating table for tickets
CREATE TABLE IF NOT EXISTS public.t_billetes
(
    id_billete integer NOT NULL DEFAULT nextval('t_billetes_id_billete_seq'::regclass),
    id_reserva integer,
    id_vuelo integer,
    id_pasajero integer,
    id_asiento integer,
    localizador character varying(255) COLLATE pg_catalog."default" NOT NULL,
    precio numeric NOT NULL,
    CONSTRAINT t_billetes_pkey PRIMARY KEY (id_billete),
    CONSTRAINT t_billetes_localizador_key UNIQUE (localizador),
    CONSTRAINT t_billetes_id_asiento_fkey FOREIGN KEY (id_asiento)
        REFERENCES public.t_asientos (id_asiento) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT t_billetes_id_pasajero_fkey FOREIGN KEY (id_pasajero)
        REFERENCES public.t_pasajeros (id_pasajero) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION,
    CONSTRAINT t_billetes_id_reserva_fkey FOREIGN KEY (id_reserva)
        REFERENCES public.t_reservas (id_reserva) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT t_billetes_id_vuelo_fkey FOREIGN KEY (id_vuelo)
        REFERENCES public.t_vuelos (id_vuelo) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.t_billetes
    OWNER to airlink;