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

--
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.accounts (player_id, name, family, colour, username, password_hash, role, avatar_seed, created_at, last_login, birthday, version) FROM stdin;
1	Dan	Pudig	#E63946	DanTheMan	$2b$12$2JwoUfWesbbXXGVGO19P7e8yNpo5vKxo4/MjBZjA2DkstduhfUNkq	admin	https://api.dicebear.com/9.x/fun-emoji/svg?seed=Emery&radius=50&flip=false&rotate=0&scale=100&backgroundColor=ff0000&translateX=0&translateY=0&eyes=shades&mouth=cute	2025-12-19 16:20:31.487317	2025-12-23 16:20:31.487317	2001-10-23	private
2	Gideon	Blinder	#105E2F	Gid980	$2b$12$JTaQAk8.WV/8d53q.ZwSeeBmxTLHcEEFmQzWOJLDQ/jz5XbGSsCAe	admin	https://api.dicebear.com/9.x/fun-emoji/svg?seed=Emery&radius=50&flip=false&rotate=0&scale=100&backgroundColor=[]&translateX=0&translateY=0&eyes=plain&mouth=plain	2025-12-26 13:23:31.487317	2025-12-26 13:23:31.487317	2002-05-05	private
3	Jake	Burgess	#800000	Jqm	$2b$12$JTaQAk8.WV/8d53q.ZwSeeBmxTLHcEEFmQzWOJLDQ/jz5XbGSsCAe	admin	https://api.dicebear.com/9.x/fun-emoji/svg?seed=Emery&radius=50&flip=false&rotate=0&scale=100&backgroundColor=[]&translateX=0&translateY=0&eyes=plain&mouth=plain	2025-12-26 13:23:31.487317	2025-12-26 13:23:31.487317	2002-02-07	private
4	Danny	Lawrence	#014273	Dannywuh	$2b$12$JTaQAk8.WV/8d53q.ZwSeeBmxTLHcEEFmQzWOJLDQ/jz5XbGSsCAe	admin	https://api.dicebear.com/9.x/fun-emoji/svg?seed=Emery&radius=50&flip=false&rotate=0&scale=100&backgroundColor=[]&translateX=0&translateY=0&eyes=plain&mouth=plain	2025-12-26 13:23:31.487317	2025-12-26 13:23:31.487317	2000-10-26	private
5	Alex	O'Dowd	#992ADE	Ultraturkey	$2b$12$JTaQAk8.WV/8d53q.ZwSeeBmxTLHcEEFmQzWOJLDQ/jz5XbGSsCAe	admin	https://api.dicebear.com/9.x/fun-emoji/svg?seed=Emery&radius=50&flip=false&rotate=0&scale=100&backgroundColor=[]&translateX=0&translateY=0&eyes=plain&mouth=plain	2025-12-26 13:23:31.487317	2025-12-26 13:23:31.487317	2000-09-11	private
6	Max	Tester	#00805E	Goodbyeyou	$2b$12$JTaQAk8.WV/8d53q.ZwSeeBmxTLHcEEFmQzWOJLDQ/jz5XbGSsCAe	admin	https://api.dicebear.com/9.x/fun-emoji/svg?seed=Emery&radius=50&flip=false&rotate=0&scale=100&backgroundColor=[]&translateX=0&translateY=0&eyes=plain&mouth=plain	2025-12-26 13:23:31.487317	2025-12-26 13:23:31.487317	2001-10-11	private
7	Isabella	Kaye	#FFFF99	Bella	$2b$12$JTaQAk8.WV/8d53q.ZwSeeBmxTLHcEEFmQzWOJLDQ/jz5XbGSsCAe	admin	https://api.dicebear.com/9.x/fun-emoji/svg?seed=Emery&radius=50&flip=false&rotate=0&scale=100&backgroundColor=[]&translateX=0&translateY=0&eyes=plain&mouth=plain	2025-12-26 13:23:31.487317	2025-12-26 13:23:31.487317	2002-02-24	private
8	Vanessa	Hodges	#9DC183	Ness	$2b$12$JTaQAk8.WV/8d53q.ZwSeeBmxTLHcEEFmQzWOJLDQ/jz5XbGSsCAe	admin	https://api.dicebear.com/9.x/fun-emoji/svg?seed=Emery&radius=50&flip=false&rotate=0&scale=100&backgroundColor=[]&translateX=0&translateY=0&eyes=plain&mouth=plain	2025-12-26 13:23:31.487317	2025-12-26 13:23:31.487317	2002-01-06	private
9	Aryana	Afzali	#35063E	Ari	$2b$12$JTaQAk8.WV/8d53q.ZwSeeBmxTLHcEEFmQzWOJLDQ/jz5XbGSsCAe	admin	https://api.dicebear.com/9.x/fun-emoji/svg?seed=Emery&radius=50&flip=false&rotate=0&scale=100&backgroundColor=[]&translateX=0&translateY=0&eyes=plain&mouth=plain	2025-12-26 13:23:31.487317	2025-12-26 13:23:31.487317	2002-04-19	private
10	Max	Valetine	#03C04A	Max	$2b$12$JTaQAk8.WV/8d53q.ZwSeeBmxTLHcEEFmQzWOJLDQ/jz5XbGSsCAe	user	https://api.dicebear.com/9.x/fun-emoji/svg?seed=Emery&radius=50&flip=false&rotate=0&scale=100&backgroundColor=[]&translateX=0&translateY=0&eyes=plain&mouth=plain	2025-12-26 13:23:31.487317	2025-12-26 13:23:31.487317	2000-09-08	private
11	Abbey	Walker	#87CEEB	Abbey	$2b$12$JTaQAk8.WV/8d53q.ZwSeeBmxTLHcEEFmQzWOJLDQ/jz5XbGSsCAe	admin	https://api.dicebear.com/9.x/fun-emoji/svg?seed=Emery&radius=50&flip=false&rotate=0&scale=100&backgroundColor=[]&translateX=0&translateY=0&eyes=plain&mouth=plain	2025-12-26 13:23:31.487317	2025-12-26 13:23:31.487317	2001-03-16	private
\.


--
-- Data for Name: games_info; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.games_info (game_id, name, tag, type, results_type, winner_criteria, header, player_min, player_max, starting, colour) FROM stdin;
1	Shithead	shithead	card	knockout	first	Shuffe those cards and don't be the shithead!<br><br>Click your name when you're done.	2	10	wheel_first	#795548
2	Golf	golf	card	table_rounds	lowest		2	10	wheel_first	#43A047
3	Skip Bo	skip_bo	card	knockout	first		2	10	wheel_first	#66BB6A
4	Monopoly Deal	monopoly_deal	card	single	winner	Build up those property sets!	2	10	wheel_first	#E64A19
5	Monopoly Bid	monopoly_bid	card	single	winner	Build up those property sets!<br>I think?	2	5	wheel_first	#90CAF9
6	Muffin Time	muffin	card	single	winner	Get to 10 cards to win!	2	6	wheel_first	#90A4AE
7	Here to Slay	here_to_slay	card	single	winner	Successfully slay 3 monsters or build a full party with 6 classes to win!	2	6	wheel_first	#EF5350
8	Unstable Unicorns	unicorns	card	table	highest	Get to 7 unicorns to win!	2	8	wheel_first	#29B6F6
9	Llamas Unleashed	llamas	card	table	highest	Get to 7 animals to win!	2	8	wheel_first	#FFD54F
10	Yahtzee Cards	yahtzee_cards	card	table	highest	Get as many points as you can!	2	6	wheel_first	#D32F2F
11	FUCK the Game	fuck	card	table_rounds	highest	Get as many points as you can!	3	8	wheel_first	#E91E63
12	Coup	coup	card	knockout	last	Don't get killed!	2	6	wheel_first	#455A64
13	Uno	uno	card	knockout	first	Get rid of all of your cards!	2	10	wheel_first	#E53935
14	Uno Flip	uno_flip	card	knockout	first	Get rid of all of your cards!	2	10	wheel_first	#8E24AA
15	Uno No Mercy	uno_no_mercy	card	knockout	first	Get rid of all of your cards or be the last to die!	2	10	wheel_first	#D81B60
16	Cards Against Humanity	cah	card	table	highest		4	10	wheel_first	#B0BEC5
17	Costumed Cats	cats	card	table	highest	Match those cats!	2	10	wheel_first	#FFD180
18	Struggle for Catan	sf_catan	card	table	highest	Get 10 Victory points to win!	2	4	wheel_first	#BF360C
19	Avocado Smash	avocado	card	knockout	first	Get rid of all of your cards to win!	2	10	wheel_first	#84BD00
20	Monopoly	monopoly	board	table	highest	Get rich!	2	8	wheel_first	#D32F2F
21	Game of Life	go_life	board	table	highest	Get rich!	2	6	wheel_first	#FFEB3B
22	Catan	catan	board	table	highest	Get 10 Victory points to win!	2	6	wheel_first	#F57C00
23	Betrayal	betrayal	board	special	winner	Don't die (or maybe do if you need to)<br><br>Who is the traitor?	3	6		#4B0082
24	Chess	chess	board	tournament	winner	Attack those pieces while defending yours!	2	10		#8D6E63
25	Trouble (Pop-n-hop)	trouble	board	knockout	first	Get your pieces around the board and into the middle!	2	4	wheel_first	#FFEE58
26	Block Party	block_party	party	table	highest	Build some blocks and shit!	2	10	wheel_first	#FF6F61
27	Mario Kart	mario_kart	video	special	highest	Drive those carts or bikes around the track!	2	10		#E53935
28	Mario Party	mario_party	video	special	winner		2	10		#FDD835
29	Super Smash Bros	smash	video	multiple		Don't fall off the stage!	2	10		#5E35B1
30	Switch Bowling	s_bowling	video	table	highest	Shoot those balls and knock those pins down!	2	10	wheel_order	#90CAF9
31	Switch Tennis	s_tennis	video	team	winner	Hit those balls over the net!	2	10		#66BB6A
32	Switch Basketball	s_basketball	video	multiple		Shoot those hoops!	2	4		#FF8A65
33	Switch Golf	s_golf	video	special	lowest	Hit those balls!	2	10	wheel_order	#A5D6A7
34	Minigolf Adventure	minigolf_a	video	multiple	lowest	Hit those balls with some totally normal gravity!	2	10	wheel_order	#81C784
35	Gang Beasts	gang_beasts	video	counter	highest	Throw everyone off! Now!	2	4		#F50057
36	FIFA	fifa	video	team_points	winner	Get as many goals as you can!	2	4		#388E3C
37	NBA	nba	video	team_points	winner	Get as many points as you can!	2	4		#1976D2
38	Call of Duty	cod	video	table	highest	KILL! KILL! KILL!	2	4		#6E7F80
39	Injustice	injustice	video	tournament	winner	FIGHT! FIGHT! FIGHT!	2	10		#263238
40	Street Fighter	street_figher	video	tournament	winner	FIGHT! FIGHT! FIGHT!	2	10		#C2185B
41	Basketball	basketball	outdoor	team_points	winner	Shoot those hoops!	2	10	wheel_first	#D2691E
42	Table Tennis	table_tennis	outdoor	tournament	points	Hit those balls	2	10		#42A5F5
43	Backyard Cricket	cricket	outdoor	team_points	winner	Hit those balls!	2	10	wheel_first	#4CAF50
44	Soccer	soccer	outdoor	team_points	winner	Kick the ball into the net!	2	10	wheel_first	#43A047
45	Handball	handball	outdoor	tournament	points	Hit those balls across the court!	2	10		#FDD835
46	Capture the Flag	ct_flag	outdoor	team_points	winner	Capture those flags!	2	10	wheel_first	#1976D2
47	Quoits	quoits	party	counter_rounds	highest	Throw those rings!	2	10	wheel_order	#EF6C00
48	Cornhole	cornhole	party	counter_rounds	highest	Throw those sacks!	2	10	wheel_order	#A1887F
49	Shooting	shooting	outdoor	counter_rounds	highest	Shoot the gun!	2	10	wheel_order	#795548
50	Alphabetix	alphabetix	party	special	winner	Come up with as many words as you can for the current letter!	2	10		#F4C542
51	Uno Stacko	uno_stacko	party	single	loser	Stack those blocks!<br>Who knocked it over?	2	10	wheel_first	#FF7043
52	Jenga	jenga	party	single	loser	Stack those blocks!<br>Who knocked it over?	2	10	wheel_first	#FFA726
53	4:20 Game	four20game	party	special	winner		2	10		#4CAF50
54	Sounds Fishy	fishy	party	table	highest	Reel them in with a lie.<br>Just don't get caught.	2	10	wheel_first	#00ACC1
55	Five Crowns	five_crowns	card	special	lowest		2	10		#AB47BC
56	Karma	karma	card	knockout	first	Play your cards wisely and use Karma to your advantage!<br>Click your name when you're out.<br>Click your name again if you're brought back in.	2	7	wheel_first	#009688
57	Tong-its	tongits	card	table_rounds	lowest	Get rid of all of your cards!	2	10	wheel_first	#6D4C41
58	Flip 7	flip7	card	table_rounds	highest	Push your luck! Race to 200	2	10	wheel_first	#FF7043
59	Beer Pong	beer_pong	party	team_points	winner	Shoot those balls!	2	10	wheel_first	#E53935
60	Putt Putt	putt_putt	party	table_rounds	lowest	Shoot those balls!	2	10	wheel_order	#66BB6A
61	Codenames	codenames	card	team_points	winner	Crack the code, guess the words!	2	10	wheel_first	#FF8A65
62	Boomerang Fu	boomerang_fu	video	counter	highest	Throw those boomeranges! Get the power-ups and slice your enemies!	2	6		#FFB74D
63	Minigolf Bowling	minigolf_bowling	party	table_rounds	lowest	Shoot those balls and knock those pins over!   	2	10	wheel_order	#66BB6A
64	Rhythm Kitchen	rhythm_kitchen	video	table	highest	Make some banging music!	2	8	wheel_order	#E53935
65	Moose Master	moose	card	knockout	last	Follow the rules or look like a fool!	2	10	wheel_first	#00ACC1
66	Codenames Pictures	codenames_pic	card	team_points	winner	Crack the code, guess the words!	2	10	wheel_first	#FF8A65
67	Codenames Duet	codenames_duet	card	team_points	winner	Crack the code, guess the words!	2	10	wheel_first	#FF8A65
\.


--
-- Data for Name: gog_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.gog_sessions (session_id, name, status, start_time, finish_time, points_system, speciality_count, refresh_count, intruded, abandoned, extra) FROM stdin;
1	Game of Games No. 1	complete	2023-01-28 01:00:00+11	2023-01-28 23:59:59+11	Just Points	2	0	{}	{}	{}
2	Game of Games No. 2	complete	2023-02-24 17:20:00+11	2023-02-24 18:55:52+11	Just Points	1	0	{}	{}	{"All at the same time","Speciality decided by Spinner Wheel"}
3	Game of Games No. 3	complete	2023-10-12 17:20:00+11	2023-10-12 23:59:59+11	Points & Cones	0	0	{4}	{}	{}
4	Game of Games No. 4	complete	2023-10-15 01:00:00+11	2023-10-15 23:59:59+11	Points & Cones	0	0	{}	{}	{}
5	Game of Games No. 5	complete	2024-01-15 01:00:00+11	2024-01-15 23:59:59+11	Points & Cones	0	0	{}	{}	{}
6	Game of Games No. 6	complete	2024-05-25 00:00:00+10	2024-05-25 23:59:59+10	Points & Cones	2	0	{}	{}	{}
7	Game of Games No. 7	complete	2024-09-06 16:20:00+10	2024-09-06 23:59:59+10	Points & Cones	2	0	{2}	{6,7}	{}
8	Game of Games No. 8	complete	2024-09-08 16:20:00+10	2024-09-08 23:59:59+10	Points & Cones	0	0	{}	{7}	{}
9	Game of Games No. 9	complete	2023-01-28 01:00:00+11	2023-01-28 23:59:59+11	Points & Cones	2	0	{}	{}	{}
10	Game of Games No. 10	complete	2024-10-07 14:00:00+11	2024-10-07 18:00:00+11	Points & Cones	2	0	{}	{}	{}
11	Game of Games No. 11	complete	2024-10-23 13:23:00+11	2024-10-23 23:59:59+11	Points & Cones	0	0	{}	{}	{}
12	Game of Games No. 12	complete	2024-11-24 00:00:00+11	2024-11-24 23:59:59+11	Points & Cones	0	0	{}	{}	{}
13	Game of Games No. 13	complete	2024-12-21 00:00:00+11	2024-12-21 23:59:00+11	Points & Cones	2	0	{2}	{7}	{}
14	Game of Games No. 14	complete	2025-01-04 00:00:00+11	2025-01-04 23:59:59+11	Points & Cones	2	0	{}	{}	{}
15	Game of Games No. 15	complete	2025-01-26 18:00:00+11	2025-01-26 23:59:59+11	Points & Cones	2	0	{2}	{6,7}	{}
16	Game of Games No. 16	complete	2025-03-09 16:20:00+11	2025-03-09 23:00:00+11	Points & Cones	2	0	{2}	{}	{}
17	Game of Games No. 17	complete	2025-07-05 14:22:00+10	2025-07-05 23:11:00+10	Points & Cones	2	0	{9,10}	{6,7}	{}
18	Game of Games No. 18	complete	2025-08-08 19:42:12.39+10	2025-08-09 00:34:33.653+10	Points & Cones	2	0	{}	{7}	{}
19	Game of Games No. 19	complete	2025-08-30 13:05:49.407+10	2025-08-31 00:02:38.061+10	Points & Cones	2	0	{7}	{7}	{}
20	Game of Games No. 20	complete	2025-09-19 19:30:00+10	2025-09-19 23:59:59+10	Points & Cones	1	0	{}	{}	{}
21	Game of Games No. 21	complete	2025-09-27 14:10:00+10	2025-09-27 23:37:37.726+10	Points & Cones	2	1	{7,6,3}	{}	{}
\.


