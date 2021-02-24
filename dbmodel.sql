CREATE TABLE IF NOT EXISTS `dice` (
  `diceId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `value` varchar(16) NOT NULL,
  `location` varchar(16) NOT NULL,
  `player` int(11) NOT NULL,
  PRIMARY KEY (`diceId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;