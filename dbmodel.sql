
-- ------
-- BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
-- PulsarZet implementation : © <Your name here> <Your email address here>
-- 
-- This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
-- See http://en.boardgamearena.com/#!doc/Studio for more information.
-- -----

-- dbmodel.sql

CREATE TABLE IF NOT EXISTS `actions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `action` tinyint UNSIGNED NOT NULL,
  `locked` tinyint UNSIGNED NOT NULL,
  `phase` tinyint UNSIGNED NOT NULL,
  `player` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `tokens` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `player` int(11) NOT NULL,
  `componentType` varchar(20) NOT NULL,
  `tileId` varchar(20) NOT NULL,
  `overlay` varchar(20) NOT NULL,
  `position` tinyint UNSIGNED NOT NULL,
  `info` varchar(20) NOT NULL DEFAULT "",
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `dice` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `value` varchar(16) NOT NULL,
  `location` varchar(16) NOT NULL,
  `position` tinyint UNSIGNED NOT NULL,
  `player` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

CREATE TABLE IF NOT EXISTS `json` (
  `id` varchar(255) NOT NULL,
  `value` varchar(65535) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `playerinfo` (
  `playerid` int(11) NOT NULL,
  `position` tinyint UNSIGNED NOT NULL DEFAULT 0,
  `modifierone` tinyint UNSIGNED NOT NULL DEFAULT 1,
  `modifiertwo` tinyint UNSIGNED NOT NULL DEFAULT 0,
  `gyrodyneone` tinyint UNSIGNED NOT NULL DEFAULT 0,
  `gyrodynetwo` tinyint UNSIGNED NOT NULL DEFAULT 0,
  `gyrodynethree` tinyint UNSIGNED NOT NULL DEFAULT 0,
  `pulsarrings` tinyint UNSIGNED NOT NULL DEFAULT 6,
  PRIMARY KEY (`playerid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `pulsar` (
  `playerid` int(11) NOT NULL,
  `node` tinyint UNSIGNED NOT NULL,
  `gyrodyne` tinyint UNSIGNED NOT NULL,
  `active` tinyint UNSIGNED NOT NULL,
  PRIMARY KEY (`node`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `planetarysystems` (
  `card_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `card_type` varchar(16) NOT NULL,
  `card_type_arg` int(11) NOT NULL,
  `card_location` varchar(16) NOT NULL,
  `card_location_arg` int(11) NOT NULL,
  PRIMARY KEY (`card_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;