--
-- Data for Name: gog_final_results; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.gog_final_results (session_id, player_id, place, points, cones) FROM stdin;
1	4	1	31	0
1	2	2	30	0
1	5	3	26	0
1	3	4	24	0
1	1	5	22	0
2	5	1	10	0
2	1	2	5	0
2	3	3	2	0
2	2	3	2	0
3	4	1	7	2
3	5	2	6	4
3	3	2	6	4
3	2	4	6	5
3	7	5	5	4
3	1	6	3	4
3	6	7	3	5
4	3	1	3	3
4	1	2	3	4
4	2	3	0	3
4	5	4	0	5
5	1	1	9	4
5	5	2	8	6
5	4	3	5	4
5	3	3	5	4
5	2	5	5	5
6	1	1	6	4
6	2	2	3	5
6	3	3	1	4
7	4	1	9	6
7	7	2	5	6
7	5	3	4	5
7	3	4	4	6
7	6	5	3	5
7	2	6	3	6
7	1	7	3	8
8	1	1	6	3
8	6	2	3	2
8	7	3	3	3
8	3	4	1	4
9	1	1	11	14
9	3	2	6	14
10	4	1	5	3
10	1	2	4	4
10	6	3	3	4
10	3	4	2	3
10	5	5	2	5
10	2	6	0	4
10	7	7	0	5
11	1	1	6	5
11	3	2	4	4
11	7	3	4	5
11	6	4	2	4
12	1	1	3	5
12	8	2	2	5
13	1	1	10	2
13	2	2	9	2
13	6	3	8	4
13	4	4	6	3
13	3	5	5	3
13	5	6	3	2
13	7	6	3	2
14	3	1	6	6
14	4	2	5	7
14	1	3	4	5
15	4	1	9	2
15	6	2	7	3
15	2	3	5	3
15	7	4	5	4
15	5	5	4	4
15	3	6	3	5
15	1	7	0	4
16	1	1	7	3
16	4	1	7	3
16	2	3	2	2
16	3	4	2	4
16	5	5	1	5
17	5	1	13	4
17	4	2	11	3
17	6	3	7	4
17	2	4	7	5
17	10	5	7	6
17	3	6	6	4
17	7	7	5	5
17	1	8	5	7
17	9	9	2	0
18	6	1	11	4
18	4	2	10	4
18	3	3	9	6
18	1	4	8	7
18	7	5	3	6
19	4	1	18	9
19	1	2	14	6
19	7	3	10	3
19	6	4	10	11
19	3	5	7	11
20	6	1	9	4
20	7	1	9	4
20	3	3	7	3
20	4	4	7	4
20	5	5	4	4
20	2	6	4	5
20	1	7	4	7
21	1	1	10	10
21	2	2	9	7
21	3	3	7	3
21	7	4	7	8
21	6	5	6	5
21	5	6	4	9
\.


--
-- Data for Name: gog_games; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.gog_games (game_instance_id, session_id, game_id, game_number, name, status, selected_by, extras, after) FROM stdin;
1	1	19	1	Avocado Smash	complete	Wheel	{}	{}
2	1	13	2	Uno	complete	Wheel	{}	{}
3	1	4	3	Monopoly Deal	complete	Wheel	{}	{}
4	1	1	4	Shithead	complete	Wheel	{}	{}
5	1	14	5	Uno Flip	complete	Wheel	{}	{}
6	1	3	6	Skip Bo	complete	Wheel	{}	{}
7	1	27	7	Mario Kart	complete	Wheel	{"Time Trial","Koopa City"}	{}
8	1	10	8	Yahtzee Cards	complete	Wheel	{}	{}
9	1	2	9	Golf	complete	Wheel	{}	{}
10	1	29	10	Super Smash Bros	complete	Wheel	{"3 rounds"}	{}
11	1	9	11	Llamas Unleashed	complete	Wheel	{}	{}
12	1	7	12	Here to Slay	complete	Wheel	{}	{}
13	2	3	1	Skip Bo	complete	Choose	{}	{}
14	2	1	2	Shithead	complete	Choose	{}	{}
15	2	34	3	Minigolf Adventure	complete	Choose	{}	{}
16	2	52	4	Jenga	complete	Choose	{}	{}
17	3	52	1	Jenga	complete	Wheel	{}	{"Isabella NEIGHED Yahtzee Cards","Jake NEIGHED Alphabetix"}
18	3	53	2	4:20 Game	complete	Wheel	{session_3.png}	{}
19	3	3	3	Skip Bo	complete	Wheel	{}	{"Danny INTRUDED the Game"}
20	3	13	4	Uno	complete	Wheel	{}	{}
21	3	1	5	Shithead	complete	Wheel	{}	{"Alex had a VICTORY cone","Dan NEIGHED Alphabetix"}
22	3	28	6	Mario Party	complete	Wheel	{Teams}	{"Jake had a BREAK cone","Gideon had a VICTORY cone","Danny had a VICTORY cone"}
23	4	31	1	Switch Tennis	complete	Wheel	{}	{"Alex NEIGHED Alphabetix"}
24	4	22	2	Catan	complete	Wheel	{}	{"Everyone had a BREAK cone"}
25	4	2	3	Golf	complete	Wheel	{}	{"Dan had a VICTORY cone","Jake had a VICTORY cone"}
26	5	22	1	Catan	complete	Wheel	{}	{"Alex had a BREAK cone"}
27	5	30	2	Switch Bowling	complete	Wheel	{}	{"Gideon had a BREAK cone","Alex NEIGHED Mario Kart"}
28	5	51	3	Uno Stacko	complete	Wheel	{}	{}
29	5	14	4	Uno Flip	complete	Wheel	{}	{"Dan had a VICTORY cone"}
30	5	1	5	Shithead	complete	Wheel	{}	{"Alex had a WHEEL cone"}
31	5	3	6	Skip Bo	complete	Wheel	{}	{}
32	5	6	7	Muffin Time	complete	Wheel	{}	{}
33	5	2	8	Golf	complete	Wheel	{}	{"Jake had a BREAK cone","Alex had a VICTORY cone"}
34	6	35	1	Gang Beasts	complete	Wheel	{}	{}
35	6	34	2	Minigolf Adventure	complete	Wheel	{}	{}
36	6	29	3	Super Smash Bros	complete	Wheel	{}	{"Jake had a BREAK cone"}
37	6	28	4	Mario Party	complete	Wheel	{}	{"Gideon NEIGHED Switch Golf","Dan NEIGHED Gideon's Neigh"}
38	6	33	5	Switch Golf	complete	Wheel	{}	{}
39	6	2	6	Golf	complete	Wheel	{}	{}
40	6	14	7	Uno Flip	complete	Wheel	{}	{}
41	6	25	8	Trouble (Pop-n-hop)	complete	Wheel	{}	{"Dan had a VICTORY cone"}
42	7	52	1	Jenga	complete	Wheel	{}	{"Isabella had a BREAK cone","Gideon INTRUDED the Game","Everyone had a BREAK cone"}
43	7	21	2	Game of Life	complete	Wheel	{}	{"Dan had a BREAK cone","Alex had a BREAK cone","Danny had a BREAK cone","Max had a BREAK cone"}
44	7	30	3	Switch Bowling	complete	Wheel	{Standard}	{"Dan had a VICTORY cone","Gideon had a BREAK cone","Isabella had a BREAK cone"}
45	7	53	4	4:20 Game	complete	Wheel	{session_7.png}	{"Isabella NEIGHED Catan"}
46	7	2	5	Golf	complete	Wheel	{"3 Rounds"}	{"Max ABANDONED the Game","Isabella ABANDONED the Game"}
47	7	1	6	Shithead	complete	Wheel	{}	{"Danny had a VICTORY cone"}
48	8	42	1	Table Tennis	complete	Wheel	{}	{"Isabella NEIGHED Gang Beasts","Dan NEIGHED Mario Party"}
49	8	34	2	Minigolf Adventure	complete	Wheel	{"3 Rounds"}	{"Dan had a VICTORY cone"}
50	8	2	3	Golf	complete	Wheel	{"4 Rounds"}	{}
51	8	30	4	Switch Bowling	complete	Wheel	{Special}	{"Max won a GOOC card - Got a Five Bagger","Jake NEIGHED Switch Golf","Isabella SUPER NEIGHED Switch Basketball","Max NEIGHED Super Smash Bros","Max SUPER NEIGHED Gang Beasts","Jake SUPER NEIGHED Super Smash Bros","Dan SUPER NEIGHED Gang Beasts","Isabella ABANDONED the Game"}
52	8	1	5	Shithead	complete	Wheel	{"2 Decks"}	{}
53	9	8	1	Unstable Unicorns	complete	Wheel	{}	{}
54	9	14	2	Uno Flip	complete	Wheel	{}	{}
55	9	27	3	Mario Kart	complete	Wheel	{"4 Races"}	{}
56	9	53	4	4:20 Game	complete	Wheel	{session_9.png}	{}
57	9	28	5	Mario Party	complete	Wheel	{Superstars,"Woody Woods","15 Turns"}	{"Dan had a BREAK cone (4:20)","Jake had a BREAK cone (4:20)","Jake NEIGHED Super Smash Bros"}
58	9	35	6	Gang Beasts	complete	Wheel	{"First to 3"}	{}
59	9	31	7	Switch Tennis	complete	Wheel	{"Best of 5"}	{"Dan had a VICTORY cone"}
60	9	34	8	Minigolf Adventure	complete	Wheel	{"6 Holes"}	{}
61	9	1	9	Shithead	complete	Wheel	{"2 Decks"}	{}
62	9	17	10	Costumed Cats	complete	Wheel	{"First to 13"}	{"Jake NEIGHED Injustice","Dan NEIGHED Monopoly","Jake SUPER NEIGHED Monopoly"}
63	9	2	11	Golf	complete	Wheel	{"7 Rounds"}	{"Dan had a VICTORY cone","DINNER BREAK","Dan had a BREAK cone","Jake had a BREAK cone","Dan NEIGHED Monopoly Deal"}
64	9	33	12	Switch Golf	complete	Wheel	{}	{}
65	9	6	13	Muffin Time	complete	Wheel	{}	{"Dan had a VICTORY cone","Dan SUPER NEIGHED Yahtzee Cards","Dan SUPER NEIGHED Monopoly Deal","Jake SUPER NEIGHED Call of Duty"}
66	9	30	14	Switch Bowling	complete	Wheel	{Special,Advanced}	{}
67	9	52	15	Jenga	complete	Wheel	{}	{"Dan had a VICTORY cone"}
68	9	3	16	Skip Bo	complete	Wheel	{"13 Cards","2 Up 2 Down"}	{"Jake had a VICTORY cone"}
69	10	42	1	Table Tennis	complete	Wheel	{}	{"Jake won a GOOC card - Flawless Victory","Isabella won a GOOC card - Flawless Victory","Everyone had a BREAK cone (4:20 cone)"}
70	10	2	2	Golf	complete	Wheel	{"5 rounds"}	{"Isabella used her GOOC card","Max had a VICTORY cone","Dan had a BREAK cone","Alex had a BREAK cone"}
71	10	41	3	Basketball	complete	Wheel	{}	{"Dan got injured :(","Dan had a VICTORY cone (best pain relief)"}
72	11	28	1	Mario Party	complete	Choose	{Jamboree,"10 Turns","Goomba Lagoon"}	{"Dan had a BREAK cone","Max had a BREAK cone","Isabella had a VICTORY cone","LUNCH BREAK","Dan had a BREAK cone (4:20 cone)","Isabella had a BREAK cone (4:20 cone)"}
73	11	2	2	Golf	complete	Choose	{"4 rounds"}	{}
74	11	3	3	Skip Bo	complete	Choose	{"12 Cards","2 Up 2 Down"}	{}
75	11	53	4	4:20 Game	complete	Choose	{session_11.png}	{}
76	11	30	5	Switch Bowling	complete	Choose	{Standard}	{"Dan had a VICTORY cone"}
77	12	25	1	Trouble (Pop-n-hop)	complete	Choose	{}	{"Vanessa had a VICTORY cone"}
78	12	27	2	Mario Kart	complete	Choose	{}	{"Dan had a VICTORY cone"}
79	12	1	3	Shithead	complete	Choose	{}	{}
80	12	31	4	Switch Tennis	complete	Choose	{}	{}
81	12	2	5	Golf	complete	Choose	{"3 Rounds"}	{"Dan had a VICTORY cone"}
82	13	51	1	Uno Stacko	complete	Vote	{}	{}
83	13	8	2	Unstable Unicorns	complete	Vote	{}	{"Gideon INTRUDED the Game","Isabella ABANDONED the Game"}
84	13	29	3	Super Smash Bros	complete	Vote	{Knockout}	{}
85	13	53	4	4:20 Game	complete	Vote	{session_13.png}	{}
86	13	47	5	Quoits	complete	Vote	{"3 Rounds"}	{}
87	13	49	6	Shooting	complete	Vote	{"2 Rounds"}	{}
88	14	51	1	Uno Stacko	complete	Vote	{}	{}
89	14	1	2	Shithead	complete	Vote	{}	{}
90	14	2	3	Golf	complete	Vote	{}	{}
91	14	27	4	Mario Kart	complete	Vote	{}	{}
92	14	49	5	Shooting	complete	Vote	{"3 Rounds"}	{}
93	14	28	6	Mario Party	complete	Vote	{}	{"DINNER BREAK","Dan had a VICTORY cone","Jake had a BREAK cone"}
94	14	34	7	Minigolf Adventure	complete	Vote	{"6 Holes"}	{}
95	14	22	8	Catan	complete	Vote	{}	{"Danny had a WHEEL cone"}
96	14	47	9	Quoits	complete	Vote	{"3 Rounds"}	{}
97	14	30	10	Switch Bowling	complete	Vote	{Special,Advanced}	{}
98	15	52	1	Jenga	complete	Vote	{}	{"Gideon INTRUDED the Game"}
99	15	34	2	Minigolf Adventure	complete	Vote	{}	{}
100	15	1	3	Shithead	complete	Vote	{}	{"DINNER BREAK","Everyone had a BREAK cone (joint time!)"}
101	15	13	4	Uno	complete	Vote	{}	{"Max ABANDONED the Game","Isabella ABANDONED the Game"}
102	15	29	5	Super Smash Bros	complete	Vote	{}	{}
103	16	34	1	Minigolf Adventure	complete	Vote	{"3 Races"}	{}
104	16	28	2	Mario Party	complete	Vote	{Jamboree,"10 Turns","Roll 'em Raceway"}	{}
105	16	27	3	Mario Kart	complete	Vote	{"6 Races"}	{"Gideon INTRUDED the Game"}
106	16	3	4	Skip Bo	complete	Vote	{}	{"Dan had a VICTORY cone","DINNER BREAK","Alex had a WHEEL cone"}
107	16	55	5	Five Crowns	complete	Vote	{"7 Rounds","Spinner Wheel"}	{}
108	16	52	6	Jenga	complete	Vote	{}	{}
109	17	51	1	Uno Stacko	complete	Vote	{}	{"Gideon had a BREAK cone","Max V INTRUDED the Game"}
110	17	53	2	4:20 Game	complete	Vote	{session_17.png}	{}
111	17	60	3	Putt Putt	complete	Vote	{}	{"Isabella ABANDONED the Game"}
112	17	29	4	Super Smash Bros	complete	Vote	{Knockout}	{"Aryana INTRUDED the Game"}
113	17	61	5	Codenames	complete	Vote	{}	{"Dan had a VICTORY cone","DINNER BREAK","Isabella INTRUDED the Game"}
114	17	52	6	Jenga	complete	Vote	{}	{}
115	17	34	7	Minigolf Adventure	complete	Vote	{"2 Rounds","3 Races"}	{}
116	17	59	8	Beer Pong	complete	Vote	{}	{"Max T ABANDONED the Game","Isabella ABANDONED the Game"}
117	17	55	9	Five Crowns	complete	Vote	{}	{}
118	18	62	1	Boomerang Fu	complete	Vote	{}	{"Dan had a VICTORY cone"}
119	18	58	2	Flip 7	complete	Vote	{}	{}
120	18	47	3	Quoits	complete	Vote	{"3 rounds"}	{"Isabella had a WHEEL cone"}
121	18	51	4	Uno Stacko	complete	Vote	{}	{}
122	18	14	5	Uno Flip	complete	Vote	{}	{}
123	18	3	6	Skip Bo	complete	Vote	{"12 cards"}	{"Jake had a VICTORY cone"}
124	18	34	7	Minigolf Adventure	complete	Vote	{}	{}
125	18	61	8	Codenames	complete	Choose	{}	{"Danny had a VICTORY cone","Isabella ABANDONED the Game"}
126	18	60	9	Putt Putt	complete	Vote	{}	{}
127	18	53	10	4:20 Game	complete	Choose	{session_18.png}	{}
128	19	25	1	Trouble (Pop-n-hop)	complete	Vote	{}	{}
129	19	34	2	Minigolf Adventure	complete	Vote	{}	{}
130	19	62	3	Boomerang Fu	complete	Vote	{}	{}
131	19	47	4	Quoits	complete	Vote	{"3 rounds"}	{"Isabella INTRUDED the Game"}
132	19	50	5	Alphabetix	complete	Vote	{"Topics: Animals, Countries, Food, Leisure Activities, Movie Characters, Song titles, Sportspersons and TV Shows"}	{}
133	19	53	6	4:20 Game	complete	Choose	{session_19.png}	{}
134	19	58	7	Flip 7	complete	Vote	{}	{}
135	19	13	8	Uno	complete	Vote	{}	{}
136	19	65	9	Moose Master	complete	Vote	{}	{"Isabella ABANDONED the Game"}
137	19	64	10	Rhythm Kitchen	complete	Choose	{}	{}
138	19	30	11	Switch Bowling	complete	Vote	{}	{}
139	19	61	12	Codenames	complete	Vote	{}	{}
140	19	59	13	Beer Pong	complete	Vote	{}	{}
141	19	33	14	Switch Golf	complete	Vote	{}	{"Isabella INTRUDED the Game"}
142	19	51	15	Uno Stacko	complete	Vote	{}	{}
143	19	52	16	Jenga	complete	Vote	{"Normal Game"}	{}
144	19	2	17	Golf	complete	Vote	{"5 rounds"}	{}
145	19	14	18	Uno Flip	complete	Vote	{}	{}
146	20	58	1	Flip 7	complete	Vote	{}	{"Dan had a BREAK cone","Isabella had a BREAK cone"}
147	20	47	2	Quoits	complete	Vote	{"3 rounds"}	{"Max had a VICTORY cone"}
148	20	65	3	Moose Master	complete	Vote	{}	{"Dan had a WHEEL cone"}
149	20	34	4	Minigolf Adventure	complete	Vote	{}	{}
150	20	51	5	Uno Stacko	complete	Choose	{}	{}
151	20	53	6	4:20 Game	complete	Choose	{}	{session_20.png}
152	21	58	1	Flip 7	complete	Choose	{}	{"Isabella INTRUDED the Game","Max INTRUDED the Game","Dan had a VICTORY cone"}
153	21	6	2	Muffin Time	complete	Vote	{}	{}
154	21	52	3	Jenga	complete	Vote	{"Normal Game"}	{}
155	21	4	4	Monopoly Deal	complete	Vote	{}	{}
156	21	22	5	Catan	complete	Vote	{}	{"DINNER BREAK","Dan had a BREAK cone","Jake INTRUDED the Game","Refreshed games"}
157	21	47	6	Quoits	complete	Vote	{"3 rounds"}	{}
158	21	52	7	Jenga	complete	Vote	{"Normal Game"}	{}
159	21	61	8	Codenames	complete	Vote	{}	{}
160	21	58	9	Flip 7	complete	Vote	{}	{"Alex had a WHEEL cone","Max had a WHEEL cone"}
161	21	55	10	Five Crowns	complete	Vote	{"Type: Spinner Wheel"}	{}
162	21	53	11	4:20 Game	complete	Choose	{session_21.png}	{}
163	21	6	12	Muffin Time	complete	Choose	{}	{"Dan had a VICTORY cone"}
\.


