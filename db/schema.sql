-- pg_dump -U postgres -d gog --schema-only -f schema.sql
--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: accounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.accounts (
    player_id integer NOT NULL,
    name text NOT NULL,
    family text NOT NULL,
    colour text NOT NULL,
    username text NOT NULL,
    password_hash text NOT NULL,
    role text NOT NULL,
    avatar_seed text,
    created_at timestamp without time zone DEFAULT now(),
    last_login timestamp without time zone DEFAULT now(),
    birthday date NOT NULL,
    version text NOT NULL
);


ALTER TABLE public.accounts OWNER TO postgres;

--
-- Name: accounts_player_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.accounts_player_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.accounts_player_id_seq OWNER TO postgres;

--
-- Name: accounts_player_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.accounts_player_id_seq OWNED BY public.accounts.player_id;


--
-- Name: games_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.games_info (
    game_id integer NOT NULL,
    name character varying(255),
    tag character varying(255),
    type character varying(255),
    results_type character varying(255),
    winner_criteria character varying(255),
    header text,
    player_min integer,
    player_max integer,
    starting character varying(255),
    colour character varying(255)
);


ALTER TABLE public.games_info OWNER TO postgres;

--
-- Name: games_info_game_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.games_info_game_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.games_info_game_id_seq OWNER TO postgres;

--
-- Name: games_info_game_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.games_info_game_id_seq OWNED BY public.games_info.game_id;


--
-- Name: gog_final_results; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gog_final_results (
    session_id integer NOT NULL,
    player_id integer NOT NULL,
    place integer,
    points integer,
    cones integer
);


ALTER TABLE public.gog_final_results OWNER TO postgres;

--
-- Name: gog_game_players; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gog_game_players (
    game_instance_id integer NOT NULL,
    player_id integer NOT NULL,
    speciality boolean,
    place integer,
    reward text,
    points text,
    stars integer,
    coins integer,
    rounds text[]
);


ALTER TABLE public.gog_game_players OWNER TO postgres;

--
-- Name: gog_game_votes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gog_game_votes (
    vote_id integer NOT NULL,
    game_instance_id integer NOT NULL,
    player_id integer NOT NULL,
    game_name character varying(255)
);


ALTER TABLE public.gog_game_votes OWNER TO postgres;

--
-- Name: gog_game_votes_vote_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.gog_game_votes_vote_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.gog_game_votes_vote_id_seq OWNER TO postgres;

--
-- Name: gog_game_votes_vote_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.gog_game_votes_vote_id_seq OWNED BY public.gog_game_votes.vote_id;


--
-- Name: gog_games; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gog_games (
    game_instance_id integer NOT NULL,
    session_id integer NOT NULL,
    game_id integer NOT NULL,
    game_number integer NOT NULL,
    name character varying(255),
    status character varying(50),
    selected_by character varying(50),
    extras text[],
    after text[]
);


ALTER TABLE public.gog_games OWNER TO postgres;

--
-- Name: gog_games_game_instance_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.gog_games_game_instance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.gog_games_game_instance_id_seq OWNER TO postgres;

--
-- Name: gog_games_game_instance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.gog_games_game_instance_id_seq OWNED BY public.gog_games.game_instance_id;


--
-- Name: gog_games_neighed; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gog_games_neighed (
    game_neighed_id integer NOT NULL,
    session_id integer NOT NULL,
    game_id integer NOT NULL,
    player_id integer NOT NULL,
    type character varying(20) NOT NULL
);


ALTER TABLE public.gog_games_neighed OWNER TO postgres;

--
-- Name: gog_games_neighed_game_neighed_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.gog_games_neighed_game_neighed_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.gog_games_neighed_game_neighed_id_seq OWNER TO postgres;

--
-- Name: gog_games_neighed_game_neighed_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.gog_games_neighed_game_neighed_id_seq OWNED BY public.gog_games_neighed.game_neighed_id;


