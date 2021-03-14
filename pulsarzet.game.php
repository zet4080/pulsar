<?php
 /**
  *------
  * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
  * PulsarZet implementation : © <Your name here> <Your email address here>
  * 
  * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
  * See http://en.boardgamearena.com/#!doc/Studio for more information.
  * -----
  * 
  * pulsarzet.game.php
  *
  * This is the main file for your game logic.
  *
  * In this PHP file, you are going to defines the rules of the game.
  *
  */


require_once( APP_GAMEMODULE_PATH.'module/table/table.game.php' );
require_once 'modules/DBUtil.php';
require_once 'modules/Track.php';

class PulsarZet extends Table
{
	function __construct( )
	{
        // Your global variables labels:
        //  Here, you can assign labels to global variables you are using for this game.
        //  You can use any number of global variables with IDs between 10 and 99.
        //  If your game has options (variants), you also have to associate here a label to
        //  the corresponding ID in gameoptions.inc.php.
        // Note: afterwards, you can get/set the global variables with getGameStateValue/setGameStateInitialValue/setGameStateValue
        parent::__construct();
        
        self::initGameStateLabels(array( 
            "markerPosition" => 10,
            "choosenDie" => 20,
        ));        
	}
	
    protected function getGameName( )
    {
		// Used for translations and stuff. Please do not modify.
        return "pulsarzet";
    }	

    /*
        setupNewGame:
        
        This method is called only once, when a new game is launched.
        In this method, you must setup the game according to the game rules, so that
        the game is ready to be played.
    */
    protected function setupNewGame( $players, $options = array() )
    {    
        // Set the colors of the players with HTML color code
        // The default below is red/green/blue/orange/brown
        // The number of colors defined here must correspond to the maximum number of players allowed for the gams
        $gameinfos = self::getGameinfos();
        $default_colors = $gameinfos['player_colors'];
 
        // Create players
        // Note: if you added some extra field on "player" table in the database (dbmodel.sql), you can initialize it there.
        $sql = "INSERT INTO player (player_id, player_color, player_canal, player_name, player_avatar) VALUES ";
        $values = array();
        foreach( $players as $player_id => $player )
        {
            $color = array_shift( $default_colors );
            $values[] = "('".$player_id."','$color','".$player['player_canal']."','".addslashes( $player['player_name'] )."','".addslashes( $player['player_avatar'] )."')";
        }
        $sql .= implode( $values, ',' );
        self::DbQuery( $sql );
        self::reattributeColorsBasedOnPreferences( $players, $gameinfos['player_colors'] );
        self::reloadPlayersBasicInfos();
        
        /************ Start the game initialization *****/

        self::createDice ();
        self::initializeDiceboardTracks();
        self::setGameStateInitialValue('markerPosition', 0);
        $this->activeNextPlayer();

        /************ End of the game initialization *****/
    }

    /*
        getAllDatas: 
        
        Gather all informations about current game situation (visible by the current player).
        
        The method is called each time the game interface is displayed to a player, ie:
        _ when the game starts
        _ when a player refreshes the game page (F5)
    */
    protected function getAllDatas()
    {
        $result = array();
    
        $current_player_id = self::getCurrentPlayerId();    // !! We must only return informations visible by this player !!
    
        // Get information about players
        // Note: you can retrieve some extra field you added for "player" table in "dbmodel.sql" if you need it.
        $result['players'] = self::getAllPlayers();
        $result['diceboard'] = self::getDiceboard();
        $result['playerdice'] = self::getPlayerDice();
        $result['markerposition'] = self::getGameStateValue('markerPosition');
        $result['engineeringTrack'] = Track::getTrackForClient('engineeringTrack');        
        $result['initiativeTrack'] = Track::getTrackForClient('initiativeTrack');
        return $result;
    }

    /*
        getGameProgression:
        
        Compute and return the current game progression.
        The number returned must be an integer beween 0 (=the game just started) and
        100 (= the game is finished or almost finished).
    
        This method is called each time we are in a game state with the "updateGameProgression" property set to true 
        (see states.inc.php)
    */
    function getGameProgression()
    {
        // TODO: compute and return the game progression

        return 0;
    }


//////////////////////////////////////////////////////////////////////////////
//////////// Utility functions
////////////    