--
-- Data for Name: gog_game_players; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.gog_game_players (game_instance_id, player_id, speciality, place, reward, points, stars, coins, rounds) FROM stdin;
1	4	t	1	5 points	\N	\N	\N	\N
1	5	f	2	3 points	\N	\N	\N	\N
1	1	f	3	2 points	\N	\N	\N	\N
1	3	f	4	1 point	\N	\N	\N	\N
1	2	f	5	0 points	\N	\N	\N	\N
2	2	f	1	4 points	\N	\N	\N	\N
2	5	f	2	3 points	\N	\N	\N	\N
2	4	f	3	2 points	\N	\N	\N	\N
2	3	f	4	1 point	\N	\N	\N	\N
2	1	f	5	0 points	\N	\N	\N	\N
3	4	f	1	4 points	\N	\N	\N	\N
3	1	f	2	3 points	\N	\N	\N	\N
3	3	f	2	3 points	\N	\N	\N	\N
3	5	f	2	3 points	\N	\N	\N	\N
3	2	t	2	2 points	\N	\N	\N	\N
4	5	f	1	4 points	\N	\N	\N	\N
4	1	f	2	3 points	\N	\N	\N	\N
4	3	t	3	1 point	\N	\N	\N	\N
4	4	f	4	1 point	\N	\N	\N	\N
4	2	f	5	0 points	\N	\N	\N	\N
5	3	f	1	4 points	\N	\N	\N	\N
5	2	f	2	3 points	\N	\N	\N	\N
5	5	f	3	2 points	\N	\N	\N	\N
5	1	f	4	1 point	\N	\N	\N	\N
5	4	f	5	0 points	\N	\N	\N	\N
6	3	f	1	4 points	\N	\N	\N	\N
6	2	f	2	3 points	\N	\N	\N	\N
6	5	f	3	2 points	\N	\N	\N	\N
6	1	t	4	0 points	\N	\N	\N	\N
6	4	f	5	0 points	\N	\N	\N	\N
7	4	f	1	4 points	2:16.096	\N	\N	\N
7	1	f	2	3 points	2:32.170	\N	\N	\N
7	3	f	3	2 points	2:42.477	\N	\N	\N
7	2	f	4	1 point	2:42.606	\N	\N	\N
7	5	f	5	0 points	2:45.060	\N	\N	\N
8	4	f	1	4 points	\N	\N	\N	\N
8	2	f	2	3 points	\N	\N	\N	\N
8	1	f	3	2 points	\N	\N	\N	\N
8	5	f	4	1 point	\N	\N	\N	\N
8	3	f	5	0 points	\N	\N	\N	\N
9	2	t	1	5 points	18	\N	\N	\N
9	5	t	2	2 points	31	\N	\N	\N
9	4	t	3	1 point	36	\N	\N	\N
9	3	t	4	0 points	38	\N	\N	\N
9	1	t	5	-1 point	40	\N	\N	\N
10	4	f	1	4 points	\N	\N	\N	\N
10	1	f	2	3 points	\N	\N	\N	\N
10	2	f	2	3 points	\N	\N	\N	\N
10	5	f	4	1 point	\N	\N	\N	\N
10	3	f	5	0 points	\N	\N	\N	\N
11	3	f	1	4 points	\N	\N	\N	\N
11	1	f	2	3 points	\N	\N	\N	\N
11	4	f	2	3 points	\N	\N	\N	\N
11	2	f	2	3 points	\N	\N	\N	\N
11	5	f	2	3 points	\N	\N	\N	\N
12	3	f	1	4 points	\N	\N	\N	\N
12	1	f	2	3 points	\N	\N	\N	\N
12	2	f	2	3 points	\N	\N	\N	\N
12	4	f	2	3 points	\N	\N	\N	\N
12	5	t	2	2 points	\N	\N	\N	\N
13	5	t	1	4 points	\N	\N	\N	\N
13	1	f	2	2 points	\N	\N	\N	\N
13	2	f	3	1 point	\N	\N	\N	\N
13	3	f	4	0 points	\N	\N	\N	\N
14	5	f	1	3 points	\N	\N	\N	\N
14	3	t	2	1 point	\N	\N	\N	\N
14	1	f	3	1 point	\N	\N	\N	\N
14	2	f	4	0 points	\N	\N	\N	\N
15	1	f	1	3 points	4	\N	\N	\N
15	5	f	2	2 points	7	\N	\N	\N
15	2	t	3	0 points	8	\N	\N	\N
15	3	f	4	0 points	11	\N	\N	\N
16	2	f	1	1 point	\N	\N	\N	\N
16	3	f	1	1 point	\N	\N	\N	\N
16	5	f	1	1 point	\N	\N	\N	\N
16	1	t	4	-1 point	\N	\N	\N	\N
17	1	f	1	1 point	\N	\N	\N	\N
17	3	f	1	1 point	\N	\N	\N	\N
17	5	f	1	1 point	\N	\N	\N	\N
17	6	f	1	1 point	\N	\N	\N	\N
17	7	f	1	1 point	\N	\N	\N	\N
17	2	f	6	0 points	\N	\N	\N	\N
18	1	f	1	1 point	\N	\N	\N	\N
18	2	f	1	1 point	\N	\N	\N	\N
18	3	f	1	1 point	\N	\N	\N	\N
18	5	f	1	1 point	\N	\N	\N	\N
18	6	f	1	1 point	\N	\N	\N	\N
18	7	f	1	1 point	\N	\N	\N	\N
19	7	f	1	3 points	\N	\N	\N	\N
19	3	f	2	2 points	\N	\N	\N	\N
19	1	f	3	1 point	\N	\N	\N	\N
19	2	f	4	1 point	\N	\N	\N	\N
19	5	f	5	Nothing	\N	\N	\N	\N
19	6	f	6	1 cone	\N	\N	\N	\N
20	4	f	1	3 points	\N	\N	\N	\N
20	2	f	2	2 points	\N	\N	\N	\N
20	6	f	3	1 point	\N	\N	\N	\N
20	5	f	4	1 point	\N	\N	\N	\N
20	1	f	5	1 cone	\N	\N	\N	\N
20	3	f	6	1 cone	\N	\N	\N	\N
20	7	f	7	1 cone	\N	\N	\N	\N
21	5	f	1	3 points	\N	\N	\N	\N
21	4	f	2	2 points	\N	\N	\N	\N
21	3	f	3	1 point	\N	\N	\N	\N
21	2	f	4	1 cone	\N	\N	\N	\N
21	6	f	5	1 cone	\N	\N	\N	\N
21	1	f	6	1 cone	\N	\N	\N	\N
21	7	f	7	1 cone	\N	\N	\N	\N
22	2	f	1	2 points	\N	5	94	\N
22	4	f	1	2 points	\N	5	94	\N
22	3	f	2	1 point	\N	2	53	\N
22	1	f	3	Nothing	\N	2	7	\N
22	7	f	3	Nothing	\N	2	7	\N
22	5	f	4	1 cone	\N	1	28	\N
22	6	f	4	1 cone	\N	1	28	\N
23	1	f	1	1 point	\N	\N	\N	\N
23	3	f	1	1 point	\N	\N	\N	\N
23	5	f	2	1 cone	\N	\N	\N	\N
23	2	f	2	1 cone	\N	\N	\N	\N
24	3	f	1	1 point	10	\N	\N	\N
24	2	f	2	Nothing	9	\N	\N	\N
24	1	f	3	1 cone	7	\N	\N	\N
24	5	f	3	1 cone	7	\N	\N	\N
25	1	f	1	2 points	0	\N	\N	\N
25	3	f	2	1 point	14	\N	\N	\N
25	2	f	3	Nothing	17	\N	\N	\N
25	5	f	4	1 cone	22	\N	\N	\N
26	1	f	1	2 points	10	\N	\N	\N
26	2	f	2	1 point	9	\N	\N	\N
26	5	f	2	1 point	9	\N	\N	\N
26	4	f	4	Nothing	8	\N	\N	\N
26	3	f	4	1 cone	8	\N	\N	\N
27	1	f	1	2 points	245	\N	\N	\N
27	3	f	2	1 point	185	\N	\N	\N
27	5	f	3	1 point	181	\N	\N	\N
27	2	f	4	Nothing	179	\N	\N	\N
27	4	f	5	1 cone	177	\N	\N	\N
28	1	f	1	1 point	\N	\N	\N	\N
28	3	f	1	1 point	\N	\N	\N	\N
28	5	f	1	1 point	\N	\N	\N	\N
28	4	f	1	1 point	\N	\N	\N	\N
28	2	f	5	1 cone	\N	\N	\N	\N
29	1	f	1	2 points	\N	\N	\N	\N
29	2	f	2	1 point	\N	\N	\N	\N
29	3	f	3	1 point	\N	\N	\N	\N
29	5	f	4	1 cone	\N	\N	\N	\N
29	4	f	5	1 cone	\N	\N	\N	\N
30	2	f	1	2 points	\N	\N	\N	\N
30	5	f	2	1 point	\N	\N	\N	\N
30	4	f	3	1 point	\N	\N	\N	\N
30	3	f	4	Nothing	\N	\N	\N	\N
30	1	f	5	1 cone	\N	\N	\N	\N
31	4	f	1	2 points	\N	\N	\N	\N
31	1	f	2	1 point	\N	\N	\N	\N
31	2	f	3	1 cone	\N	\N	\N	\N
31	5	f	4	1 cone	\N	\N	\N	\N
31	3	f	5	1 cone	\N	\N	\N	\N
32	5	f	1	2 points	\N	\N	\N	\N
32	1	f	2	1 point	\N	\N	\N	\N
32	2	f	2	1 point	\N	\N	\N	\N
32	3	f	2	1 point	\N	\N	\N	\N
32	4	f	2	1 point	\N	\N	\N	\N
33	5	f	1	2 points	0	\N	\N	\N
33	3	f	2	1 point	14	\N	\N	\N
33	4	f	3	1 cone	15	\N	\N	\N
33	2	f	4	1 cone	18	\N	\N	\N
33	1	f	5	1 cone	25	\N	\N	\N
34	1	f	1	1 point	3	\N	\N	\N
34	3	f	2	Nothing	2	\N	\N	\N
34	2	f	3	1 cone	1	\N	\N	\N
35	3	f	1	1 point	5	\N	\N	\N
35	2	f	1	1 point	5	\N	\N	\N
35	1	f	3	1 cone	6	\N	\N	\N
36	2	t	1	2 points	\N	\N	\N	\N
36	3	f	2	Nothing	\N	\N	\N	\N
36	1	f	3	1 cone	\N	\N	\N	\N
37	1	f	1	1 point	\N	\N	\N	\N
37	3	f	2	Nothing	\N	\N	\N	\N
37	2	f	3	1 cone	\N	\N	\N	\N
38	1	t	1	2 points	\N	\N	\N	\N
38	3	f	2	Nothing	\N	\N	\N	\N
38	2	f	3	1 cone	\N	\N	\N	\N
39	1	f	1	1 point	13	\N	\N	\N
39	2	f	2	Nothing	34	\N	\N	\N
39	3	t	3	1 cone -1 point	80	\N	\N	\N
40	3	f	1	1 point	\N	\N	\N	\N
40	1	f	2	Nothing	\N	\N	\N	\N
40	2	f	3	1 cone	\N	\N	\N	\N
41	1	f	1	1 point	\N	\N	\N	\N
41	2	f	2	Nothing	\N	\N	\N	\N
41	3	f	3	1 cone	\N	\N	\N	\N
42	3	t	1	2 points	\N	\N	\N	\N
42	5	t	1	2 points	\N	\N	\N	\N
42	4	t	1	2 points	\N	\N	\N	\N
42	6	t	1	2 points	\N	\N	\N	\N
42	7	t	1	2 points	\N	\N	\N	\N
42	1	t	6	1 cone -1 point	\N	\N	\N	\N
43	4	f	1	3 points	2400	\N	\N	\N
43	6	f	2	2 points	1770	\N	\N	\N
43	1	f	3	1 point	1640	\N	\N	\N
43	2	f	4	1 cone	1595	\N	\N	\N
43	5	f	5	Nothing	1475	\N	\N	\N
43	3	f	6	1 cone	1320	\N	\N	\N
43	7	f	7	1 cone	1090	\N	\N	\N
44	1	f	1	2 points	205	\N	\N	\N
44	2	f	2	1 point	138	\N	\N	\N
44	7	f	2	1 point	138	\N	\N	\N
44	5	f	3	1 cone	123	\N	\N	\N
44	6	f	3	1 cone	123	\N	\N	\N
44	3	f	4	1 cone	118	\N	\N	\N
44	4	f	4	1 cone	118	\N	\N	\N
45	1	f	1	1 point	\N	\N	\N	\N
45	2	f	1	1 point	\N	\N	\N	\N
45	3	f	1	1 point	\N	\N	\N	\N
45	5	f	1	1 point	\N	\N	\N	\N
45	4	f	1	1 point	\N	\N	\N	\N
45	6	f	1	1 point	\N	\N	\N	\N
45	7	f	1	1 point	\N	\N	\N	\N
46	4	f	1	3 points	4	\N	\N	\N
46	3	f	2	2 points	8	\N	\N	\N
46	5	f	3	1 point	11	\N	\N	\N
46	7	f	4	1 point	19	\N	\N	\N
46	6	t	5	-1 point	20	\N	\N	\N
46	2	f	6	1 cone	25	\N	\N	\N
46	1	f	7	1 cone	27	\N	\N	\N
47	2	f	1	2 points	\N	\N	\N	\N
47	5	f	2	1 point	\N	\N	\N	\N
47	3	f	3	1 cone	\N	\N	\N	\N
47	4	f	4	Nothing	\N	\N	\N	\N
47	1	f	5	1 cone	\N	\N	\N	\N
48	1	f	1	2 points	\N	\N	\N	\N
48	6	f	2	1 point	\N	\N	\N	\N
48	7	f	3	1 cone	\N	\N	\N	\N
48	3	f	4	1 cone	\N	\N	\N	\N
49	1	f	1	2 points	3	\N	\N	\N
49	7	f	2	1 point	8	\N	\N	\N
49	3	f	3	1 cone	9	\N	\N	\N
49	6	f	4	1 cone	10	\N	\N	\N
50	7	f	1	2 points	4	\N	\N	\N
50	1	f	2	1 point	7	\N	\N	\N
50	6	f	3	Nothing	10	\N	\N	\N
50	3	f	4	1 cone	23	\N	\N	\N
51	6	f	1	2 points	186	\N	\N	\N
51	1	f	2	1 point	174	\N	\N	\N
51	3	f	3	Nothing	169	\N	\N	\N
51	7	f	4	1 cone	110	\N	\N	\N
52	3	f	1	1 point	\N	\N	\N	\N
52	6	f	2	Nothing	\N	\N	\N	\N
52	1	f	3	1 cone	\N	\N	\N	\N
53	3	f	1	1 point	\N	\N	\N	\N
53	1	f	2	1 cone	\N	\N	\N	\N
54	3	f	1	1 point	\N	\N	\N	\N
54	1	f	2	1 cone	\N	\N	\N	\N
55	1	t	1	2 points	\N	\N	\N	\N
55	3	f	2	1 cone	\N	\N	\N	\N
56	1	f	1	1 point	\N	\N	\N	\N
56	3	f	1	1 point	\N	\N	\N	\N
57	1	f	1	1 point	\N	5	10	\N
57	3	f	2	1 cone	\N	4	28	\N
58	1	f	1	1 point	\N	\N	\N	\N
58	3	f	2	1 cone	\N	\N	\N	\N
59	1	f	1	1 point	3	\N	\N	\N
59	3	f	2	1 cone	0	\N	\N	\N
60	3	f	1	1 point	7	\N	\N	\N
60	1	f	2	1 cone	10	\N	\N	\N
61	1	f	1	1 point	\N	\N	\N	\N
61	3	f	2	1 cone	\N	\N	\N	\N
62	3	f	1	1 point	13	\N	\N	\N
62	1	f	2	1 cone	10	\N	\N	\N
63	1	f	1	1 point	36	\N	\N	\N
63	3	f	2	1 cone	54	\N	\N	\N
64	1	f	1	1 point	-1	\N	\N	\N
64	3	f	2	1 cone	9	\N	\N	\N
65	1	f	1	1 point	10	\N	\N	\N
65	3	f	2	1 cone	8	\N	\N	\N
66	3	f	1	1 point	168	\N	\N	\N
66	1	f	2	1 cone	138	\N	\N	\N
67	1	f	1	1 point	\N	\N	\N	\N
67	3	t	2	1 cone -1 point	\N	\N	\N	\N
68	3	f	1	1 point	\N	\N	\N	\N
68	1	f	2	1 cone	\N	\N	\N	\N
69	4	t	1	4 points	\N	\N	\N	\N
69	1	t	2	1 point	\N	\N	\N	\N
69	3	f	3	1 point	\N	\N	\N	\N
69	7	f	4	1 cone	\N	\N	\N	\N
69	6	f	5	Nothing	\N	\N	\N	\N
69	5	f	6	1 cone	\N	\N	\N	\N
69	2	f	7	1 cone	\N	\N	\N	\N
70	6	f	1	3 points	6	\N	\N	\N
70	1	f	2	2 points	18	\N	\N	\N
70	5	f	2	2 points	18	\N	\N	\N
70	4	f	4	1 cone	20	\N	\N	\N
70	2	f	5	Nothing	26	\N	\N	\N
70	3	f	6	1 cone	38	\N	\N	\N
70	7	f	7	1 cone	42	\N	\N	\N
71	1	f	1	1 point	\N	\N	\N	\N
71	3	f	1	1 point	\N	\N	\N	\N
71	4	f	1	1 point	\N	\N	\N	\N
71	2	f	2	1 cone	\N	\N	\N	\N
71	5	f	2	1 cone	\N	\N	\N	\N
71	6	f	2	1 cone	\N	\N	\N	\N
71	7	f	2	1 cone	\N	\N	\N	\N
72	7	f	1	2 points	\N	\N	\N	\N
72	1	f	2	1 point	\N	\N	\N	\N
72	6	f	3	Nothing	\N	\N	\N	\N
72	3	f	4	1 cone	\N	\N	\N	\N
73	1	f	1	2 points	16	\N	\N	\N
73	3	f	2	1 point	18	\N	\N	\N
73	6	f	3	1 cone	24	\N	\N	\N
73	7	f	4	1 cone	27	\N	\N	\N
74	1	f	1	2 points	\N	\N	\N	\N
74	6	f	2	1 point	\N	\N	\N	\N
74	7	f	3	Nothing	\N	\N	\N	\N
74	3	f	2	1 cone	\N	\N	\N	\N
75	1	f	1	1 point	\N	\N	\N	\N
75	3	f	1	1 point	\N	\N	\N	\N
75	6	f	1	1 point	\N	\N	\N	\N
75	7	f	1	1 point	\N	\N	\N	\N
76	3	f	1	2 points	194	\N	\N	\N
76	7	f	2	1 point	187	\N	\N	\N
76	1	f	3	Nothing	184	\N	\N	\N
76	6	f	4	1 cone	172	\N	\N	\N
77	8	f	1	1 point	\N	\N	\N	\N
77	1	f	2	1 cone	\N	\N	\N	\N
78	1	f	1	1 point	\N	\N	\N	\N
78	8	f	2	1 cone	\N	\N	\N	\N
79	8	f	1	1 point	\N	\N	\N	\N
79	1	f	2	1 cone	\N	\N	\N	\N
80	1	f	1	1 point	\N	\N	\N	\N
80	8	f	2	1 cone	\N	\N	\N	\N
81	1	f	1	1 point	15	\N	\N	\N
81	8	f	2	1 cone	34	\N	\N	\N
82	1	t	1	2 points	\N	\N	\N	\N
82	5	t	1	2 points	\N	\N	\N	\N
82	6	t	1	2 points	\N	\N	\N	\N
82	3	f	1	1 point	\N	\N	\N	\N
82	4	f	1	1 point	\N	\N	\N	\N
82	7	t	6	1 cone -1 point	\N	\N	\N	\N
83	7	t	1	4 points	7	\N	\N	\N
83	1	f	2	2 points	6	\N	\N	\N
83	3	f	3	1 point	5	\N	\N	\N
83	6	f	3	1 point	5	\N	\N	\N
83	5	f	5	Nothing	3	\N	\N	\N
83	4	f	5	1 cone	3	\N	\N	\N
84	2	t	1	4 points	\N	\N	\N	\N
84	1	f	2	2 points	\N	\N	\N	\N
84	4	t	3	Nothing	\N	\N	\N	\N
84	5	f	4	1 point	\N	\N	\N	\N
84	6	f	5	1 cone	\N	\N	\N	\N
84	3	f	6	1 cone	\N	\N	\N	\N
85	1	f	1	1 point	\N	\N	\N	\N
85	2	f	1	1 point	\N	\N	\N	\N
85	3	f	1	1 point	\N	\N	\N	\N
85	4	f	1	1 point	\N	\N	\N	\N
85	5	f	1	1 point	\N	\N	\N	\N
85	6	f	1	1 point	\N	\N	\N	\N
86	6	t	1	1 point	2	\N	\N	\N
86	2	f	2	2 points	1	\N	\N	\N
86	4	f	2	2 points	1	\N	\N	\N
86	3	t	2	1 point	1	\N	\N	\N
86	1	f	5	Nothing	0	\N	\N	\N
86	5	f	5	Nothing	0	\N	\N	\N
87	1	f	1	3 points	5	\N	\N	\N
87	4	f	2	2 points	4	\N	\N	\N
87	2	f	2	2 points	4	\N	\N	\N
87	3	f	4	1 point	3	\N	\N	\N
87	5	t	5	-1 point	2	\N	\N	\N
87	6	f	5	1 cone	2	\N	\N	\N
88	4	t	1	2 points	\N	\N	\N	\N
88	3	f	1	1 point	\N	\N	\N	\N
88	1	f	3	1 cone	\N	\N	\N	\N
89	3	f	1	1 point	\N	\N	\N	\N
89	1	f	2	Nothing	\N	\N	\N	\N
89	4	f	3	1 cone	\N	\N	\N	\N
90	1	f	1	1 point	6	\N	\N	\N
90	4	f	2	Nothing	9	\N	\N	\N
90	3	f	3	1 cone	19	\N	\N	\N
91	1	t	1	2 points	\N	\N	\N	\N
91	4	f	2	Nothing	\N	\N	\N	\N
91	3	f	3	1 cone	\N	\N	\N	\N
92	1	f	1	1 point	7	\N	\N	\N
92	3	f	1	1 point	7	\N	\N	\N
92	4	f	3	1 cone	4	\N	\N	\N
93	1	f	1	1 point	\N	5	26	\N
93	3	f	2	Nothing	\N	4	37	\N
93	4	f	3	1 cone	\N	3	32	\N
94	4	f	1	1 point	10	\N	\N	\N
94	1	f	3	1 cone	11	\N	\N	\N
94	3	f	3	1 cone	11	\N	\N	\N
95	4	t	1	1 point	10	\N	\N	\N
95	1	f	2	Nothing	9	\N	\N	\N
95	3	f	3	1 cone	8	\N	\N	\N
96	3	t	1	1 point	2	\N	\N	\N
96	1	f	3	1 cone	0	\N	\N	\N
96	4	f	3	1 cone	0	\N	\N	\N
97	3	f	1	1 point	156	\N	\N	\N
97	1	t	2	-1 point	143	\N	\N	\N
97	4	f	3	1 cone	117	\N	\N	\N
98	3	t	1	2 points	\N	\N	\N	\N
98	4	t	1	2 points	\N	\N	\N	\N
98	6	t	1	2 points	\N	\N	\N	\N
98	7	t	1	2 points	\N	\N	\N	\N
98	5	f	1	1 point	\N	\N	\N	\N
98	1	t	6	1 cone -1 point	\N	\N	\N	\N
99	4	t	1	4 points	3	\N	\N	\N
99	6	f	2	2 points	4	\N	\N	\N
99	2	f	3	1 point	5	\N	\N	\N
99	5	f	3	1 point	5	\N	\N	\N
99	1	f	5	Nothing	6	\N	\N	\N
99	3	f	6	1 cone	7	\N	\N	\N
99	7	f	6	1 cone	7	\N	\N	\N
100	7	f	1	3 points	\N	\N	\N	\N
100	5	f	2	2 points	\N	\N	\N	\N
100	4	f	3	1 point	\N	\N	\N	\N
100	1	f	4	1 point	\N	\N	\N	\N
100	2	t	5	1 cone -1 point	\N	\N	\N	\N
100	3	f	6	1 cone	\N	\N	\N	\N
100	6	f	7	1 cone	\N	\N	\N	\N
101	6	f	1	3 points	\N	\N	\N	\N
101	2	f	2	2 points	\N	\N	\N	\N
101	4	f	3	1 point	\N	\N	\N	\N
101	7	t	4	1 cone -1 point	\N	\N	\N	\N
101	5	f	5	1 cone	\N	\N	\N	\N
101	1	f	6	1 cone	\N	\N	\N	\N
101	3	f	7	1 cone	\N	\N	\N	\N
102	2	t	1	3 points	\N	\N	\N	\N
102	4	f	2	1 point	\N	\N	\N	\N
102	3	f	3	1 point	\N	\N	\N	\N
102	1	f	4	Nothing	\N	\N	\N	\N
102	5	f	5	1 cone	\N	\N	\N	\N
103	4	t	1	3 points	3:02	\N	\N	\N
103	5	f	2	Nothing	3:29	\N	\N	\N
103	1	f	3	1 cone	3:37	\N	\N	\N
103	3	f	4	1 cone	4:00	\N	\N	\N
104	1	f	1	2 points	\N	3	100	\N
104	3	f	2	1 point	\N	1	171	\N
104	4	f	3	1 cone	\N	1	145	\N
104	5	f	4	1 cone	\N	1	70	\N
105	4	f	1	2 points	\N	\N	\N	\N
105	1	f	2	Nothing	\N	\N	\N	\N
105	5	f	3	Nothing	\N	\N	\N	\N
105	3	f	4	1 cone	\N	\N	\N	\N
106	1	f	1	2 points	\N	\N	\N	\N
106	5	f	2	1 point	\N	\N	\N	\N
106	2	f	3	1 cone	\N	\N	\N	\N
106	3	f	4	Nothing	\N	\N	\N	\N
106	4	f	5	1 cone	\N	\N	\N	\N
107	1	f	1	2 points	\N	\N	\N	\N
107	4	f	2	1 point	\N	\N	\N	\N
107	5	f	3	1 cone	\N	\N	\N	\N
107	3	f	4	1 cone	\N	\N	\N	\N
107	2	f	5	1 cone	\N	\N	\N	\N
108	2	t	1	2 points	\N	\N	\N	\N
108	1	f	1	1 point	\N	\N	\N	\N
108	3	f	1	1 point	\N	\N	\N	\N
108	4	f	1	1 point	\N	\N	\N	\N
108	5	f	5	1 cone	\N	\N	\N	\N
109	5	t	1	2 points	\N	\N	\N	\N
109	6	t	1	2 points	\N	\N	\N	\N
109	7	t	1	2 points	\N	\N	\N	\N
109	4	f	1	1 point	\N	\N	\N	\N
109	3	f	1	1 point	\N	\N	\N	\N
109	2	f	1	1 point	\N	\N	\N	\N
109	1	f	7	1 cone	\N	\N	\N	\N
110	5	f	1	1 point	\N	\N	\N	\N
110	6	f	1	1 point	\N	\N	\N	\N
110	7	f	1	1 point	\N	\N	\N	\N
110	4	f	1	1 point	\N	\N	\N	\N
110	3	f	1	1 point	\N	\N	\N	\N
110	2	f	1	1 point	\N	\N	\N	\N
110	1	f	1	1 point	\N	\N	\N	\N
110	10	f	1	1 point	\N	\N	\N	\N
111	5	f	1	3 points	2	\N	\N	\N
111	6	t	2	1 point	6	\N	\N	\N
111	1	f	3	1 point	8	\N	\N	\N
111	2	f	4	1 cone	11	\N	\N	\N
111	4	f	5	Nothing	14	\N	\N	\N
111	7	f	6	1 cone	15	\N	\N	\N
111	3	f	6	1 cone	15	\N	\N	\N
111	10	f	8	1 cone	16	\N	\N	\N
112	10	t	1	4 points	\N	\N	\N	\N
112	4	f	2	2 points	\N	\N	\N	\N
112	2	f	3	1 point	\N	\N	\N	\N
112	1	f	4	1 cone	\N	\N	\N	\N
112	6	f	5	1 cone	\N	\N	\N	\N
112	5	f	6	1 cone	\N	\N	\N	\N
112	3	f	7	1 cone	\N	\N	\N	\N
113	1	f	1	1 point	2	\N	\N	\N
113	3	f	1	1 point	2	\N	\N	\N
113	5	f	1	1 point	2	\N	\N	\N
113	6	f	1	1 point	2	\N	\N	\N
113	9	f	8	Nothing	1	\N	\N	\N
113	10	f	8	1 cone	1	\N	\N	\N
113	4	f	8	1 cone	1	\N	\N	\N
113	2	t	8	1 cone -1 point	1	\N	\N	\N
114	5	t	1	2 points	\N	\N	\N	\N
114	7	t	1	2 point	\N	\N	\N	\N
114	9	t	1	2 points	\N	\N	\N	\N
114	3	f	1	1 point	\N	\N	\N	\N
114	2	f	1	1 point	\N	\N	\N	\N
114	4	f	1	1 point	\N	\N	\N	\N
114	6	f	1	1 point	\N	\N	\N	\N
114	10	f	1	1 point	\N	\N	\N	\N
114	1	t	9	1 cone -1 point	\N	\N	\N	\N
115	4	t	1	4 points	2	\N	\N	\N
115	1	f	2	2 points	3	\N	\N	\N
115	2	f	2	2 points	3	\N	\N	\N
115	5	f	4	1 point	4	\N	\N	\N
115	3	f	4	1 point	4	\N	\N	\N
115	6	f	4	1 point	4	\N	\N	\N
115	9	f	7	Nothing	5	\N	\N	\N
115	10	f	7	1 cone	5	\N	\N	\N
115	7	f	9	1 cone	6	\N	\N	\N
116	4	f	1	1 point	\N	\N	\N	\N
116	2	f	1	1 point	\N	\N	\N	\N
116	3	f	1	1 point	\N	\N	\N	\N
116	10	f	1	1 point	\N	\N	\N	\N
116	9	f	9	Nothing	\N	\N	\N	\N
116	1	f	9	1 cone	\N	\N	\N	\N
116	7	f	9	1 cone	\N	\N	\N	\N
116	6	f	9	1 cone	\N	\N	\N	\N
116	5	f	9	1 cone	\N	\N	\N	\N
117	5	f	1	3 points	14	\N	\N	\N
117	2	t	2	1 point	19	\N	\N	\N
117	1	f	3	1 point	36	\N	\N	\N
117	4	f	4	1 point	46	\N	\N	\N
117	3	f	5	Nothing	61	\N	\N	\N
117	9	f	6	Nothing	68	\N	\N	\N
117	10	f	7	1 cone	100	\N	\N	\N
118	1	t	1	3 points	15	\N	\N	\N
118	4	f	2	1 point	7	\N	\N	\N
118	3	f	2	1 point	7	\N	\N	\N
118	6	f	2	1 point	7	\N	\N	\N
118	7	f	5	1 cone	2	\N	\N	\N
119	6	f	1	2 points	206	\N	\N	\N
119	3	f	2	1 point	139	\N	\N	\N
119	4	f	3	1 cone	126	\N	\N	\N
119	7	t	4	1 cone & -1 point	119	\N	\N	\N
119	1	f	5	1 cone	97	\N	\N	\N
120	6	t	1	3 points	4	\N	\N	\N
120	4	f	2	1 point	3	\N	\N	\N
120	7	f	2	1 point	3	\N	\N	\N
120	1	f	4	Nothing	1	\N	\N	\N
120	3	t	4	1 cone & -1 point	1	\N	\N	\N
121	4	f	1	1 point	\N	\N	\N	\N
121	7	t	1	2 points	\N	\N	\N	\N
121	3	t	1	2 points	\N	\N	\N	\N
121	6	f	1	1 point	\N	\N	\N	\N
121	1	f	5	1 cone	\N	\N	\N	\N
122	3	f	1	2 points	\N	\N	\N	\N
122	6	f	2	1 point	\N	\N	\N	\N
122	4	f	3	1 point	\N	\N	\N	\N
122	1	f	4	1 cone	\N	\N	\N	\N
122	7	f	5	1 cone	\N	\N	\N	\N
123	3	f	1	2 points	\N	\N	\N	\N
123	1	f	2	1 point	\N	\N	\N	\N
123	6	f	3	1 cone	\N	\N	\N	\N
123	4	f	4	Nothing	\N	\N	\N	\N
123	7	f	5	1 cone	\N	\N	\N	\N
124	4	t	1	3 points	113	\N	\N	\N
124	1	f	2	1 point	133	\N	\N	\N
124	3	f	3	1 cone	139	\N	\N	\N
124	7	f	4	Nothing	152	\N	\N	\N
124	6	f	5	1 cone	154	\N	\N	\N
125	4	f	1	1 point	2	\N	\N	\N
125	7	f	1	1 point	2	\N	\N	\N
125	6	f	1	1 point	2	\N	\N	\N
125	1	f	5	1 cone	1	\N	\N	\N
125	3	f	5	1 cone	1	\N	\N	\N
126	1	f	1	2 points	3	\N	\N	\N
126	4	f	2	1 point	8	\N	\N	\N
126	3	f	2	1 point	8	\N	\N	\N
126	6	f	2	1 point	8	\N	\N	\N
127	1	f	1	1 point	\N	\N	\N	\N
127	4	f	1	1 point	\N	\N	\N	\N
127	3	f	1	1 point	\N	\N	\N	\N
127	6	f	1	1 point	\N	\N	\N	\N
128	3	f	1	2 points	\N	\N	\N	\N
128	1	f	2	1 point	\N	\N	\N	\N
128	6	f	3	1 cone	\N	\N	\N	\N
128	4	f	4	1 cone	\N	\N	\N	\N
129	4	t	1	3 points	1	\N	\N	\N
129	1	f	2	1 point	2	\N	\N	\N
129	6	f	3	1 cone	3	\N	\N	\N
129	3	f	4	1 cone	4	\N	\N	\N
130	4	f	1	2 points	15	\N	\N	\N
130	1	t	2	Nothing	13	\N	\N	\N
130	3	f	3	1 cone	6	\N	\N	\N
130	6	f	4	1 cone	1	\N	\N	\N
131	6	t	1	3 points	6	\N	\N	\N
131	4	f	2	1 point	5	\N	\N	\N
131	3	t	2	Nothing	5	\N	\N	\N
131	1	f	4	1 cone	1	\N	\N	\N
132	7	f	1	2 points	74	\N	\N	\N
132	1	f	2	1 point	71	\N	\N	\N
132	6	f	3	1 point	70	\N	\N	\N
132	3	f	4	1 cone	57	\N	\N	\N
132	4	f	5	1 cone	49	\N	\N	\N
133	1	f	1	1 point	\N	\N	\N	\N
133	4	f	1	1 point	\N	\N	\N	\N
133	7	f	1	1 point	\N	\N	\N	\N
133	3	f	1	1 point	\N	\N	\N	\N
133	6	f	1	1 point	\N	\N	\N	\N
134	3	f	1	2 points	202	\N	\N	\N
134	1	f	2	1 point	108	\N	\N	\N
134	6	t	3	Nothing	106	\N	\N	\N
134	7	t	4	1 cone & -1 point	35	\N	\N	\N
134	4	f	5	1 cone	0	\N	\N	\N
135	7	f	1	2 points	\N	\N	\N	\N
135	6	f	2	1 point	\N	\N	\N	\N
135	3	f	3	1 point	\N	\N	\N	\N
135	1	f	4	Nothing	\N	\N	\N	\N
135	4	f	5	1 cone	\N	\N	\N	\N
136	1	f	1	2 points	\N	\N	\N	\N
136	4	f	1	2 points	\N	\N	\N	\N
136	7	f	3	1 point	\N	\N	\N	\N
136	3	f	4	1 cone	\N	\N	\N	\N
136	6	f	5	1 cone	\N	\N	\N	\N
137	4	t	1	3 points	95	\N	\N	\N
137	1	f	2	1 point	92	\N	\N	\N
137	6	f	3	1 cone	90	\N	\N	\N
137	3	f	4	1 cone	84	\N	\N	\N
138	1	t	1	3 points	435	\N	\N	\N
138	3	f	2	1 point	364	\N	\N	\N
138	6	f	3	1 cone	311	\N	\N	\N
138	4	f	4	1 cone	265	\N	\N	\N
139	1	f	1	1 point	2	\N	\N	\N
139	4	f	1	1 point	2	\N	\N	\N
139	3	f	4	1 cone	0	\N	\N	\N
139	6	f	4	1 cone	0	\N	\N	\N
140	4	f	1	1 point	10	\N	\N	\N
140	6	f	1	1 point	10	\N	\N	\N
140	1	f	4	1 cone	6	\N	\N	\N
140	3	t	4	1 cone & -1 point	6	\N	\N	\N
141	4	f	1	2 points	3	\N	\N	\N
141	3	f	2	1 point	5	\N	\N	\N
141	1	f	3	1 cone	6	\N	\N	\N
141	6	f	4	1 cone	9	\N	\N	\N
142	1	f	1	1 point	\N	\N	\N	\N
142	4	f	1	1 point	\N	\N	\N	\N
142	7	t	1	2 points	\N	\N	\N	\N
142	3	f	1	1 point	\N	\N	\N	\N
142	6	f	5	1 cone	\N	\N	\N	\N
143	1	f	1	1 point	\N	\N	\N	\N
143	4	f	1	1 point	\N	\N	\N	\N
143	7	f	1	1 point	\N	\N	\N	\N
143	6	f	1	1 point	\N	\N	\N	\N
143	3	f	5	1 cone	\N	\N	\N	\N
144	6	f	1	2 points	0	\N	\N	\N
144	1	f	2	1 point	1	\N	\N	\N
144	4	f	3	1 cone	14	\N	\N	\N
144	7	f	4	Nothing	20	\N	\N	\N
144	3	f	5	1 cone	22	\N	\N	\N
145	7	f	1	2 points	\N	\N	\N	\N
145	6	f	2	1 point	\N	\N	\N	\N
145	4	f	3	1 cone	\N	\N	\N	\N
145	3	f	4	Nothing	\N	\N	\N	\N
145	1	f	5	1 cone	\N	\N	\N	\N
146	6	t	1	4 points	207	\N	\N	\N
146	1	f	2	2 points	181	\N	\N	\N
146	3	f	3	1 point	179	\N	\N	\N
146	7	f	4	1 point	170	\N	\N	\N
146	4	f	5	1 cone	160	\N	\N	\N
146	5	f	6	1 cone	150	\N	\N	\N
146	2	f	7	1 cone	43	\N	\N	\N
147	6	f	1	3 points	3	\N	\N	\N
147	7	f	2	2 points	2	\N	\N	\N
147	3	t	2	1 point	2	\N	\N	\N
147	1	f	4	1 cone	1	\N	\N	\N
147	4	f	4	1 cone	1	\N	\N	\N
147	2	f	4	1 point	1	\N	\N	\N
147	5	f	7	1 cone	0	\N	\N	\N
148	3	f	1	3 points	\N	\N	\N	\N
148	7	f	1	3 points	\N	\N	\N	\N
148	4	f	3	1 point	\N	\N	\N	\N
148	1	f	4	1 cone	\N	\N	\N	\N
148	2	f	5	1 cone	\N	\N	\N	\N
148	6	f	6	1 cone	\N	\N	\N	\N
148	5	f	7	1 cone	\N	\N	\N	\N
149	4	t	1	4 points	97	\N	\N	\N
149	5	f	2	2 points	115	\N	\N	\N
149	3	f	3	1 point	120	\N	\N	\N
149	2	f	4	1 cone	151	\N	\N	\N
149	6	f	5	Nothing	153	\N	\N	\N
149	1	f	6	1 cone	160	\N	\N	\N
149	7	f	7	1 cone	169	\N	\N	\N
150	2	t	1	2 points	\N	\N	\N	\N
150	5	t	1	2 points	\N	\N	\N	\N
150	7	t	1	2 points	\N	\N	\N	\N
150	1	f	1	1 point	\N	\N	\N	\N
150	6	f	1	1 point	\N	\N	\N	\N
150	4	f	1	1 point	\N	\N	\N	\N
150	3	f	7	1 cone	\N	\N	\N	\N
151	1	f	1	1 point	\N	\N	\N	\N
151	2	f	1	1 point	\N	\N	\N	\N
151	3	f	1	1 point	\N	\N	\N	\N
151	4	f	1	1 point	\N	\N	\N	\N
151	6	f	1	1 point	\N	\N	\N	\N
151	7	f	1	1 point	\N	\N	\N	\N
151	5	f	7	Nothing	\N	\N	\N	\N
152	1	f	1	1 point	255	\N	\N	\N
152	5	f	2	Nothing	213	\N	\N	\N
152	2	f	3	1 cone	133	\N	\N	\N
153	2	f	1	1 point	\N	\N	\N	\N
153	5	t	5	1 cone & -1 point	\N	\N	\N	\N
153	1	f	5	1 cone	\N	\N	\N	\N
153	7	t	5	1 cone & -1 point	\N	\N	\N	\N
153	6	f	5	1 cone	\N	\N	\N	\N
154	5	t	1	2 points	\N	\N	\N	\N
154	2	t	1	2 points	\N	\N	\N	\N
154	7	t	1	2 points	\N	\N	\N	\N
154	6	t	1	2 points	\N	\N	\N	\N
154	1	f	5	1 cone	\N	\N	\N	\N
155	1	f	1	1 point	\N	\N	\N	\N
155	5	f	5	1 cone	\N	\N	\N	\N
155	2	t	5	1 cone & -1 point	\N	\N	\N	\N
155	7	f	5	1 cone	\N	\N	\N	\N
155	6	f	5	1 cone	\N	\N	\N	\N
156	2	f	1	2 points	10	\N	\N	\N
156	1	f	2	1 point	8	\N	\N	\N
156	7	f	3	1 cone	6	\N	\N	\N
156	5	f	4	1 cone	5	\N	\N	\N
156	6	f	4	Nothing	5	\N	\N	\N
157	3	t	1	4 points	5	\N	\N	\N
157	1	f	2	2 points	4	\N	\N	\N
157	6	t	3	Nothing	2	\N	\N	\N
157	5	f	4	1 cone	0	\N	\N	\N
157	2	f	4	1 cone	0	\N	\N	\N
157	7	f	4	1 cone	0	\N	\N	\N
158	5	t	1	2 points	\N	\N	\N	\N
158	2	t	1	2 points	\N	\N	\N	\N
158	7	t	1	2 points	\N	\N	\N	\N
158	3	f	1	1 point	\N	\N	\N	\N
158	6	t	1	2 points	\N	\N	\N	\N
158	1	f	6	1 cone	\N	\N	\N	\N
159	7	f	1	1 point	3	\N	\N	\N
159	3	f	1	1 point	3	\N	\N	\N
159	6	f	1	1 point	3	\N	\N	\N
159	5	f	6	1 cone	2	\N	\N	\N
159	1	t	6	1 cone & -1 point	2	\N	\N	\N
159	2	f	6	1 cone	2	\N	\N	\N
160	7	f	1	3 points	216	\N	\N	\N
160	1	f	2	2 points	133	\N	\N	\N
160	2	f	3	1 point	129	\N	\N	\N
160	3	t	4	Nothing	126	\N	\N	\N
160	6	f	5	Nothing	111	\N	\N	\N
160	5	f	6	1 cone	103	\N	\N	\N
161	1	f	1	3 points	44	\N	\N	\N
161	5	f	2	2 points	53	\N	\N	\N
161	2	f	3	1 point	58	\N	\N	\N
161	7	f	4	1 cone	63	\N	\N	\N
161	3	f	5	Nothing	75	\N	\N	\N
161	6	f	6	1 cone	86	\N	\N	\N
162	1	f	1	1 point	\N	\N	\N	\N
162	2	f	1	1 point	\N	\N	\N	\N
162	7	f	1	1 point	\N	\N	\N	\N
162	3	f	1	1 point	\N	\N	\N	\N
162	5	f	6	Nothing	\N	\N	\N	\N
162	6	f	6	Nothing	\N	\N	\N	\N
163	6	f	1	1 point	\N	\N	\N	\N
163	5	t	6	1 cone & -1 point	\N	\N	\N	\N
163	1	f	6	1 cone	\N	\N	\N	\N
163	2	f	6	1 cone	\N	\N	\N	\N
163	7	t	6	1 cone & -1 point	\N	\N	\N	\N
163	3	f	6	1 cone	\N	\N	\N	\N
\.


