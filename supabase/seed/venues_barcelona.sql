-- ====================================================================
-- Establecimientos importados de OpenStreetMap (fuente verificable)
-- Generado por scripts/import-venues.mjs
-- Fecha de importación: 2026-10-20T19:33:05.249Z
-- Fuente: © OpenStreetMap contributors — licencia ODbL-1.0
-- Idempotente: puedes ejecutarlo varias veces (upsert por osm_id).
-- ====================================================================

begin;

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('1305366218', 'Bar Teo', 'Diagonal', 41.393729, 2.149521, 'Barcelona', null, 'bar', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:street":"Diagonal","amenity":"bar","check_date":"2026-09-06","name":"Bar Teo","outdoor_seating":"yes","toilets:wheelchair":"no","wheelchair":"no"}'::jsonb
from public.venues v where v.osm_id = '1305366218';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('1314468423', 'Sala Salamandra', 'Avinguda del Carrilet 235', 41.3600758, 2.109424, 'L''Hospitalet de Llobregat', null, 'nightclub', '{}', null, null, '+34 933 37 06 02', null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"L''Hospitalet de Llobregat","addr:housenumber":"235","addr:postcode":"08907","addr:street":"Avinguda del Carrilet","amenity":"nightclub","email":"salamandra@salamandra.cat","min_age":"18","name":"Sala Salamandra","operator":"Salamandrabcn, S.L.","phone":"+34 933 37 06 02"}'::jsonb
from public.venues v where v.osm_id = '1314468423';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('1314943380', 'Mescladís del Pou', 'Carrer dels Carders 35', 41.3870865, 2.1803497, 'Barcelona', null, 'bar', '{}', 'https://www.mescladis.org/', null, '+34 933198732', 'Mo-Fr 13:00-21:00; Sa,Su 11:00-21:00')
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Barcelona","addr:housenumber":"35","addr:postcode":"08003","addr:street":"Carrer dels Carders","air_conditioning":"no","alt_name":"Espai Mescladis","amenity":"bar","brewery":"yes","check_date":"2023-10-29","contact:facebook":"espaimescladis","contact:instagram":"https://www.instagram.com/espaismescladis","drink:club-mate":"served","email":"info@mescladis.org","internet_access":"wlan","internet_access:fee":"no","internet_access:ssid":"Mescladis","name":"Mescladís del Pou","opening_hours":"Mo-Fr 13:00-21:00; Sa,Su 11:00-21:00","outdoor_seating":"yes","payment:cash":"yes","payment:mastercard":"yes","payment:visa":"yes","phone":"+34 933198732","website":"https://www.mescladis.org/","wheelchair":"yes"}'::jsonb
from public.venues v where v.osm_id = '1314943380';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('1420760630', 'Diamant', 'Carrer d''Astúries 67', 41.4042174, 2.1555899, 'Barcelona', null, 'bar', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Barcelona","addr:housenumber":"67","addr:street":"Carrer d''Astúries","amenity":"bar","check_date":"2023-05-01","indoor_seating":"yes","name":"Diamant","outdoor_seating":"yes","smoking":"outside","wheelchair":"no"}'::jsonb
from public.venues v where v.osm_id = '1420760630';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('1428867664', 'Café Berlin', 'Carrer de Muntaner 240', 41.3943566, 2.1494599, 'Barcelona', null, 'bar', '{}', 'http://cafeberlinbarcelona.com/', null, '+34 932 006 542', null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Barcelona","addr:housenumber":"240","addr:postcode":"08021","addr:street":"Carrer de Muntaner","amenity":"bar","email":"cafeberlinbcn@gmail.com","name":"Café Berlin","outdoor_seating":"yes","phone":"+34 932 006 542","website":"http://cafeberlinbarcelona.com/"}'::jsonb
from public.venues v where v.osm_id = '1428867664';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('1445598561', 'Contracorrent', 'Carrer de Ribes 35', 41.3955687, 2.1819002, 'Barcelona', null, 'bar', '{}', 'https://contracorrentbar.com/', null, '+34 608865917', 'Mo,Th 17:30-23:00; Fr-Su 12:30-16:30,19:00-23:00')
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:housenumber":"35","addr:postcode":"08013","addr:street":"Carrer de Ribes","amenity":"bar","check_date":"2024-11-11","email":"info@contracorrentbar.com","name":"Contracorrent","opening_hours":"Mo,Th 17:30-23:00; Fr-Su 12:30-16:30,19:00-23:00","outdoor_seating":"yes","phone":"+34 608865917","website":"https://contracorrentbar.com/"}'::jsonb
from public.venues v where v.osm_id = '1445598561';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('1502974123', 'DRACO', null, 41.4091036, 2.1610503, 'Barcelona', null, 'nightclub', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"amenity":"nightclub","name":"DRACO"}'::jsonb
from public.venues v where v.osm_id = '1502974123';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('1886635516', 'Chica Club', 'Carrer del Rosselló 217', 41.393099, 2.1568896, 'Barcelona', null, 'nightclub', '{}', 'https://www.chicabcn.cat', null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Barcelona","addr:housename":"Chica Club","addr:housenumber":"217","addr:postcode":"08008","addr:street":"Carrer del Rosselló","amenity":"nightclub","contact:facebook":"https://www.facebook.com/chicaclubbcn","email":"reservations@chicabcn.cat","name":"Chica Club","website":"https://www.chicabcn.cat"}'::jsonb
from public.venues v where v.osm_id = '1886635516';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('1948935061', 'Taverna Blai Tonight', 'Carrer de Blai 23', 41.3735656, 2.164687, 'Barcelona', null, 'bar', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Barcelona","addr:housenumber":"23","addr:street":"Carrer de Blai","amenity":"bar","brewery":"yes","description":"A nice bar with friendly staff, which serves good and cheap pinchos (1€/1,20€)","food":"yes","name":"Taverna Blai Tonight","outdoor_seating":"yes","smoking":"outside"}'::jsonb
from public.venues v where v.osm_id = '1948935061';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('2056514582', 'Hell awaits', null, 41.3755945, 2.1702374, 'Barcelona', null, 'nightclub', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"amenity":"nightclub","name":"Hell awaits"}'::jsonb
from public.venues v where v.osm_id = '2056514582';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('2056514584', 'Bonker', null, 41.3738977, 2.1586905, 'Barcelona', null, 'nightclub', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"amenity":"nightclub","name":"Bonker"}'::jsonb
from public.venues v where v.osm_id = '2056514584';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('2247741140', 'El Paraigua', 'Carrer del Pas de l''Ensenyança 2', 41.3819109, 2.1767686, 'Barcelona', null, 'bar', '{}', 'https://www.elparaigua.com/', null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:housenumber":"2","addr:postcode":"08002","addr:street":"Carrer del Pas de l''Ensenyança","amenity":"bar","indoor_seating":"yes","name":"El Paraigua","outdoor_seating":"yes","source":"+34 933 02 11 31","website":"https://www.elparaigua.com/"}'::jsonb
from public.venues v where v.osm_id = '2247741140';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('2247748060', 'Club Astoria', 'Carrer de París 193', 41.3938378, 2.1532409, 'Barcelona', null, 'nightclub', '{}', 'https://www.clubastoriabcn.com/', null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:housenumber":"193","addr:street":"Carrer de París","amenity":"nightclub","name":"Club Astoria","source":"+34619473901","website":"https://www.clubastoriabcn.com/"}'::jsonb
from public.venues v where v.osm_id = '2247748060';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('2247754303', 'Antilla Latin Club', 'Carrer d''Aragó 141', 41.3845653, 2.1545955, 'Barcelona', null, 'nightclub', '{}', 'https://www.antillasalsa.com/', null, null, 'We 22:00-05:00; Th 23:00-05:00; Fr,Sa 23:00-06:00; Su 19:00-sunrise, PH -1 day 23:00-05:00')
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:housenumber":"141","addr:street":"Carrer d''Aragó","amenity":"nightclub","name":"Antilla Latin Club","opening_hours":"We 22:00-05:00; Th 23:00-05:00; Fr,Sa 23:00-06:00; Su 19:00-sunrise, PH -1 day 23:00-05:00","source":"+34 934 51 21 51","website":"https://www.antillasalsa.com/","wheelchair":"no"}'::jsonb
from public.venues v where v.osm_id = '2247754303';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('2247772387', 'Boulevard Culture Club', 'la Rambla 27', 41.3786292, 2.1752978, 'Barcelona', null, 'nightclub', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:housenumber":"27","addr:street":"la Rambla","amenity":"nightclub","name":"Boulevard Culture Club","name:cs":"caramba","source":"+34 662 30 43 01"}'::jsonb
from public.venues v where v.osm_id = '2247772387';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('2457866965', 'Jamboree', 'Plaça Reial 18', 41.3797128, 2.1751933, 'Barcelona', null, 'nightclub', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:housenumber":"18","addr:street":"Plaça Reial","amenity":"nightclub","check_date":"2024-07-20","harassment_prevention":"No Callem","name":"Jamboree","sexual_antiharassment_policy":"yes","sexual_antiharassment_policy:name":"NoCallem"}'::jsonb
from public.venues v where v.osm_id = '2457866965';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('2457874856', 'Harlem Jazz Club', 'Carrer de la Comtessa de Sobradiel 8', 41.3811234, 2.1784298, 'Barcelona', null, 'nightclub', '{}', 'https://www.harlemjazzclub.es/', null, '+34 933 10 07 55', null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Barcelona","addr:housenumber":"8","addr:postcode":"08002","addr:street":"Carrer de la Comtessa de Sobradiel","amenity":"nightclub","name":"Harlem Jazz Club","phone":"+34 933 10 07 55","smoking":"no","website":"https://www.harlemjazzclub.es/"}'::jsonb
from public.venues v where v.osm_id = '2457874856';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('2498389550', 'Black Box', 'Carrer de la Diputació 233', 41.3884366, 2.1639798, 'Barcelona', null, 'nightclub', '{}', null, null, null, 'Fr-Sa 23:59-06:00')
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Barcelona","addr:housenumber":"233","addr:street":"Carrer de la Diputació","amenity":"nightclub","check_date":"2025-08-14","harassment_prevention":"No Callem","name":"Black Box","opening_hours":"Fr-Sa 23:59-06:00","sexual_antiharassment_policy":"yes","sexual_antiharassment_policy:name":"NoCallem"}'::jsonb
from public.venues v where v.osm_id = '2498389550';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('2522915521', 'Sala de Fiestas Tango', 'Carrer de la Diputació 94', 41.3808462, 2.1545811, 'Barcelona', null, 'nightclub', '{}', 'https://saladefiestastango.com/', null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Barcelona","addr:housename":"Sala Tango","addr:housenumber":"94","addr:postcode":"08015","addr:street":"Carrer de la Diputació","amenity":"nightclub","harassment_prevention":"No Callem","name":"Sala de Fiestas Tango","sexual_antiharassment_policy":"yes","sexual_antiharassment_policy:name":"NoCallem","website":"https://saladefiestastango.com/"}'::jsonb
from public.venues v where v.osm_id = '2522915521';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('2879811887', 'Macarena Club', 'Carrer Nou de Sant Francesc 5', 41.3794046, 2.1768641, 'Barcelona', null, 'nightclub', '{}', 'https://www.macarenaclub.com/', null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Barcelona","addr:housenumber":"5","addr:postcode":"08002","addr:street":"Carrer Nou de Sant Francesc","amenity":"nightclub","name":"Macarena Club","website":"https://www.macarenaclub.com/"}'::jsonb
from public.venues v where v.osm_id = '2879811887';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('2892028393', 'Kino', 'Carrer de Ferlandina 23', 41.3825992, 2.1665452, 'Barcelona', null, 'bar', '{}', 'https://kinobcn.com/', null, '+34 931 798 409', 'Mo-Su 11:00-02:00')
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:housenumber":"23","addr:postcode":"08001","addr:street":"Carrer de Ferlandina","amenity":"bar","cuisine":"burger;sandwich;tapas","diet:vegan":"yes","internet_access":"wlan","name":"Kino","opening_hours":"Mo-Su 11:00-02:00","outdoor_seating":"yes","phone":"+34 931 798 409","smoking":"separated","website":"https://kinobcn.com/","website:menu":"https://kinobcn.com/menu/"}'::jsonb
from public.venues v where v.osm_id = '2892028393';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('2910255021', 'Sutton Club', 'Carrer Tuset 13', 41.3959489, 2.1517438, 'Barcelona', null, 'nightclub', '{}', 'https://www.suttonbarcelona.com/', null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Barcelona","addr:housenumber":"13","addr:street":"Carrer Tuset","amenity":"nightclub","contact:email":"info@suttonbarcelona.com","contact:mobile":"+34 667 432 759","contact:website":"https://www.suttonbarcelona.com/","harassment_prevention":"No Callem","name":"Sutton Club","name:ca":"Sutton Club","sexual_antiharassment_policy":"yes","sexual_antiharassment_policy:name":"NoCallem"}'::jsonb
from public.venues v where v.osm_id = '2910255021';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('2910255826', 'Shôko', 'Passeig Marítim del Port Olímpic 36', 41.3854991, 2.1969746, 'Barcelona', null, 'bar', '{}', 'https://shoko.biz/', null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Barcelona","addr:housenumber":"36","addr:postcode":"08005","addr:street":"Passeig Marítim del Port Olímpic","amenity":"bar","check_date":"2023-09-28","indoor_seating":"yes","name":"Shôko","name:ca":"Shôko","name:de":"Shôko","name:en":"Shôko","name:es":"Shôko","outdoor_seating":"yes","website":"https://shoko.biz/"}'::jsonb
from public.venues v where v.osm_id = '2910255826';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('2910255827', 'Opium', 'Passeig Marítim de la Barceloneta 34', 41.3852778, 2.1967099, 'Barcelona', null, 'bar', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Barcelona","addr:housenumber":"34","addr:postcode":"08003","addr:street":"Passeig Marítim de la Barceloneta","amenity":"bar","check_date":"2023-09-28","indoor_seating":"yes","name":"Opium","name:en":"Opium","outdoor_seating":"yes"}'::jsonb
from public.venues v where v.osm_id = '2910255827';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('2923513235', 'Downtown Barcelona', 'Avinguda del Doctor Marañón 17', 41.381261, 2.1143271, 'Barcelona', null, 'nightclub', '{}', 'https://downtownbarcelona.es/', null, null, 'Th 00:00-05:00; Fr-Sa 00:00-06:00')
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Barcelona","addr:housenumber":"17","addr:postcode":"08028","addr:street":"Avinguda del Doctor Marañón","amenity":"nightclub","email":"eventos@downtownbarcelona.es","fee":"yes","min_age":"18","mobile":"+34 696 88 33 05","name":"Downtown Barcelona","opening_hours":"Th 00:00-05:00; Fr-Sa 00:00-06:00","smoking":"outside","website":"https://downtownbarcelona.es/"}'::jsonb
from public.venues v where v.osm_id = '2923513235';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('3049395439', 'El refugio de los 33', 'Plaça del Mercat 19', 41.4075568, 2.1891002, 'Barcelona', null, 'bar', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Barcelona","addr:housenumber":"19","addr:street":"Plaça del Mercat","amenity":"bar","indoor_seating":"yes","name":"El refugio de los 33","outdoor_seating":"yes"}'::jsonb
from public.venues v where v.osm_id = '3049395439';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('3072968504', 'Sala Apolo', null, 41.3743908, 2.1695606, 'Barcelona', null, 'nightclub', '{}', 'https://www.sala-apolo.com', null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"amenity":"nightclub","harassment_prevention":"No Callem","name":"Sala Apolo","name:ca":"Sala Apolo","sexual_antiharassment_policy":"yes","sexual_antiharassment_policy:name":"NoCallem","website":"https://www.sala-apolo.com","wikidata":"Q20103353","wikimedia_commons":"Category:Sala Apolo (Barcelona)","wikipedia":"ca:Sala Apolo"}'::jsonb
from public.venues v where v.osm_id = '3072968504';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('3113655119', 'Boxer Bar', 'Carrer de la Diputació 167', 41.3847826, 2.1592727, 'Barcelona', null, 'bar', '{}', null, null, null, 'We 18:00-01:30; Th 18:00-02:00; Fr-Sa 18:00-03:00; So 18:00-01:30')
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Barcelona","addr:housenumber":"167","addr:street":"Carrer de la Diputació","amenity":"bar","lgbtq":"primary","min_age":"18","name":"Boxer Bar","opening_hours":"We 18:00-01:30; Th 18:00-02:00; Fr-Sa 18:00-03:00; So 18:00-01:30","outdoor_seating":"yes","wheelchair":"yes"}'::jsonb
from public.venues v where v.osm_id = '3113655119';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('3158729112', 'Almo2bar', 'Carrer de Bruniquer 59,61', 41.4056064, 2.1621059, 'Barcelona', null, 'nightclub', '{}', 'https://grupalmodobar.com/almo2bar/', null, '+34 93 219 93 45', '23:00-06:00')
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Barcelona","addr:housenumber":"59,61","addr:postcode":"08024","addr:street":"Carrer de Bruniquer","amenity":"nightclub","check_date":"2024-05-05","contact:facebook":"Almo2barBcn","contact:instagram":"almo2bar_bcn","contact:twitter":"Almo2bar","email":"grupalmodobar@gmail.com","harassment_prevention":"No Callem","name":"Almo2bar","opening_hours":"23:00-06:00","phone":"+34 93 219 93 45","sexual_antiharassment_policy":"yes","sexual_antiharassment_policy:name":"NoCallem","website":"https://grupalmodobar.com/almo2bar/","wheelchair":"no"}'::jsonb
from public.venues v where v.osm_id = '3158729112';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('3481112677', 'Latin Palace', 'Carrer de Ramon Trias Fargas 2-4', 41.3858135, 2.1967637, 'Barcelona', null, 'nightclub', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:housenumber":"2-4","addr:postcode":"08005","addr:street":"Carrer de Ramon Trias Fargas","amenity":"nightclub","check_date":"2024-06-23","name":"Latin Palace","operator":"Otto''s"}'::jsonb
from public.venues v where v.osm_id = '3481112677';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('3491476947', 'Bar del Pla', 'Carrer de Montcada 2', 41.3856036, 2.1800221, 'Barcelona', null, 'bar', '{}', 'https://www.bardelpla.cat/', null, null, 'Mo-Th 12:00-23:00; Fr-Sa 12:00-00:00')
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Barcelona","addr:housenumber":"2","addr:street":"Carrer de Montcada","amenity":"bar","atm":"no","cuisine":"tapas","description":"Tapas a bar","food":"yes","indoor_seating":"yes","internet_access":"wlan","name":"Bar del Pla","opening_hours":"Mo-Th 12:00-23:00; Fr-Sa 12:00-00:00","outdoor_seating":"yes","smoking":"outside","source":"Local knowledge","website":"https://www.bardelpla.cat/","wheelchair":"limited"}'::jsonb
from public.venues v where v.osm_id = '3491476947';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('3517276245', 'Bar Canigó', 'Carrer de Verdi 2', 41.4029724, 2.1579186, 'Barcelona', null, 'bar', '{}', 'http://www.barcanigo.com/', null, '+34 93 213 30 49', 'Mo-Th 10:00-02:00; Fr 10:00-03:00; Sa 20:00-03:00')
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Barcelona","addr:housenumber":"2","addr:postcode":"08012","addr:street":"Carrer de Verdi","amenity":"bar","check_date":"2026-09-14","indoor_seating":"yes","name":"Bar Canigó","opening_hours":"Mo-Th 10:00-02:00; Fr 10:00-03:00; Sa 20:00-03:00","outdoor_seating":"yes","payment:cash":"yes","payment:credit_cards":"yes","payment:debit_cards":"yes","phone":"+34 93 213 30 49","smoking":"outside","website":"http://www.barcanigo.com/","wheelchair":"limited"}'::jsonb
from public.venues v where v.osm_id = '3517276245';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('3626838286', 'Nueva Época', 'Gran Via de les Corts Catalanes 770', 41.3983986, 2.1807324, 'Barcelona', null, 'nightclub', '{}', null, null, '+34 67 879 5040', null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Barcelona","addr:housenumber":"770","addr:postcode":"08013","addr:street":"Gran Via de les Corts Catalanes","amenity":"nightclub","name":"Nueva Época","phone":"+34 67 879 5040"}'::jsonb
from public.venues v where v.osm_id = '3626838286';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('3631295923', 'Otto Zutz', 'Carrer de Lincoln 15', 41.4001094, 2.1503817, 'Barcelona', null, 'nightclub', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Barcelona","addr:housenumber":"15","addr:postcode":"08006","addr:street":"Carrer de Lincoln","amenity":"nightclub","harassment_prevention":"No Callem","name":"Otto Zutz","sexual_antiharassment_policy":"yes","sexual_antiharassment_policy:name":"NoCallem"}'::jsonb
from public.venues v where v.osm_id = '3631295923';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('3718061014', 'Bar Calders', 'Carrer del Parlament 25', 41.3764788, 2.1623937, 'Barcelona', null, 'bar', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:housenumber":"25","addr:street":"Carrer del Parlament","amenity":"bar","check_date":"2024-11-02","name":"Bar Calders","outdoor_seating":"yes","wheelchair":"no"}'::jsonb
from public.venues v where v.osm_id = '3718061014';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('3762966035', 'El Llit Bar', 'Passeig de la Plaça Major 37', 41.5476592, 2.1084356, 'Sabadell', null, 'bar', '{}', 'https://www.llitbar.cat/', null, '+34 937 128 832', 'Mo-Fr 16:00-00:00; Sa-Su 11:00-00:00')
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Sabadell","addr:housenumber":"37","addr:postcode":"08201","addr:street":"Passeig de la Plaça Major","air_conditioning":"yes","amenity":"bar","brewery":"yes;various;Estrella_Damm","contact:facebook":"https://www.facebook.com/ElLlitBar","description":"Cervecería ESTRELLA DAMM con terraza interior de cesped. Tapas, bocadillos y hamburguesas de ternera ecológica aptas para celíacos. TV gigante y Parking a 200 m.","internet_access":"no","name":"El Llit Bar","opening_hours":"Mo-Fr 16:00-00:00; Sa-Su 11:00-00:00","outdoor_seating":"yes","phone":"+34 937 128 832","smoking":"outside","website":"https://www.llitbar.cat/","wheelchair":"yes"}'::jsonb
from public.venues v where v.osm_id = '3762966035';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('3892711667', 'Museum', 'Carrer de Sepúlveda 178', 41.3831657, 2.162742, 'Barcelona', null, 'nightclub', '{}', null, null, null, 'Fr-Sa 23:00-03:00')
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Barcelona","addr:housenumber":"178","addr:postcode":"08011","addr:street":"Carrer de Sepúlveda","amenity":"nightclub","check_date":"2025-02-19","lgbtq":"primary","name":"Museum","opening_hours":"Fr-Sa 23:00-03:00","wheelchair":"no"}'::jsonb
from public.venues v where v.osm_id = '3892711667';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('3961122030', 'Safari Disco Club', 'Carrer de Tarragona 141-157', 41.3783395, 2.1448682, 'Barcelona', null, 'nightclub', '{}', 'http://www.safaridiscoclub.com', null, null, 'Fr 23:59-06:00; Sa 18:00-23:45, 23:59-06:00; Su 18:00-23:45')
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Barcelona","addr:housenumber":"141-157","addr:postcode":"08014","addr:street":"Carrer de Tarragona","amenity":"nightclub","contact:website":"http://www.safaridiscoclub.com","harassment_prevention":"No Callem","lgbtq":"primary","name":"Safari Disco Club","opening_hours":"Fr 23:59-06:00; Sa 18:00-23:45, 23:59-06:00; Su 18:00-23:45","sexual_antiharassment_policy":"yes","sexual_antiharassment_policy:name":"NoCallem"}'::jsonb
from public.venues v where v.osm_id = '3961122030';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('4126257971', 'Xixbar', 'Carrer de Rocafort 19', 41.3758485, 2.1576176, 'Barcelona', null, 'bar', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Barcelona","addr:housenumber":"19","addr:postcode":"08015","addr:street":"Carrer de Rocafort","amenity":"bar","name":"Xixbar","outdoor_seating":"yes","smoking":"outside"}'::jsonb
from public.venues v where v.osm_id = '4126257971';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('4349886673', 'Dionisos', 'Carrer de n''Arai 3', 41.38047, 2.1770302, 'Barcelona', null, 'bar', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:housenumber":"3","addr:street":"Carrer de n''Arai","amenity":"bar","indoor_seating":"yes","name":"Dionisos","outdoor_seating":"yes","wheelchair":"yes"}'::jsonb
from public.venues v where v.osm_id = '4349886673';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('4406708695', 'Raspall', 'Plaça del Raspall 8', 41.401192, 2.1605852, 'Barcelona', null, 'bar', '{}', null, null, null, 'Mo-Th 18:30-02:00; Fr 12:00-16:00, 18:30-02:30; Sa 12:00-02:30; Su 12:00-02:00')
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:housenumber":"8","addr:postcode":"08012","addr:street":"Plaça del Raspall","amenity":"bar","check_date":"2024-06-16","contact:instagram":"raspallbcn","cuisine":"regional;spanish","dog":"yes","internet_access":"wlan","name":"Raspall","name:ca":"Raspall","opening_hours":"Mo-Th 18:30-02:00; Fr 12:00-16:00, 18:30-02:30; Sa 12:00-02:30; Su 12:00-02:00","outdoor_seating":"yes","payment:cash":"yes","payment:credit_cards":"yes","payment:debit_cards":"yes","smoking":"outside"}'::jsonb
from public.venues v where v.osm_id = '4406708695';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('4455238130', 'Anahuac', 'Tuset 32', 41.3965161, 2.1513989, 'Barcelona', null, 'bar', '{}', null, null, '+34 93 2185237', null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Barcelona","addr:housenumber":"32","addr:postcode":"08006","addr:street":"Tuset","amenity":"bar","contact:phone":"+34 93 2185237","name":"Anahuac","outdoor_seating":"yes"}'::jsonb
from public.venues v where v.osm_id = '4455238130';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('4712026039', 'Undeadarkclub', null, 41.3798286, 2.1334164, 'Barcelona', null, 'nightclub', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"amenity":"nightclub","name":"Undeadarkclub"}'::jsonb
from public.venues v where v.osm_id = '4712026039';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('4773217122', 'Rainbow Dragon', null, 41.3852951, 2.172046, 'Barcelona', null, 'nightclub', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"amenity":"nightclub","name":"Rainbow Dragon","name:es":"Rainbow Dragon"}'::jsonb
from public.venues v where v.osm_id = '4773217122';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('4777016826', 'Gent del Barri', 'Carrer de Rogent 25', 41.4091439, 2.184618, 'Barcelona', null, 'bar', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:housenumber":"25","addr:street":"Carrer de Rogent","amenity":"bar","indoor_seating":"yes","name":"Gent del Barri","name:ca":"Gent del Barri","outdoor_seating":"yes","toilets:wheelchair":"no","wheelchair":"limited"}'::jsonb
from public.venues v where v.osm_id = '4777016826';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('4958833022', 'Open Mind', null, 41.3849379, 2.155696, 'Barcelona', null, 'nightclub', '{}', 'https://www.openmindbcn.com/', null, '+34934510479', 'Mo 00:00-05:00, Th 23:00-00:00, Fr-Sa 00:00-04:00, 23:00-00:00, Su 00:00-07:00, 20:00-00:00')
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"amenity":"nightclub","lgbtq":"primary","lgbtq:men":"primary","min_age":"18","name":"Open Mind","opening_hours":"Mo 00:00-05:00, Th 23:00-00:00, Fr-Sa 00:00-04:00, 23:00-00:00, Su 00:00-07:00, 20:00-00:00","phone":"+34934510479","website":"https://www.openmindbcn.com/"}'::jsonb
from public.venues v where v.osm_id = '4958833022';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('4958833624', 'Night Barcelona', 'Carrer de la Diputació 161', 41.3842982, 2.1587144, 'Barcelona', null, 'nightclub', '{}', 'https://www.nightbarcelona.net/', null, '+34935031701', 'Mo-Th 18:00-02:30; Fr-Sa 18:00-03:00; Su 18:00-02:30')
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:housenumber":"161","addr:postcode":"08011","addr:street":"Carrer de la Diputació","amenity":"nightclub","email":"info@nightbarcelona.net","lgbtq":"primary","lgbtq:men":"primary","name":"Night Barcelona","name:en":"Nightbarcelona","name:es":"Nightbarcelona","opening_hours":"Mo-Th 18:00-02:30; Fr-Sa 18:00-03:00; Su 18:00-02:30","phone":"+34935031701","website":"https://www.nightbarcelona.net/","wheelchair":"no"}'::jsonb
from public.venues v where v.osm_id = '4958833624';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('4958849921', 'Berlin Dark', 'Passatge de Prunera 18', 41.3743162, 2.1561764, 'Barcelona', null, 'nightclub', '{}', 'https://www.berlindark.com/', null, '+34635773955', 'Tu-Th 22:00-03:00; Fr, Sa 22:00-03:30; Su 20:00-02:00')
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Barcelona","addr:housenumber":"18","addr:postcode":"08004","addr:street":"Passatge de Prunera","amenity":"nightclub","lgbtq":"primary","lgbtq:men":"only","min_age":"18","name":"Berlin Dark","opening_hours":"Tu-Th 22:00-03:00; Fr, Sa 22:00-03:30; Su 20:00-02:00","phone":"+34635773955","website":"https://www.berlindark.com/"}'::jsonb
from public.venues v where v.osm_id = '4958849921';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('4958889874', 'The Black Room', 'Rambla de Catalunya 4', 41.3877311, 2.1682772, 'Barcelona', null, 'nightclub', '{}', null, null, null, 'Mo 01:00-20:30; Tu 01:30-23:00; We 03:30-21:30; Th 09:00-20:00')
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Barcelona","addr:housenumber":"4","addr:postcode":"08007","addr:street":"Rambla de Catalunya","amenity":"nightclub","lgbtq":"primary","lgbtq:men":"primary","name":"The Black Room","name:en":"The Black Room","name:es":"The Black Room","opening_hours":"Mo 01:00-20:30; Tu 01:30-23:00; We 03:30-21:30; Th 09:00-20:00"}'::jsonb
from public.venues v where v.osm_id = '4958889874';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('5052314721', 'Illuminati', 'Carrer de l''Alzina 46', 41.407315, 2.1556575, 'Barcelona', null, 'bar', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Barcelona","addr:housenumber":"46","addr:street":"Carrer de l''Alzina","amenity":"bar","contact:facebook":"https://www.facebook.com/pages/Bar-ILLUMINATI/193369804029235","name":"Illuminati","name:ca":"Illuminati","outdoor_seating":"yes","wheelchair":"no"}'::jsonb
from public.venues v where v.osm_id = '5052314721';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('5052323721', 'Continental', 'Carrer de la Providència 30-32', 41.4062568, 2.1564886, 'Barcelona', null, 'nightclub', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Barcelona","addr:housenumber":"30-32","addr:street":"Carrer de la Providència","amenity":"nightclub","check_date":"2026-03-20","min_age":"18","name":"Continental","name:ca":"Continental"}'::jsonb
from public.venues v where v.osm_id = '5052323721';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('5081388242', 'La Raposa', 'Carrer de Tapioles 47', 41.3725137, 2.1639527, 'Barcelona', null, 'bar', '{}', 'https://laraposacoop.wordpress.com/', null, '+34 931 257 954', 'Su-Tu 13:00-20:00; We-Sa 13:00-24:00')
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Barcelona","addr:housenumber":"47","addr:postcode":"08004","addr:street":"Carrer de Tapioles","amenity":"bar","check_date:opening_hours":"2025-10-19","description":"Vegan bar and feminist bookstore.","diet:gluten_free":"yes","diet:raw":"yes","diet:vegan":"yes","email":"hola@laraposacoop.org","indoor_seating":"yes","internet_access":"wlan","name":"La Raposa","opening_hours":"Su-Tu 13:00-20:00; We-Sa 13:00-24:00","outdoor_seating":"yes","phone":"+34 931 257 954","website":"https://laraposacoop.wordpress.com/","wheelchair":"yes"}'::jsonb
from public.venues v where v.osm_id = '5081388242';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('5128075585', 'Monkey Factory', 'Carrer de Còrsega', 41.3927261, 2.1544614, 'Barcelona', null, 'bar', '{}', null, null, '+34 936 81 78 93', 'Tu-Sa 18:30-03:00')
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Barcelona","addr:postcode":"08036","addr:street":"Carrer de Còrsega","amenity":"bar","email":"monkeyfactorybcn@gmail.com","name":"Monkey Factory","opening_hours":"Tu-Sa 18:30-03:00","outdoor_seating":"yes","phone":"+34 936 81 78 93","smoking":"outside"}'::jsonb
from public.venues v where v.osm_id = '5128075585';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('5206544217', 'Caribe Caliente', null, 41.3744995, 2.1148664, 'Barcelona', null, 'nightclub', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"amenity":"nightclub","name":"Caribe Caliente","name:es":"Caribe Caliente"}'::jsonb
from public.venues v where v.osm_id = '5206544217';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('5223167022', 'Topanga Club', 'Carrer 13 2', 41.2656265, 1.9852638, 'Área metropolitana', null, 'bar', '{}', 'https://topangaclub.com/', null, '+34 936452574', 'Su, Tu-Th 11:00-00:30; Mo 18:00-00:30; Fr-Sa 11:00-01:30')
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:housenumber":"2","addr:postcode":"08860","addr:street":"Carrer 13","air_conditioning":"yes","amenity":"bar","indoor_seating":"yes","name":"Topanga Club","opening_hours":"Su, Tu-Th 11:00-00:30; Mo 18:00-00:30; Fr-Sa 11:00-01:30","outdoor_seating":"yes","phone":"+34 936452574","website":"https://topangaclub.com/"}'::jsonb
from public.venues v where v.osm_id = '5223167022';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('5327570662', 'Ancestral', 'Carrer de Provença 340', 41.3977332, 2.1656576, 'Barcelona', null, 'bar', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:housenumber":"340","addr:postcode":"08037","addr:street":"Carrer de Provença","amenity":"bar","level":"0","name":"Ancestral","outdoor_seating":"yes","wheelchair":"yes"}'::jsonb
from public.venues v where v.osm_id = '5327570662';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('5539845612', 'Zahara Cocktail Club', null, 41.383278, 2.1894771, 'Barcelona', null, 'nightclub', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"amenity":"nightclub","name":"Zahara Cocktail Club"}'::jsonb
from public.venues v where v.osm_id = '5539845612';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('5554720357', 'Razzmatazz sales 2 & 3', null, 41.3972784, 2.1910762, 'Barcelona', null, 'nightclub', '{}', null, null, null, '"Depending on the concert"')
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"amenity":"nightclub","harassment_prevention":"No Callem","name":"Razzmatazz sales 2 & 3","name:ca":"Razzmatazz sales 2 i 3","opening_hours":"\"Depending on the concert\"","sexual_antiharassment_policy":"yes","sexual_antiharassment_policy:name":"NoCallem","smoking":"outside"}'::jsonb
from public.venues v where v.osm_id = '5554720357';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('5663248080', 'R33', 'La Rambla, el Raval', 41.3788563, 2.1749439, 'Barcelona', null, 'nightclub', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:street":"La Rambla, el Raval","amenity":"nightclub","name":"R33"}'::jsonb
from public.venues v where v.osm_id = '5663248080';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('5663251369', 'La Terrrazza', 'Avinguda de Francesc Ferrer i Guàrdia', 41.3689262, 2.149236, 'Barcelona', null, 'nightclub', '{}', 'https://laterrrazza.com/', null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:street":"Avinguda de Francesc Ferrer i Guàrdia","amenity":"nightclub","name":"La Terrrazza","website":"https://laterrrazza.com/"}'::jsonb
from public.venues v where v.osm_id = '5663251369';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('5718757792', '360°', 'Rambla del Raval 17-21', 41.3790957, 2.1696433, 'Barcelona', null, 'bar', '{}', 'https://www.terrazeo.com/terraza/terraza-del-hotel-barcelo-raval/', null, '+34933201490', '11:00-01:00')
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Barcelona","addr:housenumber":"17-21","addr:postcode":"08001","addr:street":"Rambla del Raval","amenity":"bar","check_date":"2025-05-14","level":"11","location":"rooftop","name":"360°","opening_hours":"11:00-01:00","outdoor_seating":"yes","phone":"+34933201490","smoking":"yes","website":"https://www.terrazeo.com/terraza/terraza-del-hotel-barcelo-raval/"}'::jsonb
from public.venues v where v.osm_id = '5718757792';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('5810830020', 'La Terrassa', null, 41.3822326, 2.045612, 'Área metropolitana', null, 'nightclub', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"amenity":"nightclub","name":"La Terrassa","name:ca":"La Terrassa"}'::jsonb
from public.venues v where v.osm_id = '5810830020';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('5810830026', 'Els Pagessos', null, 41.3811117, 2.0466608, 'Área metropolitana', null, 'nightclub', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"amenity":"nightclub","name":"Els Pagessos"}'::jsonb
from public.venues v where v.osm_id = '5810830026';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('5914744894', 'Vesta', 'Carrer de la Indústria 8', 41.402071, 2.1647815, 'Barcelona', null, 'bar', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Barcelona","addr:housenumber":"8","addr:postcode":"08037","addr:street":"Carrer de la Indústria","amenity":"bar","check_date":"2024-10-06","dog":"no","name":"Vesta","outdoor_seating":"yes","smoking":"outside","source":"survey","wheelchair":"no"}'::jsonb
from public.venues v where v.osm_id = '5914744894';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('6038913886', 'Almodobar', 'Carrer d''en Grassot 36', 41.4036783, 2.1675289, 'Barcelona', null, 'nightclub', '{}', 'https://grupalmodobar.com/almodobar/', null, '+34 932073855', null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:housenumber":"36","addr:street":"Carrer d''en Grassot","amenity":"nightclub","contact:facebook":"AlmodobarBCN","contact:instagram":"almodobar_bcn","contact:twitter":"Almodobarbcn","email":"grupalmodobar@gmail.com","harassment_prevention":"No Callem","name":"Almodobar","phone":"+34 932073855","sexual_antiharassment_policy":"yes","sexual_antiharassment_policy:name":"NoCallem","website":"https://grupalmodobar.com/almodobar/"}'::jsonb
from public.venues v where v.osm_id = '6038913886';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('6090305387', 'Moon Club', 'Avinguda de les Corts Catalanes 5', 41.475093, 2.0978593, 'Área metropolitana', null, 'nightclub', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:housenumber":"5","addr:street":"Avinguda de les Corts Catalanes","amenity":"nightclub","name":"Moon Club"}'::jsonb
from public.venues v where v.osm_id = '6090305387';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('6132612213', 'El Racó d''en Min', 'Plaça de la Vil·la', 41.3810625, 2.0457741, 'Sant Feliu de Llobregat', null, 'bar', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Sant Feliu de Llobregat","addr:postcode":"08980","addr:street":"Plaça de la Vil·la","amenity":"bar","name":"El Racó d''en Min","outdoor_seating":"yes"}'::jsonb
from public.venues v where v.osm_id = '6132612213';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('6139033077', 'Dixi 724', null, 41.3970111, 2.1920045, 'Barcelona', null, 'nightclub', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"amenity":"nightclub","name":"Dixi 724","name:ca":"Dixi 724","smoking":"outside","wheelchair":"yes"}'::jsonb
from public.venues v where v.osm_id = '6139033077';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('6193462651', 'Level', 'Carrer del Rosselló', 41.3935276, 2.157906, 'Barcelona', null, 'bar', '{}', null, null, null, 'Mo-Su,PH 06:30-02:30')
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Barcelona","addr:postcode":"08008","addr:street":"Carrer del Rosselló","amenity":"bar","check_date":"2024-11-12","check_date:opening_hours":"2024-11-12","indoor_seating":"yes","name":"Level","opening_hours":"Mo-Su,PH 06:30-02:30","outdoor_seating":"yes","wheelchair":"yes"}'::jsonb
from public.venues v where v.osm_id = '6193462651';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('6254618241', 'Strass Barcelona', 'Carrer de Villarroel 68', 41.3837626, 2.1588913, 'Barcelona', null, 'bar', '{}', null, null, null, 'Mo-Su 18:00-03:00')
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Barcelona","addr:housenumber":"68","addr:postcode":"08011","addr:street":"Carrer de Villarroel","amenity":"bar","lgbtq":"primary","name":"Strass Barcelona","opening_hours":"Mo-Su 18:00-03:00","outdoor_seating":"yes"}'::jsonb
from public.venues v where v.osm_id = '6254618241';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('6258715958', 'La Lluna de Gavà', 'Carrer de la Mineria 58-60', 41.3672801, 2.1403759, 'Barcelona', null, 'bar', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:housenumber":"58-60","addr:street":"Carrer de la Mineria","amenity":"bar","name":"La Lluna de Gavà","outdoor_seating":"yes"}'::jsonb
from public.venues v where v.osm_id = '6258715958';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('6387346287', 'Luz de Gas', 'Carrer de Muntaner 246', 41.3945996, 2.1490385, 'Barcelona', null, 'nightclub', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Barcelona","addr:housenumber":"246","addr:postcode":"08021","addr:street":"Carrer de Muntaner","amenity":"nightclub","harassment_prevention":"No Callem","name":"Luz de Gas","sexual_antiharassment_policy":"yes","sexual_antiharassment_policy:name":"NoCallem","smoking":"no","wikidata":"Q11934306","wikimedia_commons":"Category:Luz de Gas","wikipedia":"ca:Luz de Gas"}'::jsonb
from public.venues v where v.osm_id = '6387346287';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('6423279564', 'Bar Bágoa', 'Plaça del Doctor Letamendi 24', 41.3895378, 2.1604524, 'Barcelona', null, 'bar', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:housenumber":"24","addr:street":"Plaça del Doctor Letamendi","amenity":"bar","check_date":"2026-09-30","name":"Bar Bágoa","outdoor_seating":"yes"}'::jsonb
from public.venues v where v.osm_id = '6423279564';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('6430305257', 'Rock''N''Trini', 'Via Favència 441', 41.4469745, 2.1902067, 'Barcelona', null, 'nightclub', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Barcelona","addr:housenumber":"441","addr:postcode":"08033","addr:street":"Via Favència","amenity":"nightclub","name":"Rock''N''Trini"}'::jsonb
from public.venues v where v.osm_id = '6430305257';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('6543118810', 'Plataforma', 'Carrer Nou de la Rambla 145', 41.3728751, 2.1680013, 'Barcelona', null, 'nightclub', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Barcelona","addr:housenumber":"145","addr:street":"Carrer Nou de la Rambla","amenity":"nightclub","check_date":"2023-07-18","harassment_prevention":"No Callem","name":"Plataforma","sexual_antiharassment_policy":"yes","sexual_antiharassment_policy:name":"NoCallem","smoking":"no"}'::jsonb
from public.venues v where v.osm_id = '6543118810';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('6750085589', 'Olimpo', 'Carrer de Cartagena', 41.4066414, 2.1800529, 'Barcelona', null, 'bar', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:street":"Carrer de Cartagena","amenity":"bar","indoor_seating":"yes","name":"Olimpo","outdoor_seating":"yes"}'::jsonb
from public.venues v where v.osm_id = '6750085589';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('6854723168', 'Imperator', 'Carrer de Corsega 327', 41.3972085, 2.1600197, 'Barcelona', null, 'nightclub', '{}', null, null, '+34932 374322', null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:housenumber":"327","addr:street":"Carrer de Corsega","amenity":"nightclub","name":"Imperator","phone":"+34932 374322","wheelchair":"no"}'::jsonb
from public.venues v where v.osm_id = '6854723168';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('6920233083', 'Celler del 22', 'Carrer de la Bòbila 22', 41.5030041, 2.0358008, 'Rubí', null, 'bar', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Rubí","addr:housenumber":"22","addr:postcode":"08191","addr:street":"Carrer de la Bòbila","amenity":"bar","brewery":"yes","name":"Celler del 22","name:ca":"Celler del 22","outdoor_seating":"yes"}'::jsonb
from public.venues v where v.osm_id = '6920233083';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('6920498788', 'Bar Los Gomez', 'Avinguda de l''Estatut 229', 41.5017926, 2.0376731, 'Rubí', null, 'bar', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Rubí","addr:housenumber":"229","addr:postcode":"08191","addr:street":"Avinguda de l''Estatut","amenity":"bar","name":"Bar Los Gomez","outdoor_seating":"yes"}'::jsonb
from public.venues v where v.osm_id = '6920498788';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('7028817097', 'Espai Titus', 'Carrer de Ramon Martí Alsina 44', 41.459907, 2.2615126, 'Badalona', null, 'nightclub', '{}', 'https://espaititus.cat/', null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Badalona","addr:housenumber":"44","addr:postcode":"08911","addr:street":"Carrer de Ramon Martí Alsina","amenity":"nightclub","email":"info@espaititus.cat","name":"Espai Titus","name:ca":"Espai Titus","operator":"Grup Titus","website":"https://espaititus.cat/"}'::jsonb
from public.venues v where v.osm_id = '7028817097';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('7042784186', 'Matinée Barcelona Events', 'Av. Francesc Ferrer i Guàrdia 13', 41.3688468, 2.1468564, 'Barcelona', null, 'nightclub', '{}', 'https://matineegroup.com/', null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Barcelona","addr:housenumber":"13","addr:postcode":"08038","addr:street":"Av. Francesc Ferrer i Guàrdia","amenity":"nightclub","lgbtq":"primary","name":"Matinée Barcelona Events","website":"https://matineegroup.com/"}'::jsonb
from public.venues v where v.osm_id = '7042784186';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('7063767268', 'Alba', 'Carrer Tarragona', 41.495381, 2.1560925, 'Ripollet', null, 'bar', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Ripollet","addr:postcode":"08291","addr:street":"Carrer Tarragona","amenity":"bar","name":"Alba","name:ca":"Alba","outdoor_seating":"yes"}'::jsonb
from public.venues v where v.osm_id = '7063767268';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('7063767281', 'Hu', 'Rambla de Sant Jordi 47', 41.4970967, 2.1610908, 'Ripollet', null, 'bar', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Ripollet","addr:housenumber":"47","addr:postcode":"08291","addr:street":"Rambla de Sant Jordi","amenity":"bar","name":"Hu","outdoor_seating":"yes"}'::jsonb
from public.venues v where v.osm_id = '7063767281';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('7091938456', 'Pecat', 'Carrer de Jacint Verdaguer 24', 41.3661164, 2.128038, 'l''Hospitalet de Llobregat', null, 'bar', '{}', null, null, '+34 93 332 59 99', 'Tu-Th 08:00-22:30; Fr 08:30-03:00; Sa 18:00-03:00')
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"l''Hospitalet de Llobregat","addr:housenumber":"24","addr:postcode":"08902","addr:street":"Carrer de Jacint Verdaguer","amenity":"bar","name":"Pecat","opening_hours":"Tu-Th 08:00-22:30; Fr 08:30-03:00; Sa 18:00-03:00","outdoor_seating":"yes","phone":"+34 93 332 59 99","smoking":"outside","wheelchair":"yes"}'::jsonb
from public.venues v where v.osm_id = '7091938456';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('7124857728', 'Cabo', 'Carrer de la Marina 124', 41.3964797, 2.1851438, 'Barcelona', null, 'bar', '{}', 'https://grupocabo.es/cabo-bar/', null, '+34 936 76 23 54', null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Barcelona","addr:housenumber":"124","addr:postcode":"08013","addr:street":"Carrer de la Marina","amenity":"bar","check_date":"2024-09-24","contact:instagram":"https://www.instagram.com/cabobarbcn","internet_access":"wlan","internet_access:fee":"customers","level":"0","name":"Cabo","outdoor_seating":"yes","payment:cash":"yes","payment:credit_cards":"yes","payment:debit_cards":"yes","phone":"+34 936 76 23 54","smoking":"outside","website":"https://grupocabo.es/cabo-bar/","wheelchair":"yes"}'::jsonb
from public.venues v where v.osm_id = '7124857728';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('7172666371', 'Mambo Club', 'Carrer de Miquel Servet 149', 41.4462226, 2.2401134, 'Área metropolitana', null, 'nightclub', '{}', null, null, '+34935390509', 'Mo 20:00-22:00; Tu, We 19:00-23:00; Th 20:00-02:30; Fr 18:00-03:30; Sa 23:00-03:30; Su 19:00-01:00')
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:housenumber":"149","addr:street":"Carrer de Miquel Servet","amenity":"nightclub","name":"Mambo Club","opening_hours":"Mo 20:00-22:00; Tu, We 19:00-23:00; Th 20:00-02:30; Fr 18:00-03:30; Sa 23:00-03:30; Su 19:00-01:00","phone":"+34935390509"}'::jsonb
from public.venues v where v.osm_id = '7172666371';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('8578962719', 'Sort', 'Passeig de Sant Joan 47', 41.3962828, 2.173227, 'Barcelona', null, 'bar', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:housenumber":"47","addr:street":"Passeig de Sant Joan","amenity":"bar","indoor_seating":"yes","name":"Sort","name:ca":"Sort","outdoor_seating":"yes"}'::jsonb
from public.venues v where v.osm_id = '8578962719';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('8658397927', 'Barroko''s', 'Carrer d''Aribau 242', 41.3957578, 2.1497718, 'Barcelona', null, 'nightclub', '{}', 'https://www.discotecabarrokos.com/', null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:housenumber":"242","addr:street":"Carrer d''Aribau","amenity":"nightclub","contact:website":"https://www.discotecabarrokos.com/","name":"Barroko''s"}'::jsonb
from public.venues v where v.osm_id = '8658397927';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('8685951182', 'Costa Breve', 'Carrer d''Aribau 230', 41.3952962, 2.1503847, 'Barcelona', null, 'nightclub', '{}', 'https://grupocostabreve.com/', null, '+34 93 0241184', 'Th 00:00-05:00; Fr,Sa 00:00-06:00')
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:housenumber":"230","addr:street":"Carrer d''Aribau","amenity":"nightclub","contact:email":"hola@grupocostabreve.com","contact:phone":"+34 93 0241184","contact:website":"https://grupocostabreve.com/","name":"Costa Breve","opening_hours":"Th 00:00-05:00; Fr,Sa 00:00-06:00"}'::jsonb
from public.venues v where v.osm_id = '8685951182';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('9064017017', 'Bubar', 'Carrer de Wellington 52', 41.3909909, 2.187867, 'Barcelona', null, 'bar', '{}', null, null, '+34675701049', null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:housenumber":"52","addr:postcode":"08005","addr:street":"Carrer de Wellington","amenity":"bar","check_date":"2024-06-19","contact:instagram":"bubarbarcelona","cuisine":"tapas;regional","name":"Bubar","outdoor_seating":"yes","payment:cash":"yes","payment:credit_cards":"yes","payment:debit_cards":"yes","phone":"+34675701049","smoking":"outside","toilets":"yes","wheelchair":"yes"}'::jsonb
from public.venues v where v.osm_id = '9064017017';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('9076494634', 'Sarau 08911', 'Carrer de Ramon Martí Alsina 32', 41.4593959, 2.2620468, 'Área metropolitana', null, 'nightclub', '{}', 'https://www.sarau08911.com', null, '+34609774579', null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:housenumber":"32","addr:postcode":"08911","addr:street":"Carrer de Ramon Martí Alsina","amenity":"nightclub","email":"sarau@sarau08911.com","name":"Sarau 08911","name:ca":"Sarau 08911","phone":"+34609774579","smoking":"no","website":"https://www.sarau08911.com"}'::jsonb
from public.venues v where v.osm_id = '9076494634';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('9376372117', 'D9', 'Carrer de Pallars 122', 41.3967903, 2.1921194, 'Barcelona', null, 'bar', '{}', 'https://denou.bar/', null, '+34 933 099 202;+34 687 955 816', 'Su-Th 18:00-02:30; Fr-Sa 18:00-03:00')
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:housenumber":"122","addr:postcode":"08018","addr:street":"Carrer de Pallars","air_conditioning":"no","amenity":"bar","contact:facebook":"D9bar","contact:instagram":"d9poblenou","email":"ramon@denou.bar","indoor_seating":"yes","name":"D9","opening_hours":"Su-Th 18:00-02:30; Fr-Sa 18:00-03:00","outdoor_seating":"yes","payment:credit_cards":"yes","payment:debit_cards":"yes","phone":"+34 933 099 202;+34 687 955 816","smoking":"outside","website":"https://denou.bar/","wheelchair":"no"}'::jsonb
from public.venues v where v.osm_id = '9376372117';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('9800778917', 'Ilusion', null, 41.3842012, 2.1472514, 'Barcelona', null, 'nightclub', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"amenity":"nightclub","name":"Ilusion"}'::jsonb
from public.venues v where v.osm_id = '9800778917';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('9801832818', 'Entença 214 Skylab', 'Carrer d''Entença 214', 41.3855135, 2.1430297, 'Barcelona', null, 'nightclub', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:housenumber":"214","addr:street":"Carrer d''Entença","amenity":"nightclub","check_date:opening_hours":"2026-10-10","name":"Entença 214 Skylab","opening_hours:signed":"no"}'::jsonb
from public.venues v where v.osm_id = '9801832818';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('9885553030', 'Casa Pedro', 'Passeig Marítim', 41.438999, 2.2440095, 'Área metropolitana', null, 'bar', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:postcode":"08912","addr:street":"Passeig Marítim","amenity":"bar","check_date":"2024-09-15","indoor_seating":"yes","name":"Casa Pedro","outdoor_seating":"yes","payment:credit_cards":"yes","payment:debit_cards":"yes","smoking":"outside","wheelchair":"limited"}'::jsonb
from public.venues v where v.osm_id = '9885553030';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('9885561317', 'Pizzería San Marino 2', 'Passeig Marítim 5', 41.4390422, 2.2440373, 'Área metropolitana', null, 'bar', '{}', null, null, '+34 933993260', 'Mo-Su 12:00-23:00')
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:housenumber":"5","addr:postcode":"08912","addr:street":"Passeig Marítim","air_conditioning":"yes","amenity":"bar","indoor_seating":"yes","name":"Pizzería San Marino 2","opening_hours":"Mo-Su 12:00-23:00","outdoor_seating":"yes","payment:credit_cards":"yes","payment:debit_cards":"yes","phone":"+34 933993260","smoking":"outside","wheelchair":"limited"}'::jsonb
from public.venues v where v.osm_id = '9885561317';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('9885561417', 'Bonna Boca', 'Passeig Marítim 5', 41.4387851, 2.2437561, 'Área metropolitana', null, 'bar', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:housenumber":"5","addr:postcode":"08912","addr:street":"Passeig Marítim","air_conditioning":"yes","amenity":"bar","check_date":"2024-09-15","indoor_seating":"yes","name":"Bonna Boca","outdoor_seating":"yes","payment:credit_cards":"yes","payment:debit_cards":"yes","smoking":"outside","wheelchair":"limited"}'::jsonb
from public.venues v where v.osm_id = '9885561417';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('10055610428', 'Jube', 'Carrer de Sant Fructuós 1', 41.3725512, 2.1485109, 'Barcelona', null, 'bar', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Barcelona","addr:housenumber":"1","addr:street":"Carrer de Sant Fructuós","amenity":"bar","brewery":"yes","contact:facebook":"https://www.facebook.com/jubebardetapas","cuisine":"tapas","name":"Jube","outdoor_seating":"yes"}'::jsonb
from public.venues v where v.osm_id = '10055610428';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('10060431241', 'Vi & Beers', 'Carrer de Blai 45', 41.3740746, 2.163286, 'Barcelona', null, 'bar', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Barcelona","addr:housenumber":"45","addr:street":"Carrer de Blai","amenity":"bar","name":"Vi & Beers","outdoor_seating":"yes"}'::jsonb
from public.venues v where v.osm_id = '10060431241';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('10091572577', 'La Biblio', 'Carrer de Moià 1', 41.3954764, 2.1521881, 'Barcelona', null, 'nightclub', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:housenumber":"1","addr:street":"Carrer de Moià","amenity":"nightclub","name":"La Biblio"}'::jsonb
from public.venues v where v.osm_id = '10091572577';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('10649981205', 'Arena Xperience', 'Ronda de Sant Pere 19-21', 41.3895686, 2.1739427, 'Barcelona', null, 'nightclub', '{}', 'https://grupoarena.com/', null, '+34934875140', 'Su-Th 23:59-05:00; Fr-Sa 23:59-06:00')
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:housenumber":"19-21","addr:postcode":"08010","addr:street":"Ronda de Sant Pere","amenity":"nightclub","lgbtq":"primary","name":"Arena Xperience","name:en":"Arena Xperience","name:es":"Arena Xperience","name:fr":"Arena Xperience","opening_hours":"Su-Th 23:59-05:00; Fr-Sa 23:59-06:00","phone":"+34934875140","website":"https://grupoarena.com/"}'::jsonb
from public.venues v where v.osm_id = '10649981205';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('10721064807', 'Bonavida', 'Carrer de Casp 22', 41.3893117, 2.1708667, 'Barcelona', null, 'bar', '{}', 'https://www.bonavidabcn.com/', null, '+34 605 55 73 23', null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:housenumber":"22","addr:street":"Carrer de Casp","amenity":"bar","check_date":"2026-05-23","contact:facebook":"bonavidabar","cuisine":"coffee_shop;tapas","email":"info@bonavidabcn.com","name":"Bonavida","outdoor_seating":"yes","phone":"+34 605 55 73 23","toilets":"yes","website":"https://www.bonavidabcn.com/"}'::jsonb
from public.venues v where v.osm_id = '10721064807';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('11141876958', 'Jardinet del Mar', 'Plaça de la Rosa dels Vents', 41.3679758, 2.1904391, 'Barcelona', null, 'bar', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:street":"Plaça de la Rosa dels Vents","air_conditioning":"no","amenity":"bar","check_date":"2024-09-27","name":"Jardinet del Mar","outdoor_seating":"yes","payment:mastercard":"yes","payment:visa":"yes","source":"survey","wheelchair":"yes"}'::jsonb
from public.venues v where v.osm_id = '11141876958';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('11297720038', 'Galicia', 'Carrer de Llança 38-40', 41.3792288, 2.1467864, 'Barcelona', null, 'bar', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:housenumber":"38-40","addr:street":"Carrer de Llança","amenity":"bar","check_date":"2023-10-29","cuisine":"tapas","name":"Galicia","outdoor_seating":"yes","wheelchair":"limited"}'::jsonb
from public.venues v where v.osm_id = '11297720038';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('11306780216', 'Bar primavera', 'Garrofers 33', 41.3681134, 2.1116726, 'Hospitalet de Llobregat', null, 'bar', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Hospitalet de Llobregat","addr:housenumber":"33","addr:postcode":"08905","addr:street":"Garrofers","amenity":"bar","name":"Bar primavera","outdoor_seating":"yes"}'::jsonb
from public.venues v where v.osm_id = '11306780216';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('11617295979', 'Stereo Bar', 'Carrer Nou de la Rambla 119', 41.3738796, 2.1690488, 'Barcelona', null, 'bar', '{}', null, null, null, 'We-Sa 19:00-03:00')
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Barcelona","addr:housenumber":"119","addr:postcode":"08004","addr:street":"Carrer Nou de la Rambla","amenity":"bar","contact:instagram":"https://www.instagram.com/stereobarcelona/","name":"Stereo Bar","opening_hours":"We-Sa 19:00-03:00","outdoor_seating":"yes","payment:cash":"yes","payment:contactless":"yes","payment:credit_cards":"yes"}'::jsonb
from public.venues v where v.osm_id = '11617295979';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('11690535934', 'La Fira Casanova', 'Carrer de Casanova 171', 41.3918937, 2.1500484, 'Barcelona', null, 'nightclub', '{}', 'https://lafiragroup.com', null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Barcelona","addr:housenumber":"171","addr:postcode":"08036","addr:street":"Carrer de Casanova","amenity":"nightclub","name":"La Fira Casanova","website":"https://lafiragroup.com"}'::jsonb
from public.venues v where v.osm_id = '11690535934';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('11919337621', 'Capitolio', 'Carrer del Coure 79', 41.355622, 2.0958801, 'Cornellà de Llobregat', null, 'nightclub', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Cornellà de Llobregat","addr:housenumber":"79","addr:postcode":"08940","addr:street":"Carrer del Coure","amenity":"nightclub","name":"Capitolio"}'::jsonb
from public.venues v where v.osm_id = '11919337621';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('12077033449', 'Nitsa Club', null, 41.3743555, 2.1695179, 'Barcelona', null, 'nightclub', '{}', 'https://www.nitsa.com', null, null, 'Fr 23:59-23:59; Sa 00:00-06:00, 23:59-23:59, Su 00:00-06:00')
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"amenity":"nightclub","contact:instagram":"nitsa_club","fee":"yes","lgbtq":"primary","lgbtq:men":"primary","live_music":"yes","min_age":"18","name":"Nitsa Club","opening_hours":"Fr 23:59-23:59; Sa 00:00-06:00, 23:59-23:59, Su 00:00-06:00","website":"https://www.nitsa.com"}'::jsonb
from public.venues v where v.osm_id = '12077033449';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('12090218723', 'Botanicus Cocktail Bar', 'Carrer de Pujades 177', 41.4020152, 2.2009443, 'Barcelona', null, 'bar', '{}', 'https://www.botanicusbcn.com/', null, null, 'Mo-Su 18:00-03:00')
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Barcelona","addr:housenumber":"177","addr:postcode":"08005","addr:street":"Carrer de Pujades","air_conditioning":"yes","amenity":"bar","brewery":"yes","description":"Botanicus is an evolutionary cocktail bar born with the ambition of combining the world of botany with that of fermented products.","email":"botanicusbarcelona@gmail.com","image":"https://assets.zyrosite.com/m2WlapXP9Bh4zlZ9/logo-botanist-2023-mjEQqqpy4nCg6DLO.svg","internet_access":"wlan","name":"Botanicus Cocktail Bar","opening_hours":"Mo-Su 18:00-03:00","outdoor_seating":"yes","payment:cards":"yes","payment:cash":"yes","website":"https://www.botanicusbcn.com/","wheelchair":"yes"}'::jsonb
from public.venues v where v.osm_id = '12090218723';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('12205467236', 'Anita''s Bar Vela', 'Plaça de la Rosa dels Vents', 41.3672985, 2.1893426, 'Barcelona', null, 'bar', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:street":"Plaça de la Rosa dels Vents","amenity":"bar","indoor_seating":"yes","name":"Anita''s Bar Vela","outdoor_seating":"yes","wheelchair":"limited"}'::jsonb
from public.venues v where v.osm_id = '12205467236';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('12244682322', 'Wolf', 'Carrer dels Almogàvers 86', 41.3958866, 2.1886684, 'Barcelona', null, 'nightclub', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:housenumber":"86","addr:street":"Carrer dels Almogàvers","amenity":"nightclub","check_date":"2024-10-11","name":"Wolf"}'::jsonb
from public.venues v where v.osm_id = '12244682322';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('12246183831', 'La Paloma', 'Carrer del Tigre 27', 41.382371, 2.1642234, 'Barcelona', null, 'nightclub', '{}', 'https://lapaloma.com', null, '+34 933 016 897', null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Barcelona","addr:housenumber":"27","addr:postcode":"08001","addr:street":"Carrer del Tigre","amenity":"nightclub","email":"info@lapaloma.com","name":"La Paloma","phone":"+34 933 016 897","website":"https://lapaloma.com"}'::jsonb
from public.venues v where v.osm_id = '12246183831';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('12400373415', 'Bar Muñoz', 'Avinguda de la Mare de Déu de Montserrat 163', 41.4177606, 2.1712845, 'Barcelona', null, 'bar', '{}', null, null, null, 'Mo-Su 00:00-01:00,06:30-00:00')
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Barcelona","addr:housenumber":"163","addr:postcode":"08041","addr:street":"Avinguda de la Mare de Déu de Montserrat","amenity":"bar","name":"Bar Muñoz","opening_hours":"Mo-Su 00:00-01:00,06:30-00:00","outdoor_seating":"yes"}'::jsonb
from public.venues v where v.osm_id = '12400373415';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('12955040001', '5º pino', 'Passeig de la Bonanova 98', 41.401137, 2.1230085, 'Barcelona', null, 'bar', '{}', 'http://quintopino.es/', null, '+34932522281', 'Mo-Fr 08:00-00:30; Sa-Su 09:00-00:30')
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Barcelona","addr:housenumber":"98","addr:postcode":"08017","addr:street":"Passeig de la Bonanova","amenity":"bar","contact:instagram":"5pinobcn","cuisine":"spanish","name":"5º pino","opening_hours":"Mo-Fr 08:00-00:30; Sa-Su 09:00-00:30","outdoor_seating":"yes","phone":"+34932522281","website":"http://quintopino.es/","website:menu":"http://quintopino.es/cartas/"}'::jsonb
from public.venues v where v.osm_id = '12955040001';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('13069782182', 'Believe Club', 'Carrer de Balmes 56', 41.389444, 2.1626074, 'Barcelona', null, 'nightclub', '{}', 'https://thebelieve.club/', null, null, 'Mo-Th 23:00-05:00; Fr-Sa 23:00-06:00; Su 23:00-05:00')
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Barcelona","addr:housenumber":"56","addr:postcode":"08007","addr:street":"Carrer de Balmes","amenity":"nightclub","lgbtq":"primary","name":"Believe Club","opening_hours":"Mo-Th 23:00-05:00; Fr-Sa 23:00-06:00; Su 23:00-05:00","website":"https://thebelieve.club/"}'::jsonb
from public.venues v where v.osm_id = '13069782182';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('13070261580', 'Honey Bears Barcelona', 'Carrer de la Diputació 203', 41.3862819, 2.1613266, 'Barcelona', null, 'bar', '{}', 'https://honeyfurrybar.com/', null, null, 'Mo-Th 18:00-02:30; Fr-Sa 18:00-03:00; Su 18:00-02:30')
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Barcelona","addr:housenumber":"203","addr:street":"Carrer de la Diputació","amenity":"bar","brewery":"Estrella Galicia","check_date":"2025-12-26","level":"0","lgbtq":"primary","lgbtq:bears":"yes","lgbtq:men":"primary","name":"Honey Bears Barcelona","opening_hours":"Mo-Th 18:00-02:30; Fr-Sa 18:00-03:00; Su 18:00-02:30","operator":"Believe Group","outdoor_seating":"yes","website":"https://honeyfurrybar.com/"}'::jsonb
from public.venues v where v.osm_id = '13070261580';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('13583557201', 'Weed Park Barcelona', 'Carrer de Roger de Flor 96', 41.3943422, 2.1787479, 'Barcelona', null, 'nightclub', '{}', null, null, null, 'Mo-Su 10:00-00:00')
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:housenumber":"96","addr:postcode":"08013","addr:street":"Carrer de Roger de Flor","amenity":"nightclub","check_date":"2026-02-19","check_date:opening_hours":"2026-02-19","level":"0","name":"Weed Park Barcelona","opening_hours":"Mo-Su 10:00-00:00"}'::jsonb
from public.venues v where v.osm_id = '13583557201';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('13598466101', 'Badamola', 'Carrer de Sant Sebastià 37-39', 41.4514484, 2.2454403, 'Área metropolitana', null, 'nightclub', '{}', null, null, null, 'Mo-Fr 06:00-23:30; Sa-Su 09:00-00:00')
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:housenumber":"37-39","addr:postcode":"08911","addr:street":"Carrer de Sant Sebastià","amenity":"nightclub","check_date":"2026-02-25","check_date:opening_hours":"2026-02-25","name":"Badamola","opening_hours":"Mo-Fr 06:00-23:30; Sa-Su 09:00-00:00"}'::jsonb
from public.venues v where v.osm_id = '13598466101';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('13627121901', 'Les Enfants Brillants', 'Carrer de Guàrdia 3', 41.3780486, 2.1736809, 'Barcelona', null, 'nightclub', '{}', 'https://www.lesenfantsclub.com/', null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:housenumber":"3","addr:street":"Carrer de Guàrdia","amenity":"nightclub","name":"Les Enfants Brillants","website":"https://www.lesenfantsclub.com/"}'::jsonb
from public.venues v where v.osm_id = '13627121901';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('13786640101', 'Bar Xatu', 'Carrer de Rogent 50', 41.4095046, 2.1843077, 'Barcelona', null, 'bar', '{}', 'https://www.barxatu.com/', null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:housenumber":"50","addr:street":"Carrer de Rogent","amenity":"bar","check_date":"2026-05-02","indoor_seating":"yes","name":"Bar Xatu","outdoor_seating":"yes","website":"https://www.barxatu.com/"}'::jsonb
from public.venues v where v.osm_id = '13786640101';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('13859960401', 'Fluid', 'Carrer de Salvà 21', 41.3737545, 2.1662132, 'Barcelona', null, 'nightclub', '{}', null, null, null, 'Fr-Sa 20:00-03:00; Su 17:00-22:30; We-Th 20:00-01:00')
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:housenumber":"21","addr:postcode":"08004","addr:street":"Carrer de Salvà","amenity":"nightclub","contact:instagram":"fluidbcn","name":"Fluid","opening_hours":"Fr-Sa 20:00-03:00; Su 17:00-22:30; We-Th 20:00-01:00"}'::jsonb
from public.venues v where v.osm_id = '13859960401';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('14061882502', 'Sala Vivaldi', null, 41.3755431, 2.1512439, 'Barcelona', null, 'nightclub', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"amenity":"nightclub","name":"Sala Vivaldi"}'::jsonb
from public.venues v where v.osm_id = '14061882502';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('14065925801', 'Maricon Ghetto LGBT+ bar', 'Carrer d''Aribau 55', 41.3884056, 2.1591265, 'Barcelona', null, 'nightclub', '{}', 'https://mariconbar.com/', null, '+34 679 11 51 05', 'We-Su 18:00-03:00')
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:housenumber":"55","addr:postcode":"08011","addr:street":"Carrer d''Aribau","amenity":"nightclub","check_date":"2026-08-01","check_date:opening_hours":"2026-08-01","name":"Maricon Ghetto LGBT+ bar","opening_hours":"We-Su 18:00-03:00","phone":"+34 679 11 51 05","website":"https://mariconbar.com/"}'::jsonb
from public.venues v where v.osm_id = '14065925801';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('14065936702', 'Aire Chicas', 'Carrer de la Diputació 233', 41.3896884, 2.1657147, 'Barcelona', null, 'nightclub', '{}', null, null, '+34 934 87 83 42', null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:housenumber":"233","addr:postcode":"08007","addr:street":"Carrer de la Diputació","amenity":"nightclub","check_date":"2026-08-01","name":"Aire Chicas","phone":"+34 934 87 83 42"}'::jsonb
from public.venues v where v.osm_id = '14065936702';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('14124844352', 'La Cova de la Mari', 'Carrer del Consell de Cent 250', 41.3870679, 2.1606254, 'Barcelona', null, 'bar', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:housenumber":"250","addr:street":"Carrer del Consell de Cent","amenity":"bar","check_date":"2026-08-26","name":"La Cova de la Mari","outdoor_seating":"yes"}'::jsonb
from public.venues v where v.osm_id = '14124844352';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('14159923111', 'Bar Meridiana', 'Avinguda Meridiana 210-208', 41.4146522, 2.1872344, 'Barcelona', null, 'bar', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:housenumber":"210-208","addr:street":"Avinguda Meridiana","amenity":"bar","check_date":"2026-09-07","internet_access":"wlan","internet_access:fee":"customers","name":"Bar Meridiana","outdoor_seating":"yes"}'::jsonb
from public.venues v where v.osm_id = '14159923111';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('14280809101', 'Merlin DiscoClub', 'Carrer de la Diputació 223', 41.3884276, 2.1640974, 'Barcelona', null, 'nightclub', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:housenumber":"223","addr:postcode":"08007","addr:street":"Carrer de la Diputació","amenity":"nightclub","check_date":"2026-10-13","name":"Merlin DiscoClub"}'::jsonb
from public.venues v where v.osm_id = '14280809101';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('249402011', 'Sala Bikini', 'Avinguda Diagonal 547', 41.3894576, 2.1370991, 'Barcelona', null, 'nightclub', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Barcelona","addr:housenumber":"547","addr:street":"Avinguda Diagonal","amenity":"nightclub","building":"retail","harassment_prevention":"No Callem","layer":"-1","level":"-1","location":"underground","name":"Sala Bikini","name:ca":"Sala Bikini","sexual_antiharassment_policy":"yes","sexual_antiharassment_policy:name":"NoCallem","source":"Ajuntament de Barcelona - CartoBCN (@2013-11-10)","wikidata":"Q11946658","wikimedia_commons":"Category:Sala Bikini (Barcelona)","wikipedia":"ca:Sala Bikini"}'::jsonb
from public.venues v where v.osm_id = '249402011';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('426162558', 'Razzmatazz', 'Carrer dels Almogàvers 122', 41.3975851, 2.191249, 'Barcelona', null, 'nightclub', '{}', 'https://www.salarazzmatazz.com/', null, '+34 933 208 200', '"Depending on the concert"')
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:housenumber":"122","addr:postcode":"08018","addr:street":"Carrer dels Almogàvers","amenity":"nightclub","building":"public","building:levels":"3","check_date":"2026-03-07","contact:facebook":"salarazzmatazz","contact:instagram":"razzmatazzclubs","contact:twitter":"RazzmatazzClubs","email":"inforazz@salarazzmatazz.com","harassment_prevention":"No Callem","live_music":"yes","name":"Razzmatazz","name:ca":"Razzmatazz","opening_hours":"\"Depending on the concert\"","phone":"+34 933 208 200","roof:shape":"flat","sexual_antiharassment_policy":"yes","sexual_antiharassment_policy:name":"NoCallem","smoking":"outside","website":"https://www.salarazzmatazz.com/","wikidata":"Q249462","wikimedia_commons":"Category:Sala Razzmatazz","wikipedia":"ca:Razzmatazz"}'::jsonb
from public.venues v where v.osm_id = '426162558';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('531843956', 'Discoteca Candy', null, 41.3286931, 2.0465722, 'Área metropolitana', null, 'nightclub', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"amenity":"nightclub","building":"yes","name":"Discoteca Candy"}'::jsonb
from public.venues v where v.osm_id = '531843956';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('563367447', 'Be disco', 'Carrer de Miquel Torelló i Pagès 5', 41.4037835, 2.0225336, 'Área metropolitana', null, 'nightclub', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:housenumber":"5","addr:postcode":"08750","addr:street":"Carrer de Miquel Torelló i Pagès","amenity":"nightclub","building":"yes","name":"Be disco"}'::jsonb
from public.venues v where v.osm_id = '563367447';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('652925610', 'Sala Bóveda', null, 41.398335, 2.1999541, 'Barcelona', null, 'nightclub', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"amenity":"nightclub","building":"industrial","building:levels":"2","name":"Sala Bóveda"}'::jsonb
from public.venues v where v.osm_id = '652925610';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('684764234', 'Sala Vol', 'Carrer de Sancho de Ávila 78', 41.3993945, 2.1912559, 'Barcelona', null, 'nightclub', '{}', 'https://salavol.com/', null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:housenumber":"78","addr:postcode":"08018","addr:street":"Carrer de Sancho de Ávila","amenity":"nightclub","building":"retail","building:levels":"1","contact:facebook":"volbarcelona","contact:instagram":"salavol","contact:twitter":"salavol","name":"Sala Vol","name:en":"Sala Vol","name:es":"Sala Vol","website":"https://salavol.com/"}'::jsonb
from public.venues v where v.osm_id = '684764234';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('737029253', 'Costa Latina', 'Carretera de Terrassa 133', 41.5048452, 2.0360983, 'Rubí', null, 'nightclub', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Rubí","addr:housenumber":"133","addr:postcode":"08191","addr:street":"Carretera de Terrassa","amenity":"nightclub","building":"yes","name":"Costa Latina"}'::jsonb
from public.venues v where v.osm_id = '737029253';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('786532161', 'Row 14', null, 41.2749296, 2.0456994, 'Área metropolitana', null, 'nightclub', '{}', null, null, null, 'Su 11:00-23:00')
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"amenity":"nightclub","building":"yes","name":"Row 14","opening_hours":"Su 11:00-23:00"}'::jsonb
from public.venues v where v.osm_id = '786532161';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('791314974', 'Titus Carpa', 'Carretera de Mataró 629', 41.4581249, 2.2628271, 'Badalona', null, 'nightclub', '{}', 'https://www.titus.cat/', null, '+34 934 64 27 10', 'Sa 18:30-06:00; Su 12:00-06:00; Fr 00:00-06:00')
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Badalona","addr:housenumber":"629","addr:milestone":"km. 629","addr:postcode":"08911","addr:street":"Carretera de Mataró","amenity":"nightclub","building":"retail","building:levels":"1","check_date":"2026-08-01","check_date:opening_hours":"2026-08-01","name":"Titus Carpa","opening_hours":"Sa 18:30-06:00; Su 12:00-06:00; Fr 00:00-06:00","phone":"+34 934 64 27 10","toilets":"yes","toilets:access":"customers","website":"https://www.titus.cat/"}'::jsonb
from public.venues v where v.osm_id = '791314974';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('987786521', 'Sala Kèfem', 'Ronda de Can Fàbregas', 41.537436, 2.2171, 'Mollet del Vallès', null, 'nightclub', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Mollet del Vallès","addr:postcode":"08100","addr:street":"Ronda de Can Fàbregas","addr:unit":"6","amenity":"nightclub","building":"yes","name":"Sala Kèfem"}'::jsonb
from public.venues v where v.osm_id = '987786521';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('987786525', 'Discoteca Oms Club', 'Ronda de Can Fàbregas', 41.537282, 2.2173431, 'Mollet del Vallès', null, 'nightclub', '{}', null, null, '+34667604508', null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Mollet del Vallès","addr:postcode":"08100","addr:street":"Ronda de Can Fàbregas","amenity":"nightclub","building":"yes","name":"Discoteca Oms Club","phone":"+34667604508"}'::jsonb
from public.venues v where v.osm_id = '987786525';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('1077743365', 'Teatre Sant Cugat · Night Scene', null, 41.4766559, 2.0989904, 'Área metropolitana', null, 'nightclub', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"amenity":"nightclub","building":"commercial","name":"Teatre Sant Cugat · Night Scene","payment:mastercard":"yes","payment:visa":"yes"}'::jsonb
from public.venues v where v.osm_id = '1077743365';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('1110223671', 'Malalts de Festa', 'Carrer del Coure 9', 41.3555056, 2.0946111, 'Cornellà de Llobregat', null, 'nightclub', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"Cornellà de Llobregat","addr:housenumber":"9","addr:postcode":"08940","addr:street":"Carrer del Coure","amenity":"nightclub","min_age":"18","name":"Malalts de Festa","name:ca":"Malalts de Festa"}'::jsonb
from public.venues v where v.osm_id = '1110223671';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('1123907768', 'Kfè Olé', 'Carrer d''Enric Prat de la Riba 160', 41.3621067, 2.1076794, 'l''Hospitalet de Llobregat', null, 'nightclub', '{}', null, null, '+34 93 337 27 28', 'Su-Th 18:30-02:30; Fr-Sa 18:30-03:00')
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"addr:city":"l''Hospitalet de Llobregat","addr:housenumber":"160","addr:postcode":"08901","addr:street":"Carrer d''Enric Prat de la Riba","amenity":"nightclub","name":"Kfè Olé","opening_hours":"Su-Th 18:30-02:30; Fr-Sa 18:30-03:00","phone":"+34 93 337 27 28"}'::jsonb
from public.venues v where v.osm_id = '1123907768';

insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)
values ('1265334796', 'Discoteca Juanchito', null, 41.3636657, 2.1135686, 'Barcelona', null, 'nightclub', '{}', null, null, null, null)
on conflict (osm_id) do update set
  name = excluded.name, address = excluded.address, latitude = excluded.latitude,
  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,
  category = excluded.category, music_genres = excluded.music_genres,
  website_url = excluded.website_url, instagram_url = excluded.instagram_url,
  phone = excluded.phone, opening_hours = excluded.opening_hours;
insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)
select v.id, 'OpenStreetMap', 'https://www.openstreetmap.org/', 'ODbL-1.0', '{"amenity":"nightclub","building":"yes","name":"Discoteca Juanchito"}'::jsonb
from public.venues v where v.osm_id = '1265334796';

commit;
