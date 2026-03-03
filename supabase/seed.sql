SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict EYIsRk1ZvkKfIJ2KgoH5SLk3fcBNFI83dhfcWXstWol3Ul5LafTStBaUxEhttVt

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

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
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."flow_state" ("id", "user_id", "auth_code", "code_challenge_method", "code_challenge", "provider_type", "provider_access_token", "provider_refresh_token", "created_at", "updated_at", "authentication_method", "auth_code_issued_at", "invite_token", "referrer", "oauth_client_state_id", "linking_target_id", "email_optional") VALUES
	('0a37318b-306d-4cf5-b77a-690b82dfc96b', NULL, NULL, NULL, NULL, 'google', '', '', '2026-02-09 21:06:16.404881+00', '2026-02-09 21:06:16.404881+00', 'oauth', NULL, NULL, 'com.calistenia.app://auth/callback', NULL, NULL, false),
	('3f50047e-01b4-4aff-8f91-7363cd53619b', NULL, NULL, NULL, NULL, 'google', '', '', '2026-02-12 23:49:41.40619+00', '2026-02-12 23:49:41.40619+00', 'oauth', NULL, NULL, 'com.calistenia.app://auth/callback', NULL, NULL, false),
	('2c251ac9-3191-4de7-a6cf-a2e454c75fe8', NULL, NULL, NULL, NULL, 'google', '', '', '2026-02-25 12:29:17.911788+00', '2026-02-25 12:29:17.911788+00', 'oauth', NULL, NULL, 'com.calistenia.app://auth/callback', NULL, NULL, false);


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', 'b95a914d-0601-4331-a6a4-c9b84ec3af1c', 'authenticated', 'authenticated', 'correyeroporrojuanjose@gmail.com', '$2a$10$owm12N9wAOzqdPJ4ndvmUefbjosy1qp4t38q2y2LtLpD4i1u5Fu72', '2026-02-06 17:53:47.924242+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-02-06 17:53:47.950739+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "b95a914d-0601-4331-a6a4-c9b84ec3af1c", "email": "correyeroporrojuanjose@gmail.com", "full_name": "Juan José ", "email_verified": true, "phone_verified": false}', NULL, '2026-02-06 17:53:47.802893+00', '2026-02-23 20:33:26.129955+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'ae78b385-1334-4a89-9a8c-629469d04d51', 'authenticated', 'authenticated', 'abelsanchez210376@gmail.com', '$2a$10$LhrVPQ1taWJB.zu5hZwaN.3pgaLQUf2buL8t3gmgUm8iOK0DTmQ7i', '2026-01-21 19:23:07.808246+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-01-21 19:24:51.586563+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "ae78b385-1334-4a89-9a8c-629469d04d51", "email": "abelsanchez210376@gmail.com", "full_name": "Abel", "email_verified": true, "phone_verified": false}', NULL, '2026-01-21 19:23:07.803142+00', '2026-02-25 07:29:02.731752+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '1a3dce70-bdee-4e67-8784-5f115a416816', 'authenticated', 'authenticated', 'manuelrosalima1992@gmail.com', '$2a$10$ruGJE5g3S5vuEbPbpf9J9OF12YdGp10Z4xRn6dhPwlEu3s7ue.p4q', '2026-02-03 06:24:24.799784+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-02-03 06:24:24.807705+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "1a3dce70-bdee-4e67-8784-5f115a416816", "email": "manuelrosalima1992@gmail.com", "full_name": "Manolo Rosa Lima ", "email_verified": true, "phone_verified": false}', NULL, '2026-02-03 06:24:24.749725+00', '2026-02-25 15:17:22.861425+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '219ce759-6447-4be4-9bc3-891590663948', 'authenticated', 'authenticated', 'luisa.xaxi@gmail.com', '$2a$10$QrSyo09eI9jfSpwjqzI9yebmVi1h.uObLwhUJUDdpOGRDA4VEq5Qm', '2026-02-25 12:29:35.097502+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-02-25 12:29:35.111731+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "219ce759-6447-4be4-9bc3-891590663948", "email": "luisa.xaxi@gmail.com", "full_name": "Luisa Puntas", "email_verified": true, "phone_verified": false}', NULL, '2026-02-25 12:29:35.007635+00', '2026-02-27 09:12:11.663901+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', 'authenticated', 'authenticated', 'jesuscuadra@gmail.com', '$2a$10$DSzVs1CG2rFuqgSkVQ0n7u3V2JKrGwyggfOSZ0aZ8RbMVevNWdDU6', '2025-12-30 15:55:14.14275+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-02-02 19:23:27.943253+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8", "email": "jesuscuadra@gmail.com", "full_name": "jesus", "email_verified": true, "phone_verified": false}', NULL, '2025-12-30 15:55:14.061339+00', '2026-03-02 17:40:43.734296+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'ee5ed2c4-ab2a-4485-a5cc-cf3db842b8f1', 'authenticated', 'authenticated', 'jacobogarciamanso@gmail.com', '$2a$10$7arkoKCFfpPdE2Mx26HMpu6nd9UcfrT8vLi24mwCiDfMygVlz6KuS', '2026-01-21 19:18:59.258664+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-01-21 19:18:59.277492+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "ee5ed2c4-ab2a-4485-a5cc-cf3db842b8f1", "email": "jacobogarciamanso@gmail.com", "full_name": "Jacobo", "email_verified": true, "phone_verified": false}', NULL, '2026-01-21 19:18:59.123185+00', '2026-03-02 18:01:00.656746+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '3b99746e-634b-4506-8ccd-6183785d2d64', 'authenticated', 'authenticated', 'thejhobbs@gmail.com', '$2a$10$IHj.5d1Q25iJLJtnv646UO8scVF0V1TFiH6izAYmDYAfVlpjsFELC', '2026-02-18 09:14:35.869272+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-02-24 15:02:47.899329+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "3b99746e-634b-4506-8ccd-6183785d2d64", "email": "thejhobbs@gmail.com", "full_name": "Josh Hobbs", "email_verified": true, "phone_verified": false}', NULL, '2026-02-18 09:14:35.724108+00', '2026-02-25 12:32:12.114778+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'f619fd7d-9bb5-49f4-b074-e4cfd72481ff', 'authenticated', 'authenticated', 'hola@gmail.com', '$2a$10$aRskB.2d9sA.u44I5PEim.mhbm06cNYoc4HPjJS2YrvVqB59czTb6', '2025-12-30 12:04:30.814472+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-01-07 14:58:49.686304+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "f619fd7d-9bb5-49f4-b074-e4cfd72481ff", "email": "hola@gmail.com", "full_name": "hola", "email_verified": true, "phone_verified": false}', NULL, '2025-12-30 12:04:30.804491+00', '2026-01-07 14:58:49.689692+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '52252b8a-4436-4a65-abb2-2093b1a2c7b7', 'authenticated', 'authenticated', 'paulallamas99@gmail.com', '$2a$10$pTmyiztSjaooSIT/zn0Eo.saMR8DELR3MA4CQkQfc1okr47TxQ9Hi', '2026-02-12 17:52:12.105871+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-02-12 17:52:12.118925+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "52252b8a-4436-4a65-abb2-2093b1a2c7b7", "email": "paulallamas99@gmail.com", "full_name": "Paula Llamas Martínez ", "email_verified": true, "phone_verified": false}', NULL, '2026-02-12 17:52:12.036644+00', '2026-03-03 07:33:05.204407+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', 'authenticated', 'authenticated', 'manuemerita@gmail.com', '$2a$10$tnMMrjnzIfl.7oDX3zEf3.B0FzUQ7KNxf83KG3SkQ7a8fcYhOOG5q', '2025-12-30 14:29:13.086638+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-01-18 18:39:07.170662+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "b5e0e7c6-f0e7-4b5f-a415-ebe23590444c", "email": "manuemerita@gmail.com", "full_name": "Manu", "email_verified": true, "phone_verified": false}', NULL, '2025-12-30 14:29:13.06255+00', '2026-03-03 13:19:09.302238+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '05723cd0-e913-498f-9c23-c1032e985246', 'authenticated', 'authenticated', 'carrascofernandezpaloma@gmail.com', NULL, '2026-02-16 17:24:06.060612+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-02-16 17:24:06.070762+00', '{"provider": "google", "providers": ["google"]}', '{"iss": "https://accounts.google.com", "sub": "114121916318747695314", "name": "Paloma Carrasco", "email": "carrascofernandezpaloma@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocKPyfkomG6LSSHbgZKa966a7CLF7eJHTz6KF9NAka2N9ovm5w=s96-c", "full_name": "Paloma Carrasco", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocKPyfkomG6LSSHbgZKa966a7CLF7eJHTz6KF9NAka2N9ovm5w=s96-c", "provider_id": "114121916318747695314", "email_verified": true, "phone_verified": false}', NULL, '2026-02-16 17:24:06.012899+00', '2026-03-02 08:04:57.488793+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'aa1a22b7-801a-48a5-b2ac-8d417438b31d', 'authenticated', 'authenticated', 'jeffersonsalvador.es@gmail.com', NULL, '2026-02-05 18:59:01.392817+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-02-20 14:54:13.072683+00', '{"provider": "google", "providers": ["google"]}', '{"iss": "https://accounts.google.com", "sub": "114392735665518149363", "name": "Jefferson", "email": "jeffersonsalvador.es@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocKRt0A-tZdPvpnKGdveb6mmXjGoHuFafQVAyaOCA_UA7xsehYE=s96-c", "full_name": "Jefferson", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocKRt0A-tZdPvpnKGdveb6mmXjGoHuFafQVAyaOCA_UA7xsehYE=s96-c", "provider_id": "114392735665518149363", "email_verified": true, "phone_verified": false}', NULL, '2026-02-05 18:59:01.310592+00', '2026-03-02 09:09:59.982691+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'a432650d-3397-423b-a27b-7f5f49fc446c', 'authenticated', 'authenticated', 'beavaroabad@gmail.com', '$2a$10$kqWoXPqi1gIXPHvfcLtv/.jAkAsJEcFk7GHrHfhxTAT1sFr5YOxFe', '2026-02-12 23:50:06.577526+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-02-12 23:50:06.597044+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "a432650d-3397-423b-a27b-7f5f49fc446c", "email": "beavaroabad@gmail.com", "full_name": "Bea Varo", "email_verified": true, "phone_verified": false}', NULL, '2026-02-12 23:50:06.470093+00', '2026-03-02 21:58:55.00618+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'ad5ba03b-2099-4b3d-9a58-080ed6310212', 'authenticated', 'authenticated', 'daniela.garcia.rivas1986@gmail.com', '$2a$10$CE/kMkBIJOZHfwC4heI/BuJTZa9UetharGSbwRfLBBBNusJIs7Mnq', '2026-02-09 21:09:00.950596+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-02-09 21:09:00.954623+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "ad5ba03b-2099-4b3d-9a58-080ed6310212", "email": "daniela.garcia.rivas1986@gmail.com", "full_name": "DANIELA ", "email_verified": true, "phone_verified": false}', NULL, '2026-02-09 21:09:00.924631+00', '2026-03-03 12:52:41.317355+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '0a5df480-a278-481d-a3f9-23f8eda30a33', 'authenticated', 'authenticated', 'miguelgallegoblanco@hotmail.com', NULL, '2026-02-19 20:52:45.50399+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-02-19 20:52:45.510846+00', '{"provider": "google", "providers": ["google"]}', '{"iss": "https://accounts.google.com", "sub": "111057244499839034754", "name": "Miguel Gallego Blanco", "email": "miguelgallegoblanco@hotmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocJ-4swu8Wp4DpNAyT6OGLWg0d-yvqtgq-0WlXXryi33oVPJHBGo=s96-c", "full_name": "Miguel Gallego Blanco", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocJ-4swu8Wp4DpNAyT6OGLWg0d-yvqtgq-0WlXXryi33oVPJHBGo=s96-c", "provider_id": "111057244499839034754", "email_verified": true, "phone_verified": false}', NULL, '2026-02-19 20:52:45.402325+00', '2026-02-19 22:03:10.688851+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('f619fd7d-9bb5-49f4-b074-e4cfd72481ff', 'f619fd7d-9bb5-49f4-b074-e4cfd72481ff', '{"sub": "f619fd7d-9bb5-49f4-b074-e4cfd72481ff", "email": "hola@gmail.com", "full_name": "hola", "email_verified": false, "phone_verified": false}', 'email', '2025-12-30 12:04:30.811783+00', '2025-12-30 12:04:30.81183+00', '2025-12-30 12:04:30.81183+00', 'd9e5fb2f-efcf-4d6f-90be-b22bd4ddff29'),
	('b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', '{"sub": "b5e0e7c6-f0e7-4b5f-a415-ebe23590444c", "email": "manuemerita@gmail.com", "full_name": "Manu", "email_verified": false, "phone_verified": false}', 'email', '2025-12-30 14:29:13.081652+00', '2025-12-30 14:29:13.081702+00', '2025-12-30 14:29:13.081702+00', '222a85be-636d-45f6-81a0-2ca00aab54cc'),
	('810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', '{"sub": "810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8", "email": "jesuscuadra@gmail.com", "full_name": "jesus", "email_verified": false, "phone_verified": false}', 'email', '2025-12-30 15:55:14.128888+00', '2025-12-30 15:55:14.128941+00', '2025-12-30 15:55:14.128941+00', 'feffc638-37fd-4f82-b6bc-3c1cf17c6bdd'),
	('ee5ed2c4-ab2a-4485-a5cc-cf3db842b8f1', 'ee5ed2c4-ab2a-4485-a5cc-cf3db842b8f1', '{"sub": "ee5ed2c4-ab2a-4485-a5cc-cf3db842b8f1", "email": "jacobogarciamanso@gmail.com", "full_name": "Jacobo", "email_verified": false, "phone_verified": false}', 'email', '2026-01-21 19:18:59.240147+00', '2026-01-21 19:18:59.240201+00', '2026-01-21 19:18:59.240201+00', '0be96104-4c1d-4418-9994-4fa795abd1d6'),
	('a432650d-3397-423b-a27b-7f5f49fc446c', 'a432650d-3397-423b-a27b-7f5f49fc446c', '{"sub": "a432650d-3397-423b-a27b-7f5f49fc446c", "email": "beavaroabad@gmail.com", "full_name": "Bea Varo", "email_verified": false, "phone_verified": false}', 'email', '2026-02-12 23:50:06.565479+00', '2026-02-12 23:50:06.565529+00', '2026-02-12 23:50:06.565529+00', 'f7f2a832-821e-40b6-b104-8c3df456bb4f'),
	('ae78b385-1334-4a89-9a8c-629469d04d51', 'ae78b385-1334-4a89-9a8c-629469d04d51', '{"sub": "ae78b385-1334-4a89-9a8c-629469d04d51", "email": "abelsanchez210376@gmail.com", "full_name": "Abel", "email_verified": false, "phone_verified": false}', 'email', '2026-01-21 19:23:07.806014+00', '2026-01-21 19:23:07.80606+00', '2026-01-21 19:23:07.80606+00', 'bcd49f88-3e2a-41bb-aa2b-ab2d0570b93b'),
	('1a3dce70-bdee-4e67-8784-5f115a416816', '1a3dce70-bdee-4e67-8784-5f115a416816', '{"sub": "1a3dce70-bdee-4e67-8784-5f115a416816", "email": "manuelrosalima1992@gmail.com", "full_name": "Manolo Rosa Lima ", "email_verified": false, "phone_verified": false}', 'email', '2026-02-03 06:24:24.789252+00', '2026-02-03 06:24:24.789304+00', '2026-02-03 06:24:24.789304+00', 'd73d7209-b35d-4c4b-8fd5-41a058d1219c'),
	('b95a914d-0601-4331-a6a4-c9b84ec3af1c', 'b95a914d-0601-4331-a6a4-c9b84ec3af1c', '{"sub": "b95a914d-0601-4331-a6a4-c9b84ec3af1c", "email": "correyeroporrojuanjose@gmail.com", "full_name": "Juan José ", "email_verified": false, "phone_verified": false}', 'email', '2026-02-06 17:53:47.908233+00', '2026-02-06 17:53:47.908284+00', '2026-02-06 17:53:47.908284+00', 'fd1c757b-2f6e-48f8-b5ae-eb5ad8c5f9aa'),
	('ad5ba03b-2099-4b3d-9a58-080ed6310212', 'ad5ba03b-2099-4b3d-9a58-080ed6310212', '{"sub": "ad5ba03b-2099-4b3d-9a58-080ed6310212", "email": "daniela.garcia.rivas1986@gmail.com", "full_name": "DANIELA ", "email_verified": false, "phone_verified": false}', 'email', '2026-02-09 21:09:00.94325+00', '2026-02-09 21:09:00.94452+00', '2026-02-09 21:09:00.94452+00', 'c5f33c63-ba51-4bb3-96ac-5b4af563aadd'),
	('52252b8a-4436-4a65-abb2-2093b1a2c7b7', '52252b8a-4436-4a65-abb2-2093b1a2c7b7', '{"sub": "52252b8a-4436-4a65-abb2-2093b1a2c7b7", "email": "paulallamas99@gmail.com", "full_name": "Paula Llamas Martínez ", "email_verified": false, "phone_verified": false}', 'email', '2026-02-12 17:52:12.097169+00', '2026-02-12 17:52:12.097237+00', '2026-02-12 17:52:12.097237+00', '9e08701e-3711-4fe5-9cd8-82383fc3f7b4'),
	('114121916318747695314', '05723cd0-e913-498f-9c23-c1032e985246', '{"iss": "https://accounts.google.com", "sub": "114121916318747695314", "name": "Paloma Carrasco", "email": "carrascofernandezpaloma@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocKPyfkomG6LSSHbgZKa966a7CLF7eJHTz6KF9NAka2N9ovm5w=s96-c", "full_name": "Paloma Carrasco", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocKPyfkomG6LSSHbgZKa966a7CLF7eJHTz6KF9NAka2N9ovm5w=s96-c", "provider_id": "114121916318747695314", "email_verified": true, "phone_verified": false}', 'google', '2026-02-16 17:24:06.049884+00', '2026-02-16 17:24:06.049941+00', '2026-02-16 17:24:06.049941+00', '46c193a1-ed2a-466c-bba4-7cef307a4d5a'),
	('3b99746e-634b-4506-8ccd-6183785d2d64', '3b99746e-634b-4506-8ccd-6183785d2d64', '{"sub": "3b99746e-634b-4506-8ccd-6183785d2d64", "email": "thejhobbs@gmail.com", "full_name": "Josh Hobbs", "email_verified": false, "phone_verified": false}', 'email', '2026-02-18 09:14:35.856277+00', '2026-02-18 09:14:35.856327+00', '2026-02-18 09:14:35.856327+00', 'b7cec07f-af38-4e5c-8941-6557aa934e26'),
	('111057244499839034754', '0a5df480-a278-481d-a3f9-23f8eda30a33', '{"iss": "https://accounts.google.com", "sub": "111057244499839034754", "name": "Miguel Gallego Blanco", "email": "miguelgallegoblanco@hotmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocJ-4swu8Wp4DpNAyT6OGLWg0d-yvqtgq-0WlXXryi33oVPJHBGo=s96-c", "full_name": "Miguel Gallego Blanco", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocJ-4swu8Wp4DpNAyT6OGLWg0d-yvqtgq-0WlXXryi33oVPJHBGo=s96-c", "provider_id": "111057244499839034754", "email_verified": true, "phone_verified": false}', 'google', '2026-02-19 20:52:45.494294+00', '2026-02-19 20:52:45.49435+00', '2026-02-19 20:52:45.49435+00', '15eed053-649c-4f6b-81fa-ed0846d4169e'),
	('114392735665518149363', 'aa1a22b7-801a-48a5-b2ac-8d417438b31d', '{"iss": "https://accounts.google.com", "sub": "114392735665518149363", "name": "Jefferson", "email": "jeffersonsalvador.es@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocKRt0A-tZdPvpnKGdveb6mmXjGoHuFafQVAyaOCA_UA7xsehYE=s96-c", "full_name": "Jefferson", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocKRt0A-tZdPvpnKGdveb6mmXjGoHuFafQVAyaOCA_UA7xsehYE=s96-c", "provider_id": "114392735665518149363", "email_verified": true, "phone_verified": false}', 'google', '2026-02-05 18:59:01.38385+00', '2026-02-05 18:59:01.383898+00', '2026-02-20 14:54:13.044556+00', 'cf5a8e15-816d-464c-8497-91736fa3f743'),
	('219ce759-6447-4be4-9bc3-891590663948', '219ce759-6447-4be4-9bc3-891590663948', '{"sub": "219ce759-6447-4be4-9bc3-891590663948", "email": "luisa.xaxi@gmail.com", "full_name": "Luisa Puntas", "email_verified": false, "phone_verified": false}', 'email', '2026-02-25 12:29:35.085844+00', '2026-02-25 12:29:35.085893+00', '2026-02-25 12:29:35.085893+00', '49c750bc-849e-4af4-9c14-9420d56d51f1');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id", "refresh_token_hmac_key", "refresh_token_counter", "scopes") VALUES
	('45944d43-9714-45ff-8ea3-090953def315', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', '2026-01-13 12:27:55.455052+00', '2026-01-13 12:27:55.455052+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '79.116.134.249', NULL, NULL, NULL, NULL, NULL),
	('9e7747a9-d0e4-48f9-8c2f-201fd78e71cd', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', '2026-01-13 12:35:29.538374+00', '2026-01-13 14:55:05.531369+00', NULL, 'aal1', NULL, '2026-01-13 14:55:05.530452', 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '79.116.134.249', NULL, NULL, NULL, NULL, NULL),
	('5d679fe6-fd5c-45c3-8b8e-51e03b3dd9a3', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', '2026-01-13 14:55:18.767522+00', '2026-01-13 14:55:18.767522+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '79.116.134.249', NULL, NULL, NULL, NULL, NULL),
	('95e9abe4-1555-4f39-a2a9-0571db770f2d', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', '2026-01-14 18:03:03.235732+00', '2026-01-14 19:45:47.787206+00', NULL, 'aal1', NULL, '2026-01-14 19:45:47.785804', 'Mozilla/5.0 (Linux; Android 15; 2312DRAABG Build/AP3A.240905.015.A2; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.192 Mobile Safari/537.36', '79.116.96.50', NULL, NULL, NULL, NULL, NULL),
	('ff46f453-afa0-4e02-a25a-a4edfadc8641', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', '2026-01-14 19:50:21.533051+00', '2026-01-14 19:50:21.533051+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Linux; Android 15; 2312DRAABG Build/AP3A.240905.015.A2; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.192 Mobile Safari/537.36', '79.116.96.50', NULL, NULL, NULL, NULL, NULL),
	('84de6b3f-c20e-4ff0-ac37-0432dbdab592', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', '2026-01-18 10:18:25.005276+00', '2026-01-18 10:18:25.005276+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36  (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36', '79.116.134.249', NULL, NULL, NULL, NULL, NULL),
	('b4ec66df-fe21-426f-ab8d-a0d07b8bdf8d', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', '2026-01-18 10:18:25.070799+00', '2026-01-18 10:18:25.070799+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36  (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36', '79.116.134.249', NULL, NULL, NULL, NULL, NULL),
	('6aa3429f-9d81-4aee-b2ad-6eef1fbf825e', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', '2026-01-18 10:18:25.200746+00', '2026-01-18 10:18:25.200746+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36  (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36', '79.116.134.249', NULL, NULL, NULL, NULL, NULL),
	('5765d060-52e0-496f-a323-00bb68216dea', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', '2026-01-18 10:18:25.578135+00', '2026-01-18 10:18:25.578135+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36  (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36', '79.116.134.249', NULL, NULL, NULL, NULL, NULL),
	('07d13c0d-0ed2-4ea5-b160-720d3124c7d3', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', '2026-01-14 20:00:15.53155+00', '2026-01-16 15:37:40.554896+00', NULL, 'aal1', NULL, '2026-01-16 15:37:40.554143', 'Mozilla/5.0 (Linux; Android 11; SM-A505FN Build/RP1A.200720.012; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.146 Mobile Safari/537.36', '47.62.253.50', NULL, NULL, NULL, NULL, NULL),
	('d1c3052c-1fec-44be-8cbe-e663a10a26b3', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', '2026-01-18 10:18:26.10594+00', '2026-01-18 10:18:26.10594+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36  (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36', '79.116.134.249', NULL, NULL, NULL, NULL, NULL),
	('df1a5dfb-8fa6-4384-945d-2f8dac035dcd', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', '2026-01-14 19:54:47.973734+00', '2026-01-17 13:25:09.125507+00', NULL, 'aal1', NULL, '2026-01-17 13:25:09.125389', 'Mozilla/5.0 (Linux; Android 15; 2312DRAABG Build/AP3A.240905.015.A2; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.192 Mobile Safari/537.36', '79.116.104.50', NULL, NULL, NULL, NULL, NULL),
	('a5b5a036-622c-402e-b4d6-451c5a2c4ece', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', '2026-01-17 13:25:26.512201+00', '2026-01-17 13:25:26.512201+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Linux; Android 15; 2312DRAABG Build/AP3A.240905.015.A2; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.192 Mobile Safari/537.36', '79.116.104.50', NULL, NULL, NULL, NULL, NULL),
	('54f345b4-9058-458f-bd68-17f069dd0dfc', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', '2026-01-18 10:18:23.909363+00', '2026-01-18 10:18:23.909363+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36  (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36', '79.116.134.249', NULL, NULL, NULL, NULL, NULL),
	('19b50c40-c30d-45c1-be24-216bddfb0be8', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', '2026-01-18 10:18:23.977766+00', '2026-01-18 10:18:23.977766+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36  (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36', '79.116.134.249', NULL, NULL, NULL, NULL, NULL),
	('02e03e36-f9de-4527-a4ae-a82fcdf4463a', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', '2026-01-18 10:18:24.015706+00', '2026-01-18 10:18:24.015706+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36  (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36', '79.116.134.249', NULL, NULL, NULL, NULL, NULL),
	('8a84050b-b836-4b69-841d-e1c43a8a6b4b', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', '2026-01-18 10:18:24.186064+00', '2026-01-18 10:18:24.186064+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36  (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36', '79.116.134.249', NULL, NULL, NULL, NULL, NULL),
	('72d38492-7226-48a7-b8f7-b0e2bc4ec38d', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', '2026-01-18 10:18:24.329374+00', '2026-01-18 10:18:24.329374+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36  (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36', '79.116.134.249', NULL, NULL, NULL, NULL, NULL),
	('c4150363-125d-48b0-bba8-9d9444f7d33d', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', '2026-01-18 10:18:24.403129+00', '2026-01-18 10:18:24.403129+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36  (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36', '79.116.134.249', NULL, NULL, NULL, NULL, NULL),
	('59f3f97f-bab6-46d5-b49a-52decc4513b7', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', '2026-01-18 10:18:24.635126+00', '2026-01-18 10:18:24.635126+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36  (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36', '79.116.134.249', NULL, NULL, NULL, NULL, NULL),
	('6b6d0b31-fa88-4313-8629-71297b1a3fa5', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', '2026-01-18 10:18:24.697258+00', '2026-01-18 10:18:24.697258+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36  (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36', '79.116.134.249', NULL, NULL, NULL, NULL, NULL),
	('522d2cb3-33a4-44d5-bad2-5addab39018f', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', '2026-01-18 10:18:24.744847+00', '2026-01-18 10:18:24.744847+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36  (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36', '79.116.134.249', NULL, NULL, NULL, NULL, NULL),
	('1aa0510f-25f0-4b89-a62e-08837e8c3785', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', '2026-01-18 10:18:24.890505+00', '2026-01-18 10:18:24.890505+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36  (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36', '79.116.134.249', NULL, NULL, NULL, NULL, NULL),
	('66ef08db-17cb-41e6-97eb-5d6dce9e2480', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', '2026-01-18 10:18:26.668581+00', '2026-01-18 10:18:26.668581+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36  (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36', '79.116.134.249', NULL, NULL, NULL, NULL, NULL),
	('162f47be-26b1-48bd-9543-a088351470b6', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', '2026-01-18 10:23:16.54301+00', '2026-01-18 10:23:16.54301+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36  (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36', '79.116.134.249', NULL, NULL, NULL, NULL, NULL),
	('e03adabb-cb7b-4fbb-87cb-c3206afc65ce', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', '2026-01-13 15:02:37.711341+00', '2026-01-21 08:18:25.828914+00', NULL, 'aal1', NULL, '2026-01-21 08:18:25.82882', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '79.116.134.249', NULL, NULL, NULL, NULL, NULL),
	('43dff721-fddd-4355-9b4b-e744851fc813', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', '2026-01-18 09:42:13.618442+00', '2026-01-18 10:45:10.225021+00', NULL, 'aal1', NULL, '2026-01-18 10:45:10.223954', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '79.116.134.249', NULL, NULL, NULL, NULL, NULL),
	('f52ae97d-db0b-4761-b240-455fa645fa15', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', '2026-01-18 10:51:29.775798+00', '2026-01-18 10:51:29.775798+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '79.116.134.249', NULL, NULL, NULL, NULL, NULL),
	('f4b179d7-26f2-456b-b90f-41d55f616ffe', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', '2026-01-18 18:39:07.170775+00', '2026-03-03 13:19:09.319099+00', NULL, 'aal1', NULL, '2026-03-03 13:19:09.317726', 'Mozilla/5.0 (Linux; Android 11; SM-A505FN Build/RP1A.200720.012; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/145.0.7632.120 Mobile Safari/537.36', '88.28.0.25', NULL, NULL, NULL, NULL, NULL),
	('c24ac0e1-a244-41f6-b4f1-8a07dc8dce30', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', '2026-01-17 13:27:01.576685+00', '2026-01-21 19:20:59.348991+00', NULL, 'aal1', NULL, '2026-01-21 19:20:59.348895', 'Mozilla/5.0 (Linux; Android 15; 2312DRAABG Build/AP3A.240905.015.A2; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.192 Mobile Safari/537.36', '79.116.145.4', NULL, NULL, NULL, NULL, NULL),
	('fab3cba4-4bd1-44f2-b8e3-4d12e6a17d4c', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', '2026-01-18 09:42:24.753397+00', '2026-01-21 11:03:26.601001+00', NULL, 'aal1', NULL, '2026-01-21 11:03:26.600886', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '79.116.134.249', NULL, NULL, NULL, NULL, NULL),
	('13f6fbe3-87a2-408d-a9d3-66b41a78b390', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', '2026-01-21 08:12:58.148841+00', '2026-01-21 08:12:58.148841+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '79.116.134.249', NULL, NULL, NULL, NULL, NULL),
	('6430f894-ab2c-446f-95be-e3b48ee059b1', 'ae78b385-1334-4a89-9a8c-629469d04d51', '2026-01-21 19:23:07.811144+00', '2026-01-21 19:23:07.811144+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Linux; Android 15; SM-A155F Build/AP3A.240905.015.A2; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/143.0.7499.192 Mobile Safari/537.36', '95.127.66.78', NULL, NULL, NULL, NULL, NULL),
	('79277e5e-06ad-4ca9-96dd-4252437b1b84', 'ad5ba03b-2099-4b3d-9a58-080ed6310212', '2026-02-09 21:09:00.954706+00', '2026-03-03 12:52:41.334712+00', NULL, 'aal1', NULL, '2026-03-03 12:52:41.333666', 'Mozilla/5.0 (Linux; Android 14; V2206 Build/UP1A.231005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/145.0.7632.79 Mobile Safari/537.36', '178.139.170.106', NULL, NULL, NULL, NULL, NULL),
	('a0d88336-f4a3-4d02-80ac-f08cac81a895', '05723cd0-e913-498f-9c23-c1032e985246', '2026-02-16 17:24:06.072127+00', '2026-03-02 08:04:57.50413+00', NULL, 'aal1', NULL, '2026-03-02 08:04:57.504015', 'Mozilla/5.0 (Linux; Android 15; 2312DRA50G Build/AQ3A.240912.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/145.0.7632.79 Mobile Safari/537.36', '79.116.108.24', NULL, NULL, NULL, NULL, NULL),
	('5ae509e0-c2e2-481b-ade7-6a865ef2893c', 'aa1a22b7-801a-48a5-b2ac-8d417438b31d', '2026-02-20 14:54:13.072797+00', '2026-03-02 09:09:59.994427+00', NULL, 'aal1', NULL, '2026-03-02 09:09:59.994315', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '79.116.227.19', NULL, NULL, NULL, NULL, NULL),
	('ee2fdfa4-3006-4253-8a4e-39c2c2640baa', 'aa1a22b7-801a-48a5-b2ac-8d417438b31d', '2026-02-05 18:59:01.40142+00', '2026-02-06 04:44:44.042094+00', NULL, 'aal1', NULL, '2026-02-06 04:44:44.041989', 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_0_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/144.0.7559.95 Mobile/15E148 Safari/604.1', '79.116.227.5', NULL, NULL, NULL, NULL, NULL),
	('88b0e9cf-6d0d-4671-a367-57658276a2df', 'ae78b385-1334-4a89-9a8c-629469d04d51', '2026-01-21 19:24:51.588102+00', '2026-02-25 07:29:02.750898+00', NULL, 'aal1', NULL, '2026-02-25 07:29:02.75079', 'Mozilla/5.0 (Linux; Android 15; SM-A155F Build/AP3A.240905.015.A2; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/145.0.7632.79 Mobile Safari/537.36', '95.124.216.73', NULL, NULL, NULL, NULL, NULL),
	('fc0bdd08-4d03-4814-b0aa-c2a10592538a', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', '2026-01-21 19:22:28.914129+00', '2026-02-02 19:21:59.261292+00', NULL, 'aal1', NULL, '2026-02-02 19:21:59.260551', 'Mozilla/5.0 (Linux; Android 15; 2312DRAABG Build/AP3A.240905.015.A2; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/144.0.7559.59 Mobile Safari/537.36', '79.117.70.148', NULL, NULL, NULL, NULL, NULL),
	('97575bd5-7fdb-4841-ad69-27ea0c02600b', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', '2026-02-02 19:23:27.945625+00', '2026-03-02 17:40:43.742916+00', NULL, 'aal1', NULL, '2026-03-02 17:40:43.742803', 'Mozilla/5.0 (Linux; Android 15; 2312DRAABG Build/AP3A.240905.015.A2; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/145.0.7632.79 Mobile Safari/537.36', '79.116.227.36', NULL, NULL, NULL, NULL, NULL),
	('bf74aa15-a767-42e7-b1fd-ddc5db563b59', '3b99746e-634b-4506-8ccd-6183785d2d64', '2026-02-18 09:14:35.894615+00', '2026-02-18 16:56:38.147868+00', NULL, 'aal1', NULL, '2026-02-18 16:56:38.147763', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Mobile/15E148 Safari/604.1 Ddg/26.3', '217.138.198.166', NULL, NULL, NULL, NULL, NULL),
	('f4963b17-dfe3-4bc1-9aa9-b6d2f50f30b1', 'ee5ed2c4-ab2a-4485-a5cc-cf3db842b8f1', '2026-01-21 19:18:59.2776+00', '2026-03-02 18:01:00.671166+00', NULL, 'aal1', NULL, '2026-03-02 18:01:00.67053', 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_1_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/145.0.7632.108 Mobile/15E148 Safari/604.1', '79.116.122.74', NULL, NULL, NULL, NULL, NULL),
	('9f6e7dfd-6835-412d-b79d-2a2fad56654e', '3b99746e-634b-4506-8ccd-6183785d2d64', '2026-02-24 15:02:47.901323+00', '2026-02-25 12:32:12.128343+00', NULL, 'aal1', NULL, '2026-02-25 12:32:12.128204', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Mobile/15E148 Safari/604.1 Ddg/26.3', '77.243.87.16', NULL, NULL, NULL, NULL, NULL),
	('25d78784-457f-4391-acc1-3cca1319d293', '1a3dce70-bdee-4e67-8784-5f115a416816', '2026-02-03 06:24:24.809741+00', '2026-02-25 15:17:22.87564+00', NULL, 'aal1', NULL, '2026-02-25 15:17:22.875529', 'Mozilla/5.0 (Linux; Android 12; KINGKONG MINI 3 Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/145.0.7632.79 Mobile Safari/537.36', '31.221.137.222', NULL, NULL, NULL, NULL, NULL),
	('f6e6e682-980e-46a9-b1c1-a1ddc70c7858', 'b95a914d-0601-4331-a6a4-c9b84ec3af1c', '2026-02-06 17:53:47.950855+00', '2026-02-23 20:33:26.14868+00', NULL, 'aal1', NULL, '2026-02-23 20:33:26.148576', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1', '31.221.149.12', NULL, NULL, NULL, NULL, NULL),
	('0fd0fb8c-68f4-45c4-bb6e-bd650ed492aa', 'a432650d-3397-423b-a27b-7f5f49fc446c', '2026-02-12 23:50:06.598386+00', '2026-03-02 21:58:55.020435+00', NULL, 'aal1', NULL, '2026-03-02 21:58:55.019039', 'Mozilla/5.0 (Linux; Android 16; 2407FPN8EG Build/BP2A.250605.031.A3; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/145.0.7632.79 Mobile Safari/537.36', '79.116.227.53', NULL, NULL, NULL, NULL, NULL),
	('d8424011-c376-40b3-aaf2-1120067d20fe', '219ce759-6447-4be4-9bc3-891590663948', '2026-02-25 12:29:35.111838+00', '2026-02-27 09:12:11.679102+00', NULL, 'aal1', NULL, '2026-02-27 09:12:11.678986', 'Mozilla/5.0 (Linux; Android 13; CPH2207 Build/TP1A.220905.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/145.0.7632.79 Mobile Safari/537.36', '62.36.127.104', NULL, NULL, NULL, NULL, NULL),
	('3f9425c3-2412-4481-9f15-95498e4cc94c', '0a5df480-a278-481d-a3f9-23f8eda30a33', '2026-02-19 20:52:45.510938+00', '2026-02-19 22:03:10.702759+00', NULL, 'aal1', NULL, '2026-02-19 22:03:10.702648', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.1 Mobile/15E148 Safari/604.1', '104.28.88.133', NULL, NULL, NULL, NULL, NULL),
	('17be8c5f-83f6-47f2-aabb-3c51a6c3f405', '52252b8a-4436-4a65-abb2-2093b1a2c7b7', '2026-02-12 17:52:12.119039+00', '2026-03-03 07:33:05.223586+00', NULL, 'aal1', NULL, '2026-03-03 07:33:05.222686', 'Mozilla/5.0 (Linux; Android 15; REA-NX9 Build/HONORREA-N39; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/145.0.7632.79 Mobile Safari/537.36', '79.116.144.131', NULL, NULL, NULL, NULL, NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('45944d43-9714-45ff-8ea3-090953def315', '2026-01-13 12:27:55.45896+00', '2026-01-13 12:27:55.45896+00', 'password', '256129f0-15c5-4a9a-b969-cfe964481e1b'),
	('9e7747a9-d0e4-48f9-8c2f-201fd78e71cd', '2026-01-13 12:35:29.559523+00', '2026-01-13 12:35:29.559523+00', 'password', 'dcfa8566-5703-40e9-8427-d7fc053c0d15'),
	('5d679fe6-fd5c-45c3-8b8e-51e03b3dd9a3', '2026-01-13 14:55:18.790247+00', '2026-01-13 14:55:18.790247+00', 'password', '527345d8-cefe-4840-a1f1-9593fe1faf3c'),
	('e03adabb-cb7b-4fbb-87cb-c3206afc65ce', '2026-01-13 15:02:37.741062+00', '2026-01-13 15:02:37.741062+00', 'password', '92f1bb45-d313-4c4d-8254-8322fc098f2a'),
	('95e9abe4-1555-4f39-a2a9-0571db770f2d', '2026-01-14 18:03:03.339058+00', '2026-01-14 18:03:03.339058+00', 'password', '49d7252c-c47c-4133-b166-0ca9f7b49906'),
	('ff46f453-afa0-4e02-a25a-a4edfadc8641', '2026-01-14 19:50:21.543594+00', '2026-01-14 19:50:21.543594+00', 'password', 'c7391578-e7d7-4bb9-8f5b-f03d59677e47'),
	('df1a5dfb-8fa6-4384-945d-2f8dac035dcd', '2026-01-14 19:54:48.010746+00', '2026-01-14 19:54:48.010746+00', 'password', '65d9a718-62a8-4bf8-b838-b9cb8c24ab21'),
	('07d13c0d-0ed2-4ea5-b160-720d3124c7d3', '2026-01-14 20:00:15.534966+00', '2026-01-14 20:00:15.534966+00', 'password', '739de1f5-cbb2-4f05-a726-ae326b291875'),
	('a5b5a036-622c-402e-b4d6-451c5a2c4ece', '2026-01-17 13:25:26.530368+00', '2026-01-17 13:25:26.530368+00', 'password', 'd920f7f0-5044-4f83-8532-686875640c66'),
	('c24ac0e1-a244-41f6-b4f1-8a07dc8dce30', '2026-01-17 13:27:01.582069+00', '2026-01-17 13:27:01.582069+00', 'password', 'd14c4923-e5f1-468a-86e6-861f83fd90d9'),
	('43dff721-fddd-4355-9b4b-e744851fc813', '2026-01-18 09:42:13.695919+00', '2026-01-18 09:42:13.695919+00', 'password', '14413bb1-a5a0-4ead-ac40-6964092f7b6d'),
	('fab3cba4-4bd1-44f2-b8e3-4d12e6a17d4c', '2026-01-18 09:42:24.786884+00', '2026-01-18 09:42:24.786884+00', 'password', '08cd472e-1ee1-4c76-8a99-5dd288429361'),
	('54f345b4-9058-458f-bd68-17f069dd0dfc', '2026-01-18 10:18:23.992937+00', '2026-01-18 10:18:23.992937+00', 'password', 'afc260ff-2c7e-4d64-8be1-2666bc927e72'),
	('19b50c40-c30d-45c1-be24-216bddfb0be8', '2026-01-18 10:18:24.014252+00', '2026-01-18 10:18:24.014252+00', 'password', 'd7dc4c79-06b7-4fb6-921c-dfa9143b58c6'),
	('02e03e36-f9de-4527-a4ae-a82fcdf4463a', '2026-01-18 10:18:24.019841+00', '2026-01-18 10:18:24.019841+00', 'password', 'd20bea5b-b6da-4998-b814-dc5b022cd6f3'),
	('8a84050b-b836-4b69-841d-e1c43a8a6b4b', '2026-01-18 10:18:24.190294+00', '2026-01-18 10:18:24.190294+00', 'password', '45f849db-c084-4d15-8bfb-0731773e8fc8'),
	('72d38492-7226-48a7-b8f7-b0e2bc4ec38d', '2026-01-18 10:18:24.33239+00', '2026-01-18 10:18:24.33239+00', 'password', 'f5627afc-76e6-4400-90bf-2601ac91c79c'),
	('c4150363-125d-48b0-bba8-9d9444f7d33d', '2026-01-18 10:18:24.405817+00', '2026-01-18 10:18:24.405817+00', 'password', '0e977584-cf10-4c4f-ad5a-0f3673cf74c4'),
	('59f3f97f-bab6-46d5-b49a-52decc4513b7', '2026-01-18 10:18:24.640549+00', '2026-01-18 10:18:24.640549+00', 'password', 'df5c1f62-9d0f-45fd-962f-1978d1668d16'),
	('6b6d0b31-fa88-4313-8629-71297b1a3fa5', '2026-01-18 10:18:24.701257+00', '2026-01-18 10:18:24.701257+00', 'password', '7609939e-cd11-45c0-a5d1-32b96d6c32f0'),
	('522d2cb3-33a4-44d5-bad2-5addab39018f', '2026-01-18 10:18:24.748597+00', '2026-01-18 10:18:24.748597+00', 'password', '9a517712-19b8-4952-9d8a-3988a6767b76'),
	('1aa0510f-25f0-4b89-a62e-08837e8c3785', '2026-01-18 10:18:24.897502+00', '2026-01-18 10:18:24.897502+00', 'password', 'b4de55f8-7476-4ee4-bdde-233928df56f7'),
	('84de6b3f-c20e-4ff0-ac37-0432dbdab592', '2026-01-18 10:18:25.009573+00', '2026-01-18 10:18:25.009573+00', 'password', '7339fb38-a989-40f2-8a5e-dd1829ea8fdb'),
	('b4ec66df-fe21-426f-ab8d-a0d07b8bdf8d', '2026-01-18 10:18:25.074685+00', '2026-01-18 10:18:25.074685+00', 'password', '7bd837b0-69a4-4110-9035-f2a4817b77ad'),
	('6aa3429f-9d81-4aee-b2ad-6eef1fbf825e', '2026-01-18 10:18:25.202792+00', '2026-01-18 10:18:25.202792+00', 'password', '0f57d928-5c2e-4b2e-b723-29c738080b2c'),
	('5765d060-52e0-496f-a323-00bb68216dea', '2026-01-18 10:18:25.582269+00', '2026-01-18 10:18:25.582269+00', 'password', 'ce3bac6e-46a5-43f5-8d9b-d58d57d36a06'),
	('d1c3052c-1fec-44be-8cbe-e663a10a26b3', '2026-01-18 10:18:26.108629+00', '2026-01-18 10:18:26.108629+00', 'password', 'd6064708-77e0-4f1b-b242-59111eddacd0'),
	('66ef08db-17cb-41e6-97eb-5d6dce9e2480', '2026-01-18 10:18:26.672716+00', '2026-01-18 10:18:26.672716+00', 'password', 'f88cb345-9306-4c5c-a12f-9ba0c77c5d6e'),
	('162f47be-26b1-48bd-9543-a088351470b6', '2026-01-18 10:23:16.547388+00', '2026-01-18 10:23:16.547388+00', 'password', '543aba87-7de2-4153-9239-20ba38c7d3f8'),
	('f52ae97d-db0b-4761-b240-455fa645fa15', '2026-01-18 10:51:29.788108+00', '2026-01-18 10:51:29.788108+00', 'password', '65c91d32-fa60-48e8-97b1-52b9e87b0905'),
	('f4b179d7-26f2-456b-b90f-41d55f616ffe', '2026-01-18 18:39:07.198435+00', '2026-01-18 18:39:07.198435+00', 'password', '9883223f-1ca8-4f58-9000-6026101d3863'),
	('13f6fbe3-87a2-408d-a9d3-66b41a78b390', '2026-01-21 08:12:58.169175+00', '2026-01-21 08:12:58.169175+00', 'password', '9d9366b5-6b47-4fcd-aee7-63d6bfffb26e'),
	('f4963b17-dfe3-4bc1-9aa9-b6d2f50f30b1', '2026-01-21 19:18:59.33612+00', '2026-01-21 19:18:59.33612+00', 'password', '3bdc86c2-935f-4d04-9d8a-c8e5d2780e8d'),
	('fc0bdd08-4d03-4814-b0aa-c2a10592538a', '2026-01-21 19:22:28.918087+00', '2026-01-21 19:22:28.918087+00', 'password', '95517097-a8bd-4870-811e-f2383b6096d7'),
	('6430f894-ab2c-446f-95be-e3b48ee059b1', '2026-01-21 19:23:07.813254+00', '2026-01-21 19:23:07.813254+00', 'password', '34624fe1-7300-499e-93fd-252f8c7ff4b1'),
	('88b0e9cf-6d0d-4671-a367-57658276a2df', '2026-01-21 19:24:51.605272+00', '2026-01-21 19:24:51.605272+00', 'password', '514300b7-a7b6-4bdc-a0fe-e26a7777092e'),
	('97575bd5-7fdb-4841-ad69-27ea0c02600b', '2026-02-02 19:23:27.989274+00', '2026-02-02 19:23:27.989274+00', 'password', 'fd4c27a0-ce52-4db2-9748-427ac9e5c698'),
	('25d78784-457f-4391-acc1-3cca1319d293', '2026-02-03 06:24:24.83006+00', '2026-02-03 06:24:24.83006+00', 'password', '025d57ce-5fe4-492f-b439-dc7e794b05ad'),
	('ee2fdfa4-3006-4253-8a4e-39c2c2640baa', '2026-02-05 18:59:01.43889+00', '2026-02-05 18:59:01.43889+00', 'oauth', '561a09ea-c719-496d-9d43-6b43d7fa6ebc'),
	('f6e6e682-980e-46a9-b1c1-a1ddc70c7858', '2026-02-06 17:53:47.989297+00', '2026-02-06 17:53:47.989297+00', 'password', '7f21bfa4-c549-4c5a-a1ea-b3bf4cefc340'),
	('79277e5e-06ad-4ca9-96dd-4252437b1b84', '2026-02-09 21:09:00.964944+00', '2026-02-09 21:09:00.964944+00', 'password', '493a9ca0-51b3-41e9-924c-10b34b612f4c'),
	('17be8c5f-83f6-47f2-aabb-3c51a6c3f405', '2026-02-12 17:52:12.143291+00', '2026-02-12 17:52:12.143291+00', 'password', '91776123-a0d5-4de5-b4dc-b34f5fd64184'),
	('0fd0fb8c-68f4-45c4-bb6e-bd650ed492aa', '2026-02-12 23:50:06.62329+00', '2026-02-12 23:50:06.62329+00', 'password', '82f469e3-96af-42ce-b73d-882ddf8b1dd8'),
	('a0d88336-f4a3-4d02-80ac-f08cac81a895', '2026-02-16 17:24:06.104339+00', '2026-02-16 17:24:06.104339+00', 'oauth', '77bdafdc-d1c2-4ce8-9833-8e845218e5fd'),
	('bf74aa15-a767-42e7-b1fd-ddc5db563b59', '2026-02-18 09:14:35.947711+00', '2026-02-18 09:14:35.947711+00', 'password', '5e39c16b-abc9-4c41-8dac-73ef4f181213'),
	('3f9425c3-2412-4481-9f15-95498e4cc94c', '2026-02-19 20:52:45.541841+00', '2026-02-19 20:52:45.541841+00', 'oauth', '68f3d954-e0ca-4e90-a1f2-f2ae63a58c9e'),
	('5ae509e0-c2e2-481b-ade7-6a865ef2893c', '2026-02-20 14:54:13.138879+00', '2026-02-20 14:54:13.138879+00', 'oauth', 'a43685e5-17c9-43cc-987f-fda6918f6691'),
	('9f6e7dfd-6835-412d-b79d-2a2fad56654e', '2026-02-24 15:02:47.968093+00', '2026-02-24 15:02:47.968093+00', 'password', '5d3c46d6-93aa-4329-bfe2-1c2f7bb7f676'),
	('d8424011-c376-40b3-aaf2-1120067d20fe', '2026-02-25 12:29:35.136893+00', '2026-02-25 12:29:35.136893+00', 'password', '52e2d539-9457-47b9-a66c-2d9be7876994');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 362, 'nwkd4w6he3ft', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-17 11:19:25.724202+00', '2026-02-17 17:12:24.704202+00', 'l4ac3fnt42kp', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 360, 'ucefxbjqag4u', 'b95a914d-0601-4331-a6a4-c9b84ec3af1c', true, '2026-02-16 20:24:43.439284+00', '2026-02-17 21:55:55.54657+00', '75ujkk6f5lg2', 'f6e6e682-980e-46a9-b1c1-a1ddc70c7858'),
	('00000000-0000-0000-0000-000000000000', 197, '4bg73fd5vjeh', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', false, '2026-01-13 12:27:55.457078+00', '2026-01-13 12:27:55.457078+00', NULL, '45944d43-9714-45ff-8ea3-090953def315'),
	('00000000-0000-0000-0000-000000000000', 198, '6i4wbbzrjszi', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-01-13 12:35:29.552081+00', '2026-01-13 13:33:35.652538+00', NULL, '9e7747a9-d0e4-48f9-8c2f-201fd78e71cd'),
	('00000000-0000-0000-0000-000000000000', 199, 'fnezxkvm2gm6', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-01-13 13:33:35.66795+00', '2026-01-13 14:55:05.455929+00', '6i4wbbzrjszi', '9e7747a9-d0e4-48f9-8c2f-201fd78e71cd'),
	('00000000-0000-0000-0000-000000000000', 200, 'iks74v4chn6s', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', false, '2026-01-13 14:55:05.488665+00', '2026-01-13 14:55:05.488665+00', 'fnezxkvm2gm6', '9e7747a9-d0e4-48f9-8c2f-201fd78e71cd'),
	('00000000-0000-0000-0000-000000000000', 201, 'yj43htjq262w', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', false, '2026-01-13 14:55:18.785297+00', '2026-01-13 14:55:18.785297+00', NULL, '5d679fe6-fd5c-45c3-8b8e-51e03b3dd9a3'),
	('00000000-0000-0000-0000-000000000000', 203, 'esl5jlwkjyt4', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', true, '2026-01-14 18:03:03.287094+00', '2026-01-14 19:45:47.71603+00', NULL, '95e9abe4-1555-4f39-a2a9-0571db770f2d'),
	('00000000-0000-0000-0000-000000000000', 204, 'yo7spueejk43', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', false, '2026-01-14 19:45:47.746613+00', '2026-01-14 19:45:47.746613+00', 'esl5jlwkjyt4', '95e9abe4-1555-4f39-a2a9-0571db770f2d'),
	('00000000-0000-0000-0000-000000000000', 205, 'vlqvdcfpzvie', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', false, '2026-01-14 19:50:21.539688+00', '2026-01-14 19:50:21.539688+00', NULL, 'ff46f453-afa0-4e02-a25a-a4edfadc8641'),
	('00000000-0000-0000-0000-000000000000', 208, 'uo4x4szezzxb', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-01-14 20:00:15.533676+00', '2026-01-15 14:44:13.560956+00', NULL, '07d13c0d-0ed2-4ea5-b160-720d3124c7d3'),
	('00000000-0000-0000-0000-000000000000', 206, 'htegsawmwqxx', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', true, '2026-01-14 19:54:47.996368+00', '2026-01-15 16:14:16.909672+00', NULL, 'df1a5dfb-8fa6-4384-945d-2f8dac035dcd'),
	('00000000-0000-0000-0000-000000000000', 211, 'ucuflj5ig4ln', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', true, '2026-01-15 16:14:16.935385+00', '2026-01-15 19:49:25.149221+00', 'htegsawmwqxx', 'df1a5dfb-8fa6-4384-945d-2f8dac035dcd'),
	('00000000-0000-0000-0000-000000000000', 210, 'y5q2fmucxd64', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-01-15 14:44:13.588165+00', '2026-01-15 20:03:49.786281+00', 'uo4x4szezzxb', '07d13c0d-0ed2-4ea5-b160-720d3124c7d3'),
	('00000000-0000-0000-0000-000000000000', 213, 'lpgniarspd2s', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-01-15 20:03:49.806914+00', '2026-01-16 15:37:40.467193+00', 'y5q2fmucxd64', '07d13c0d-0ed2-4ea5-b160-720d3124c7d3'),
	('00000000-0000-0000-0000-000000000000', 212, 'qp6aalbxjq5z', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', true, '2026-01-15 19:49:25.18436+00', '2026-01-16 20:27:13.968781+00', 'ucuflj5ig4ln', 'df1a5dfb-8fa6-4384-945d-2f8dac035dcd'),
	('00000000-0000-0000-0000-000000000000', 215, '237vjufek4ki', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', true, '2026-01-16 20:27:13.997889+00', '2026-01-17 13:25:09.040693+00', 'qp6aalbxjq5z', 'df1a5dfb-8fa6-4384-945d-2f8dac035dcd'),
	('00000000-0000-0000-0000-000000000000', 216, 'rzspbe77ggsh', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', false, '2026-01-17 13:25:09.084096+00', '2026-01-17 13:25:09.084096+00', '237vjufek4ki', 'df1a5dfb-8fa6-4384-945d-2f8dac035dcd'),
	('00000000-0000-0000-0000-000000000000', 217, 'r4ebwph5liqq', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', false, '2026-01-17 13:25:26.528429+00', '2026-01-17 13:25:26.528429+00', NULL, 'a5b5a036-622c-402e-b4d6-451c5a2c4ece'),
	('00000000-0000-0000-0000-000000000000', 221, 'yqrhnm3u7v5l', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', false, '2026-01-18 10:18:23.95483+00', '2026-01-18 10:18:23.95483+00', NULL, '54f345b4-9058-458f-bd68-17f069dd0dfc'),
	('00000000-0000-0000-0000-000000000000', 222, 'olavlo5ahnny', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', false, '2026-01-18 10:18:23.984268+00', '2026-01-18 10:18:23.984268+00', NULL, '19b50c40-c30d-45c1-be24-216bddfb0be8'),
	('00000000-0000-0000-0000-000000000000', 223, 't3rvpekxkruj', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', false, '2026-01-18 10:18:24.017122+00', '2026-01-18 10:18:24.017122+00', NULL, '02e03e36-f9de-4527-a4ae-a82fcdf4463a'),
	('00000000-0000-0000-0000-000000000000', 224, '67n4wbalwbnk', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', false, '2026-01-18 10:18:24.187106+00', '2026-01-18 10:18:24.187106+00', NULL, '8a84050b-b836-4b69-841d-e1c43a8a6b4b'),
	('00000000-0000-0000-0000-000000000000', 225, '4n47ht4zkpqz', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', false, '2026-01-18 10:18:24.330419+00', '2026-01-18 10:18:24.330419+00', NULL, '72d38492-7226-48a7-b8f7-b0e2bc4ec38d'),
	('00000000-0000-0000-0000-000000000000', 226, 'u7hrsclzdjnh', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', false, '2026-01-18 10:18:24.404365+00', '2026-01-18 10:18:24.404365+00', NULL, 'c4150363-125d-48b0-bba8-9d9444f7d33d'),
	('00000000-0000-0000-0000-000000000000', 227, 'ovxv43o7g5li', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', false, '2026-01-18 10:18:24.637934+00', '2026-01-18 10:18:24.637934+00', NULL, '59f3f97f-bab6-46d5-b49a-52decc4513b7'),
	('00000000-0000-0000-0000-000000000000', 228, 'fy7t4z6kdiym', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', false, '2026-01-18 10:18:24.69944+00', '2026-01-18 10:18:24.69944+00', NULL, '6b6d0b31-fa88-4313-8629-71297b1a3fa5'),
	('00000000-0000-0000-0000-000000000000', 229, 'tdrjq2ydufyb', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', false, '2026-01-18 10:18:24.746522+00', '2026-01-18 10:18:24.746522+00', NULL, '522d2cb3-33a4-44d5-bad2-5addab39018f'),
	('00000000-0000-0000-0000-000000000000', 230, 'hc2uadae2nrc', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', false, '2026-01-18 10:18:24.895496+00', '2026-01-18 10:18:24.895496+00', NULL, '1aa0510f-25f0-4b89-a62e-08837e8c3785'),
	('00000000-0000-0000-0000-000000000000', 231, 'ymvwuqzbr5xn', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', false, '2026-01-18 10:18:25.006346+00', '2026-01-18 10:18:25.006346+00', NULL, '84de6b3f-c20e-4ff0-ac37-0432dbdab592'),
	('00000000-0000-0000-0000-000000000000', 232, 'a2mnjprsenyj', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', false, '2026-01-18 10:18:25.07269+00', '2026-01-18 10:18:25.07269+00', NULL, 'b4ec66df-fe21-426f-ab8d-a0d07b8bdf8d'),
	('00000000-0000-0000-0000-000000000000', 233, 'gxobrbbqj4gk', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', false, '2026-01-18 10:18:25.201669+00', '2026-01-18 10:18:25.201669+00', NULL, '6aa3429f-9d81-4aee-b2ad-6eef1fbf825e'),
	('00000000-0000-0000-0000-000000000000', 234, 'm2qkxhfot7l6', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', false, '2026-01-18 10:18:25.580995+00', '2026-01-18 10:18:25.580995+00', NULL, '5765d060-52e0-496f-a323-00bb68216dea'),
	('00000000-0000-0000-0000-000000000000', 235, 'doum6tm3pqoz', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', false, '2026-01-18 10:18:26.106756+00', '2026-01-18 10:18:26.106756+00', NULL, 'd1c3052c-1fec-44be-8cbe-e663a10a26b3'),
	('00000000-0000-0000-0000-000000000000', 236, 'tepszissvujp', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', false, '2026-01-18 10:18:26.670113+00', '2026-01-18 10:18:26.670113+00', NULL, '66ef08db-17cb-41e6-97eb-5d6dce9e2480'),
	('00000000-0000-0000-0000-000000000000', 239, 'tnm2c6kx7bn6', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', false, '2026-01-18 10:23:16.545255+00', '2026-01-18 10:23:16.545255+00', NULL, '162f47be-26b1-48bd-9543-a088351470b6'),
	('00000000-0000-0000-0000-000000000000', 220, 'iqp3edd2r22m', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', true, '2026-01-18 09:42:24.774934+00', '2026-01-18 10:45:10.175106+00', NULL, 'fab3cba4-4bd1-44f2-b8e3-4d12e6a17d4c'),
	('00000000-0000-0000-0000-000000000000', 219, '5ydi2dl2uffs', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-01-18 09:42:13.663201+00', '2026-01-18 10:45:10.175158+00', NULL, '43dff721-fddd-4355-9b4b-e744851fc813'),
	('00000000-0000-0000-0000-000000000000', 240, 'huuhwnbj5emg', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', false, '2026-01-18 10:45:10.197183+00', '2026-01-18 10:45:10.197183+00', '5ydi2dl2uffs', '43dff721-fddd-4355-9b4b-e744851fc813'),
	('00000000-0000-0000-0000-000000000000', 242, '5ouewtl6gr55', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', false, '2026-01-18 10:51:29.783509+00', '2026-01-18 10:51:29.783509+00', NULL, 'f52ae97d-db0b-4761-b240-455fa645fa15'),
	('00000000-0000-0000-0000-000000000000', 218, 'vo7tpf2we5ou', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', true, '2026-01-17 13:27:01.580152+00', '2026-01-18 16:38:20.040865+00', NULL, 'c24ac0e1-a244-41f6-b4f1-8a07dc8dce30'),
	('00000000-0000-0000-0000-000000000000', 214, 'u3wo5gu6xhe2', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-01-16 15:37:40.508555+00', '2026-01-18 18:38:24.580363+00', 'lpgniarspd2s', '07d13c0d-0ed2-4ea5-b160-720d3124c7d3'),
	('00000000-0000-0000-0000-000000000000', 244, 'tden4rdo2nb5', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-01-18 18:39:07.191029+00', '2026-01-19 18:37:24.416707+00', NULL, 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 243, 'i6jkyhks273g', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', true, '2026-01-18 16:38:20.07577+00', '2026-01-19 18:37:39.821169+00', 'vo7tpf2we5ou', 'c24ac0e1-a244-41f6-b4f1-8a07dc8dce30'),
	('00000000-0000-0000-0000-000000000000', 245, 'pzh4sz6db4jh', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-01-19 18:37:24.454935+00', '2026-01-20 19:33:05.938407+00', 'tden4rdo2nb5', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 241, '77gaczuuonew', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', true, '2026-01-18 10:45:10.194776+00', '2026-01-21 08:12:42.947406+00', 'iqp3edd2r22m', 'fab3cba4-4bd1-44f2-b8e3-4d12e6a17d4c'),
	('00000000-0000-0000-0000-000000000000', 249, 'siino7qsjakl', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', false, '2026-01-21 08:12:58.163421+00', '2026-01-21 08:12:58.163421+00', NULL, '13f6fbe3-87a2-408d-a9d3-66b41a78b390'),
	('00000000-0000-0000-0000-000000000000', 202, 'enh5qucpynd3', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-01-13 15:02:37.728506+00', '2026-01-21 08:18:25.819941+00', NULL, 'e03adabb-cb7b-4fbb-87cb-c3206afc65ce'),
	('00000000-0000-0000-0000-000000000000', 248, 'ofqwgrpbpk3g', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', true, '2026-01-21 08:12:42.979416+00', '2026-01-21 11:03:26.548982+00', '77gaczuuonew', 'fab3cba4-4bd1-44f2-b8e3-4d12e6a17d4c'),
	('00000000-0000-0000-0000-000000000000', 247, '7teyj4npnt7q', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-01-20 19:33:05.975158+00', '2026-01-21 17:30:46.099065+00', 'pzh4sz6db4jh', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 246, 'n2xze3awqcll', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', true, '2026-01-19 18:37:39.822165+00', '2026-01-21 19:20:59.337382+00', 'i6jkyhks273g', 'c24ac0e1-a244-41f6-b4f1-8a07dc8dce30'),
	('00000000-0000-0000-0000-000000000000', 250, '6soetgikzno7', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', false, '2026-01-21 08:18:25.822805+00', '2026-01-21 08:18:25.822805+00', 'enh5qucpynd3', 'e03adabb-cb7b-4fbb-87cb-c3206afc65ce'),
	('00000000-0000-0000-0000-000000000000', 251, 'h7bpamnc5mjl', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', false, '2026-01-21 11:03:26.570433+00', '2026-01-21 11:03:26.570433+00', 'ofqwgrpbpk3g', 'fab3cba4-4bd1-44f2-b8e3-4d12e6a17d4c'),
	('00000000-0000-0000-0000-000000000000', 276, 'idjri2jznjbl', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', true, '2026-01-29 19:33:10.780476+00', '2026-02-01 18:44:55.40323+00', 'qhutuqcdjxzy', 'fc0bdd08-4d03-4814-b0aa-c2a10592538a'),
	('00000000-0000-0000-0000-000000000000', 275, 'qtvmsfx3tdhh', 'ae78b385-1334-4a89-9a8c-629469d04d51', true, '2026-01-29 19:26:05.984903+00', '2026-02-02 08:01:29.162946+00', 'zhih3ruolwnd', '88b0e9cf-6d0d-4671-a367-57658276a2df'),
	('00000000-0000-0000-0000-000000000000', 254, '4lqbcyenx3or', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', false, '2026-01-21 19:20:59.341356+00', '2026-01-21 19:20:59.341356+00', 'n2xze3awqcll', 'c24ac0e1-a244-41f6-b4f1-8a07dc8dce30'),
	('00000000-0000-0000-0000-000000000000', 279, '2jt4atfcf42j', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', true, '2026-02-01 18:44:55.420908+00', '2026-02-02 19:21:59.224413+00', 'idjri2jznjbl', 'fc0bdd08-4d03-4814-b0aa-c2a10592538a'),
	('00000000-0000-0000-0000-000000000000', 281, '55yftb4yw6yw', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', false, '2026-02-02 19:21:59.238734+00', '2026-02-02 19:21:59.238734+00', '2jt4atfcf42j', 'fc0bdd08-4d03-4814-b0aa-c2a10592538a'),
	('00000000-0000-0000-0000-000000000000', 278, '7lszoh44cau5', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-01-30 22:31:11.820629+00', '2026-02-02 19:22:04.194821+00', '4wm64dfh3rnt', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 259, 'wuwjtl6ken5u', 'ae78b385-1334-4a89-9a8c-629469d04d51', false, '2026-01-21 19:23:07.811972+00', '2026-01-21 19:23:07.811972+00', NULL, '6430f894-ab2c-446f-95be-e3b48ee059b1'),
	('00000000-0000-0000-0000-000000000000', 253, 'ssbjffkh42xr', 'ee5ed2c4-ab2a-4485-a5cc-cf3db842b8f1', true, '2026-01-21 19:18:59.305028+00', '2026-01-21 21:36:51.935292+00', NULL, 'f4963b17-dfe3-4bc1-9aa9-b6d2f50f30b1'),
	('00000000-0000-0000-0000-000000000000', 252, 'tcdhtlctezo3', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-01-21 17:30:46.120377+00', '2026-01-22 17:08:04.20601+00', '7teyj4npnt7q', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 258, 'iqldb67uxdsd', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', true, '2026-01-21 19:22:28.915905+00', '2026-01-22 19:27:50.249839+00', NULL, 'fc0bdd08-4d03-4814-b0aa-c2a10592538a'),
	('00000000-0000-0000-0000-000000000000', 282, 'way2sywln3nz', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-02 19:22:04.195208+00', '2026-02-02 21:07:58.039084+00', '7lszoh44cau5', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 262, 'd3uhxxjt3fa5', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-01-22 17:08:04.237173+00', '2026-01-22 22:55:44.573882+00', 'tcdhtlctezo3', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 264, '7ijtszqx55eu', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-01-22 22:55:44.592989+00', '2026-01-25 18:45:55.87513+00', 'd3uhxxjt3fa5', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 263, 'snz7nqz2iqxc', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', true, '2026-01-22 19:27:50.263642+00', '2026-01-26 11:02:11.657758+00', 'iqldb67uxdsd', 'fc0bdd08-4d03-4814-b0aa-c2a10592538a'),
	('00000000-0000-0000-0000-000000000000', 280, 'otwubwo2mzfp', 'ae78b385-1334-4a89-9a8c-629469d04d51', true, '2026-02-02 08:01:29.187791+00', '2026-02-03 09:25:24.476008+00', 'qtvmsfx3tdhh', '88b0e9cf-6d0d-4671-a367-57658276a2df'),
	('00000000-0000-0000-0000-000000000000', 260, 'b3beerdmam6x', 'ae78b385-1334-4a89-9a8c-629469d04d51', true, '2026-01-21 19:24:51.59971+00', '2026-01-26 15:40:58.597798+00', NULL, '88b0e9cf-6d0d-4671-a367-57658276a2df'),
	('00000000-0000-0000-0000-000000000000', 265, 'qo25wgpfdpg6', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-01-25 18:45:55.911567+00', '2026-01-26 16:47:02.629661+00', '7ijtszqx55eu', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 285, 'smrjbhpzr5gs', '1a3dce70-bdee-4e67-8784-5f115a416816', true, '2026-02-03 06:24:24.817817+00', '2026-02-03 11:10:54.069574+00', NULL, '25d78784-457f-4391-acc1-3cca1319d293'),
	('00000000-0000-0000-0000-000000000000', 268, 'kknw2nm7xhyz', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-01-26 16:47:02.644974+00', '2026-01-26 19:47:36.930715+00', 'qo25wgpfdpg6', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 269, 'fgrxbvttkhnw', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-01-26 19:47:36.945234+00', '2026-01-28 16:07:38.496463+00', 'kknw2nm7xhyz', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 287, 'f5zfvqdixd67', '1a3dce70-bdee-4e67-8784-5f115a416816', true, '2026-02-03 11:10:54.074633+00', '2026-02-03 13:04:33.827107+00', 'smrjbhpzr5gs', '25d78784-457f-4391-acc1-3cca1319d293'),
	('00000000-0000-0000-0000-000000000000', 267, 'nj74ni6ykupp', 'ae78b385-1334-4a89-9a8c-629469d04d51', true, '2026-01-26 15:40:58.635274+00', '2026-01-28 16:08:49.489473+00', 'b3beerdmam6x', '88b0e9cf-6d0d-4671-a367-57658276a2df'),
	('00000000-0000-0000-0000-000000000000', 266, 'i4ycaebfswz7', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', true, '2026-01-26 11:02:11.691526+00', '2026-01-28 18:08:20.268188+00', 'snz7nqz2iqxc', 'fc0bdd08-4d03-4814-b0aa-c2a10592538a'),
	('00000000-0000-0000-0000-000000000000', 284, 'jrhywwklzmmz', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-02 21:07:58.040658+00', '2026-02-03 17:50:19.50825+00', 'way2sywln3nz', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 270, '6pxldtcmz32f', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-01-28 16:07:38.517897+00', '2026-01-28 20:44:47.235676+00', 'fgrxbvttkhnw', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 273, 'ubnestoxnahu', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-01-28 20:44:47.250531+00', '2026-01-29 17:46:57.436576+00', '6pxldtcmz32f', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 288, 'z4fezhrpatst', '1a3dce70-bdee-4e67-8784-5f115a416816', true, '2026-02-03 13:04:33.833135+00', '2026-02-03 17:58:40.123332+00', 'f5zfvqdixd67', '25d78784-457f-4391-acc1-3cca1319d293'),
	('00000000-0000-0000-0000-000000000000', 271, 'zhih3ruolwnd', 'ae78b385-1334-4a89-9a8c-629469d04d51', true, '2026-01-28 16:08:49.498367+00', '2026-01-29 19:26:05.967866+00', 'nj74ni6ykupp', '88b0e9cf-6d0d-4671-a367-57658276a2df'),
	('00000000-0000-0000-0000-000000000000', 272, 'qhutuqcdjxzy', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', true, '2026-01-28 18:08:20.285773+00', '2026-01-29 19:33:10.771245+00', 'i4ycaebfswz7', 'fc0bdd08-4d03-4814-b0aa-c2a10592538a'),
	('00000000-0000-0000-0000-000000000000', 274, '3z3wk6ccdvx6', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-01-29 17:46:57.459475+00', '2026-01-29 20:05:27.402958+00', 'ubnestoxnahu', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 277, '4wm64dfh3rnt', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-01-29 20:05:27.424178+00', '2026-01-30 22:31:11.786943+00', '3z3wk6ccdvx6', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 289, 'v2v5uevkkfdi', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-03 17:50:19.513546+00', '2026-02-03 19:28:36.04854+00', 'jrhywwklzmmz', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 290, 'pacszoydhku6', '1a3dce70-bdee-4e67-8784-5f115a416816', true, '2026-02-03 17:58:40.126754+00', '2026-02-03 19:38:05.587891+00', 'z4fezhrpatst', '25d78784-457f-4391-acc1-3cca1319d293'),
	('00000000-0000-0000-0000-000000000000', 291, 'ijyahllsqp4g', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-03 19:28:36.058026+00', '2026-02-04 17:28:14.750577+00', 'v2v5uevkkfdi', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 293, 'vwgpp2kuhxa6', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-04 17:28:14.782302+00', '2026-02-04 22:45:54.610767+00', 'ijyahllsqp4g', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 294, 'bxtruloqr5ge', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-04 22:45:54.636799+00', '2026-02-05 14:04:18.809985+00', 'vwgpp2kuhxa6', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 283, 'q7pmwyjyt7nr', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', true, '2026-02-02 19:23:27.976425+00', '2026-02-05 14:51:38.311235+00', NULL, '97575bd5-7fdb-4841-ad69-27ea0c02600b'),
	('00000000-0000-0000-0000-000000000000', 295, 'g7cprnmve7lk', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-05 14:04:18.8339+00', '2026-02-05 17:11:59.619412+00', 'bxtruloqr5ge', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 286, 's7nfkohir5wo', 'ae78b385-1334-4a89-9a8c-629469d04d51', true, '2026-02-03 09:25:24.496869+00', '2026-02-05 17:40:14.361007+00', 'otwubwo2mzfp', '88b0e9cf-6d0d-4671-a367-57658276a2df'),
	('00000000-0000-0000-0000-000000000000', 296, 'njsqtppisdeo', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', true, '2026-02-05 14:51:38.327945+00', '2026-02-05 18:19:15.106034+00', 'q7pmwyjyt7nr', '97575bd5-7fdb-4841-ad69-27ea0c02600b'),
	('00000000-0000-0000-0000-000000000000', 297, 'pp35iufahqs2', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-05 17:11:59.635628+00', '2026-02-05 19:33:26.06326+00', 'g7cprnmve7lk', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 299, 'si7ph5nkumf2', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', true, '2026-02-05 18:19:15.121761+00', '2026-02-05 19:35:07.22343+00', 'njsqtppisdeo', '97575bd5-7fdb-4841-ad69-27ea0c02600b'),
	('00000000-0000-0000-0000-000000000000', 300, 'yrvmxf36rpxe', 'aa1a22b7-801a-48a5-b2ac-8d417438b31d', true, '2026-02-05 18:59:01.420182+00', '2026-02-05 20:49:26.44724+00', NULL, 'ee2fdfa4-3006-4253-8a4e-39c2c2640baa'),
	('00000000-0000-0000-0000-000000000000', 301, 'vnw37msvwxou', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-05 19:33:26.077617+00', '2026-02-05 22:00:46.968896+00', 'pp35iufahqs2', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 303, 'gk4kn4lwecr3', 'aa1a22b7-801a-48a5-b2ac-8d417438b31d', true, '2026-02-05 20:49:26.461244+00', '2026-02-06 04:44:44.007845+00', 'yrvmxf36rpxe', 'ee2fdfa4-3006-4253-8a4e-39c2c2640baa'),
	('00000000-0000-0000-0000-000000000000', 298, 'dxgcbpmn4ru5', 'ae78b385-1334-4a89-9a8c-629469d04d51', true, '2026-02-05 17:40:14.384309+00', '2026-02-07 16:24:24.994562+00', 's7nfkohir5wo', '88b0e9cf-6d0d-4671-a367-57658276a2df'),
	('00000000-0000-0000-0000-000000000000', 292, 'd7gh5uwx54w3', '1a3dce70-bdee-4e67-8784-5f115a416816', true, '2026-02-03 19:38:05.602115+00', '2026-02-09 11:11:09.898608+00', 'pacszoydhku6', '25d78784-457f-4391-acc1-3cca1319d293'),
	('00000000-0000-0000-0000-000000000000', 302, '5h4hzvmxwidu', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', true, '2026-02-05 19:35:07.224444+00', '2026-02-10 16:26:00.283289+00', 'si7ph5nkumf2', '97575bd5-7fdb-4841-ad69-27ea0c02600b'),
	('00000000-0000-0000-0000-000000000000', 261, '4o7pfmharq3t', 'ee5ed2c4-ab2a-4485-a5cc-cf3db842b8f1', true, '2026-01-21 21:36:51.959313+00', '2026-02-11 17:09:44.410598+00', 'ssbjffkh42xr', 'f4963b17-dfe3-4bc1-9aa9-b6d2f50f30b1'),
	('00000000-0000-0000-0000-000000000000', 327, '75ujkk6f5lg2', 'b95a914d-0601-4331-a6a4-c9b84ec3af1c', true, '2026-02-10 19:28:11.0775+00', '2026-02-16 20:24:43.417288+00', 'jhabuckyws2f', 'f6e6e682-980e-46a9-b1c1-a1ddc70c7858'),
	('00000000-0000-0000-0000-000000000000', 305, '7mriwp7g7eud', 'aa1a22b7-801a-48a5-b2ac-8d417438b31d', false, '2026-02-06 04:44:44.02111+00', '2026-02-06 04:44:44.02111+00', 'gk4kn4lwecr3', 'ee2fdfa4-3006-4253-8a4e-39c2c2640baa'),
	('00000000-0000-0000-0000-000000000000', 304, 'o5e7rumuzvgf', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-05 22:00:46.982793+00', '2026-02-06 09:55:17.057088+00', 'vnw37msvwxou', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 336, '5pbkwwmyhfea', 'ad5ba03b-2099-4b3d-9a58-080ed6310212', true, '2026-02-11 21:44:42.297146+00', '2026-02-17 11:21:26.660619+00', 'd2g5j366oylr', '79277e5e-06ad-4ca9-96dd-4252437b1b84'),
	('00000000-0000-0000-0000-000000000000', 340, '6ggpi4kef2ti', '52252b8a-4436-4a65-abb2-2093b1a2c7b7', true, '2026-02-12 17:52:12.133195+00', '2026-02-17 13:38:12.175581+00', NULL, '17be8c5f-83f6-47f2-aabb-3c51a6c3f405'),
	('00000000-0000-0000-0000-000000000000', 306, 'dflkxoin6dmb', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-06 09:55:17.088047+00', '2026-02-06 20:58:01.352329+00', 'o5e7rumuzvgf', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 331, 'srf5guh6qkk2', '1a3dce70-bdee-4e67-8784-5f115a416816', true, '2026-02-11 17:03:29.174183+00', '2026-02-23 12:58:14.966948+00', 'g6vpmqnmzgww', '25d78784-457f-4391-acc1-3cca1319d293'),
	('00000000-0000-0000-0000-000000000000', 307, '624juo4t3koy', 'b95a914d-0601-4331-a6a4-c9b84ec3af1c', true, '2026-02-06 17:53:47.96429+00', '2026-02-06 22:18:17.957332+00', NULL, 'f6e6e682-980e-46a9-b1c1-a1ddc70c7858'),
	('00000000-0000-0000-0000-000000000000', 341, 'gqymr23hjx5v', 'ee5ed2c4-ab2a-4485-a5cc-cf3db842b8f1', true, '2026-02-12 19:40:07.893837+00', '2026-03-02 18:01:00.619439+00', 'tdtmanumkxsy', 'f4963b17-dfe3-4bc1-9aa9-b6d2f50f30b1'),
	('00000000-0000-0000-0000-000000000000', 309, 'g3wzdgkyyc36', 'b95a914d-0601-4331-a6a4-c9b84ec3af1c', true, '2026-02-06 22:18:17.970465+00', '2026-02-07 21:07:11.040529+00', '624juo4t3koy', 'f6e6e682-980e-46a9-b1c1-a1ddc70c7858'),
	('00000000-0000-0000-0000-000000000000', 311, 'pt72c37vttco', 'b95a914d-0601-4331-a6a4-c9b84ec3af1c', true, '2026-02-07 21:07:11.055928+00', '2026-02-08 04:59:41.756767+00', 'g3wzdgkyyc36', 'f6e6e682-980e-46a9-b1c1-a1ddc70c7858'),
	('00000000-0000-0000-0000-000000000000', 308, 'lrcpsk6nrw7t', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-06 20:58:01.368439+00', '2026-02-08 22:07:26.330029+00', 'dflkxoin6dmb', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 313, 'zesurohudink', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-08 22:07:26.358853+00', '2026-02-09 14:05:41.778131+00', 'lrcpsk6nrw7t', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 315, 'ndqrh7ol3odd', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-09 14:05:41.794795+00', '2026-02-09 15:09:49.928436+00', 'zesurohudink', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 316, 'lxucmpxpz4d3', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-09 15:09:49.942198+00', '2026-02-09 17:11:23.162244+00', 'ndqrh7ol3odd', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 317, 'h7etefyjtiz4', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-09 17:11:23.178533+00', '2026-02-09 18:33:18.428803+00', 'lxucmpxpz4d3', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 318, 'ae3lzek4qn3g', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-09 18:33:18.455755+00', '2026-02-09 19:38:17.570603+00', 'h7etefyjtiz4', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 319, 'aygmasisapzv', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-09 19:38:17.581488+00', '2026-02-09 21:08:35.400789+00', 'ae3lzek4qn3g', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 320, 'edy3acguvz44', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-09 21:08:35.411443+00', '2026-02-10 07:54:18.750124+00', 'aygmasisapzv', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 322, 'mj57ymzlzhpd', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-10 07:54:18.780039+00', '2026-02-10 15:40:22.251972+00', 'edy3acguvz44', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 323, '3ngowgsynhz6', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-10 15:40:22.288373+00', '2026-02-10 16:39:58.538321+00', 'mj57ymzlzhpd', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 325, 'x5x6xaoucutr', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-10 16:39:58.548686+00', '2026-02-10 19:27:21.692304+00', '3ngowgsynhz6', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 312, 'jhabuckyws2f', 'b95a914d-0601-4331-a6a4-c9b84ec3af1c', true, '2026-02-08 04:59:41.781959+00', '2026-02-10 19:28:11.077042+00', 'pt72c37vttco', 'f6e6e682-980e-46a9-b1c1-a1ddc70c7858'),
	('00000000-0000-0000-0000-000000000000', 326, '67hkrmumcitk', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-10 19:27:21.717408+00', '2026-02-10 20:33:15.938671+00', 'x5x6xaoucutr', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 328, 'eh25hjg3ifp2', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-10 20:33:15.962499+00', '2026-02-11 06:31:09.594701+00', '67hkrmumcitk', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 329, 'qjmkafskcogw', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-11 06:31:09.620894+00', '2026-02-11 16:53:18.863866+00', 'eh25hjg3ifp2', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 314, 'g6vpmqnmzgww', '1a3dce70-bdee-4e67-8784-5f115a416816', true, '2026-02-09 11:11:09.925167+00', '2026-02-11 17:03:29.157527+00', 'd7gh5uwx54w3', '25d78784-457f-4391-acc1-3cca1319d293'),
	('00000000-0000-0000-0000-000000000000', 310, 'hw7x2s5ds37c', 'ae78b385-1334-4a89-9a8c-629469d04d51', true, '2026-02-07 16:24:25.026885+00', '2026-02-11 17:49:08.425137+00', 'dxgcbpmn4ru5', '88b0e9cf-6d0d-4671-a367-57658276a2df'),
	('00000000-0000-0000-0000-000000000000', 330, 'dadfobbldc3u', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-11 16:53:18.889121+00', '2026-02-11 17:54:57.110094+00', 'qjmkafskcogw', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 334, 'e4mjjudnikpb', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-11 17:54:57.117161+00', '2026-02-11 19:45:09.964658+00', 'dadfobbldc3u', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 321, 'd2g5j366oylr', 'ad5ba03b-2099-4b3d-9a58-080ed6310212', true, '2026-02-09 21:09:00.963638+00', '2026-02-11 21:44:42.273031+00', NULL, '79277e5e-06ad-4ca9-96dd-4252437b1b84'),
	('00000000-0000-0000-0000-000000000000', 335, 'sduuqohy3m7o', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-11 19:45:09.981613+00', '2026-02-11 22:34:59.216222+00', 'e4mjjudnikpb', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 337, 'hnde2kuoq4by', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-11 22:34:59.24416+00', '2026-02-12 06:59:13.095228+00', 'sduuqohy3m7o', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 338, 'rppgd3u6lu76', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-12 06:59:13.126447+00', '2026-02-12 17:37:58.090057+00', 'hnde2kuoq4by', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 332, 'tdtmanumkxsy', 'ee5ed2c4-ab2a-4485-a5cc-cf3db842b8f1', true, '2026-02-11 17:09:44.412184+00', '2026-02-12 19:40:07.864584+00', '4o7pfmharq3t', 'f4963b17-dfe3-4bc1-9aa9-b6d2f50f30b1'),
	('00000000-0000-0000-0000-000000000000', 339, '5k3r6zcaqloq', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-12 17:37:58.107751+00', '2026-02-12 19:55:17.85795+00', 'rppgd3u6lu76', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 342, 'gicjoh6g2r4n', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-12 19:55:17.869506+00', '2026-02-12 22:38:57.119047+00', '5k3r6zcaqloq', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 344, 'tkbtye2htgvl', 'a432650d-3397-423b-a27b-7f5f49fc446c', true, '2026-02-12 23:50:06.612164+00', '2026-02-13 11:41:59.444269+00', NULL, '0fd0fb8c-68f4-45c4-bb6e-bd650ed492aa'),
	('00000000-0000-0000-0000-000000000000', 345, 'kzgimcx3a57l', 'a432650d-3397-423b-a27b-7f5f49fc446c', true, '2026-02-13 11:41:59.475962+00', '2026-02-13 16:28:02.729659+00', 'tkbtye2htgvl', '0fd0fb8c-68f4-45c4-bb6e-bd650ed492aa'),
	('00000000-0000-0000-0000-000000000000', 343, 'em77j6lummwm', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-12 22:38:57.131985+00', '2026-02-13 16:35:31.100986+00', 'gicjoh6g2r4n', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 347, 'g46fq45ria4c', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-13 16:35:31.105255+00', '2026-02-13 20:10:21.32342+00', 'em77j6lummwm', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 346, 'coxkyzhggals', 'a432650d-3397-423b-a27b-7f5f49fc446c', true, '2026-02-13 16:28:02.757266+00', '2026-02-13 23:27:35.794329+00', 'kzgimcx3a57l', '0fd0fb8c-68f4-45c4-bb6e-bd650ed492aa'),
	('00000000-0000-0000-0000-000000000000', 324, 'uasb4xhqsrgg', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', true, '2026-02-10 16:26:00.303825+00', '2026-02-14 23:10:09.281034+00', '5h4hzvmxwidu', '97575bd5-7fdb-4841-ad69-27ea0c02600b'),
	('00000000-0000-0000-0000-000000000000', 348, 'kseu5hc65ezw', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-13 20:10:21.340386+00', '2026-02-15 12:22:10.500119+00', 'g46fq45ria4c', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 351, 'zm35rf3jcbxs', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-15 12:22:10.528852+00', '2026-02-15 19:34:11.140235+00', 'kseu5hc65ezw', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 350, 'tc6tfqdf7xfi', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', true, '2026-02-14 23:10:09.310686+00', '2026-02-16 15:31:21.624321+00', 'uasb4xhqsrgg', '97575bd5-7fdb-4841-ad69-27ea0c02600b'),
	('00000000-0000-0000-0000-000000000000', 333, 'tic4afct6lj3', 'ae78b385-1334-4a89-9a8c-629469d04d51', true, '2026-02-11 17:49:08.444047+00', '2026-02-16 16:33:41.252015+00', 'hw7x2s5ds37c', '88b0e9cf-6d0d-4671-a367-57658276a2df'),
	('00000000-0000-0000-0000-000000000000', 352, 'esiuae5jswyg', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-15 19:34:11.155154+00', '2026-02-16 16:44:21.081972+00', 'zm35rf3jcbxs', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 353, 'rfeimcvaekkc', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', true, '2026-02-16 15:31:21.651135+00', '2026-02-16 19:37:52.188945+00', 'tc6tfqdf7xfi', '97575bd5-7fdb-4841-ad69-27ea0c02600b'),
	('00000000-0000-0000-0000-000000000000', 349, 'y4b7fkbq4hng', 'a432650d-3397-423b-a27b-7f5f49fc446c', true, '2026-02-13 23:27:35.820305+00', '2026-02-16 19:57:21.814701+00', 'coxkyzhggals', '0fd0fb8c-68f4-45c4-bb6e-bd650ed492aa'),
	('00000000-0000-0000-0000-000000000000', 356, '4ybatk6y5dlz', '05723cd0-e913-498f-9c23-c1032e985246', true, '2026-02-16 17:24:06.091649+00', '2026-02-16 21:16:47.038611+00', NULL, 'a0d88336-f4a3-4d02-80ac-f08cac81a895'),
	('00000000-0000-0000-0000-000000000000', 355, 'wbfvlm2j3kk3', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-16 16:44:21.094353+00', '2026-02-16 19:37:24.791003+00', 'esiuae5jswyg', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 357, 'l4ac3fnt42kp', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-16 19:37:24.809952+00', '2026-02-17 11:19:25.694292+00', 'wbfvlm2j3kk3', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 359, 'ffrs7bqaap7r', 'a432650d-3397-423b-a27b-7f5f49fc446c', true, '2026-02-16 19:57:21.831483+00', '2026-02-17 13:38:04.655778+00', 'y4b7fkbq4hng', '0fd0fb8c-68f4-45c4-bb6e-bd650ed492aa'),
	('00000000-0000-0000-0000-000000000000', 364, 'opmxk2z4gocp', 'a432650d-3397-423b-a27b-7f5f49fc446c', true, '2026-02-17 13:38:04.675163+00', '2026-02-17 14:39:28.234058+00', 'ffrs7bqaap7r', '0fd0fb8c-68f4-45c4-bb6e-bd650ed492aa'),
	('00000000-0000-0000-0000-000000000000', 366, 'fcsc6nkqx75p', 'a432650d-3397-423b-a27b-7f5f49fc446c', true, '2026-02-17 14:39:28.25798+00', '2026-02-17 16:46:41.606381+00', 'opmxk2z4gocp', '0fd0fb8c-68f4-45c4-bb6e-bd650ed492aa'),
	('00000000-0000-0000-0000-000000000000', 368, 'watxpyn6dfy6', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-17 17:12:24.725925+00', '2026-02-17 19:30:35.143863+00', 'nwkd4w6he3ft', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 354, 'pihimkas4nps', 'ae78b385-1334-4a89-9a8c-629469d04d51', true, '2026-02-16 16:33:41.266549+00', '2026-02-18 04:34:30.89068+00', 'tic4afct6lj3', '88b0e9cf-6d0d-4671-a367-57658276a2df'),
	('00000000-0000-0000-0000-000000000000', 365, '4dy2f4f4bb3h', '52252b8a-4436-4a65-abb2-2093b1a2c7b7', true, '2026-02-17 13:38:12.177743+00', '2026-02-18 11:02:44.345421+00', '6ggpi4kef2ti', '17be8c5f-83f6-47f2-aabb-3c51a6c3f405'),
	('00000000-0000-0000-0000-000000000000', 369, 's5rfq2csl4iu', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-17 19:30:35.157291+00', '2026-02-18 13:04:07.39403+00', 'watxpyn6dfy6', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 372, 'svpejxihyrvd', '3b99746e-634b-4506-8ccd-6183785d2d64', true, '2026-02-18 09:14:35.917264+00', '2026-02-18 15:19:25.256136+00', NULL, 'bf74aa15-a767-42e7-b1fd-ddc5db563b59'),
	('00000000-0000-0000-0000-000000000000', 375, 'lh5jj4amsz7x', '3b99746e-634b-4506-8ccd-6183785d2d64', true, '2026-02-18 15:19:25.278435+00', '2026-02-18 16:56:38.102303+00', 'svpejxihyrvd', 'bf74aa15-a767-42e7-b1fd-ddc5db563b59'),
	('00000000-0000-0000-0000-000000000000', 376, '2larnzqwdfi2', '3b99746e-634b-4506-8ccd-6183785d2d64', false, '2026-02-18 16:56:38.124149+00', '2026-02-18 16:56:38.124149+00', 'lh5jj4amsz7x', 'bf74aa15-a767-42e7-b1fd-ddc5db563b59'),
	('00000000-0000-0000-0000-000000000000', 374, '3x55gvtnmfvd', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-18 13:04:07.41698+00', '2026-02-18 17:44:44.104206+00', 's5rfq2csl4iu', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 358, '5vjijoojx6gi', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', true, '2026-02-16 19:37:52.189445+00', '2026-02-18 17:54:57.576505+00', 'rfeimcvaekkc', '97575bd5-7fdb-4841-ad69-27ea0c02600b'),
	('00000000-0000-0000-0000-000000000000', 361, 'qijmkal527cv', '05723cd0-e913-498f-9c23-c1032e985246', true, '2026-02-16 21:16:47.054549+00', '2026-02-18 19:20:46.243636+00', '4ybatk6y5dlz', 'a0d88336-f4a3-4d02-80ac-f08cac81a895'),
	('00000000-0000-0000-0000-000000000000', 377, 'h2lqlbudxzqa', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-18 17:44:44.117522+00', '2026-02-18 20:25:44.178707+00', '3x55gvtnmfvd', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 371, '6uga5rbdiobe', 'ae78b385-1334-4a89-9a8c-629469d04d51', true, '2026-02-18 04:34:30.918404+00', '2026-02-19 09:17:52.59134+00', 'pihimkas4nps', '88b0e9cf-6d0d-4671-a367-57658276a2df'),
	('00000000-0000-0000-0000-000000000000', 380, 'own75srfx6aj', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-18 20:25:44.197525+00', '2026-02-19 09:56:33.441998+00', 'h2lqlbudxzqa', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 363, 't7wqqhycjqhx', 'ad5ba03b-2099-4b3d-9a58-080ed6310212', true, '2026-02-17 11:21:26.66212+00', '2026-02-19 11:00:05.32768+00', '5pbkwwmyhfea', '79277e5e-06ad-4ca9-96dd-4252437b1b84'),
	('00000000-0000-0000-0000-000000000000', 383, 'q67o43qjq35r', 'ad5ba03b-2099-4b3d-9a58-080ed6310212', true, '2026-02-19 11:00:05.341956+00', '2026-02-19 14:57:40.036457+00', 't7wqqhycjqhx', '79277e5e-06ad-4ca9-96dd-4252437b1b84'),
	('00000000-0000-0000-0000-000000000000', 378, 'ct3bcqhgmtrl', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', true, '2026-02-18 17:54:57.591306+00', '2026-02-19 18:14:11.842783+00', '5vjijoojx6gi', '97575bd5-7fdb-4841-ad69-27ea0c02600b'),
	('00000000-0000-0000-0000-000000000000', 382, 'usdrtxzd4emg', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-19 09:56:33.45157+00', '2026-02-19 20:53:25.929722+00', 'own75srfx6aj', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 386, 'cahtbrgtqtud', '0a5df480-a278-481d-a3f9-23f8eda30a33', true, '2026-02-19 20:52:45.524641+00', '2026-02-19 22:03:10.638874+00', NULL, '3f9425c3-2412-4481-9f15-95498e4cc94c'),
	('00000000-0000-0000-0000-000000000000', 388, '6kybnn4ensbr', '0a5df480-a278-481d-a3f9-23f8eda30a33', false, '2026-02-19 22:03:10.669417+00', '2026-02-19 22:03:10.669417+00', 'cahtbrgtqtud', '3f9425c3-2412-4481-9f15-95498e4cc94c'),
	('00000000-0000-0000-0000-000000000000', 387, 'ug432u2g3t7a', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-19 20:53:25.93159+00', '2026-02-21 19:03:39.268133+00', 'usdrtxzd4emg', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 390, 'svcsjnhqjnc5', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-21 19:03:39.299734+00', '2026-02-22 18:01:06.234812+00', 'ug432u2g3t7a', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 384, 'bqfxvklmeqya', 'ad5ba03b-2099-4b3d-9a58-080ed6310212', true, '2026-02-19 14:57:40.058577+00', '2026-02-22 18:01:32.11978+00', 'q67o43qjq35r', '79277e5e-06ad-4ca9-96dd-4252437b1b84'),
	('00000000-0000-0000-0000-000000000000', 370, '25c4jccrmdbl', 'b95a914d-0601-4331-a6a4-c9b84ec3af1c', true, '2026-02-17 21:55:55.56908+00', '2026-02-22 18:05:20.187057+00', 'ucefxbjqag4u', 'f6e6e682-980e-46a9-b1c1-a1ddc70c7858'),
	('00000000-0000-0000-0000-000000000000', 381, '6cxgsivkgmmd', 'ae78b385-1334-4a89-9a8c-629469d04d51', true, '2026-02-19 09:17:52.626691+00', '2026-02-22 18:42:31.798697+00', '6uga5rbdiobe', '88b0e9cf-6d0d-4671-a367-57658276a2df'),
	('00000000-0000-0000-0000-000000000000', 373, 'msrkklayjpu3', '52252b8a-4436-4a65-abb2-2093b1a2c7b7', true, '2026-02-18 11:02:44.373751+00', '2026-02-23 07:05:54.048059+00', '4dy2f4f4bb3h', '17be8c5f-83f6-47f2-aabb-3c51a6c3f405'),
	('00000000-0000-0000-0000-000000000000', 367, 'fsuojioghfvo', 'a432650d-3397-423b-a27b-7f5f49fc446c', true, '2026-02-17 16:46:41.628385+00', '2026-02-23 07:17:51.311705+00', 'fcsc6nkqx75p', '0fd0fb8c-68f4-45c4-bb6e-bd650ed492aa'),
	('00000000-0000-0000-0000-000000000000', 391, '6rlmjoqagdfi', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-22 18:01:06.265077+00', '2026-02-23 07:21:02.150345+00', 'svcsjnhqjnc5', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 385, 'qvzmafliozbp', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', true, '2026-02-19 18:14:11.876572+00', '2026-02-23 14:55:45.83788+00', 'ct3bcqhgmtrl', '97575bd5-7fdb-4841-ad69-27ea0c02600b'),
	('00000000-0000-0000-0000-000000000000', 398, 'wpbp3ggytrfy', '1a3dce70-bdee-4e67-8784-5f115a416816', true, '2026-02-23 12:58:14.985237+00', '2026-02-23 17:11:16.607072+00', 'srf5guh6qkk2', '25d78784-457f-4391-acc1-3cca1319d293'),
	('00000000-0000-0000-0000-000000000000', 397, '77xp7ycd2esp', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-23 07:21:02.157452+00', '2026-02-23 17:34:48.575188+00', '6rlmjoqagdfi', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 401, 'zjzppk2h2qir', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-23 17:34:48.595094+00', '2026-02-23 19:17:12.872006+00', '77xp7ycd2esp', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 379, 'qyf3hfw3zm4x', '05723cd0-e913-498f-9c23-c1032e985246', true, '2026-02-18 19:20:46.264844+00', '2026-02-23 19:47:50.219618+00', 'qijmkal527cv', 'a0d88336-f4a3-4d02-80ac-f08cac81a895'),
	('00000000-0000-0000-0000-000000000000', 393, 'frmjiqvwsuix', 'b95a914d-0601-4331-a6a4-c9b84ec3af1c', true, '2026-02-22 18:05:20.198649+00', '2026-02-23 20:33:26.098076+00', '25c4jccrmdbl', 'f6e6e682-980e-46a9-b1c1-a1ddc70c7858'),
	('00000000-0000-0000-0000-000000000000', 404, '2iw3y3xbktfm', 'b95a914d-0601-4331-a6a4-c9b84ec3af1c', false, '2026-02-23 20:33:26.118263+00', '2026-02-23 20:33:26.118263+00', 'frmjiqvwsuix', 'f6e6e682-980e-46a9-b1c1-a1ddc70c7858'),
	('00000000-0000-0000-0000-000000000000', 392, 'poqgbspc4rqw', 'ad5ba03b-2099-4b3d-9a58-080ed6310212', true, '2026-02-22 18:01:32.123305+00', '2026-02-24 07:51:15.642514+00', 'bqfxvklmeqya', '79277e5e-06ad-4ca9-96dd-4252437b1b84'),
	('00000000-0000-0000-0000-000000000000', 402, 'gu4dqzdjobpt', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-23 19:17:12.89698+00', '2026-02-24 11:26:14.110492+00', 'zjzppk2h2qir', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 405, 'gqxgllgt42p5', 'ad5ba03b-2099-4b3d-9a58-080ed6310212', true, '2026-02-24 07:51:15.672177+00', '2026-02-24 18:38:19.95905+00', 'poqgbspc4rqw', '79277e5e-06ad-4ca9-96dd-4252437b1b84'),
	('00000000-0000-0000-0000-000000000000', 403, '2jzry6uwhcea', '05723cd0-e913-498f-9c23-c1032e985246', true, '2026-02-23 19:47:50.228856+00', '2026-02-24 19:52:03.086188+00', 'qyf3hfw3zm4x', 'a0d88336-f4a3-4d02-80ac-f08cac81a895'),
	('00000000-0000-0000-0000-000000000000', 394, 'u7rwb72i4zzx', 'ae78b385-1334-4a89-9a8c-629469d04d51', true, '2026-02-22 18:42:31.814886+00', '2026-02-25 07:29:02.681121+00', '6cxgsivkgmmd', '88b0e9cf-6d0d-4671-a367-57658276a2df'),
	('00000000-0000-0000-0000-000000000000', 400, 'yyzcqhv7lg4q', '1a3dce70-bdee-4e67-8784-5f115a416816', true, '2026-02-23 17:11:16.626675+00', '2026-02-25 15:17:22.815345+00', 'wpbp3ggytrfy', '25d78784-457f-4391-acc1-3cca1319d293'),
	('00000000-0000-0000-0000-000000000000', 396, '4vlzpwxeazx7', 'a432650d-3397-423b-a27b-7f5f49fc446c', true, '2026-02-23 07:17:51.320109+00', '2026-03-01 21:13:15.93581+00', 'fsuojioghfvo', '0fd0fb8c-68f4-45c4-bb6e-bd650ed492aa'),
	('00000000-0000-0000-0000-000000000000', 395, 'mnqbqkfxeuwj', '52252b8a-4436-4a65-abb2-2093b1a2c7b7', true, '2026-02-23 07:05:54.078305+00', '2026-03-01 21:14:54.038193+00', 'msrkklayjpu3', '17be8c5f-83f6-47f2-aabb-3c51a6c3f405'),
	('00000000-0000-0000-0000-000000000000', 389, 'z6scsivj3blb', 'aa1a22b7-801a-48a5-b2ac-8d417438b31d', true, '2026-02-20 14:54:13.102836+00', '2026-03-02 09:09:59.962813+00', NULL, '5ae509e0-c2e2-481b-ade7-6a865ef2893c'),
	('00000000-0000-0000-0000-000000000000', 399, '7byuryqndljr', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', true, '2026-02-23 14:55:45.849452+00', '2026-03-02 17:40:43.704271+00', 'qvzmafliozbp', '97575bd5-7fdb-4841-ad69-27ea0c02600b'),
	('00000000-0000-0000-0000-000000000000', 406, 'rc3hvi3tu6bj', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-24 11:26:14.131431+00', '2026-02-24 17:04:57.740674+00', 'gu4dqzdjobpt', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 408, 'xasz4uypb6jv', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-24 17:04:57.770261+00', '2026-02-24 20:27:04.377918+00', 'rc3hvi3tu6bj', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 407, 'y3kvbua737zv', '3b99746e-634b-4506-8ccd-6183785d2d64', true, '2026-02-24 15:02:47.942678+00', '2026-02-24 22:40:21.021818+00', NULL, '9f6e7dfd-6835-412d-b79d-2a2fad56654e'),
	('00000000-0000-0000-0000-000000000000', 414, 'kicsprt4pgjq', 'ae78b385-1334-4a89-9a8c-629469d04d51', false, '2026-02-25 07:29:02.714015+00', '2026-02-25 07:29:02.714015+00', 'u7rwb72i4zzx', '88b0e9cf-6d0d-4671-a367-57658276a2df'),
	('00000000-0000-0000-0000-000000000000', 412, 'ri5jbwfsezle', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-24 20:27:04.392662+00', '2026-02-25 09:19:58.116743+00', 'xasz4uypb6jv', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 415, 'mu5jict43l5f', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-25 09:19:58.137782+00', '2026-02-25 10:51:14.94367+00', 'ri5jbwfsezle', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 416, 'culvutwjjchk', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-25 10:51:14.972799+00', '2026-02-25 11:53:34.88904+00', 'mu5jict43l5f', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 413, 'nkurxlkwkozy', '3b99746e-634b-4506-8ccd-6183785d2d64', true, '2026-02-24 22:40:21.042105+00', '2026-02-25 12:32:12.090462+00', 'y3kvbua737zv', '9f6e7dfd-6835-412d-b79d-2a2fad56654e'),
	('00000000-0000-0000-0000-000000000000', 419, '7xf7abgcvzra', '3b99746e-634b-4506-8ccd-6183785d2d64', false, '2026-02-25 12:32:12.108786+00', '2026-02-25 12:32:12.108786+00', 'nkurxlkwkozy', '9f6e7dfd-6835-412d-b79d-2a2fad56654e'),
	('00000000-0000-0000-0000-000000000000', 417, 'mtn7mgbhxfwt', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-25 11:53:34.904272+00', '2026-02-25 12:56:20.314339+00', 'culvutwjjchk', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 421, 'whf37hifbshs', '1a3dce70-bdee-4e67-8784-5f115a416816', false, '2026-02-25 15:17:22.838956+00', '2026-02-25 15:17:22.838956+00', 'yyzcqhv7lg4q', '25d78784-457f-4391-acc1-3cca1319d293'),
	('00000000-0000-0000-0000-000000000000', 420, '7qljam62fdli', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-25 12:56:20.331031+00', '2026-02-25 16:00:52.112119+00', 'mtn7mgbhxfwt', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 422, 'h3qbrqm22hh2', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-25 16:00:52.122791+00', '2026-02-25 16:59:03.403317+00', '7qljam62fdli', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 411, 'llvnklrshtnk', '05723cd0-e913-498f-9c23-c1032e985246', true, '2026-02-24 19:52:03.100114+00', '2026-02-25 17:03:56.924354+00', '2jzry6uwhcea', 'a0d88336-f4a3-4d02-80ac-f08cac81a895'),
	('00000000-0000-0000-0000-000000000000', 423, 'vxsaonkwan5l', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-25 16:59:03.423444+00', '2026-02-25 19:51:46.080589+00', 'h3qbrqm22hh2', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 425, '3b5adhoja2qs', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-25 19:51:46.096724+00', '2026-02-26 16:21:42.827228+00', 'vxsaonkwan5l', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 409, 'sj62rrrilyxi', 'ad5ba03b-2099-4b3d-9a58-080ed6310212', true, '2026-02-24 18:38:19.980758+00', '2026-02-26 16:40:14.482338+00', 'gqxgllgt42p5', '79277e5e-06ad-4ca9-96dd-4252437b1b84'),
	('00000000-0000-0000-0000-000000000000', 426, 'ctaiskzcibux', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-26 16:21:42.857736+00', '2026-02-26 17:26:06.17174+00', '3b5adhoja2qs', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 428, 'gxqsnsebjki3', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-26 17:26:06.196046+00', '2026-02-26 19:16:35.988685+00', 'ctaiskzcibux', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 418, 'xu7r2tocgc5e', '219ce759-6447-4be4-9bc3-891590663948', true, '2026-02-25 12:29:35.128296+00', '2026-02-27 09:12:11.615949+00', NULL, 'd8424011-c376-40b3-aaf2-1120067d20fe'),
	('00000000-0000-0000-0000-000000000000', 430, 'qsmfbvvt6wex', '219ce759-6447-4be4-9bc3-891590663948', false, '2026-02-27 09:12:11.647469+00', '2026-02-27 09:12:11.647469+00', 'xu7r2tocgc5e', 'd8424011-c376-40b3-aaf2-1120067d20fe'),
	('00000000-0000-0000-0000-000000000000', 429, 'lhaztybsw3x2', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-26 19:16:36.002709+00', '2026-02-28 10:33:59.842758+00', 'gxqsnsebjki3', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 431, 's3yajva37xvd', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-02-28 10:33:59.873955+00', '2026-03-01 20:11:53.98576+00', 'lhaztybsw3x2', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 432, 'jbhjni3k6wzg', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-03-01 20:11:54.009598+00', '2026-03-02 07:45:51.287285+00', 's3yajva37xvd', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 424, 'zbtsok4wanal', '05723cd0-e913-498f-9c23-c1032e985246', true, '2026-02-25 17:03:56.925256+00', '2026-03-02 08:04:57.458697+00', 'llvnklrshtnk', 'a0d88336-f4a3-4d02-80ac-f08cac81a895'),
	('00000000-0000-0000-0000-000000000000', 436, 'm6elabvwjdwh', '05723cd0-e913-498f-9c23-c1032e985246', false, '2026-03-02 08:04:57.478694+00', '2026-03-02 08:04:57.478694+00', 'zbtsok4wanal', 'a0d88336-f4a3-4d02-80ac-f08cac81a895'),
	('00000000-0000-0000-0000-000000000000', 437, '5xfi4wmlkh6e', 'aa1a22b7-801a-48a5-b2ac-8d417438b31d', false, '2026-03-02 09:09:59.975488+00', '2026-03-02 09:09:59.975488+00', 'z6scsivj3blb', '5ae509e0-c2e2-481b-ade7-6a865ef2893c'),
	('00000000-0000-0000-0000-000000000000', 434, 'kjzh7cvwxft4', '52252b8a-4436-4a65-abb2-2093b1a2c7b7', true, '2026-03-01 21:14:54.040398+00', '2026-03-02 14:41:51.853508+00', 'mnqbqkfxeuwj', '17be8c5f-83f6-47f2-aabb-3c51a6c3f405'),
	('00000000-0000-0000-0000-000000000000', 435, 'b7rtl2uxmloy', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-03-02 07:45:51.3258+00', '2026-03-02 17:23:28.764475+00', 'jbhjni3k6wzg', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 440, 'rytoegogjpob', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', false, '2026-03-02 17:40:43.724981+00', '2026-03-02 17:40:43.724981+00', '7byuryqndljr', '97575bd5-7fdb-4841-ad69-27ea0c02600b'),
	('00000000-0000-0000-0000-000000000000', 441, 'uf6evlpo7kz7', 'ee5ed2c4-ab2a-4485-a5cc-cf3db842b8f1', false, '2026-03-02 18:01:00.6414+00', '2026-03-02 18:01:00.6414+00', 'gqymr23hjx5v', 'f4963b17-dfe3-4bc1-9aa9-b6d2f50f30b1'),
	('00000000-0000-0000-0000-000000000000', 438, 'fic4yle7dcn5', '52252b8a-4436-4a65-abb2-2093b1a2c7b7', true, '2026-03-02 14:41:51.879594+00', '2026-03-02 19:01:46.289415+00', 'kjzh7cvwxft4', '17be8c5f-83f6-47f2-aabb-3c51a6c3f405'),
	('00000000-0000-0000-0000-000000000000', 439, 'q3plcf2nw4xu', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-03-02 17:23:28.791235+00', '2026-03-02 20:12:18.639547+00', 'b7rtl2uxmloy', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 443, 'feaeb42w6rrw', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-03-02 20:12:18.657868+00', '2026-03-02 21:19:55.865836+00', 'q3plcf2nw4xu', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 433, 'a6vab5gkynx7', 'a432650d-3397-423b-a27b-7f5f49fc446c', true, '2026-03-01 21:13:15.959248+00', '2026-03-02 21:58:54.976797+00', '4vlzpwxeazx7', '0fd0fb8c-68f4-45c4-bb6e-bd650ed492aa'),
	('00000000-0000-0000-0000-000000000000', 445, 'oouobzew53jg', 'a432650d-3397-423b-a27b-7f5f49fc446c', false, '2026-03-02 21:58:54.996855+00', '2026-03-02 21:58:54.996855+00', 'a6vab5gkynx7', '0fd0fb8c-68f4-45c4-bb6e-bd650ed492aa'),
	('00000000-0000-0000-0000-000000000000', 442, 'exewm2xzyrtb', '52252b8a-4436-4a65-abb2-2093b1a2c7b7', true, '2026-03-02 19:01:46.326129+00', '2026-03-02 22:04:28.845181+00', 'fic4yle7dcn5', '17be8c5f-83f6-47f2-aabb-3c51a6c3f405'),
	('00000000-0000-0000-0000-000000000000', 446, 'z2drhf63mcrh', '52252b8a-4436-4a65-abb2-2093b1a2c7b7', true, '2026-03-02 22:04:28.858515+00', '2026-03-03 07:33:05.15705+00', 'exewm2xzyrtb', '17be8c5f-83f6-47f2-aabb-3c51a6c3f405'),
	('00000000-0000-0000-0000-000000000000', 447, 'josm4bxx4pfm', '52252b8a-4436-4a65-abb2-2093b1a2c7b7', false, '2026-03-03 07:33:05.188529+00', '2026-03-03 07:33:05.188529+00', 'z2drhf63mcrh', '17be8c5f-83f6-47f2-aabb-3c51a6c3f405'),
	('00000000-0000-0000-0000-000000000000', 427, 'w2y3e3bt5kys', 'ad5ba03b-2099-4b3d-9a58-080ed6310212', true, '2026-02-26 16:40:14.495594+00', '2026-03-03 12:52:41.289371+00', 'sj62rrrilyxi', '79277e5e-06ad-4ca9-96dd-4252437b1b84'),
	('00000000-0000-0000-0000-000000000000', 448, 'm3xwkveo2vfu', 'ad5ba03b-2099-4b3d-9a58-080ed6310212', false, '2026-03-03 12:52:41.306197+00', '2026-03-03 12:52:41.306197+00', 'w2y3e3bt5kys', '79277e5e-06ad-4ca9-96dd-4252437b1b84'),
	('00000000-0000-0000-0000-000000000000', 444, 'e4turp6glwdb', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', true, '2026-03-02 21:19:55.888528+00', '2026-03-03 13:19:09.263373+00', 'feaeb42w6rrw', 'f4b179d7-26f2-456b-b90f-41d55f616ffe'),
	('00000000-0000-0000-0000-000000000000', 449, 'n7rk5xcrs55c', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', false, '2026-03-03 13:19:09.288126+00', '2026-03-03 13:19:09.288126+00', 'e4turp6glwdb', 'f4b179d7-26f2-456b-b90f-41d55f616ffe');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."profiles" ("id", "email", "full_name", "phone", "role", "credits", "payment_status", "created_at", "updated_at", "approval_status", "gender", "height", "birth_date", "physical_objective") VALUES
	('05723cd0-e913-498f-9c23-c1032e985246', 'carrascofernandezpaloma@gmail.com', 'Paloma Carrasco', NULL, 'user', 0, 'paid', '2026-02-16 17:24:05.966469+00', '2026-03-02 08:05:24.680407+00', 'approved', NULL, NULL, NULL, NULL),
	('0a5df480-a278-481d-a3f9-23f8eda30a33', 'miguelgallegoblanco@hotmail.com', 'Miguel Gallego Blanco', NULL, 'user', 7, 'none', '2026-02-19 20:52:45.32588+00', '2026-02-19 20:56:13.651196+00', 'approved', NULL, NULL, NULL, NULL),
	('aa1a22b7-801a-48a5-b2ac-8d417438b31d', 'jeffersonsalvador.es@gmail.com', 'Jefferson', NULL, 'user', 5, 'paid', '2026-02-05 18:59:01.248832+00', '2026-03-02 09:10:31.398017+00', 'approved', NULL, NULL, NULL, NULL),
	('810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', 'jesuscuadra@gmail.com', 'jesus', NULL, 'user', 5, 'paid', '2025-12-30 15:55:14.058865+00', '2026-03-02 17:40:58.608138+00', 'approved', 'male', 175, '1998-01-18', 'longevity'),
	('ee5ed2c4-ab2a-4485-a5cc-cf3db842b8f1', 'jacobogarciamanso@gmail.com', 'Jacobo', NULL, 'user', 0, 'paid', '2026-01-21 19:18:59.121575+00', '2026-03-02 18:01:32.510683+00', 'approved', NULL, NULL, NULL, NULL),
	('52252b8a-4436-4a65-abb2-2093b1a2c7b7', 'paulallamas99@gmail.com', 'Paula Llamas Martínez ', NULL, 'user', 1, 'paid', '2026-02-12 17:52:12.035673+00', '2026-03-02 19:04:30.23747+00', 'approved', 'female', 170, '1999-06-26', 'strength'),
	('a432650d-3397-423b-a27b-7f5f49fc446c', 'beavaroabad@gmail.com', 'Bea Varo', NULL, 'user', 1, 'paid', '2026-02-12 23:50:06.469043+00', '2026-03-02 22:02:09.131803+00', 'approved', 'female', 161, '1995-10-31', 'aesthetics'),
	('ad5ba03b-2099-4b3d-9a58-080ed6310212', 'daniela.garcia.rivas1986@gmail.com', 'DANIELA ', NULL, 'user', 3, 'paid', '2026-02-09 21:09:00.923692+00', '2026-03-03 12:52:49.531198+00', 'approved', NULL, NULL, NULL, NULL),
	('b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', 'manuemerita@gmail.com', 'Manu', NULL, 'admin', 8, 'paid', '2025-12-30 14:29:13.062187+00', '2026-02-02 21:09:00.739133+00', 'approved', NULL, NULL, NULL, NULL),
	('b95a914d-0601-4331-a6a4-c9b84ec3af1c', 'correyeroporrojuanjose@gmail.com', 'Juan José ', NULL, 'user', 2, 'paid', '2026-02-06 17:53:47.801194+00', '2026-02-23 20:33:38.979647+00', 'approved', NULL, NULL, NULL, NULL),
	('ae78b385-1334-4a89-9a8c-629469d04d51', 'abelsanchez210376@gmail.com', 'Abel', NULL, 'user', 4, 'paid', '2026-01-21 19:23:07.802812+00', '2026-02-25 07:29:09.728029+00', 'approved', 'male', 178, '1976-03-21', 'health'),
	('3b99746e-634b-4506-8ccd-6183785d2d64', 'thejhobbs@gmail.com', 'Josh Hobbs', NULL, 'user', 6, 'none', '2026-02-18 09:14:35.721942+00', '2026-02-25 12:32:27.627839+00', 'approved', NULL, NULL, NULL, NULL),
	('219ce759-6447-4be4-9bc3-891590663948', 'luisa.xaxi@gmail.com', 'Luisa Puntas', NULL, 'user', 4, 'none', '2026-02-25 12:29:35.005947+00', '2026-02-25 13:35:42.18787+00', 'approved', NULL, NULL, NULL, NULL),
	('1a3dce70-bdee-4e67-8784-5f115a416816', 'manuelrosalima1992@gmail.com', 'Manolo Rosa Lima ', NULL, 'user', 4, 'paid', '2026-02-03 06:24:24.747724+00', '2026-02-25 15:17:30.492614+00', 'approved', NULL, NULL, NULL, NULL);


--
-- Data for Name: app_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."app_settings" ("id", "key", "value", "description", "updated_at", "updated_by", "created_at") VALUES
	('e564daf3-5926-4194-a3d1-3b44121369c8', 'cancellation_policy', '{"unit": "hours", "value": 4}', 'Minimum time required before a booking can be canceled', '2026-01-07 17:22:44.97207+00', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', '2026-01-07 17:16:15.631071+00'),
	('450522a2-aac0-4e54-86ae-b65e55f8d4aa', 'mobile_quick_actions', '["/app/admin", "/app/admin/slots", "/app/admin/users", "/app/admin/bookings"]', 'Configuración de acciones rápidas del menú móvil', '2026-01-10 18:49:15.87396+00', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', '2026-01-10 18:45:59.733547+00'),
	('89ccd07f-5073-4d42-91c7-f62aa9adfc45', 'booking_auto_confirm', 'true', 'Automatically confirm bookings upon creation', '2026-01-14 19:54:16.448623+00', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', '2026-01-13 13:07:23.95628+00');


--
-- Data for Name: time_slots; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."time_slots" ("id", "day_of_week", "start_time", "end_time", "capacity", "is_active", "created_at", "updated_at", "slot_type", "specific_date", "created_by") VALUES
	('b9721fc3-cce7-419c-a6e3-e1d3bd8005a2', 1, '19:00:00', '20:00:00', 6, true, '2026-01-08 20:21:12.967344+00', '2026-01-08 20:21:12.967344+00', 'recurring', NULL, 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c'),
	('d34bd7f8-afc1-4a98-bde6-71ff5f61c4bc', 2, '19:00:00', '20:00:00', 6, true, '2026-01-08 20:21:13.248318+00', '2026-01-08 20:21:13.248318+00', 'recurring', NULL, 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c'),
	('8cfac4e5-865a-49a3-9ef7-1bcf6c8e96f9', 3, '19:00:00', '20:00:00', 6, true, '2026-01-08 20:21:13.501393+00', '2026-01-08 20:21:13.501393+00', 'recurring', NULL, 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c'),
	('59fa4e09-0cee-4110-8864-a661156cf504', 4, '19:00:00', '20:00:00', 6, true, '2026-01-08 20:21:13.74673+00', '2026-01-08 20:21:13.74673+00', 'recurring', NULL, 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c'),
	('017561b2-68b2-4596-ac03-663141e3cb1d', 1, '20:00:00', '21:00:00', 6, true, '2026-01-15 20:07:06.14313+00', '2026-01-15 20:07:06.14313+00', 'recurring', NULL, NULL),
	('a6c19a1c-11b9-4a60-aa20-c259c3ab0b23', 2, '20:00:00', '21:00:00', 6, true, '2026-01-15 20:07:42.296941+00', '2026-01-15 20:07:42.296941+00', 'recurring', NULL, NULL),
	('a257cd84-0ec1-46e5-9e71-619fe56a69bd', 3, '20:00:00', '21:00:00', 6, true, '2026-01-15 20:08:12.781518+00', '2026-01-15 20:08:12.781518+00', 'recurring', NULL, NULL),
	('65738eb9-c660-4ecd-95ad-36071ce1777d', 4, '20:00:00', '21:00:00', 6, true, '2026-01-15 20:08:48.564622+00', '2026-01-15 20:08:48.564622+00', 'recurring', NULL, NULL),
	('a0fc742b-2548-48ee-af92-e26fcda6c719', 1, '21:00:00', '22:00:00', 6, true, '2026-01-15 20:09:18.085152+00', '2026-01-15 20:09:18.085152+00', 'recurring', NULL, NULL),
	('0e0fa491-0b73-4dfc-807c-fd19ff732e2b', 2, '21:00:00', '22:00:00', 6, true, '2026-01-15 20:10:13.911006+00', '2026-01-15 20:10:13.911006+00', 'recurring', NULL, NULL),
	('3b178b8f-dbc0-4371-b637-d54afa306688', 3, '21:00:00', '22:00:00', 6, true, '2026-01-15 20:10:44.51079+00', '2026-01-15 20:10:44.51079+00', 'recurring', NULL, NULL),
	('962bce5a-0b0f-4d0f-bf02-bc4be8b7ceee', 4, '21:00:00', '22:00:00', 6, true, '2026-01-15 20:11:19.053262+00', '2026-01-15 20:11:19.053262+00', 'recurring', NULL, NULL);


--
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."bookings" ("id", "user_id", "time_slot_id", "booking_date", "status", "created_by", "created_at", "updated_at") VALUES
	('029565b1-e481-4d54-9a32-bbde846f3d1e', 'ae78b385-1334-4a89-9a8c-629469d04d51', '8cfac4e5-865a-49a3-9ef7-1bcf6c8e96f9', '2026-02-11', 'completed', NULL, '2026-02-11 17:49:14.275512+00', '2026-02-11 19:45:17.186107+00'),
	('60c47dcf-c422-4ce3-a547-961e9f1caa61', 'ee5ed2c4-ab2a-4485-a5cc-cf3db842b8f1', '8cfac4e5-865a-49a3-9ef7-1bcf6c8e96f9', '2026-02-11', 'completed', NULL, '2026-02-11 17:09:53.161986+00', '2026-02-11 19:45:18.476508+00'),
	('ba81bdb5-6d77-445e-af86-af51b9a4c917', '1a3dce70-bdee-4e67-8784-5f115a416816', '8cfac4e5-865a-49a3-9ef7-1bcf6c8e96f9', '2026-02-11', 'completed', NULL, '2026-02-11 17:03:37.301369+00', '2026-02-11 19:45:19.980159+00'),
	('e703be4e-af1d-44bc-896a-b7363b869e3d', 'ad5ba03b-2099-4b3d-9a58-080ed6310212', 'a257cd84-0ec1-46e5-9e71-619fe56a69bd', '2026-02-11', 'completed', NULL, '2026-02-09 21:09:55.049817+00', '2026-02-11 19:45:24.495702+00'),
	('a29288b3-1f90-41a2-942f-90787f942e74', 'b95a914d-0601-4331-a6a4-c9b84ec3af1c', '59fa4e09-0cee-4110-8864-a661156cf504', '2026-02-12', 'completed', NULL, '2026-02-10 19:39:36.726132+00', '2026-02-12 18:02:56.899323+00'),
	('39e964ff-ca36-40d9-8c5c-1337bb192372', 'ae78b385-1334-4a89-9a8c-629469d04d51', 'b9721fc3-cce7-419c-a6e3-e1d3bd8005a2', '2026-02-16', 'completed', NULL, '2026-02-16 16:33:46.724232+00', '2026-02-16 19:37:37.754465+00'),
	('b9182966-7c36-4680-ad98-8d43ce8e0bbf', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', 'b9721fc3-cce7-419c-a6e3-e1d3bd8005a2', '2026-02-16', 'completed', NULL, '2026-02-16 15:32:09.893607+00', '2026-02-16 19:37:39.07369+00'),
	('77948c7d-f1de-40a8-ab0f-f1e12c7e4dd7', 'ee5ed2c4-ab2a-4485-a5cc-cf3db842b8f1', 'b9721fc3-cce7-419c-a6e3-e1d3bd8005a2', '2026-02-16', 'completed', NULL, '2026-02-11 17:25:13.687497+00', '2026-02-16 19:37:40.616269+00'),
	('1595e23a-b2a4-4c74-8f10-c3280c2da157', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', '8cfac4e5-865a-49a3-9ef7-1bcf6c8e96f9', '2026-01-14', 'completed', NULL, '2026-01-14 19:52:21.225897+00', '2026-01-14 20:01:37.073711+00'),
	('c0098e20-9036-44f5-a05d-21ab1642281e', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', '59fa4e09-0cee-4110-8864-a661156cf504', '2026-01-15', 'completed', NULL, '2026-01-14 19:51:58.646255+00', '2026-01-15 20:12:05.365207+00'),
	('939c9749-c2f4-4417-9630-93e0e4e458f9', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', 'b9721fc3-cce7-419c-a6e3-e1d3bd8005a2', '2026-01-12', 'completed', NULL, '2026-01-08 20:23:40.157952+00', '2026-01-15 20:21:00.514023+00'),
	('43b97406-a259-48b5-a28d-6dff98c9a212', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', 'b9721fc3-cce7-419c-a6e3-e1d3bd8005a2', '2026-01-19', 'completed', NULL, '2026-01-16 20:27:41.808645+00', '2026-01-19 18:38:19.605051+00'),
	('52d171fa-c274-4060-b72d-96e7de3e1e02', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', '8cfac4e5-865a-49a3-9ef7-1bcf6c8e96f9', '2026-01-21', 'completed', NULL, '2026-01-16 20:28:29.202261+00', '2026-01-21 19:22:37.714803+00'),
	('057c2e1d-3d2c-48c3-8e45-03cae4d06218', 'b95a914d-0601-4331-a6a4-c9b84ec3af1c', 'd34bd7f8-afc1-4a98-bde6-71ff5f61c4bc', '2026-02-17', 'completed', NULL, '2026-02-16 20:24:57.130235+00', '2026-02-17 19:30:40.189075+00'),
	('c7ed6508-abb3-4964-881f-f7b5c0f854df', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', '59fa4e09-0cee-4110-8864-a661156cf504', '2026-01-22', 'completed', NULL, '2026-01-21 19:38:09.327995+00', '2026-01-22 22:55:50.329565+00'),
	('4aad1abb-2404-4a82-ad5a-d7005292071e', 'ae78b385-1334-4a89-9a8c-629469d04d51', '59fa4e09-0cee-4110-8864-a661156cf504', '2026-01-22', 'completed', NULL, '2026-01-21 19:24:01.053117+00', '2026-01-22 22:55:51.958923+00'),
	('121c043e-3c00-4059-a3d5-4c1acad07db4', '05723cd0-e913-498f-9c23-c1032e985246', 'd34bd7f8-afc1-4a98-bde6-71ff5f61c4bc', '2026-02-17', 'completed', NULL, '2026-02-16 17:28:23.545798+00', '2026-02-17 19:30:41.203796+00'),
	('b9a019d6-a959-414d-bbd3-07d6ba2c0d40', 'ae78b385-1334-4a89-9a8c-629469d04d51', 'b9721fc3-cce7-419c-a6e3-e1d3bd8005a2', '2026-01-26', 'completed', NULL, '2026-01-26 15:41:18.016998+00', '2026-01-26 19:47:41.956119+00'),
	('66be04e3-d830-4632-9312-0f0a8bc5d9fd', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', 'b9721fc3-cce7-419c-a6e3-e1d3bd8005a2', '2026-01-26', 'completed', NULL, '2026-01-26 11:02:42.099258+00', '2026-01-26 19:47:43.837308+00'),
	('48baeb46-c898-4212-ac96-a28534d48d4f', 'ae78b385-1334-4a89-9a8c-629469d04d51', '8cfac4e5-865a-49a3-9ef7-1bcf6c8e96f9', '2026-01-28', 'completed', NULL, '2026-01-26 15:41:40.984198+00', '2026-01-28 20:44:52.377153+00'),
	('b02820c3-d2b4-4e5d-8bd6-6062060313bd', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', '8cfac4e5-865a-49a3-9ef7-1bcf6c8e96f9', '2026-01-28', 'completed', NULL, '2026-01-26 11:02:50.181451+00', '2026-01-28 20:44:54.165199+00'),
	('ee8808e2-2e86-47b4-9355-d882179cc285', 'ae78b385-1334-4a89-9a8c-629469d04d51', '59fa4e09-0cee-4110-8864-a661156cf504', '2026-01-29', 'completed', NULL, '2026-01-28 16:09:16.06292+00', '2026-01-29 20:05:32.260395+00'),
	('c1d4b34f-fc7c-4050-b4bc-e3ea50486f59', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', '59fa4e09-0cee-4110-8864-a661156cf504', '2026-01-29', 'completed', NULL, '2026-01-26 11:02:58.045253+00', '2026-01-29 20:05:33.306234+00'),
	('cb40b08e-e5a1-44e3-9147-fc52b3e64f66', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', '8cfac4e5-865a-49a3-9ef7-1bcf6c8e96f9', '2026-02-18', 'completed', NULL, '2026-02-18 17:55:04.86764+00', '2026-02-18 20:26:13.602009+00'),
	('5429d2c5-77ca-4563-8d0e-67eb3d00e631', 'ae78b385-1334-4a89-9a8c-629469d04d51', '8cfac4e5-865a-49a3-9ef7-1bcf6c8e96f9', '2026-02-18', 'completed', NULL, '2026-02-18 04:34:38.953567+00', '2026-02-18 20:26:16.305031+00'),
	('63c4b18f-d330-4301-a426-275c5f4bd74d', 'a432650d-3397-423b-a27b-7f5f49fc446c', 'a257cd84-0ec1-46e5-9e71-619fe56a69bd', '2026-02-18', 'completed', NULL, '2026-02-17 13:39:05.051204+00', '2026-02-18 20:26:18.221572+00'),
	('5aff0992-f639-4ff2-a985-d077e0f23a9f', 'ae78b385-1334-4a89-9a8c-629469d04d51', 'b9721fc3-cce7-419c-a6e3-e1d3bd8005a2', '2026-02-02', 'completed', NULL, '2026-02-02 08:01:37.417195+00', '2026-02-02 19:22:09.165614+00'),
	('dc2d3cb5-63f1-4a78-860c-b1f024d02d96', '52252b8a-4436-4a65-abb2-2093b1a2c7b7', 'a257cd84-0ec1-46e5-9e71-619fe56a69bd', '2026-02-18', 'completed', NULL, '2026-02-17 13:38:43.284068+00', '2026-02-18 20:26:19.219257+00'),
	('87943d68-acde-460c-922c-85011545a280', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', 'b9721fc3-cce7-419c-a6e3-e1d3bd8005a2', '2026-02-02', 'completed', NULL, '2026-02-01 18:45:21.289187+00', '2026-02-02 19:22:10.043176+00'),
	('7b24dd0d-2d1d-4d6f-9e93-794ca6223d25', 'b95a914d-0601-4331-a6a4-c9b84ec3af1c', '8cfac4e5-865a-49a3-9ef7-1bcf6c8e96f9', '2026-02-18', 'completed', NULL, '2026-02-16 20:25:02.284387+00', '2026-02-18 20:26:20.787544+00'),
	('fc648cb3-b658-4c03-838e-4a414c51b6bc', 'ae78b385-1334-4a89-9a8c-629469d04d51', 'd34bd7f8-afc1-4a98-bde6-71ff5f61c4bc', '2026-02-03', 'completed', NULL, '2026-02-03 09:25:38.232568+00', '2026-02-03 19:30:14.992164+00'),
	('f5d7e882-9a77-47ee-bb87-4a9b0cf9545e', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', '8cfac4e5-865a-49a3-9ef7-1bcf6c8e96f9', '2026-02-04', 'completed', NULL, '2026-02-01 18:45:25.562826+00', '2026-02-04 22:46:01.114845+00'),
	('8581e7bc-c5b9-4f5f-b0f7-7b33d9a334f1', 'ee5ed2c4-ab2a-4485-a5cc-cf3db842b8f1', '8cfac4e5-865a-49a3-9ef7-1bcf6c8e96f9', '2026-02-18', 'completed', NULL, '2026-02-11 17:25:17.721694+00', '2026-02-18 20:26:22.696139+00'),
	('2d686132-447a-42bd-8e83-ea4102e3a183', 'ae78b385-1334-4a89-9a8c-629469d04d51', '59fa4e09-0cee-4110-8864-a661156cf504', '2026-02-05', 'completed', NULL, '2026-02-05 17:40:22.435753+00', '2026-02-05 19:34:28.655747+00'),
	('5e002870-2d1d-4bf7-8af4-833b31dd04fe', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', '59fa4e09-0cee-4110-8864-a661156cf504', '2026-02-05', 'completed', NULL, '2026-02-05 14:51:51.814534+00', '2026-02-05 19:34:29.553254+00'),
	('6f14e445-d947-435c-aa54-de31e21497d6', 'ad5ba03b-2099-4b3d-9a58-080ed6310212', '65738eb9-c660-4ecd-95ad-36071ce1777d', '2026-02-19', 'completed', NULL, '2026-02-19 11:00:14.707627+00', '2026-02-19 21:45:34.788567+00'),
	('18c97033-8bf1-4328-b4e0-cf6dcc49e549', 'ae78b385-1334-4a89-9a8c-629469d04d51', '59fa4e09-0cee-4110-8864-a661156cf504', '2026-02-19', 'completed', NULL, '2026-02-19 09:17:59.098326+00', '2026-02-19 21:45:35.890761+00'),
	('2d2710dc-abd0-4d58-b10c-4bab3c8f5953', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', '59fa4e09-0cee-4110-8864-a661156cf504', '2026-02-19', 'completed', NULL, '2026-02-18 17:55:19.376062+00', '2026-02-19 21:45:37.644633+00'),
	('f6c81e60-2e9a-41b6-ad43-ce10115f6249', '1a3dce70-bdee-4e67-8784-5f115a416816', 'b9721fc3-cce7-419c-a6e3-e1d3bd8005a2', '2026-02-09', 'completed', NULL, '2026-02-09 11:11:34.581783+00', '2026-02-09 19:38:28.883663+00'),
	('7cc99c17-2398-4a8b-970e-dd35040efbac', 'b95a914d-0601-4331-a6a4-c9b84ec3af1c', 'b9721fc3-cce7-419c-a6e3-e1d3bd8005a2', '2026-02-09', 'completed', NULL, '2026-02-06 22:19:23.031121+00', '2026-02-09 19:38:29.521775+00'),
	('a1c1f821-0123-4c79-9b52-23a4dc44048e', 'b95a914d-0601-4331-a6a4-c9b84ec3af1c', 'd34bd7f8-afc1-4a98-bde6-71ff5f61c4bc', '2026-02-10', 'completed', NULL, '2026-02-06 22:20:00.292183+00', '2026-02-10 19:27:34.345659+00'),
	('5fc71d3a-cd28-4d28-a727-04de3a0ebc9b', 'b95a914d-0601-4331-a6a4-c9b84ec3af1c', '59fa4e09-0cee-4110-8864-a661156cf504', '2026-02-19', 'completed', NULL, '2026-02-16 20:25:11.474321+00', '2026-02-19 21:45:38.741385+00'),
	('f1812756-ec02-4e12-a42a-7823c47f9bdc', '05723cd0-e913-498f-9c23-c1032e985246', '59fa4e09-0cee-4110-8864-a661156cf504', '2026-02-19', 'completed', NULL, '2026-02-16 17:28:31.057179+00', '2026-02-19 21:45:39.7961+00'),
	('39be3575-9b3d-4dab-8941-3e7aad990541', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', 'b9721fc3-cce7-419c-a6e3-e1d3bd8005a2', '2026-02-23', 'completed', NULL, '2026-02-23 14:55:56.806741+00', '2026-02-23 19:17:22.257106+00'),
	('02d89ed3-8b5f-45f9-b893-e69182cfd3a8', '1a3dce70-bdee-4e67-8784-5f115a416816', '017561b2-68b2-4596-ac03-663141e3cb1d', '2026-02-23', 'completed', NULL, '2026-02-23 12:58:28.226156+00', '2026-02-23 19:17:26.800103+00'),
	('f18c4fa3-c013-49bc-b679-2a3d2616ab95', 'ae78b385-1334-4a89-9a8c-629469d04d51', 'b9721fc3-cce7-419c-a6e3-e1d3bd8005a2', '2026-02-23', 'completed', NULL, '2026-02-22 18:42:42.366865+00', '2026-02-23 19:17:27.935824+00'),
	('8d8a9e54-c1bc-494e-89b2-9e78ce9a7bdf', 'aa1a22b7-801a-48a5-b2ac-8d417438b31d', 'b9721fc3-cce7-419c-a6e3-e1d3bd8005a2', '2026-02-23', 'completed', NULL, '2026-02-20 14:55:02.151494+00', '2026-02-23 19:17:30.374016+00'),
	('978a27d7-916e-471d-9491-289dba592cef', '0a5df480-a278-481d-a3f9-23f8eda30a33', 'b9721fc3-cce7-419c-a6e3-e1d3bd8005a2', '2026-02-23', 'completed', NULL, '2026-02-19 20:56:13.651196+00', '2026-02-23 19:17:33.662268+00'),
	('9d176e4e-10c5-4e55-b38e-22f64396941a', 'ee5ed2c4-ab2a-4485-a5cc-cf3db842b8f1', 'b9721fc3-cce7-419c-a6e3-e1d3bd8005a2', '2026-02-23', 'completed', NULL, '2026-02-11 17:25:23.81315+00', '2026-02-23 19:17:35.962799+00'),
	('0bf6d863-6f88-4d76-9a18-d35c3d18a497', 'ad5ba03b-2099-4b3d-9a58-080ed6310212', '017561b2-68b2-4596-ac03-663141e3cb1d', '2026-02-23', 'completed', NULL, '2026-02-22 18:01:43.605634+00', '2026-02-23 19:37:32.353484+00'),
	('0bd70bf2-4b0e-49ae-ace4-29d86c420033', 'b95a914d-0601-4331-a6a4-c9b84ec3af1c', 'd34bd7f8-afc1-4a98-bde6-71ff5f61c4bc', '2026-02-24', 'completed', NULL, '2026-02-23 20:33:34.207657+00', '2026-02-24 20:27:16.40501+00'),
	('e6f47242-f6f3-4d35-8b4e-9cf9c22c7bb7', 'a432650d-3397-423b-a27b-7f5f49fc446c', 'a6c19a1c-11b9-4a60-aa20-c259c3ab0b23', '2026-02-24', 'completed', NULL, '2026-02-23 07:17:59.464424+00', '2026-02-24 20:27:17.972352+00'),
	('16616cdd-a09c-4380-9a95-cc66f66e8de3', '52252b8a-4436-4a65-abb2-2093b1a2c7b7', 'a6c19a1c-11b9-4a60-aa20-c259c3ab0b23', '2026-02-24', 'completed', NULL, '2026-02-23 07:06:03.811382+00', '2026-02-24 20:27:19.602245+00'),
	('3f55495b-af5d-4d33-9472-cbe574e5243c', 'aa1a22b7-801a-48a5-b2ac-8d417438b31d', 'd34bd7f8-afc1-4a98-bde6-71ff5f61c4bc', '2026-02-24', 'completed', NULL, '2026-02-20 14:55:05.896961+00', '2026-02-24 20:27:20.940598+00'),
	('0ad042e4-107d-432c-a37e-a04d5d44427d', '05723cd0-e913-498f-9c23-c1032e985246', 'd34bd7f8-afc1-4a98-bde6-71ff5f61c4bc', '2026-02-24', 'completed', NULL, '2026-02-18 19:20:59.335307+00', '2026-02-24 20:27:22.255632+00'),
	('7f28a627-1f4f-4d3c-9432-7b68b3e5d108', '3b99746e-634b-4506-8ccd-6183785d2d64', 'd34bd7f8-afc1-4a98-bde6-71ff5f61c4bc', '2026-02-24', 'completed', NULL, '2026-02-18 15:20:16.064445+00', '2026-02-24 20:27:23.480926+00'),
	('c0042746-e9c8-4b3e-ad0e-d93a33767386', '3b99746e-634b-4506-8ccd-6183785d2d64', 'd34bd7f8-afc1-4a98-bde6-71ff5f61c4bc', '2026-03-03', 'confirmed', NULL, '2026-02-25 12:32:27.627839+00', '2026-02-25 12:32:27.627839+00'),
	('5f0487ec-0b46-4e43-9ea7-544c0d729597', '1a3dce70-bdee-4e67-8784-5f115a416816', 'a257cd84-0ec1-46e5-9e71-619fe56a69bd', '2026-02-25', 'completed', NULL, '2026-02-25 15:17:30.492614+00', '2026-02-25 19:51:52.147951+00'),
	('63caede0-32c2-45e9-877f-505328e29207', 'ae78b385-1334-4a89-9a8c-629469d04d51', '8cfac4e5-865a-49a3-9ef7-1bcf6c8e96f9', '2026-02-25', 'completed', NULL, '2026-02-25 07:29:09.728029+00', '2026-02-25 19:51:53.816791+00'),
	('e7577cd5-bd48-4584-94d9-52cbbe9296df', 'b95a914d-0601-4331-a6a4-c9b84ec3af1c', '8cfac4e5-865a-49a3-9ef7-1bcf6c8e96f9', '2026-02-25', 'completed', NULL, '2026-02-23 20:33:36.757719+00', '2026-02-25 19:51:55.599702+00'),
	('72be0e56-1c17-4b9b-907c-026e55bf82da', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', '8cfac4e5-865a-49a3-9ef7-1bcf6c8e96f9', '2026-02-25', 'completed', NULL, '2026-02-23 14:56:12.259178+00', '2026-02-25 19:51:59.876803+00'),
	('2432e406-da4c-4594-9533-67f3097fd141', 'aa1a22b7-801a-48a5-b2ac-8d417438b31d', '8cfac4e5-865a-49a3-9ef7-1bcf6c8e96f9', '2026-02-25', 'completed', NULL, '2026-02-20 14:55:08.907847+00', '2026-02-25 19:52:01.319702+00'),
	('6d231fac-d3fb-4648-a178-157d8129bcbd', 'ee5ed2c4-ab2a-4485-a5cc-cf3db842b8f1', '8cfac4e5-865a-49a3-9ef7-1bcf6c8e96f9', '2026-02-25', 'completed', NULL, '2026-02-11 17:25:26.202975+00', '2026-02-25 19:52:02.160133+00'),
	('717d86bb-5f8d-45ea-bbfe-24e44e2ce4a8', 'ad5ba03b-2099-4b3d-9a58-080ed6310212', '962bce5a-0b0f-4d0f-bf02-bc4be8b7ceee', '2026-02-26', 'completed', NULL, '2026-02-24 18:38:52.158559+00', '2026-02-26 19:16:43.927752+00'),
	('502bbb62-f411-4c55-ace0-a1733f6f924d', 'b95a914d-0601-4331-a6a4-c9b84ec3af1c', '59fa4e09-0cee-4110-8864-a661156cf504', '2026-02-26', 'completed', NULL, '2026-02-23 20:33:38.979647+00', '2026-02-26 19:16:45.891303+00'),
	('2e52b2b8-b22a-44aa-b768-d041fecd3cda', 'aa1a22b7-801a-48a5-b2ac-8d417438b31d', '59fa4e09-0cee-4110-8864-a661156cf504', '2026-02-26', 'completed', NULL, '2026-02-20 14:55:11.923495+00', '2026-02-26 19:16:47.177042+00'),
	('b1b74339-9a49-42d3-9270-71f92220c7c5', '05723cd0-e913-498f-9c23-c1032e985246', '59fa4e09-0cee-4110-8864-a661156cf504', '2026-02-26', 'completed', NULL, '2026-02-18 19:21:05.288533+00', '2026-02-26 19:16:48.106814+00'),
	('5d4818e2-b265-42f5-8c3c-6a68f71ae257', '05723cd0-e913-498f-9c23-c1032e985246', 'd34bd7f8-afc1-4a98-bde6-71ff5f61c4bc', '2026-03-03', 'confirmed', NULL, '2026-03-02 08:05:10.275234+00', '2026-03-02 08:05:10.275234+00'),
	('81034190-6786-46ed-848e-0c4b53e51c71', '05723cd0-e913-498f-9c23-c1032e985246', '59fa4e09-0cee-4110-8864-a661156cf504', '2026-03-05', 'confirmed', NULL, '2026-03-02 08:05:14.425453+00', '2026-03-02 08:05:14.425453+00'),
	('b549346a-eb48-426d-a89c-9a566fc829a8', '05723cd0-e913-498f-9c23-c1032e985246', 'd34bd7f8-afc1-4a98-bde6-71ff5f61c4bc', '2026-03-10', 'confirmed', NULL, '2026-03-02 08:05:21.997721+00', '2026-03-02 08:05:21.997721+00'),
	('f93d2f8e-da09-429e-a627-558f6d8f423c', '05723cd0-e913-498f-9c23-c1032e985246', '59fa4e09-0cee-4110-8864-a661156cf504', '2026-03-12', 'confirmed', NULL, '2026-03-02 08:05:24.680407+00', '2026-03-02 08:05:24.680407+00'),
	('f2815de5-f942-4083-999b-63f1558cab30', 'a432650d-3397-423b-a27b-7f5f49fc446c', '017561b2-68b2-4596-ac03-663141e3cb1d', '2026-03-02', 'completed', NULL, '2026-03-01 21:13:29.331316+00', '2026-03-02 20:12:32.825594+00'),
	('996f063f-2406-4275-8e63-51619fcdfd60', 'aa1a22b7-801a-48a5-b2ac-8d417438b31d', 'd34bd7f8-afc1-4a98-bde6-71ff5f61c4bc', '2026-03-03', 'confirmed', NULL, '2026-03-02 09:10:20.581891+00', '2026-03-02 09:10:20.581891+00'),
	('f2743d20-423b-4216-8b12-eff752258828', 'aa1a22b7-801a-48a5-b2ac-8d417438b31d', '8cfac4e5-865a-49a3-9ef7-1bcf6c8e96f9', '2026-03-04', 'confirmed', NULL, '2026-03-02 09:10:26.578622+00', '2026-03-02 09:10:26.578622+00'),
	('4db58b1e-9812-4217-bd80-7f036c43f763', 'aa1a22b7-801a-48a5-b2ac-8d417438b31d', '59fa4e09-0cee-4110-8864-a661156cf504', '2026-03-05', 'confirmed', NULL, '2026-03-02 09:10:31.398017+00', '2026-03-02 09:10:31.398017+00'),
	('be6555af-be68-4ae1-89f3-ee2d10847ce8', 'ee5ed2c4-ab2a-4485-a5cc-cf3db842b8f1', '8cfac4e5-865a-49a3-9ef7-1bcf6c8e96f9', '2026-03-04', 'confirmed', NULL, '2026-03-02 18:01:22.933125+00', '2026-03-02 18:01:22.933125+00'),
	('3c89d8f1-51b1-4b9c-a0ae-98775f846cfe', 'ee5ed2c4-ab2a-4485-a5cc-cf3db842b8f1', 'b9721fc3-cce7-419c-a6e3-e1d3bd8005a2', '2026-03-09', 'confirmed', NULL, '2026-03-02 18:01:32.510683+00', '2026-03-02 18:01:32.510683+00'),
	('5c0364fe-5e26-422d-bbb7-f8b067b6e452', 'ee5ed2c4-ab2a-4485-a5cc-cf3db842b8f1', 'b9721fc3-cce7-419c-a6e3-e1d3bd8005a2', '2026-03-02', 'completed', NULL, '2026-03-02 18:01:19.959498+00', '2026-03-02 20:12:26.935787+00'),
	('a720841b-a5da-4f25-b1c3-1095e58ed9c0', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', '017561b2-68b2-4596-ac03-663141e3cb1d', '2026-03-02', 'completed', NULL, '2026-03-02 17:40:58.608138+00', '2026-03-02 20:12:28.859351+00'),
	('2d0c75b7-94ce-4bd4-9c62-7b698747108c', '52252b8a-4436-4a65-abb2-2093b1a2c7b7', '017561b2-68b2-4596-ac03-663141e3cb1d', '2026-03-02', 'completed', NULL, '2026-03-01 21:15:01.726769+00', '2026-03-02 20:12:31.450783+00'),
	('a4d627d5-7bd0-4248-956e-5fbc732e4986', 'ad5ba03b-2099-4b3d-9a58-080ed6310212', 'a6c19a1c-11b9-4a60-aa20-c259c3ab0b23', '2026-03-03', 'confirmed', NULL, '2026-03-03 12:52:49.531198+00', '2026-03-03 12:52:49.531198+00');


--
-- Data for Name: branding_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."branding_settings" ("id", "business_name", "logo_url", "show_logo", "hero_image_url", "trainer_image_url", "group_image_url", "show_hero_image", "show_trainer_image", "show_group_image", "email", "phone", "whatsapp", "instagram", "show_email", "show_phone", "show_whatsapp", "show_instagram", "address", "city", "region", "country", "google_maps_url", "latitude", "longitude", "show_location", "schedule_weekdays", "schedule_saturday", "schedule_sunday", "show_schedule", "hero_title", "hero_subtitle", "hero_cta_text", "value_prop_title", "value_prop_subtitle", "about_trainer_title", "about_trainer_text", "about_trainer_quote", "empathy_title", "empathy_subtitle", "final_cta_title", "final_cta_subtitle", "testimonials", "created_at", "updated_at") VALUES
	('762f3bb8-91fa-4b69-a2ec-f8b0e377b499', 'Centro de Calistenia Stacion ', 'https://gnptmzkxmludhdwoulia.supabase.co/storage/v1/object/public/branding/logo-1768069636275.png', true, '/hero-background.png', '/trainer-photo.png', '/group-training.png', false, true, true, 'malocomo93@gmail.com', '+34 691183852', '34691183852', '@calisteniaemérita @manu.swtrainer', true, true, true, true, 'Av de la Libertad, 49, 06800 Mérida, Badajoz', 'Mérida', 'Extremadura', 'España', 'https://maps.app.goo.gl/8j5LMTPRT99Y59hg7', 38.91670000, -6.33330000, true, 'Lunes - Jueves: 19:00 - 21:00', 'Sábados: Cerrado', 'Domingos: Cerrado', true, 'Recupera tu agilidad y fuerza sin el ambiente de un gimnasio tradicional', 'Entrenamiento personal en grupos reducidos (máximo 6 personas) en Mérida. Especialistas en salud, movilidad y calistenia para mayores de 40.', 'Solicitar Entrevista Gratuita', 'Nuestra Solución', 'Un enfoque personalizado que prioriza tu salud y bienestar', 'Tu Entrenador Personal', 'Con años de experiencia en entrenamiento funcional y calistenia, mi enfoque está en el acompañamiento personal y la creación de una verdadera comunidad.', 'No eres un número, eres parte de la familia.', '¿Te suena esto?', 'Entendemos que no buscas un cuerpo de revista, sino atarte los cordones sin dolor', 'Únete al grupo', 'Solo 4 plazas por hora. No esperes más para cuidar tu salud.', '[{"id": "1", "name": "María, 47 años", "role": "Funcionaria pública", "text": "Después de años con dolor de espalda, finalmente puedo jugar con mis hijos sin molestias. El ambiente es familiar y nunca me he sentido juzgada.", "visible": true}, {"id": "2", "name": "Carlos, 52 años", "role": "Administrativo", "text": "Los grupos pequeños hacen toda la diferencia. El entrenador está siempre pendiente y he recuperado movilidad que creía perdida.", "visible": true}, {"id": "3", "name": "Ana, 44 años", "role": "Profesora", "text": "Nunca me gustaron los gimnasios grandes. Aquí me siento cómoda y segura. Es como entrenar con amigos.", "visible": true}]', '2026-01-10 17:37:41.234231+00', '2026-01-15 20:16:42.669082+00');


--
-- Data for Name: health_check; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: payment_methods; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."payment_methods" ("id", "name", "type", "is_active", "display_order", "contact_email", "contact_phone", "bank_account", "instructions", "created_at", "updated_at") VALUES
	('e589006d-b304-4a24-b3b6-dc2a890ae889', 'Efectivo ', 'cash', true, 0, '', '', '', 'Pago antes el día 10 de cada mes. GRACIAS:)', '2026-01-21 19:25:51.995798+00', '2026-01-21 19:25:51.995798+00');


--
-- Data for Name: payment_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."payment_requests" ("id", "user_id", "credits_requested", "status", "admin_notes", "processed_by", "processed_at", "created_at", "updated_at", "payment_method_id") VALUES
	('b193d5ce-dd61-4c43-b60f-c47daefe31b6', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', 8, 'approved', NULL, 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', '2026-01-10 18:55:08.382+00', '2026-01-08 20:22:01.371271+00', '2026-01-15 20:21:36.791978+00', NULL),
	('8705419a-28f6-4771-b3e5-35daed12e816', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', 8, 'approved', NULL, 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', '2026-01-12 19:49:26.488+00', '2026-01-12 19:49:20.350056+00', '2026-01-15 20:21:36.791978+00', NULL),
	('a7c89424-1e23-4acd-ad3c-96b9f8356dcd', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', 8, 'approved', NULL, 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', '2026-01-13 09:16:24.564+00', '2026-01-13 08:09:20.498099+00', '2026-01-15 20:21:36.791978+00', NULL),
	('86053ffd-81dd-45a9-9d73-aaecbca2e27c', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', 8, 'approved', NULL, 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', '2026-01-13 12:32:02.102+00', '2026-01-13 12:26:43.124041+00', '2026-01-15 20:21:36.791978+00', NULL),
	('88d4df51-4eef-43cd-92d4-40e55273472b', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', 8, 'approved', NULL, 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', '2026-01-13 12:39:03.212+00', '2026-01-13 12:32:18.432029+00', '2026-01-15 20:21:36.791978+00', NULL),
	('fcd1383a-562b-4c78-9e0d-77af1c052317', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', 8, 'approved', NULL, 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', '2026-01-14 19:51:09.297+00', '2026-01-14 19:50:56.896466+00', '2026-01-15 20:21:36.791978+00', NULL);


--
-- Data for Name: pricing_packages; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."pricing_packages" ("id", "name", "credits", "price", "is_active", "display_order", "created_at", "updated_at", "package_name") VALUES
	('f47924b6-a0bc-47fa-aa9c-481340e7e50e', 'Paquete Avanzado', 12, 60.00, true, 0, '2026-01-15 20:18:52.246419+00', '2026-01-15 20:18:52.246419+00', '3 clases a la semana '),
	('e5202e00-f6d0-43a0-bbfc-fa55173ea12b', 'Paquete básico ', 8, 50.00, true, 0, '2026-01-08 20:19:47.45452+00', '2026-01-08 20:19:47.45452+00', '2 clases a la semana ');


--
-- Data for Name: weight_stats; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."weight_stats" ("id", "user_id", "weight", "body_fat_percentage", "muscle_mass", "bone_mass", "bmi", "daily_calorie_intake", "metabolic_age", "total_body_water_percentage", "recorded_at", "notes", "created_at", "updated_at") VALUES
	('b5cde0e0-550b-4a64-9a9c-56401eed3323', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', 67.10, 17.90, 52.30, 2.80, 21.90, 2887, 25, 58.50, '2025-12-10 00:00:00+00', NULL, '2026-01-12 10:59:04.765135+00', '2026-01-12 10:59:04.765135+00'),
	('074325e9-e41f-4182-bb06-529bcdf1bd76', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', 68.20, 18.10, 53.10, 2.80, 22.30, 2922, 26, 58.30, '2026-01-07 00:00:00+00', NULL, '2026-01-12 11:00:49.688005+00', '2026-01-12 11:00:49.688005+00'),
	('9fe6acc6-c5f3-460f-91fa-487ac44faead', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', 64.80, 15.60, 51.90, 2.80, 21.10, 2847, 20, 60.30, '2026-01-14 00:00:00+00', NULL, '2026-01-14 19:48:25.520585+00', '2026-01-14 19:48:25.520585+00'),
	('7c1a7190-44d2-4660-88ec-0597b82c5fa0', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', 66.90, 17.80, 52.20, 2.80, 21.80, 2876, 25, 58.50, '2026-01-22 00:00:00+00', NULL, '2026-01-22 19:29:19.757618+00', '2026-01-22 19:29:19.757618+00'),
	('a583cb75-f71b-4086-b921-b9e9eb64e268', 'ae78b385-1334-4a89-9a8c-629469d04d51', 86.60, 29.00, 58.40, 3.10, 27.30, 2821, 36, 52.90, '2026-01-29 00:00:00+00', NULL, '2026-01-29 19:30:08.418511+00', '2026-01-29 19:30:08.418511+00'),
	('2f9c4555-6a03-49ac-8427-bc275b239cb7', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', 67.00, 17.70, 52.30, 2.80, 21.90, 2882, 25, 58.60, '2026-01-29 00:00:00+00', NULL, '2026-01-29 19:35:18.380991+00', '2026-01-29 19:35:18.380991+00'),
	('d38c42f8-5f9c-4f81-8aa4-f4f3a76315f7', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', 66.50, 18.10, 51.80, 2.80, 21.70, 2853, 26, 58.30, '2026-02-05 00:00:00+00', NULL, '2026-02-05 18:20:30.480765+00', '2026-02-05 18:20:30.480765+00'),
	('7345cab9-be2c-42c0-a3d5-b8d27486f30e', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', 66.70, 17.90, 52.00, 2.80, 21.80, 2863, 26, 58.40, '2026-02-19 00:00:00+00', NULL, '2026-02-19 18:15:08.239936+00', '2026-02-19 18:15:08.239936+00'),
	('65d3a628-a031-46d0-a581-a8ff74b0a7b7', '52252b8a-4436-4a65-abb2-2093b1a2c7b7', 56.20, 15.30, 45.20, 2.40, 19.40, 2513, 16, 61.40, '2026-03-02 00:00:00+00', 'Antes de entrenar, tras merienda habitual', '2026-03-02 19:03:33.697954+00', '2026-03-02 19:03:33.697954+00'),
	('882d514c-8f33-41c9-9ea3-e25e2ffaaeda', 'a432650d-3397-423b-a27b-7f5f49fc446c', 54.80, 24.10, 39.40, 2.10, 21.10, 2066, 17, 55.70, '2026-03-02 00:00:00+00', 'Medición en ayunas, después del trabajo y antes de entrenar', '2026-03-02 22:01:00.840553+00', '2026-03-02 22:01:00.840553+00');


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id", "type") VALUES
	('branding', 'branding', NULL, '2026-01-10 17:56:37.490765+00', '2026-01-10 17:56:37.490765+00', true, false, NULL, NULL, NULL, 'STANDARD');


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata") VALUES
	('650c9163-0750-4e55-a797-efba6ff48537', 'branding', '.emptyFolderPlaceholder', NULL, '2026-01-10 17:58:41.622123+00', '2026-01-10 17:58:41.622123+00', '2026-01-10 17:58:41.622123+00', '{"eTag": "\"d41d8cd98f00b204e9800998ecf8427e\"", "size": 0, "mimetype": "application/octet-stream", "cacheControl": "max-age=3600", "lastModified": "2026-01-10T17:58:41.621Z", "contentLength": 0, "httpStatusCode": 200}', '13a3f301-81cc-4801-9839-2e757c059deb', NULL, '{}'),
	('acecdac6-c06e-4ec9-a4f8-9948e9eb6417', 'branding', 'logo-1768069636275.png', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', '2026-01-10 18:27:17.22673+00', '2026-01-10 18:27:17.22673+00', '2026-01-10 18:27:17.22673+00', '{"eTag": "\"fc4b5b05751c069db3f15050dd1fdb6f\"", "size": 1146680, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-01-10T18:27:18.000Z", "contentLength": 1146680, "httpStatusCode": 200}', '422813aa-13df-4e78-bf07-4957ffdd7253', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', '{}');


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 449, true);


--
-- PostgreSQL database dump complete
--

-- \unrestrict EYIsRk1ZvkKfIJ2KgoH5SLk3fcBNFI83dhfcWXstWol3Ul5LafTStBaUxEhttVt

RESET ALL;