--
-- Name: gog_players; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gog_players (
    session_id integer NOT NULL,
    player_id integer NOT NULL,
    is_playing boolean,
    speciality text[],
    pg_cone integer,
    f20g_cone integer,
    l_cone integer,
    c_cone integer,
    w_cone integer,
    v_cone integer,
    g_point integer,
    c_point integer,
    special_w_point integer,
    special_l_point integer,
    neigh integer,
    super_neigh integer,
    gooc_total integer,
    gooc_used integer
);


ALTER TABLE public.gog_players OWNER TO postgres;

--
-- Name: gog_possible_games; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gog_possible_games (
    session_id integer,
    game_id integer,
    game_name character varying(255)
);


ALTER TABLE public.gog_possible_games OWNER TO postgres;

--
-- Name: gog_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gog_sessions (
    session_id integer NOT NULL,
    name character varying(255),
    status character varying(50),
    start_time timestamp with time zone,
    finish_time timestamp with time zone,
    points_system character varying(100),
    speciality_count integer,
    refresh_count integer,
    intruded integer[],
    abandoned integer[],
    extra text[]
);


ALTER TABLE public.gog_sessions OWNER TO postgres;

--
-- Name: gog_sessions_session_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.gog_sessions_session_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.gog_sessions_session_id_seq OWNER TO postgres;

--
-- Name: gog_sessions_session_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.gog_sessions_session_id_seq OWNED BY public.gog_sessions.session_id;


--
-- Name: points_system; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.points_system (
    points_system_id integer NOT NULL,
    num_players integer,
    rewards text[],
    type character varying(255)
);


ALTER TABLE public.points_system OWNER TO postgres;

--
-- Name: points_system_points_system_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.points_system_points_system_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.points_system_points_system_id_seq OWNER TO postgres;

--
-- Name: points_system_points_system_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.points_system_points_system_id_seq OWNED BY public.points_system.points_system_id;


--
-- Name: user_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_sessions (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp without time zone NOT NULL
);


ALTER TABLE public.user_sessions OWNER TO postgres;

--
-- Name: accounts player_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts ALTER COLUMN player_id SET DEFAULT nextval('public.accounts_player_id_seq'::regclass);


--
-- Name: games_info game_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.games_info ALTER COLUMN game_id SET DEFAULT nextval('public.games_info_game_id_seq'::regclass);


--
-- Name: gog_game_votes vote_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gog_game_votes ALTER COLUMN vote_id SET DEFAULT nextval('public.gog_game_votes_vote_id_seq'::regclass);


--
-- Name: gog_games game_instance_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gog_games ALTER COLUMN game_instance_id SET DEFAULT nextval('public.gog_games_game_instance_id_seq'::regclass);


--
-- Name: gog_games_neighed game_neighed_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gog_games_neighed ALTER COLUMN game_neighed_id SET DEFAULT nextval('public.gog_games_neighed_game_neighed_id_seq'::regclass);


--
-- Name: gog_sessions session_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gog_sessions ALTER COLUMN session_id SET DEFAULT nextval('public.gog_sessions_session_id_seq'::regclass);


--
-- Name: points_system points_system_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.points_system ALTER COLUMN points_system_id SET DEFAULT nextval('public.points_system_points_system_id_seq'::regclass);


--
-- Name: accounts accounts_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_email_key UNIQUE (username);


--
-- Name: accounts accounts_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_name_key UNIQUE (name, family);


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (player_id);


--
-- Name: games_info games_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.games_info
    ADD CONSTRAINT games_info_pkey PRIMARY KEY (game_id);


--
-- Name: gog_final_results gog_final_results_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gog_final_results
    ADD CONSTRAINT gog_final_results_pkey PRIMARY KEY (session_id, player_id);


--
-- Name: gog_game_players gog_game_players_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gog_game_players
    ADD CONSTRAINT gog_game_players_pkey PRIMARY KEY (game_instance_id, player_id);