--
-- Data for Name: gog_game_votes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.gog_game_votes (vote_id, game_instance_id, player_id, game_name) FROM stdin;
1	82	1	
2	82	3	
3	82	4	
4	82	5	
5	82	6	
6	82	7	
7	83	1	
8	83	3	
9	83	4	
10	83	5	
11	83	6	
12	83	7	
13	84	1	
14	84	2	
15	84	3	
16	84	4	
17	84	5	
18	84	6	
19	85	1	
20	85	2	
21	85	3	
22	85	4	
23	85	5	
24	85	6	
25	86	1	
26	86	2	
27	86	3	
28	86	4	
29	86	5	
30	86	6	
31	87	1	
32	87	2	
33	87	3	
34	87	4	
35	87	5	
36	87	6	
37	88	1	
38	88	3	
39	88	4	
40	89	1	
41	89	3	
42	89	4	
43	90	1	
44	90	3	
45	90	4	
46	91	1	
47	91	3	
48	91	4	
49	92	1	
50	92	3	
51	92	4	
52	93	1	
53	93	3	
54	93	4	
55	94	1	
56	94	3	
57	94	4	
58	95	1	
59	95	3	
60	95	4	
61	96	1	
62	96	3	
63	96	4	
64	97	1	
65	97	3	
66	97	4	
67	98	1	
68	98	3	
69	98	4	
70	98	5	
71	98	6	
72	98	7	
73	99	1	
74	99	2	
75	99	3	
76	99	4	
77	99	5	
78	99	6	
79	99	7	
80	100	1	
81	100	2	
82	100	3	
83	100	4	
84	100	5	
85	100	6	
86	100	7	
87	101	1	
88	101	2	
89	101	3	
90	101	4	
91	101	5	
92	101	6	
93	101	7	
94	102	1	
95	102	2	
96	102	3	
97	102	4	
98	102	5	
99	103	1	
100	103	3	
101	103	4	
102	103	5	
103	104	1	
104	104	3	
105	104	4	
106	104	5	
107	105	1	
108	105	3	
109	105	4	
110	105	5	
111	106	1	
112	106	2	
113	106	3	
114	106	4	
115	106	5	
116	107	1	
117	107	2	
118	107	3	
119	107	4	
120	107	5	
121	108	1	
122	108	2	
123	108	3	
124	108	4	
125	108	5	
126	109	1	
127	109	2	
128	109	3	
129	109	4	
130	109	5	
131	109	6	
132	109	7	
133	110	1	
134	110	2	
135	110	3	
136	110	4	
137	110	5	
138	110	6	
139	110	7	
140	110	10	
141	111	1	
142	111	2	
143	111	3	
144	111	4	
145	111	5	
146	111	6	
147	111	7	
148	111	10	
149	112	1	
150	112	2	
151	112	3	
152	112	4	
153	112	5	
154	112	6	
155	112	10	
156	113	1	
157	113	2	
158	113	3	
159	113	4	
160	113	5	
161	113	6	
162	113	9	
163	113	10	
164	114	1	
165	114	2	
166	114	3	
167	114	4	
168	114	5	
169	114	6	
170	114	7	
171	114	9	
172	114	10	
173	115	1	
174	115	2	
175	115	3	
176	115	4	
177	115	5	
178	115	6	
179	115	7	
180	115	9	
181	115	10	
182	116	1	
183	116	2	
184	116	3	
185	116	4	
186	116	5	
187	116	6	
188	116	7	
189	116	9	
190	116	10	
191	117	1	
192	117	2	
193	117	3	
194	117	4	
195	117	5	
196	117	9	
197	117	10	
198	118	4	Minigolf Adventure
199	118	1	Boomerang Fu
200	118	7	Flip 7
201	118	3	Quoits
202	118	6	Codenames
203	119	1	Flip 7
204	119	3	Flip 7
205	119	7	Flip 7
206	119	6	Minigolf Bowling
207	119	4	Minigolf Bowling
208	120	1	Uno
209	120	4	Minigolf Adventure
210	120	7	Uno Stacko
211	120	6	Minigolf Bowling
212	120	3	Quoits
213	121	1	Uno
214	121	4	Minigolf Adventure
215	121	7	Uno Stacko
216	121	6	Putt Putt
217	121	3	Uno Stacko
218	122	4	Minigolf Adventure
219	122	1	Uno
220	122	7	Uno Flip
221	122	3	Uno
222	122	6	Putt Putt
223	123	1	Five Crowns
224	123	3	Skip Bo
225	123	4	Uno
226	123	6	Putt Putt
227	123	7	Uno
228	124	1	4:20 Game
229	124	7	4:20 Game
230	124	6	Putt Putt
231	124	4	Minigolf Adventure
232	124	3	Monopoly Deal
233	126	1	4:20 Game
234	126	4	Mario Kart
235	126	3	Monopoly Deal
236	126	6	Putt Putt
237	128	1	Trouble (Pop-n-hop)
238	128	3	Trouble (Pop-n-hop)
239	128	4	Rhythm Kitchen
240	128	6	Codenames
241	129	1	Boomerang Fu
242	129	4	Minigolf Adventure
243	129	3	Uno
244	129	6	Uno Flip
245	130	1	Boomerang Fu
246	130	6	Uno Flip
247	130	3	Uno
248	130	4	Rhythm Kitchen
249	131	1	Alphabetix
250	131	4	Rhythm Kitchen
251	131	3	Quoits
252	131	6	Uno Flip
253	132	1	Alphabetix
254	132	4	Rhythm Kitchen
255	132	7	Uno Stacko
256	132	3	Uno
257	132	6	Uno Flip
258	133	4	Rhythm Kitchen
259	133	3	Beer Pong
260	134	7	Flip 7
261	134	1	Flip 7
262	134	4	Rhythm Kitchen
263	134	3	Beer Pong
264	134	6	Uno
265	135	4	Rhythm Kitchen
266	135	3	Uno
267	135	1	Uno
268	135	6	Uno Flip
269	135	7	Moose Master
270	136	1	Codenames
271	136	4	Rhythm Kitchen
272	136	7	Moose Master
273	136	3	Monopoly Deal
274	136	6	Uno Flip
275	137	4	Rhythm Kitchen
276	138	3	Beer Pong
277	138	1	Switch Bowling
278	138	6	Codenames
279	138	4	Switch Bowling
280	139	1	Switch Golf
281	139	4	Beer Pong
282	139	3	Beer Pong
283	139	6	Codenames
284	140	1	Switch Golf
285	140	4	Beer Pong
286	140	3	Beer Pong
287	140	6	Uno Stacko
288	141	1	Switch Golf
289	141	4	Golf
290	141	3	Golf
291	141	6	Uno Stacko
292	142	1	Skip Bo
293	142	3	Uno Stacko
294	142	7	Uno Stacko
295	142	4	Uno Stacko
296	142	6	Uno Stacko
297	143	1	Skip Bo
298	143	4	Jenga
299	143	7	Jenga
300	143	3	Monopoly Deal
301	143	6	Jenga
302	144	1	Skip Bo
303	144	3	Golf
304	144	6	Uno Flip
305	144	4	Golf
306	144	7	Muffin Time
307	145	4	Shithead
308	145	1	Shithead
309	145	7	Uno Flip
310	145	6	Uno Flip
311	145	3	Uno Flip
312	146	1	Flip 7
313	146	4	Minigolf Adventure
314	146	3	Flip 7
315	146	5	Flip 7
316	146	7	Uno Stacko
317	146	2	Muffin Time
318	146	6	Quoits
319	147	3	Quoits
320	147	1	Codenames Pictures
321	147	6	Moose Master
322	147	7	Moose Master
323	147	4	Uno Stacko
324	147	5	Muffin Time
325	147	2	Uno Stacko
326	148	5	Muffin Time
327	148	3	Uno
328	148	1	Uno Flip
329	148	7	Moose Master
330	148	6	Uno Stacko
331	148	4	Minigolf Adventure
332	148	2	Uno Stacko
333	149	1	Codenames Pictures
334	149	5	Codenames
335	149	2	Uno Stacko
336	149	7	Uno Stacko
337	149	3	Uno
338	149	6	Codenames
339	149	4	Minigolf Adventure
340	153	1	Uno Flip
341	153	5	Muffin Time
342	153	7	Muffin Time
343	153	2	Jenga
344	153	6	Golf
345	154	1	Coup
346	154	5	Jenga
347	154	7	Jenga
348	154	6	Uno
349	154	2	Jenga
350	155	5	Coup
351	155	2	Monopoly Deal
352	155	6	Uno Flip
353	155	7	Uno
354	155	1	Five Crowns
355	156	1	Five Crowns
356	156	5	Catan
357	156	7	Skip Bo
358	156	6	Uno Flip
359	156	2	Catan
360	157	3	Flip 7
361	157	7	Flip 7
362	157	5	Muffin Time
363	157	6	Quoits
364	157	2	Jenga
365	157	1	Codenames
366	158	7	Flip 7
367	158	1	Codenames
368	158	6	Flip 7
369	158	3	Golf
370	158	5	Muffin Time
371	158	2	Jenga
372	159	1	Codenames
373	159	7	Flip 7
374	159	6	Flip 7
375	159	3	Golf
376	159	2	Flip 7
377	159	5	Muffin Time
378	160	1	Switch Bowling
379	160	3	Flip 7
380	160	7	Flip 7
381	160	5	Muffin Time
382	160	6	Flip 7
383	160	2	Flip 7
384	161	5	Muffin Time
385	161	1	Switch Bowling
386	161	2	Five Crowns
387	161	7	Muffin Time
388	161	3	Uno
389	161	6	Muffin Time
\.


