create table if not exists competitions (
  id bigint primary key,
  name text not null,
  code text not null,
  area_name text not null 
);

create table if not exists teams (
  id bigint primary key,
  name text not null,
  tla text not null,
  short_name text not null,
  area_name text not null,
  address text not null
);

create table if not exists players (
  id bigint primary key,
  name text not null,
  position text not null,
  dob text not null,
  nationality text not null,
  team_id bigint,
  constraint fk_team
    foreign key(team_id)
      references teams(id)
      on delete set null
);

create table competition_teams (
  team_id bigint not null,
  competition_id bigint not null,
  primary key(team_id, competition_id) 
);