    function error($text) {
        echo "<pre>";
        var_dump( $text );
        echo "</pre>";
        die('ok');
    }

    function createDice () {
		$dice = array ();
		for ($i = 0; $i < 7; $i++) {
			$dice [] = array (
                'id' => $i,
                'value' => bga_rand(1, 6),
                'location' => 'blackhole',
                'player' => 0
            );
        }
        DBUtil::insertRows('dice', $dice);        
    }

    function initializeDiceboardTracks() {
        $engineeringtrack = new Track('engineeringtrack');
        $initiativetrack = new Track('initiativetrack');
        $players = self::getAllPlayers();
        foreach ($players as $player_id => $player) {
            $engineeringtrack->addPlayer($player_id, 8);
            $initiativetrack->addPlayer($player_id, 8);
        }
        $engineeringtrack->save();
        $initiativetrack->save();
    }

    function rollDice () {
		for ($i = 0; $i < 7; $i++) {
			$dice = array (
                'id' => $i,
                'value' => bga_rand(1, 6),
                'location' => 'diceboard',
                'player' => 0
            );
            DBUtil::updateRow('dice', $i, $dice);
        }          
    }

    function getDiceboard() {
        return DBUtil::get('dice', array('location' => 'diceboard'), 'value', 'id, value');
    }

    function getPlayerDice() {
        return DBUtil::get('dice', array('location' => 'player'), null, 'id, value, player');
    }

    function moveDiceFromBoardToPlayer($value) {
        $dice = DBUtil::get('dice', array('location' => 'diceboard', 'value' => $value), null, 'id');
        $die = array_shift($dice);
        if (!is_null($die)) {
            $update = array (
                'location' => 'player',
                'player' => self::getCurrentPlayerId()
            );
            DBUtil::updateRow('dice', $die['id'], $update);
        }
    }

    function calculateMarker () {
        $dice = $this->getDiceboard();
        $middleDie = $dice[3]['value'];
        $lower = 0;
        $higher = 0;
        foreach ($dice as $id => $die) {
            if ($die['value'] < $middleDie) {
                $lower = $lower + 1;
            }
            if ($die['value'] > $middleDie) {
                $higher = $higher + 1;
            }
        }   
        if ($lower == $higher) {
            $marker = ($middleDie * 2) - 1;
        }
        if ($lower > $higher) {
            $marker = ($middleDie * 2) - 2;
        }
        if ($lower < $higher) {
            $marker = ($middleDie * 2);
        }
        self::setGameStateValue("markerPosition", $marker);
    }

    function respond ($tileId, $tokenId, $posId, $variantId) {
        $currentState = $this->gamestate->state();
        self::notifyAllPlayers("serverresponse", '', array(
            'player_id'   => self::getActivePlayerId(),
            'player_name' => self::getActivePlayerName(),
            'players'     => self::getAllPlayers(),
            'state'       => $currentState['name'],  
            'tileId'      => $tileId,
            'tokenId'     => $tokenId,
            'posId'       => $posId,
            'variantId'   => $variantId
        ));
    }

    function getAllPlayers () {
        $sql = "SELECT player_id id, player_no nr, player_score score, player_color color FROM player ";
        return self::getCollectionFromDb( $sql );        
    }

    function calculateMarkerDistance() {
        $markerPos = self::getGameStateValue('markerPosition');
        $choosenDie = self::getGameStateValue('choosenDie');
        $dieValue = 2 * $choosenDie - 1;
        $distance = $dieValue - $markerPos;
        return $distance;
    }

    function sendTrackInformation($trackId, $track) {
        $currentState = $this->gamestate->state();
        self::notifyAllPlayers("serverresponse", '', array(
            'player_id'   => self::getActivePlayerId(),
            'player_name' => self::getActivePlayerName(),
            'players'     => self::getAllPlayers(),
            'state'       => $currentState['name'],
            'clickAreaId' => $trackId,
            'track'       => $track->getTrackForClient()            
        ));
    }

//////////////////////////////////////////////////////////////////////////////
//////////// Player actions
//////////// 