--
-- Data for Name: gog_games_neighed; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.gog_games_neighed (game_neighed_id, session_id, game_id, player_id, type) FROM stdin;
1	3	10	7	Neigh
2	3	50	3	Neigh
3	3	50	1	Neigh
4	4	50	5	Neigh
5	5	27	5	Neigh
6	6	33	2	Neigh
7	7	22	7	Neigh
8	8	35	7	Neigh
9	8	28	1	Neigh
10	8	33	3	Neigh
11	8	32	7	Super Neigh
12	8	29	6	Neigh
13	8	35	6	Super Neigh
14	8	29	3	Super Neigh
15	8	35	1	Super Neigh
16	9	29	3	Neigh
17	9	39	3	Neigh
18	9	20	1	Neigh
19	9	20	3	Super Neigh
20	9	4	1	Neigh
21	9	10	1	Super Neigh
22	9	4	1	Super Neigh
23	9	38	3	Super Neigh
\.


--
-- Data for Name: gog_players; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.gog_players (session_id, player_id, is_playing, speciality, pg_cone, f20g_cone, l_cone, c_cone, w_cone, v_cone, g_point, c_point, special_w_point, special_l_point, neigh, super_neigh, gooc_total, gooc_used) FROM stdin;
1	1	t	{Golf,"Skip Bo"}	0	0	0	0	0	0	24	0	0	-2	2	2	0	0
1	2	t	{Golf,"Monopoly Deal"}	0	0	0	0	0	0	30	0	1	-1	2	2	0	0
1	3	t	{Golf,Shithead}	0	0	0	0	0	0	26	0	0	-2	2	2	0	0
1	4	t	{Golf,"Avocado Smash"}	0	0	0	0	0	0	31	0	1	-1	2	2	0	0
1	5	t	{Golf,"Here to Slay"}	0	0	0	0	0	0	28	0	0	-2	2	2	0	0
2	1	t	{Jenga}	0	0	0	0	0	0	6	0	0	-1	2	2	0	0
2	2	t	{"Minigolf Adventure"}	0	0	0	0	0	0	3	0	0	-1	2	2	0	0
2	3	t	{Shithead}	0	0	0	0	0	0	3	0	0	-1	2	2	0	0
2	5	t	{"Skip Bo"}	0	0	0	0	0	0	9	0	1	0	2	2	0	0
3	1	t	{}	1	1	1	1	0	0	3	0	0	0	1	2	0	0
3	2	t	{}	1	1	1	1	0	1	5	1	0	0	2	2	0	0
3	3	t	{}	2	1	1	0	0	0	6	0	0	0	1	2	0	0
3	4	t	{}	1	0	0	0	0	1	7	0	0	0	2	2	0	0
3	5	t	{}	1	1	1	0	0	1	5	1	0	0	2	2	0	0
3	6	t	{}	1	1	2	1	0	0	3	0	0	0	2	2	0	0
3	7	t	{}	1	1	2	0	0	0	5	0	0	0	1	2	0	0
4	1	t	{}	2	0	0	1	0	1	3	0	0	0	2	2	0	0
4	2	t	{}	2	0	1	0	0	0	0	0	0	0	2	2	0	0
4	3	t	{}	2	0	0	0	0	1	2	1	0	0	2	2	0	0
4	5	t	{}	2	0	2	1	0	0	0	0	0	0	1	2	0	0
5	1	t	{}	1	0	2	0	0	1	9	0	0	0	2	2	0	0
5	2	t	{}	2	0	1	2	0	0	5	0	0	0	2	2	0	0
5	3	t	{}	2	0	1	1	0	0	4	1	0	0	2	2	0	0
5	4	t	{}	1	0	2	1	0	0	4	1	0	0	2	2	0	0
5	5	t	{}	2	0	0	2	1	1	7	1	0	0	1	2	0	0
6	1	t	{"Switch Golf","Mario Kart"}	1	0	2	0	0	1	5	0	1	0	1	2	0	0
6	2	t	{Shithead,"Super Smash Bros"}	1	0	4	0	0	0	2	0	1	0	1	2	0	0
6	3	t	{Catan,Golf}	2	0	2	0	0	0	2	0	0	-1	2	2	0	0
7	1	t	{Jenga,Alphabetix}	3	1	3	0	0	1	4	0	0	-1	2	2	0	0
7	2	t	{Catan,"Super Smash Bros"}	3	1	1	1	0	0	4	0	0	0	2	2	0	0
7	3	t	{Jenga,"Skip Bo"}	2	1	2	1	0	0	4	0	1	0	2	2	0	0
7	4	t	{Jenga,"Mario Kart"}	3	1	1	0	0	1	8	0	1	0	2	2	0	0
7	5	t	{Jenga,"Skip Bo"}	3	1	0	1	0	0	4	0	1	0	2	2	0	0
7	6	f	{Jenga,Golf}	3	1	0	1	0	0	4	0	1	-1	2	2	0	0
7	7	f	{Jenga,"Muffin Time"}	4	1	1	0	0	0	3	1	1	0	1	2	0	0
8	1	t	{}	1	0	1	0	0	1	6	0	0	0	1	1	0	0
8	3	t	{}	1	0	2	1	0	0	0	1	0	0	1	1	0	0
8	6	t	{}	1	0	1	0	0	0	3	1	0	0	1	1	1	0
8	7	f	{}	1	0	1	1	0	0	3	0	0	0	1	1	0	0
9	1	t	{FIFA,"Mario Kart"}	3	1	6	0	0	4	10	0	1	0	0	0	0	0
9	3	t	{Catan,Jenga}	3	1	9	0	0	1	7	0	0	-1	0	0	0	0
10	1	t	{"Table Tennis","Switch Bowling"}	3	0	0	0	0	1	5	0	0	-1	2	2	0	0
10	2	t	{"Capture the Flag",Jenga}	2	0	2	0	0	0	0	0	0	0	2	2	0	0
10	3	t	{Quoits,"Uno Stacko"}	2	0	1	0	0	0	2	0	0	0	2	2	1	0
10	4	t	{"Table Tennis","Super Smash Bros"}	2	0	0	1	0	0	4	0	1	0	2	2	0	0
10	5	t	{Shooting,Jenga}	3	0	2	0	0	0	2	0	0	0	2	2	0	0
10	6	t	{Handball,"Uno Stacko"}	2	0	1	0	0	1	3	0	0	0	2	2	0	0
10	7	t	{"Backyard Cricket","Uno Stacko"}	2	0	2	1	0	0	0	0	0	0	2	2	1	1
11	1	t	{}	3	1	0	0	0	1	6	0	0	0	2	2	0	0
11	3	t	{}	1	1	2	0	0	0	4	0	0	0	2	2	0	0
11	6	t	{}	2	1	2	1	0	0	2	0	0	0	2	2	0	0
11	7	t	{}	2	1	1	0	0	1	4	0	0	0	2	2	0	0
12	1	t	{}	1	0	2	0	0	2	3	0	0	0	2	2	0	0
12	8	t	{}	1	0	3	0	0	1	2	0	0	0	2	2	0	0
13	1	t	{"Switch Golf","Uno Stacko"}	1	1	0	0	0	0	9	0	1	0	2	2	0	0
13	2	t	{"Super Smash Bros","Minigolf Adventure"}	1	1	0	0	0	0	8	0	1	0	2	2	0	0
13	3	t	{Quoits,"Table Tennis"}	1	1	1	0	0	0	5	1	0	-1	2	2	0	0
13	4	t	{"Table Tennis","Super Smash Bros"}	1	1	0	1	0	0	7	0	0	-1	2	2	0	0
13	5	t	{Shooting,"Uno Stacko"}	1	1	0	0	0	0	2	1	1	-1	2	2	0	0
13	6	t	{Quoits,"Uno Stacko"}	1	1	0	2	0	0	6	0	2	0	2	2	0	0
13	7	f	{"Unstable Unicorns","Uno Stacko"}	1	0	1	0	0	0	3	0	1	-1	2	2	0	0
14	1	t	{"Mario Kart","Switch Bowling"}	1	0	3	0	0	1	4	0	1	-1	2	2	0	0
14	3	t	{Quoits,"Costumed Cats"}	2	0	4	0	0	0	5	0	1	0	2	2	0	0
14	4	t	{Catan,"Uno Stacko"}	1	0	5	0	1	0	3	0	2	0	2	2	0	0
15	1	t	{Jenga,"Skip Bo"}	2	0	2	0	0	0	0	1	0	-1	2	2	0	0
15	2	t	{Shithead,"Super Smash Bros"}	2	0	0	1	0	0	5	0	1	-1	2	2	0	0
15	3	t	{Jenga,"Switch Bowling"}	2	0	3	0	0	0	1	1	1	0	2	2	0	0
15	4	t	{Jenga,"Minigolf Adventure"}	2	0	0	0	0	0	7	0	2	0	2	2	0	0
15	5	t	{"Switch Golf","Skip Bo"}	2	0	1	1	0	0	4	0	0	0	2	2	0	0
15	6	f	{Jenga,"Skip Bo"}	2	0	1	0	0	0	6	0	1	0	2	2	0	0
15	7	f	{Jenga,Uno}	2	0	1	1	0	0	4	0	1	0	2	2	0	0
16	1	t	{"Mario Kart","Switch Golf"}	1	0	0	1	0	1	8	0	0	-1	2	2	0	0
16	2	t	{Jenga,"Monopoly Deal"}	1	0	0	1	0	0	1	0	1	0	2	2	0	0
16	3	t	{Catan,"Uno Stacko"}	1	0	2	1	0	0	2	0	0	0	2	2	0	0
16	4	t	{"Minigolf Adventure","Uno Stacko"}	1	0	1	1	0	0	6	0	1	0	2	2	0	0
16	5	t	{"Game of Life","Minigolf Adventure"}	1	0	2	1	1	0	2	0	0	-1	2	2	0	0
17	1	t	{Jenga,"Switch Bowling"}	1	1	3	1	0	1	6	0	0	-1	2	2	0	0
17	2	t	{"Five Crowns",Codenames}	2	1	1	1	0	0	9	0	0	-2	2	2	0	0
17	3	t	{"Table Tennis",Quoits}	1	1	2	0	0	0	5	1	0	0	2	2	0	0
17	4	t	{"Minigolf Adventure","Mario Kart"}	1	1	1	0	0	0	9	1	1	0	2	2	0	0
17	5	t	{Jenga,"Uno Stacko"}	1	1	2	0	0	0	10	1	2	0	2	2	0	0
17	6	f	{"Putt Putt","Uno Stacko"}	1	1	1	1	0	0	6	1	1	-1	2	2	0	0
17	7	f	{Jenga,"Uno Stacko"}	1	1	1	0	0	0	3	0	2	0	2	2	0	0
17	10	t	{Chess,"Super Smash Bros"}	1	1	3	1	0	0	6	0	1	0	2	2	0	0
17	9	t	{Jenga,"Uno Flip"}	0	0	0	0	0	0	1	0	1	0	2	2	0	0
18	1	t	{"Boomerang Fu","Switch Bowling"}	1	1	3	1	0	1	7	0	1	0	2	2	0	0
18	3	t	{Quoits,"Uno Stacko"}	1	1	1	2	0	1	9	0	1	-1	2	2	0	0
18	4	t	{"Mario Kart","Minigolf Adventure"}	1	1	0	1	0	1	8	1	1	0	2	2	0	0
18	6	t	{Quoits,Jenga}	1	1	1	1	0	0	10	0	1	0	2	2	0	0
18	7	f	{"Uno Stacko","Flip 7"}	1	0	3	1	1	0	3	0	1	-1	2	2	0	0
19	7	t	{"Flip 7","Uno Stacko"}	1	1	0	1	0	0	9	1	1	-1	2	2	0	0
19	3	t	{"Beer Pong",Quoits}	1	1	6	3	0	0	8	1	0	-2	2	2	0	0
19	6	t	{"Flip 7",Quoits}	1	1	5	4	0	0	9	1	1	-1	2	2	0	0
19	1	t	{"Boomerang Fu","Switch Bowling"}	1	1	3	1	0	0	14	0	1	-1	2	2	0	0
19	4	t	{"Rhythm Kitchen","Minigolf Adventure"}	1	1	5	2	0	0	16	0	2	0	2	2	0	0
20	5	t	{"Uno Stacko"}	1	0	3	0	0	0	3	0	1	0	2	2	0	0
20	1	t	{"Switch Bowling"}	2	1	1	2	1	0	4	0	0	0	2	2	0	0
20	4	t	{"Minigolf Adventure"}	1	1	0	2	0	0	6	0	1	0	2	2	0	0
20	2	t	{"Uno Stacko"}	1	1	1	2	0	0	2	1	1	0	2	2	0	0
20	7	t	{"Uno Stacko"}	2	1	1	0	0	0	7	1	1	0	2	2	0	0
20	3	t	{Quoits}	1	1	1	0	0	0	8	0	0	-1	2	2	0	0
20	6	t	{"Flip 7"}	1	1	1	0	0	1	8	0	1	0	2	2	0	0
21	7	t	{Jenga,"Muffin Time"}	1	1	3	3	0	0	7	0	2	-2	2	2	0	0
21	3	t	{Quoits,"Flip 7"}	1	1	1	0	0	0	6	1	1	-1	2	2	0	0
21	6	t	{Jenga,Quoits}	1	0	3	0	1	0	5	0	2	-1	2	2	0	0
21	5	t	{"Muffin Time",Jenga}	1	0	5	2	1	0	4	0	2	-2	2	2	0	0
21	1	t	{Codenames,"Switch Bowling"}	2	1	5	0	0	2	11	0	0	-1	2	2	0	0
21	2	t	{Jenga,"Monopoly Deal"}	1	1	4	1	0	0	8	0	2	-1	2	2	0	0
\.


