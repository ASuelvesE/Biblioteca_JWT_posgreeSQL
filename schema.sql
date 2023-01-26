create database tournament;
use tournament;

create table teams (
    name varchar(255) not null primary key,
    details varchar(255),
    image varchar(255),
    points int unsigned not null
);

create table matches(
    datetime datetime not null,
    teamA varchar(255) not null,
    teamB varchar(255) not null,
    pointsA int unsigned not null,
    pointsB int unsigned not null,
    primary key(datetime, teamA, teamB)
    foreign key(teamA) references teams(name)
    foreign key(teamB) references teams(name)
);

create table admins(
    email varchar(60) primary key
);