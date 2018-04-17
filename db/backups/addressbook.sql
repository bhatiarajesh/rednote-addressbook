--
-- Database: `addressbook`
--
-- --------------------------------------------------------

-- Table: public.users
-- DROP TABLE public.users;
CREATE TABLE public.users
(
    id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    username character varying(50) COLLATE pg_catalog."default",
    password character varying(50) COLLATE pg_catalog."default",
    CONSTRAINT users_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.users
    OWNER to aws;

-- Table: public.contacts
-- DROP TABLE public.contacts;
CREATE TABLE public.contacts
(
    id integer NOT NULL DEFAULT nextval('contacts_id_seq'::regclass),
    userid integer,
    firstname character varying(50) COLLATE pg_catalog."default",
    lastname character varying(50) COLLATE pg_catalog."default",
    phone character varying(12) COLLATE pg_catalog."default",
    CONSTRAINT contact_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.contacts
    OWNER to aws;

CREATE SEQUENCE public.contacts_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public.contacts_id_seq
    OWNER TO aws;

CREATE SEQUENCE public.users_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public.users_id_seq
    OWNER TO aws;

INSERT INTO `users` (`id`, `username`, `password`) VALUES
(1, 'test', '098f6bcd4621d37');
