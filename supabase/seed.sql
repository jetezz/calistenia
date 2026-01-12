SET session_replication_role = replica;

--
-- PostgreSQL database dump
--



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
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', 'e6483ce2-456c-4aa3-b604-2ed07da43beb', 'authenticated', 'authenticated', 'admin@gmail.com', '$2a$10$jVAYgDHFRiGKyGEQbN6HpuyysnYX5Boec5nJdfVyDZdpmvBD2zD3G', '2026-01-12 17:22:12.807015+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-01-12 17:22:12.813758+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "e6483ce2-456c-4aa3-b604-2ed07da43beb", "email": "admin@gmail.com", "full_name": "admin", "email_verified": true, "phone_verified": false}', NULL, '2026-01-12 17:22:12.789991+00', '2026-01-12 17:22:12.822256+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '7a5dd256-cd26-43ff-95a7-aae465810b25', 'authenticated', 'authenticated', 'test@gmail.com', '$2a$10$IorenEc1.2J17KPiKiqWp..JJTYmgcyr5m9.LFHm4qsv.8.d9Ca6u', '2026-01-12 17:12:55.894863+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-01-12 17:22:19.741919+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "7a5dd256-cd26-43ff-95a7-aae465810b25", "email": "test@gmail.com", "full_name": "test", "email_verified": true, "phone_verified": false}', NULL, '2026-01-12 17:12:55.841446+00', '2026-01-12 17:22:19.745373+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'bc1c5ea5-ce1e-44b9-9a3a-a624dbcd7cb2', 'authenticated', 'authenticated', 'danielagarcia@gmail.com', '$2a$06$/XDQec2mnz8WeDSOISkdmOX5PDT4wjFbfmf.j393gq272vD72TJ5e', '2026-01-07 19:51:37.06299+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"full_name": "Daniela "}', false, '2026-01-07 19:51:37.06299+00', '2026-01-07 19:51:37.06299+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'f619fd7d-9bb5-49f4-b074-e4cfd72481ff', 'authenticated', 'authenticated', 'hola@gmail.com', '$2a$10$aRskB.2d9sA.u44I5PEim.mhbm06cNYoc4HPjJS2YrvVqB59czTb6', '2025-12-30 12:04:30.814472+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-01-07 14:58:49.686304+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "f619fd7d-9bb5-49f4-b074-e4cfd72481ff", "email": "hola@gmail.com", "full_name": "hola", "email_verified": true, "phone_verified": false}', NULL, '2025-12-30 12:04:30.804491+00', '2026-01-07 14:58:49.689692+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', 'authenticated', 'authenticated', 'manuemerita@gmail.com', '$2a$10$tnMMrjnzIfl.7oDX3zEf3.B0FzUQ7KNxf83KG3SkQ7a8fcYhOOG5q', '2025-12-30 14:29:13.086638+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-01-12 17:13:18.874742+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "b5e0e7c6-f0e7-4b5f-a415-ebe23590444c", "email": "manuemerita@gmail.com", "full_name": "Manu", "email_verified": true, "phone_verified": false}', NULL, '2025-12-30 14:29:13.06255+00', '2026-01-12 17:13:18.877786+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', 'authenticated', 'authenticated', 'jesuscuadra@gmail.com', '$2a$10$DSzVs1CG2rFuqgSkVQ0n7u3V2JKrGwyggfOSZ0aZ8RbMVevNWdDU6', '2025-12-30 15:55:14.14275+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-01-12 16:52:31.752011+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8", "email": "jesuscuadra@gmail.com", "full_name": "jesus", "email_verified": true, "phone_verified": false}', NULL, '2025-12-30 15:55:14.061339+00', '2026-01-12 16:52:31.758356+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('f619fd7d-9bb5-49f4-b074-e4cfd72481ff', 'f619fd7d-9bb5-49f4-b074-e4cfd72481ff', '{"sub": "f619fd7d-9bb5-49f4-b074-e4cfd72481ff", "email": "hola@gmail.com", "full_name": "hola", "email_verified": false, "phone_verified": false}', 'email', '2025-12-30 12:04:30.811783+00', '2025-12-30 12:04:30.81183+00', '2025-12-30 12:04:30.81183+00', 'd9e5fb2f-efcf-4d6f-90be-b22bd4ddff29'),
	('b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', '{"sub": "b5e0e7c6-f0e7-4b5f-a415-ebe23590444c", "email": "manuemerita@gmail.com", "full_name": "Manu", "email_verified": false, "phone_verified": false}', 'email', '2025-12-30 14:29:13.081652+00', '2025-12-30 14:29:13.081702+00', '2025-12-30 14:29:13.081702+00', '222a85be-636d-45f6-81a0-2ca00aab54cc'),
	('810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', '810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', '{"sub": "810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8", "email": "jesuscuadra@gmail.com", "full_name": "jesus", "email_verified": false, "phone_verified": false}', 'email', '2025-12-30 15:55:14.128888+00', '2025-12-30 15:55:14.128941+00', '2025-12-30 15:55:14.128941+00', 'feffc638-37fd-4f82-b6bc-3c1cf17c6bdd'),
	('7a5dd256-cd26-43ff-95a7-aae465810b25', '7a5dd256-cd26-43ff-95a7-aae465810b25', '{"sub": "7a5dd256-cd26-43ff-95a7-aae465810b25", "email": "test@gmail.com", "full_name": "test", "email_verified": false, "phone_verified": false}', 'email', '2026-01-12 17:12:55.883962+00', '2026-01-12 17:12:55.884024+00', '2026-01-12 17:12:55.884024+00', '2225d72e-606c-49b1-8525-ad0508de48fd'),
	('e6483ce2-456c-4aa3-b604-2ed07da43beb', 'e6483ce2-456c-4aa3-b604-2ed07da43beb', '{"sub": "e6483ce2-456c-4aa3-b604-2ed07da43beb", "email": "admin@gmail.com", "full_name": "admin", "email_verified": false, "phone_verified": false}', 'email', '2026-01-12 17:22:12.802421+00', '2026-01-12 17:22:12.802473+00', '2026-01-12 17:22:12.802473+00', '9c4cf371-b947-4e37-96e4-6be9c25af19d');


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
	('f256c823-9ccb-4fa5-b0e4-e9fe168bf878', '7a5dd256-cd26-43ff-95a7-aae465810b25', '2026-01-12 17:22:19.742656+00', '2026-01-12 17:22:19.742656+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '79.116.134.249', NULL, NULL, NULL, NULL, NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('f256c823-9ccb-4fa5-b0e4-e9fe168bf878', '2026-01-12 17:22:19.746355+00', '2026-01-12 17:22:19.746355+00', 'password', 'b0d3f05b-27e3-4dd2-809a-51e04405be82');


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
	('00000000-0000-0000-0000-000000000000', 139, 'xt345d63ks7e', '7a5dd256-cd26-43ff-95a7-aae465810b25', false, '2026-01-12 17:22:19.743771+00', '2026-01-12 17:22:19.743771+00', NULL, 'f256c823-9ccb-4fa5-b0e4-e9fe168bf878');


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
	('bc1c5ea5-ce1e-44b9-9a3a-a624dbcd7cb2', 'danielagarcia@gmail.com', 'Daniela ', NULL, 'user', 0, 'none', '2026-01-07 19:51:37.06299+00', '2026-01-10 17:03:09.73196+00', 'approved', NULL, NULL, NULL, NULL),
	('810376d0-dc3d-43a9-a2fc-9d0d8dc90fc8', 'jesuscuadra@gmail.com', 'jesus', NULL, 'user', 1, 'paid', '2025-12-30 15:55:14.058865+00', '2026-01-12 16:07:17.811357+00', 'approved', 'male', 175, '1998-01-18', 'longevity'),
	('b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', 'manuemerita@gmail.com', 'Manu', NULL, 'admin', 0, 'none', '2025-12-30 14:29:13.062187+00', '2026-01-10 16:38:25.939857+00', 'approved', NULL, NULL, NULL, NULL),
	('7a5dd256-cd26-43ff-95a7-aae465810b25', 'test@gmail.com', 'test', NULL, 'user', 0, 'none', '2026-01-12 17:12:55.837151+00', '2026-01-12 17:22:40.367939+00', 'approved', NULL, NULL, NULL, NULL),
	('e6483ce2-456c-4aa3-b604-2ed07da43beb', 'admin@gmail.com', 'admin', NULL, 'admin', 0, 'none', '2026-01-12 17:22:12.789674+00', '2026-01-12 17:22:46.422912+00', 'approved', NULL, NULL, NULL, NULL);


--
-- Data for Name: app_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."app_settings" ("id", "key", "value", "description", "updated_at", "updated_by", "created_at") VALUES
	('e564daf3-5926-4194-a3d1-3b44121369c8', 'cancellation_policy', '{"unit": "hours", "value": 4}', 'Minimum time required before a booking can be canceled', '2026-01-07 17:22:44.97207+00', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', '2026-01-07 17:16:15.631071+00'),
	('450522a2-aac0-4e54-86ae-b65e55f8d4aa', 'mobile_quick_actions', '["/app/admin", "/app/admin/slots", "/app/admin/users", "/app/admin/bookings"]', 'Configuración de acciones rápidas del menú móvil', '2026-01-10 18:49:15.87396+00', 'b5e0e7c6-f0e7-4b5f-a415-ebe23590444c', '2026-01-10 18:45:59.733547+00');



--
-- Data for Name: branding_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."branding_settings" ("id", "business_name", "logo_url", "show_logo", "hero_image_url", "trainer_image_url", "group_image_url", "show_hero_image", "show_trainer_image", "show_group_image", "email", "phone", "whatsapp", "instagram", "show_email", "show_phone", "show_whatsapp", "show_instagram", "address", "city", "region", "country", "google_maps_url", "latitude", "longitude", "show_location", "schedule_weekdays", "schedule_saturday", "schedule_sunday", "show_schedule", "hero_title", "hero_subtitle", "hero_cta_text", "value_prop_title", "value_prop_subtitle", "about_trainer_title", "about_trainer_text", "about_trainer_quote", "empathy_title", "empathy_subtitle", "final_cta_title", "final_cta_subtitle", "testimonials", "created_at", "updated_at") VALUES
	('762f3bb8-91fa-4b69-a2ec-f8b0e377b499', 'Calistenia Emérita', 'https://gnptmzkxmludhdwoulia.supabase.co/storage/v1/object/public/branding/logo-1768069636275.png', true, '/hero-background.png', '/trainer-photo.png', '/group-training.png', false, true, true, 'info@calisteniaemérita.com', '+34 618540677', '34618540677', '@calisteniaemérita', true, true, true, true, 'Calle Ejemplo, 123', 'Mérida', 'Extremadura', 'España', NULL, 38.91670000, -6.33330000, true, 'Lunes - Viernes: 7:00 - 21:00', 'Sábados: 9:00 - 14:00', 'Domingos: Cerrado', true, 'Recupera tu agilidad y fuerza sin el ambiente de un gimnasio tradicional', 'Entrenamiento personal en grupos reducidos (máximo 4 personas) en Mérida. Especialistas en salud, movilidad y calistenia para mayores de 40.', 'Solicitar Entrevista Gratuita', 'Nuestra Solución', 'Un enfoque personalizado que prioriza tu salud y bienestar', 'Tu Entrenador Personal', 'Con años de experiencia en entrenamiento funcional y calistenia, mi enfoque está en el acompañamiento personal y la creación de una verdadera comunidad.', 'No eres un número, eres parte de la familia.', '¿Te suena esto?', 'Entendemos que no buscas un cuerpo de revista, sino atarte los cordones sin dolor', 'Únete al grupo', 'Solo 4 plazas por hora. No esperes más para cuidar tu salud.', '[{"id": "1", "name": "María, 47 años", "role": "Funcionaria pública", "text": "Después de años con dolor de espalda, finalmente puedo jugar con mis hijos sin molestias. El ambiente es familiar y nunca me he sentido juzgada.", "visible": true}, {"id": "2", "name": "Carlos, 52 años", "role": "Administrativo", "text": "Los grupos pequeños hacen toda la diferencia. El entrenador está siempre pendiente y he recuperado movilidad que creía perdida.", "visible": true}, {"id": "3", "name": "Ana, 44 años", "role": "Profesora", "text": "Nunca me gustaron los gimnasios grandes. Aquí me siento cómoda y segura. Es como entrenar con amigos.", "visible": true}]', '2026-01-10 17:37:41.234231+00', '2026-01-10 18:49:41.754045+00');



--
-- PostgreSQL database dump complete
--



RESET ALL;
