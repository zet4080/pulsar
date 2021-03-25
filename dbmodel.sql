
-- ------
-- BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
-- PulsarZet implementation : © <Your name here> <Your email address here>
-- 
-- This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
-- See http://en.boardgamearena.com/#!doc/Studio for more information.
-- -----

-- dbmodel.sql

CREATE TABLE IF NOT EXISTS `patents` (
  `patent` varchar(5) NOT NULL,
  `locked` TINYINT(1) NOT NULL,
  `player1` int(11) NOT NULL,
  `player2` int(11) NOT NULL,
  PRIMARY KEY (`patent`)
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

CREATE TABLE IF NOT EXISTS `shipposition` (
  `playerid` int(11) NOT NULL,
  `position` tinyint UNSIGNED NOT NULL,
  PRIMARY KEY (`playerid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