--
-- Name: gog_game_votes gog_game_votes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gog_game_votes
    ADD CONSTRAINT gog_game_votes_pkey PRIMARY KEY (vote_id);


--
-- Name: gog_games_neighed gog_games_neighed_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gog_games_neighed
    ADD CONSTRAINT gog_games_neighed_pkey PRIMARY KEY (game_neighed_id);


--
-- Name: gog_games gog_games_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gog_games
    ADD CONSTRAINT gog_games_pkey PRIMARY KEY (game_instance_id);


--
-- Name: gog_players gog_players_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gog_players
    ADD CONSTRAINT gog_players_pkey PRIMARY KEY (session_id, player_id);


--
-- Name: gog_sessions gog_sessions_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gog_sessions
    ADD CONSTRAINT gog_sessions_name_key UNIQUE (name);


--
-- Name: gog_sessions gog_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gog_sessions
    ADD CONSTRAINT gog_sessions_pkey PRIMARY KEY (session_id);


--
-- Name: points_system points_system_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.points_system
    ADD CONSTRAINT points_system_pkey PRIMARY KEY (points_system_id);


--
-- Name: user_sessions user_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_pkey PRIMARY KEY (sid);


--
-- Name: gog_final_results fk_gog_final_results_session; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gog_final_results
    ADD CONSTRAINT fk_gog_final_results_session FOREIGN KEY (session_id) REFERENCES public.gog_sessions(session_id) ON DELETE CASCADE;


--
-- Name: gog_game_players fk_gog_game_players_game; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gog_game_players
    ADD CONSTRAINT fk_gog_game_players_game FOREIGN KEY (game_instance_id) REFERENCES public.gog_games(game_instance_id) ON DELETE CASCADE;


--
-- Name: gog_game_votes fk_gog_game_votes_game; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gog_game_votes
    ADD CONSTRAINT fk_gog_game_votes_game FOREIGN KEY (game_instance_id) REFERENCES public.gog_games(game_instance_id) ON DELETE CASCADE;


--
-- Name: gog_games_neighed fk_gog_games_neighed_session; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gog_games_neighed
    ADD CONSTRAINT fk_gog_games_neighed_session FOREIGN KEY (session_id) REFERENCES public.gog_sessions(session_id) ON DELETE CASCADE;


--
-- Name: gog_games fk_gog_games_session; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gog_games
    ADD CONSTRAINT fk_gog_games_session FOREIGN KEY (session_id) REFERENCES public.gog_sessions(session_id) ON DELETE CASCADE;


--
-- Name: gog_players fk_gog_players_session; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gog_players
    ADD CONSTRAINT fk_gog_players_session FOREIGN KEY (session_id) REFERENCES public.gog_sessions(session_id) ON DELETE CASCADE;


--
-- Name: gog_possible_games fk_gog_possible_games_session; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gog_possible_games
    ADD CONSTRAINT fk_gog_possible_games_session FOREIGN KEY (session_id) REFERENCES public.gog_sessions(session_id) ON DELETE CASCADE;


--
-- Name: gog_final_results gog_final_results_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gog_final_results
    ADD CONSTRAINT gog_final_results_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.accounts(player_id);


--
-- Name: gog_game_players gog_game_players_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gog_game_players
    ADD CONSTRAINT gog_game_players_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.accounts(player_id);


--
-- Name: gog_games_neighed gog_games_neighed_game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gog_games_neighed
    ADD CONSTRAINT gog_games_neighed_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.games_info(game_id);


--
-- Name: gog_games_neighed gog_games_neighed_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gog_games_neighed
    ADD CONSTRAINT gog_games_neighed_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.accounts(player_id);


--
-- Name: gog_players gog_players_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gog_players
    ADD CONSTRAINT gog_players_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.accounts(player_id);


--
-- PostgreSQL database dump complete
--

