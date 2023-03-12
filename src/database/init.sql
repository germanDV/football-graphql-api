create table if not exists competitions (
  id bigint primary key,
  name text not null,
  code text not null,
  area_name text
);

create table if not exists teams (
  id bigint primary key,
  name text not null,
  tla text,
  short_name text,
  area_name text,
  address text
);

create table if not exists players (
  id bigint primary key,
  name text,
  position text,
  dob text,
  nationality text
);

create table competition_teams (
  team_id bigint not null,
  competition_id bigint not null,
  primary key(team_id, competition_id) 
);

create table team_players (
  player_id bigint not null,
  team_id bigint not null,
  primary key(player_id, team_id) 
);