    function click_dice_in_state_player_choose_dice($tileId, $tokenId, $posId, $variantId) {
        self::checkAction('chooseDie'); 
        self::moveDiceFromBoardToPlayer($variantId);
        self::setGameStateValue("choosenDie", $variantId);
        $this->respond($tileId, $tokenId, $posId, $variantId);
        $this->gamestate->nextState("dieChoosen");
    }

    function click_engineeringtrack_in_state_player_choose_track($tileId) {
        self::checkAction('chooseEngineeringTrack');
        $dist = self::calculateMarkerDistance();
        $track = new Track('engineeringtrack');
        $track->movePlayer(self::getActivePlayerId(), $dist);
        $track->save();
        self::sendTrackInformation('engineeringtrack', $track);
        $this->gamestate->nextState("trackChoosen");
    }
    
//////////////////////////////////////////////////////////////////////////////
//////////// Game state arguments
////////////


//////////////////////////////////////////////////////////////////////////////
//////////// Game state actions
////////////

    function stStartRound () {
        self::rollDice();
        self::calculateMarker();
        $this->gamestate->nextState("roundStarted");
    }

    function stCalculateNextPlayerDuringDicePhase () {
        $this->activeNextPlayer();
        $this->gamestate->nextState("nextPlayerCalculated");
    }

//////////////////////////////////////////////////////////////////////////////
//////////// Zombie
////////////

    /*
        zombieTurn:
        
        This method is called each time it is the turn of a player who has quit the game (= "zombie" player).
        You can do whatever you want in order to make sure the turn of this player ends appropriately
        (ex: pass).
        
        Important: your zombie code will be called when the player leaves the game. This action is triggered
        from the main site and propagated to the gameserver from a server, not from a browser.
        As a consequence, there is no current player associated to this action. In your zombieTurn function,
        you must _never_ use getCurrentPlayerId() or getCurrentPlayerName(), otherwise it will fail with a "Not logged" error message. 
    */

    function zombieTurn( $state, $active_player )
    {
    	$statename = $state['name'];
    	
        if ($state['type'] === "activeplayer") {
            switch ($statename) {
                default:
                    $this->gamestate->nextState( "zombiePass" );
                	break;
            }

            return;
        }

        if ($state['type'] === "multipleactiveplayer") {
            // Make sure player is in a non blocking status for role turn
            $this->gamestate->setPlayerNonMultiactive( $active_player, '' );
            
            return;
        }

        throw new feException( "Zombie mode not supported at this game state: ".$statename );
    }
    
///////////////////////////////////////////////////////////////////////////////////:
////////// DB upgrade
//////////

    /*
        upgradeTableDb:
        
        You don't have to care about this until your game has been published on BGA.
        Once your game is on BGA, this method is called everytime the system detects a game running with your old
        Database scheme.
        In this case, if you change your Database scheme, you just have to apply the needed changes in order to
        update the game database and allow the game to continue to run with your new version.
    
    */
    
    function upgradeTableDb( $from_version )
    {
        // $from_version is the current version of this game database, in numerical form.
        // For example, if the game was running with a release of your game named "140430-1345",
        // $from_version is equal to 1404301345
        
        // Example:
//        if( $from_version <= 1404301345 )
//        {
//            // ! important ! Use DBPREFIX_<table_name> for all tables
//
//            $sql = "ALTER TABLE DBPREFIX_xxxxxxx ....";
//            self::applyDbUpgradeToAllDB( $sql );
//        }
//        if( $from_version <= 1405061421 )
//        {
//            // ! important ! Use DBPREFIX_<table_name> for all tables
//
//            $sql = "CREATE TABLE DBPREFIX_xxxxxxx ....";
//            self::applyDbUpgradeToAllDB( $sql );
//        }
//        // Please add your future database scheme changes here
//
//


    }    
}