--
-- Data for Name: gog_possible_games; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.gog_possible_games (session_id, game_id, game_name) FROM stdin;
1	1	Shithead
1	2	Golf
1	3	Skip Bo
1	4	Monopoly Deal
1	5	Monopoly Bid
1	6	Muffin Time
1	7	Here to Slay
1	8	Unstable Unicorns
1	9	Llamas Unleashed
1	10	Yahtzee Cards
1	11	FUCK the Game
1	12	Coup
1	13	Uno
1	14	Uno Flip
1	15	Uno No Mercy
1	16	Cards Against Humanity
1	17	Costumed Cats
1	18	Struggle for Catan
1	20	Monopoly
1	21	Game of Life
1	22	Catan
1	23	Betrayal
1	24	Chess
1	25	Trouble (Pop-n-hop)
1	19	Avocado Smash
1	7	Here to Slay
1	26	Block Party
1	27	Mario Kart
1	28	Mario Party
1	29	Super Smash Bros
1	30	Switch Bowling
1	31	Switch Tennis
1	32	Switch Basketball
1	33	Switch Golf
1	34	Minigolf Adventure
1	35	Gang Beasts
1	36	FIFA
1	37	NBA
1	38	Call of Duty
1	39	Injustice
1	40	Street Fighter
1	41	Basketball
1	42	Table Tennis
1	43	Backyard Cricket
1	44	Soccer
1	45	Handball
1	46	Capture the Flag
1	47	Quoits
1	48	Cornhole
1	49	Shooting
1	50	Alphabetix
1	51	Uno Stacko
1	52	Jenga
2	1	Shithead
2	3	Skip Bo
2	34	Minigolf Adventure
2	52	Jenga
3	1	Shithead
3	2	Golf
3	3	Skip Bo
3	4	Monopoly Deal
3	5	Monopoly Bid
3	6	Muffin Time
3	7	Here to Slay
3	8	Unstable Unicorns
3	9	Llamas Unleashed
3	10	Yahtzee Cards
3	11	FUCK the Game
3	12	Coup
3	13	Uno
3	14	Uno Flip
3	15	Uno No Mercy
3	16	Cards Against Humanity
3	17	Costumed Cats
3	18	Struggle for Catan
3	20	Monopoly
3	21	Game of Life
3	22	Catan
3	23	Betrayal
3	24	Chess
3	25	Trouble (Pop-n-hop)
3	19	Avocado Smash
3	7	Here to Slay
3	26	Block Party
3	27	Mario Kart
3	28	Mario Party
3	29	Super Smash Bros
3	30	Switch Bowling
3	31	Switch Tennis
3	32	Switch Basketball
3	33	Switch Golf
3	34	Minigolf Adventure
3	35	Gang Beasts
3	36	FIFA
3	37	NBA
3	38	Call of Duty
3	39	Injustice
3	40	Street Fighter
3	41	Basketball
3	42	Table Tennis
3	43	Backyard Cricket
3	44	Soccer
3	45	Handball
3	46	Capture the Flag
3	47	Quoits
3	48	Cornhole
3	49	Shooting
3	50	Alphabetix
3	51	Uno Stacko
3	52	Jenga
4	1	Shithead
4	2	Golf
4	3	Skip Bo
4	4	Monopoly Deal
4	5	Monopoly Bid
4	6	Muffin Time
4	7	Here to Slay
4	8	Unstable Unicorns
4	9	Llamas Unleashed
4	10	Yahtzee Cards
4	11	FUCK the Game
4	12	Coup
4	13	Uno
4	14	Uno Flip
4	15	Uno No Mercy
4	16	Cards Against Humanity
4	17	Costumed Cats
4	18	Struggle for Catan
4	20	Monopoly
4	21	Game of Life
4	22	Catan
4	23	Betrayal
4	24	Chess
4	25	Trouble (Pop-n-hop)
4	19	Avocado Smash
4	7	Here to Slay
4	26	Block Party
4	27	Mario Kart
4	28	Mario Party
4	29	Super Smash Bros
4	30	Switch Bowling
4	31	Switch Tennis
4	32	Switch Basketball
4	33	Switch Golf
4	34	Minigolf Adventure
4	35	Gang Beasts
4	36	FIFA
4	37	NBA
4	38	Call of Duty
4	39	Injustice
4	40	Street Fighter
4	41	Basketball
4	42	Table Tennis
4	43	Backyard Cricket
4	44	Soccer
4	45	Handball
4	46	Capture the Flag
4	47	Quoits
4	48	Cornhole
4	49	Shooting
4	50	Alphabetix
4	51	Uno Stacko
4	52	Jenga
5	1	Shithead
5	2	Golf
5	3	Skip Bo
5	4	Monopoly Deal
5	5	Monopoly Bid
5	6	Muffin Time
5	7	Here to Slay
5	8	Unstable Unicorns
5	9	Llamas Unleashed
5	10	Yahtzee Cards
5	11	FUCK the Game
5	12	Coup
5	13	Uno
5	14	Uno Flip
5	15	Uno No Mercy
5	16	Cards Against Humanity
5	17	Costumed Cats
5	18	Struggle for Catan
5	20	Monopoly
5	21	Game of Life
5	22	Catan
5	23	Betrayal
5	24	Chess
5	25	Trouble (Pop-n-hop)
5	19	Avocado Smash
5	7	Here to Slay
5	26	Block Party
5	27	Mario Kart
5	28	Mario Party
5	29	Super Smash Bros
5	30	Switch Bowling
5	31	Switch Tennis
5	32	Switch Basketball
5	33	Switch Golf
5	34	Minigolf Adventure
5	35	Gang Beasts
5	36	FIFA
5	37	NBA
5	38	Call of Duty
5	39	Injustice
5	40	Street Fighter
5	41	Basketball
5	42	Table Tennis
5	43	Backyard Cricket
5	44	Soccer
5	45	Handball
5	46	Capture the Flag
5	47	Quoits
5	48	Cornhole
5	49	Shooting
5	50	Alphabetix
5	51	Uno Stacko
5	52	Jenga
6	1	Shithead
6	2	Golf
6	3	Skip Bo
6	4	Monopoly Deal
6	5	Monopoly Bid
6	6	Muffin Time
6	7	Here to Slay
6	8	Unstable Unicorns
6	9	Llamas Unleashed
6	10	Yahtzee Cards
6	11	FUCK the Game
6	12	Coup
6	13	Uno
6	14	Uno Flip
6	15	Uno No Mercy
6	16	Cards Against Humanity
6	17	Costumed Cats
6	18	Struggle for Catan
6	20	Monopoly
6	21	Game of Life
6	22	Catan
6	23	Betrayal
6	24	Chess
6	25	Trouble (Pop-n-hop)
6	19	Avocado Smash
6	7	Here to Slay
6	26	Block Party
6	27	Mario Kart
6	28	Mario Party
6	29	Super Smash Bros
6	30	Switch Bowling
6	31	Switch Tennis
6	32	Switch Basketball
6	33	Switch Golf
6	34	Minigolf Adventure
6	35	Gang Beasts
6	36	FIFA
6	37	NBA
6	38	Call of Duty
6	39	Injustice
6	40	Street Fighter
6	41	Basketball
6	42	Table Tennis
6	43	Backyard Cricket
6	44	Soccer
6	45	Handball
6	46	Capture the Flag
6	47	Quoits
6	48	Cornhole
6	49	Shooting
6	50	Alphabetix
6	51	Uno Stacko
6	52	Jenga
7	1	Shithead
7	2	Golf
7	3	Skip Bo
7	4	Monopoly Deal
7	5	Monopoly Bid
7	6	Muffin Time
7	7	Here to Slay
7	8	Unstable Unicorns
7	9	Llamas Unleashed
7	10	Yahtzee Cards
7	11	FUCK the Game
7	12	Coup
7	13	Uno
7	14	Uno Flip
7	15	Uno No Mercy
7	16	Cards Against Humanity
7	17	Costumed Cats
7	18	Struggle for Catan
7	20	Monopoly
7	21	Game of Life
7	22	Catan
7	23	Betrayal
7	24	Chess
7	25	Trouble (Pop-n-hop)
7	19	Avocado Smash
7	7	Here to Slay
7	26	Block Party
7	27	Mario Kart
7	28	Mario Party
7	29	Super Smash Bros
7	30	Switch Bowling
7	31	Switch Tennis
7	32	Switch Basketball
7	33	Switch Golf
7	34	Minigolf Adventure
7	35	Gang Beasts
7	36	FIFA
7	37	NBA
7	38	Call of Duty
7	39	Injustice
7	40	Street Fighter
7	41	Basketball
7	42	Table Tennis
7	43	Backyard Cricket
7	44	Soccer
7	45	Handball
7	46	Capture the Flag
7	47	Quoits
7	48	Cornhole
7	49	Shooting
7	50	Alphabetix
7	51	Uno Stacko
7	52	Jenga
8	1	Shithead
8	2	Golf
8	3	Skip Bo
8	4	Monopoly Deal
8	5	Monopoly Bid
8	6	Muffin Time
8	7	Here to Slay
8	8	Unstable Unicorns
8	9	Llamas Unleashed
8	10	Yahtzee Cards
8	11	FUCK the Game
8	12	Coup
8	13	Uno
8	14	Uno Flip
8	15	Uno No Mercy
8	16	Cards Against Humanity
8	17	Costumed Cats
8	18	Struggle for Catan
8	20	Monopoly
8	21	Game of Life
8	22	Catan
8	23	Betrayal
8	24	Chess
8	25	Trouble (Pop-n-hop)
8	19	Avocado Smash
8	7	Here to Slay
8	26	Block Party
8	27	Mario Kart
8	28	Mario Party
8	29	Super Smash Bros
8	30	Switch Bowling
8	31	Switch Tennis
8	32	Switch Basketball
8	33	Switch Golf
8	34	Minigolf Adventure
8	35	Gang Beasts
8	36	FIFA
8	37	NBA
8	38	Call of Duty
8	39	Injustice
8	40	Street Fighter
8	41	Basketball
8	42	Table Tennis
8	43	Backyard Cricket
8	44	Soccer
8	45	Handball
8	46	Capture the Flag
8	47	Quoits
8	48	Cornhole
8	49	Shooting
8	50	Alphabetix
8	51	Uno Stacko
8	52	Jenga
9	1	Shithead
9	2	Golf
9	3	Skip Bo
9	4	Monopoly Deal
9	5	Monopoly Bid
9	6	Muffin Time
9	7	Here to Slay
9	8	Unstable Unicorns
9	9	Llamas Unleashed
9	10	Yahtzee Cards
9	11	FUCK the Game
9	12	Coup
9	13	Uno
9	14	Uno Flip
9	15	Uno No Mercy
9	16	Cards Against Humanity
9	17	Costumed Cats
9	18	Struggle for Catan
9	20	Monopoly
9	21	Game of Life
9	22	Catan
9	23	Betrayal
9	24	Chess
9	25	Trouble (Pop-n-hop)
9	19	Avocado Smash
9	7	Here to Slay
9	26	Block Party
9	27	Mario Kart
9	28	Mario Party
9	29	Super Smash Bros
9	30	Switch Bowling
9	31	Switch Tennis
9	32	Switch Basketball
9	33	Switch Golf
9	34	Minigolf Adventure
9	35	Gang Beasts
9	36	FIFA
9	37	NBA
9	38	Call of Duty
9	39	Injustice
9	40	Street Fighter
9	41	Basketball
9	42	Table Tennis
9	43	Backyard Cricket
9	44	Soccer
9	45	Handball
9	46	Capture the Flag
9	47	Quoits
9	48	Cornhole
9	49	Shooting
9	50	Alphabetix
9	51	Uno Stacko
9	52	Jenga
10	1	Shithead
10	2	Golf
10	3	Skip Bo
10	4	Monopoly Deal
10	5	Monopoly Bid
10	6	Muffin Time
10	8	Unstable Unicorns
10	9	Llamas Unleashed
10	10	Yahtzee Cards
10	11	FUCK the Game
10	12	Coup
10	13	Uno
10	14	Uno Flip
10	16	Cards Against Humanity
10	17	Costumed Cats
10	18	Struggle for Catan
10	20	Monopoly
10	21	Game of Life
10	22	Catan
10	\N	Betrayal
10	24	Chess
10	25	Trouble (Pop-n-hop)
10	26	Block Party
10	27	Mario Kart
10	28	Mario Party
10	29	Super Smash Bros
10	30	Switch Bowling
10	31	Switch Tennis
10	32	Switch Basketball
10	33	Switch Golf
10	34	Minigolf Adventure
10	35	Gang Beasts
10	36	FIFA
10	37	NBA
10	38	Call of Duty
10	39	Injustice
10	40	Street Fighter
10	41	Basketball
10	42	Table Tennis
10	43	Backyard Cricket
10	44	Soccer
10	45	Handball
10	46	Capture the Flag
10	47	Quoits
10	48	Cornhole
10	49	Shooting
10	50	Alphabetix
10	51	Uno Stacko
10	52	Jenga
10	53	4:20 Game
11	1	Shithead
11	2	Golf
11	3	Skip Bo
11	4	Monopoly Deal
11	5	Monopoly Bid
11	6	Muffin Time
11	8	Unstable Unicorns
11	9	Llamas Unleashed
11	10	Yahtzee Cards
11	11	FUCK the Game
11	12	Coup
11	13	Uno
11	14	Uno Flip
11	16	Cards Against Humanity
11	17	Costumed Cats
11	18	Struggle for Catan
11	20	Monopoly
11	21	Game of Life
11	22	Catan
11	\N	Betrayal
11	24	Chess
11	25	Trouble (Pop-n-hop)
11	26	Block Party
11	27	Mario Kart
11	28	Mario Party
11	29	Super Smash Bros
11	30	Switch Bowling
11	31	Switch Tennis
11	32	Switch Basketball
11	33	Switch Golf
11	34	Minigolf Adventure
11	35	Gang Beasts
11	36	FIFA
11	37	NBA
11	38	Call of Duty
11	39	Injustice
11	40	Street Fighter
11	41	Basketball
11	42	Table Tennis
11	43	Backyard Cricket
11	44	Soccer
11	45	Handball
11	46	Capture the Flag
11	47	Quoits
11	48	Cornhole
11	49	Shooting
11	50	Alphabetix
11	51	Uno Stacko
11	52	Jenga
11	53	4:20 Game
12	1	Shithead
12	2	Golf
12	3	Skip Bo
12	4	Monopoly Deal
12	5	Monopoly Bid
12	6	Muffin Time
12	7	Here to Slay
12	8	Unstable Unicorns
12	9	Llamas Unleashed
12	10	Yahtzee Cards
12	11	FUCK the Game
12	12	Coup
12	13	Uno
12	14	Uno Flip
12	15	Uno No Mercy
12	16	Cards Against Humanity
12	17	Costumed Cats
12	18	Struggle for Catan
12	20	Monopoly
12	21	Game of Life
12	22	Catan
12	23	Betrayal
12	24	Chess
12	25	Trouble (Pop-n-hop)
12	19	Avocado Smash
12	7	Here to Slay
12	26	Block Party
12	27	Mario Kart
12	28	Mario Party
12	29	Super Smash Bros
12	30	Switch Bowling
12	31	Switch Tennis
12	32	Switch Basketball
12	33	Switch Golf
12	34	Minigolf Adventure
12	35	Gang Beasts
12	36	FIFA
12	37	NBA
12	38	Call of Duty
12	39	Injustice
12	40	Street Fighter
12	41	Basketball
12	42	Table Tennis
12	43	Backyard Cricket
12	44	Soccer
12	45	Handball
12	46	Capture the Flag
12	47	Quoits
12	48	Cornhole
12	49	Shooting
12	50	Alphabetix
12	51	Uno Stacko
12	52	Jenga
13	1	Shithead
13	2	Golf
13	3	Skip Bo
13	4	Monopoly Deal
13	5	Monopoly Bid
13	6	Muffin Time
13	8	Unstable Unicorns
13	9	Llamas Unleashed
13	10	Yahtzee Cards
13	11	FUCK the Game
13	12	Coup
13	13	Uno
13	14	Uno Flip
13	16	Cards Against Humanity
13	17	Costumed Cats
13	18	Struggle for Catan
13	20	Monopoly
13	21	Game of Life
13	22	Catan
13	\N	Betrayal
13	24	Chess
13	25	Trouble (Pop-n-hop)
13	26	Block Party
13	27	Mario Kart
13	28	Mario Party
13	29	Super Smash Bros
13	30	Switch Bowling
13	31	Switch Tennis
13	32	Switch Basketball
13	33	Switch Golf
13	34	Minigolf Adventure
13	35	Gang Beasts
13	36	FIFA
13	37	NBA
13	38	Call of Duty
13	39	Injustice
13	40	Street Fighter
13	41	Basketball
13	42	Table Tennis
13	43	Backyard Cricket
13	44	Soccer
13	45	Handball
13	46	Capture the Flag
13	47	Quoits
13	48	Cornhole
13	49	Shooting
13	50	Alphabetix
13	51	Uno Stacko
13	52	Jenga
13	53	4:20 Game
14	1	Shithead
14	2	Golf
14	3	Skip Bo
14	4	Monopoly Deal
14	5	Monopoly Bid
14	6	Muffin Time
14	8	Unstable Unicorns
14	9	Llamas Unleashed
14	10	Yahtzee Cards
14	11	FUCK the Game
14	12	Coup
14	13	Uno
14	14	Uno Flip
14	16	Cards Against Humanity
14	17	Costumed Cats
14	18	Struggle for Catan
14	20	Monopoly
14	21	Game of Life
14	22	Catan
14	\N	Betrayal
14	24	Chess
14	25	Trouble (Pop-n-hop)
14	26	Block Party
14	27	Mario Kart
14	28	Mario Party
14	29	Super Smash Bros
14	30	Switch Bowling
14	31	Switch Tennis
14	32	Switch Basketball
14	33	Switch Golf
14	34	Minigolf Adventure
14	35	Gang Beasts
14	36	FIFA
14	37	NBA
14	38	Call of Duty
14	39	Injustice
14	40	Street Fighter
14	41	Basketball
14	42	Table Tennis
14	43	Backyard Cricket
14	44	Soccer
14	45	Handball
14	46	Capture the Flag
14	47	Quoits
14	48	Cornhole
14	49	Shooting
14	50	Alphabetix
14	51	Uno Stacko
14	52	Jenga
14	53	4:20 Game
15	1	Shithead
15	2	Golf
15	3	Skip Bo
15	6	Muffin Time
15	8	Unstable Unicorns
15	12	Coup
15	13	Uno
15	14	Uno Flip
15	15	Uno No Mercy
15	16	Cards Against Humanity
15	29	Super Smash Bros
15	30	Switch Bowling
15	33	Switch Golf
15	34	Minigolf Adventure
15	52	Jenga
16	53	4:20 Game
16	1	Shithead
16	2	Golf
16	3	Skip Bo
16	4	Monopoly Deal
16	6	Muffin Time
16	8	Unstable Unicorns
16	12	Coup
16	13	Uno
16	14	Uno Flip
16	15	Uno No Mercy
16	18	Struggle for Catan
16	55	Five Crowns
16	21	Game of Life
16	22	Catan
16	24	Chess
16	25	Trouble (Pop-n-hop)
16	26	Block Party
16	27	Mario Kart
16	28	Mario Party
16	29	Super Smash Bros
16	30	Switch Bowling
16	31	Switch Tennis
16	32	Switch Basketball
16	33	Switch Golf
16	34	Minigolf Adventure
16	51	Uno Stacko
16	52	Jenga
17	53	4:20 Game
16	54	Sounds Fishy
17	50	Alphabetix
17	19	Avocado Smash
17	59	Beer Pong
17	26	Block Party
17	16	Cards Against Humanity
17	61	Codenames
17	24	Chess
17	48	Cornhole
17	17	Costumed Cats
17	55	Five Crowns
17	58	Flip 7
17	11	FUCK the Game
17	2	Golf
17	39	Injustice
17	52	Jenga
17	56	Karma
17	9	Llamas Unleashed
17	27	Mario Kart
17	28	Mario Party
17	34	Minigolf Adventure
17	4	Monopoly Deal
17	60	Putt Putt
17	47	Quoits
17	1	Shithead
17	49	Shooting
17	3	Skip Bo
17	54	Sounds Fishy
17	40	Street Fighter
17	29	Super Smash Bros
17	30	Switch Bowling
17	33	Switch Golf
17	31	Switch Tennis
17	42	Table Tennis
17	57	Tong-its
17	13	Uno
17	14	Uno Flip
17	15	Uno No Mercy
17	51	Uno Stacko
17	8	Unstable Unicorns
18	53	4:20 Game
18	50	Alphabetix
18	59	Beer Pong
18	26	Block Party
18	62	Boomerang Fu
18	16	Cards Against Humanity
18	61	Codenames
18	12	Coup
18	55	Five Crowns
18	58	Flip 7
18	2	Golf
18	52	Jenga
18	27	Mario Kart
18	28	Mario Party
18	34	Minigolf Adventure
18	63	Minigolf Bowling
18	4	Monopoly Deal
18	6	Muffin Time
18	60	Putt Putt
18	47	Quoits
18	1	Shithead
18	3	Skip Bo
18	29	Super Smash Bros
18	30	Switch Bowling
18	33	Switch Golf
18	31	Switch Tennis
18	57	Tong-its
18	13	Uno
18	14	Uno Flip
18	15	Uno No Mercy
18	51	Uno Stacko
18	8	Unstable Unicorns
19	50	Alphabetix
19	59	Beer Pong
19	26	Block Party
19	62	Boomerang Fu
19	16	Cards Against Humanity
19	22	Catan
19	61	Codenames
19	17	Costumed Cats
19	12	Coup
19	55	Five Crowns
19	58	Flip 7
19	2	Golf
19	52	Jenga
19	56	Karma
19	9	Llamas Unleashed
19	27	Mario Kart
19	28	Mario Party
19	34	Minigolf Adventure
19	4	Monopoly Deal
19	6	Muffin Time
19	47	Quoits
19	64	Rhythm Kitchen
19	1	Shithead
19	49	Shooting
19	3	Skip Bo
19	29	Super Smash Bros
19	30	Switch Bowling
19	33	Switch Golf
19	31	Switch Tennis
19	42	Table Tennis
19	57	Tong-its
19	13	Uno
19	14	Uno Flip
19	15	Uno No Mercy
19	51	Uno Stacko
19	8	Unstable Unicorns
19	65	Moose Master
19	53	4:20 Game
20	53	4:20 Game
20	50	Alphabetix
20	19	Avocado Smash
20	59	Beer Pong
20	26	Block Party
20	16	Cards Against Humanity
20	61	Codenames
20	66	Codenames Pictures
20	17	Costumed Cats
20	55	Five Crowns
20	58	Flip 7
20	2	Golf
20	52	Jenga
20	56	Karma
20	27	Mario Kart
20	28	Mario Party
20	34	Minigolf Adventure
20	5	Monopoly Bid
20	4	Monopoly Deal
20	65	Moose Master
20	6	Muffin Time
20	47	Quoits
20	1	Shithead
20	29	Super Smash Bros
20	30	Switch Bowling
20	57	Tong-its
20	13	Uno
20	14	Uno Flip
20	15	Uno No Mercy
20	51	Uno Stacko
20	8	Unstable Unicorns
21	53	4:20 Game
21	50	Alphabetix
21	59	Beer Pong
21	16	Cards Against Humanity
21	22	Catan
21	61	Codenames
21	66	Codenames Pictures
21	12	Coup
21	55	Five Crowns
21	58	Flip 7
21	2	Golf
21	52	Jenga
21	27	Mario Kart
21	28	Mario Party
21	34	Minigolf Adventure
21	65	Moose Master
21	4	Monopoly Deal
21	6	Muffin Time
21	47	Quoits
21	3	Skip Bo
21	1	Shithead
21	29	Super Smash Bros
21	30	Switch Bowling
21	57	Tong-its
21	13	Uno
21	14	Uno Flip
21	15	Uno No Mercy
21	51	Uno Stacko
21	8	Unstable Unicorns
\.


--
-- Data for Name: points_system; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.points_system (points_system_id, num_players, rewards, type) FROM stdin;
1	2	{"1 point","0 points"}	points
2	3	{"2 points","1 point","0 points"}	points
3	4	{"3 points","2 points","1 point","0 points"}	points
4	5	{"4 points","3 points","2 points","1 point","0 points"}	points
5	6	{"5 points","4 points","3 points","2 points","1 point","0 points"}	points
6	7	{"6 points","5 points","4 points","3 points","2 points","1 point","0 points"}	points
7	8	{"7 points","6 points","5 points","4 points","3 points","2 points","1 point","0 points"}	points
8	9	{"8 points","7 points","6 points","5 points","4 points","3 points","2 points","1 point","0 points"}	points
9	10	{"9 points","8 points","7 points","6 points","5 points","4 points","3 points","2 points","1 point","0 points"}	points
10	2	{"1 point","1 cone"}	cones
11	3	{"1 point",Nothing,"1 cone"}	cones
12	4	{"2 points","1 point",nc,"1 cone"}	cones
13	5	{"2 points","1 point",pc,nc,"1 cone"}	cones
14	6	{"3 points","2 points","1 point",pc,nc,"1 cone"}	cones
15	7	{"3 points","2 points","1 point",pc,nc,"1 cone","1 cone"}	cones
16	8	{"3 points","2 points","1 points",Nothing,pc,nc,"1 cone","1 cone"}	cones
17	9	{"3 points","2 points","1 point",Nothing,pn,pc,nc,"1 cone","1 cone"}	cones
18	10	{"3 points","2 points","1 point",Nothing,pn,pc,nc,"1 cone","1 cone","1 cone"}	cones
\.


--
-- Data for Name: user_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_sessions (sid, sess, expire) FROM stdin;
\.


--
-- Name: accounts_player_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.accounts_player_id_seq', 1, true);


--
-- Name: games_info_game_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.games_info_game_id_seq', 67, true);


--
-- Name: gog_game_votes_vote_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.gog_game_votes_vote_id_seq', 389, true);


--
-- Name: gog_games_game_instance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.gog_games_game_instance_id_seq', 163, true);


--
-- Name: gog_games_neighed_game_neighed_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.gog_games_neighed_game_neighed_id_seq', 23, true);


--
-- Name: gog_sessions_session_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.gog_sessions_session_id_seq', 20, true);


--
-- Name: points_system_points_system_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.points_system_points_system_id_seq', 18, true);


--
-- PostgreSQL database dump complete
--

