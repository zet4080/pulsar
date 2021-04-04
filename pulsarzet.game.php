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
require_once 'modules/JSON.php';
require_once 'modules/DicePosition.php';

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
            "nrOfDice" => 30
        ));        

        $this->systemcards = self::getNew( "module.common.deck" );
        $this->systemcards->init( "planetarysystems" );          
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
        
        self::setGameStateInitialValue('markerPosition', 6);
        JSON::create('playerorderround');
        JSON::create('playerorderphase');
        JSON::create('playerpoints');
        JSON::create('flightpath');

        $systems = array();
        for ($value = 1; $value <= 17; $value++) {
            $systems[] = array('type' => 'system-' . sprintf("%02d", $value), 'type_arg' => $value, 'nbr' => 1);
        }
        $this->systemcards->createCards($systems);
        $this->systemcards->shuffle('deck');

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
        $result['shiporder'] = JSON::read('playerorderround');
        $result['diceboard'] = self::getDiceboard();
        $result['playerdice'] = self::getPlayerDice();
        $result['blackhole'] = self::getBlackholeDice();
        $result['markerposition'] = self::getGameStateValue('markerPosition');
        $result['engineeringTrack'] = Track::getTrackForClient('engineeringTrack');        
        $result['initiativeTrack'] = Track::getTrackForClient('initiativeTrack');
        $result['playerpoints'] = JSON::read('playerpoints');
        $result['shippositions'] = self::getShipPositions();
        $result['pulsars'] = self::getPulsars();
        $result['systems'] = self::getSystems();
        $result['tokens'] = self::getTokens();
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

    function getAllPlayers () {
        $sql = "SELECT player_id id, player_no nr, player_score score, player_color color FROM player ";
        return self::getCollectionFromDb( $sql );        
    }    

//////////////////////////////////////////////////////////////////////////////
//////////// Gamestate Functions
////////////    

//////////////////////////////////////////////////////////////////////////////
//////////// TechBoard Player Action
////////////    

    function addGreenFlightBonusToPlayer() {

    }

//////////////////////////////////////////////////////////////////////////////
//////////// Rule Checks
////////////      

    function checkIfPatentIsAvailable($patentId) {
        throw new BgaUserException( self::_("This patent is not available.") );     
    }

    function checkIfItIsPlayerDie($tileId) {
        if (self::getActivePlayerId() != $tileId) {
            throw new BgaUserException( self::_("This is not your die! Choose one of your dice!") );     
        }
    }

    function assignPatentToPlayer($patent) {

    }
    
    function checkIfEntryPointIsValid($entryPoint) {
        if (array_search($entryPoint, $this->entrypoints) === false) {
            throw new BgaUserException(self::_("This is not a valid entry point!"));
        }
        $occupied = DBUtil::get('shipposition', array(
            'position' => $entryPoint
        ));
        if (count($occupied) > 0) {
            throw new BgaUserException(self::_("This entry point is already used!"));
        }
    }

    function placeShipAtEntryPoint($entrypoint) {
        $player = self::getActivePlayerId();
        DBUtil::insertRow('shipposition', array(
            'playerid' => $player,
            'position' => $entrypoint
        ));
    }

    function checkIfCorrectShipIsChoosen($variantId) {
        $player = DBUtil::get('player', array('player_id' => self::getActivePlayerId()), null, 'player_color color')[0];
        if ($player['color'] != $variantId) {
            throw new BgaUserException(self::_("This is not your ship!"));
        }
    }

    function calculateFlightPath($nodeId) {
        $currentPosition = DBUtil::get('shipposition', self::getActivePlayerId(), null, 'position')[0]['position'];
        If ($nodeId > $currentPosition) {
            $path = $currentPosition . '-' . $nodeId;
        } else {
            $path = $nodeId . '-' . $currentPosition;
        }
        return $path;
    }

    function checkIfNodeIsReachable($targetNode, $path) {
        if (array_search($path, $this->segments) === false) {
            throw new BgaUserException(self::_("Node is not reachable from your current position!"));
        }

        if (array_search($targetNode, array("1", "14", "24", "37"))) {
            throw new BgaUserException(self::_("Can't fly back to starting position!"));
        }
    }

    function checkIfPathIsAlreadyUsed($path) {
        $flightpath = JSON::read('flightpath')['path'];
        if (array_search($path, $flightpath)) {
            throw new BgaUserException(self::_("Segment already used!"));
        }
    }

    function moveShip($newPosition, $path) {
        DBUtil::updateRow('shipposition', self::getActivePlayerId(), array ('position' => $newPosition));
        $flightpath = JSON::read('flightpath');
        $flightpath["path"][] = $path;
        $flightpath["nodes"][] = $newPosition;
        JSON::write('flightpath', $flightpath);
    }

    function isPathFinished() {
        $flightpath = JSON::read('flightpath');
        if (count($flightpath["path"]) == self::getGameStateValue('choosenDie')) {
            return true;
        }
        return false;
    }

    function examineNodeForPulsar($node) {
        if (array_search($node, $this->pulsar) !== false) {
            $pulsar = DBUtil::get('pulsar', array ('node' => $node));
            if (count($pulsar) === 0) {
                DBUtil::insertRow('pulsar', array(
                    'playerid' => self::getActivePlayerId(),
                    'node' => $node,
                    'gyrodyne' => 0,
                    'active' => 0
                ));
                return $node;
            }
        }
        return null;
    }

    function inspectRouteForPlanetarySystems ($node) {
        $systems = [];
        $flightpath = JSON::read('flightpath')['nodes'];
        for ($i = 0; $i < count($flightpath); $i++) {
            if (array_search($flightpath[$i], $this->planetarysystems) !== false) {
               $systems [] = $this->systemcards->pickCardForLocation("deck", "starcluster", $flightpath[$i]);
            }
        }
        return $systems;
    }

    function claimPlanets ($systems, $node) {
        for ($i = 0; $i < count($systems); $i++) {
            $system = $systems[$i];
            if ($system["location_arg"] == $node) {
                if (!self::claimBluePlanet($system)) {
                    self::claimStonePlanet($system);
                };
            } else {
                if (!self::claimStonePlanet($system)) {
                    self::claimBluePlanet($system);
                };
            }
        }
    }

    function claimBluePlanet($system) {
        $occupied = DBUtil::get('tokens', array('element_type' => 'system', 'element_nr' => $system['type_arg'], 'type' => 'blue'));
        if (count($occupied) < $this->systems[$system['type_arg']]['blue']) {
            DBUtil::insertRow('tokens', array(
                'element_id' => $system['type'],
                'element_type' => 'system',
                'element_nr' => $system['type_arg'],
                'type' => 'blue',
                'position' => count($occupied),
                'player' => self::getActivePlayerId()
            ));
            return true;
        } 
        return false;
    }

    function claimStonePlanet($system) {
        $occupied = DBUtil::get('tokens', array('element_type' => 'system', 'element_nr' => $system['type_arg'], 'type' => 'stone'));
        if (count($occupied) < $this->systems[$system['type_arg']]['stone']) {
            DBUtil::insertRow('tokens', array(
                'element_id' => $system['type'],
                'element_type' => 'system',
                'element_nr' => $system['type_arg'],
                'type' => 'stone',
                'position' => count($occupied),
                'player' => self::getActivePlayerId()
            ));
            return true;
        } 
        return false;
    }

//////////////////////////////////////////////////////////////////////////////
//////////// Player Order
////////////     

    function calculatePlayerOrderRound() {
        $order = Track::getPlayerOrder('initiativeTrack');
        JSON::write('playerorderround', $order);                        
    }

    function calculatePlayerOrderShipPlacement() {
        $order = JSON::read('playerorderround');
        $order = array_reverse($order);
        JSON::write('playerorderphase', $order);
    }    

    function calculatePlayerOrderDicePhase() {
        $first = JSON::read('playerorderround');
        $second = array_reverse($first);
        $order = array_merge($first, $second);
        JSON::write('playerorderphase', $order);
    }

    function calculatePlayerOrderActionPhase() {
        $order = JSON::read('playerorderround');
        JSON::write('playerorderphase', $order);
    }

    function activateNextPlayer() {
        $order = JSON::read('playerorderphase');
        if (count($order) > 0) {
            $nextPlayer = array_shift($order);
            JSON::write('playerorderphase', $order);
            $this->gamestate->changeActivePlayer($nextPlayer);
            return true;
        }
        return false;        
    }

//////////////////////////////////////////////////////////////////////////////
//////////// Dice Handling
////////////     

    function movePlayerDieToBlackHole ($die) {
        $player = self::getActivePlayerId();
        $id = DBUtil::get('dice', array('player' => $player, 'value' => $die), null, 'id')[0]['id'];
        DBUtil::updateRow('dice', $id, array('location' => 'blackhole'));
    }

    function createDice ($nrOfPlayers) {
        if ($nrOfPlayers == 4) {
            $nrOfDice = 9;
        } else {
            $nrOfDice = 7;
        }
		$dice = array ();
		for ($i = 0; $i < $nrOfDice; $i++) {
			$dice [] = array (
                'id' => $i,
                'value' => bga_rand(1, 6),
                'location' => 'blackhole',
                'player' => 0
            );
        }
        self::setGameStateInitialValue('nrOfDice', $nrOfDice);
        DBUtil::insertRows('dice', $dice);        
    }

    function initializeDiceboardTracks() {
        $engineeringtrack = new Track('engineeringtrack');
        $initiativetrack = new Track('initiativetrack');
        $players = JSON::read('playerorderround');
        for ($i = 0; $i < count($players); $i++) {
            $engineeringtrack->addPlayer($players[$i], 8);
            $initiativetrack->addPlayer($players[$i], 8);
        }
        $engineeringtrack->save();
        $initiativetrack->save();
    }

    function rollDice () {
        $diceposition = new DicePosition();
        $nrOfDice = self::getGameStateValue('nrOfDice');
		for ($i = 0; $i < $nrOfDice; $i++) {
            $value = bga_rand(1, 6);
            $position = $diceposition->calculate($value);
			$dice = array (
                'id' => $i,
                'value' => $value,
                'location' => 'diceboard',
                'position' => $position,
                'player' => 0
            );
            DBUtil::updateRow('dice', $i, $dice);
        }          
    }

    function getDiceboard () {
        return DBUtil::get('dice', array('location' => 'diceboard'), 'value', 'id, value, position');
    }

    function getPlayerDice () {
        return DBUtil::get('dice', array('location' => 'player'), null, 'id, value, player');
    }

    function getBlackholeDice () {
        return DBUtil::get('dice', array('location' => 'blackhole'), null, 'id, value');
    }    

    function getShipPositions () {
        return DBUtil::get('shipposition');
    }

    function getPulsars () {
        return DBUtil::get('pulsar');
    }

    function getTokens () {
        return DBUtil::get('tokens', null, null, 'element_id tileId, player player, position position, type overlay');
    }    

    function getSystems () {
        return DBUtil::get('planetarysystems', array ('card_location' => 'starcluster'), null, 'card_location_arg node, card_type system');
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

    function calculateMarkerDistance() {
        $markerPos = self::getGameStateValue('markerPosition');
        $choosenDie = self::getGameStateValue('choosenDie');
        $dieValue = 2 * $choosenDie - 1;
        $distance = $dieValue - $markerPos;
        return $distance;
    }

//////////////////////////////////////////////////////////////////////////////
//////////// Notifications
////////////   

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

    function sendShipOrder() {
        self::notifyAllPlayers("setup/playerorder", '', array(
            'players'     => self::getAllPlayers(),
            'playerorder' => JSON::read('playerorderround')
        ));
    }

    function sendMarkerPosition() {
        self::notifyAllPlayers("setup/marker", '', array(
            'markerposition' => self::getGameStateValue('markerPosition')
        ));
    }

    function sendDiceboard() {
        self::notifyAllPlayers("setup/diceboard", '', array(
            'dice' => self::getDiceboard()
        ));
    }

    function sendTechboardToken($patent) {
        self::notifyAllPlayers("server/settechboardtoken", '', array(
            'player_id' => self::getActivePlayerId(),
            'patent' => $patent
        ));
    }

    function sendDieUpdate() {
        self::notifyAllPlayers("server/updatedie", '', array(
            'player_id' => self::getActivePlayerId(),
            'playerdice' => self::getPlayerDice(),
            'blackholedice' => self::getBlackholeDice()
        ));
    }

    function sendShipPosition() {
        self::notifyAllPlayers("setup/shippositions", '', array(
            'shippositions' => self::getShipPositions()
        ));
    }

    function sendPulsarInformation($node) {
        if (!is_null($node) && !$node === false) {
            self::notifyAllPlayers("setup/pulsars", '', array(
                'pulsars' => self::getPulsars()
            ));
        }
    }

    function sendSystemInformation($systems) {
        if (!is_null($systems) && count($systems) > 0) {
            self::notifyAllPlayers("setup/systems", '', array(
                'systems' => self::getSystems()
            ));
        }
    }

    function sendTokens() {
        self::notifyAllPlayers("setup/tokens", '', array(
            'tokens' => self::getTokens()
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

    function click_initiativetrack_in_state_player_choose_track($tileId) {
        self::checkAction('chooseInitiativeTrack');
        $dist = self::calculateMarkerDistance();
        $track = new Track('initiativetrack');
        $track->movePlayer(self::getActivePlayerId(), $dist);
        $track->save();
        self::sendTrackInformation('initiativetrack', $track);
        $this->gamestate->nextState("trackChoosen");
    }  

    function click_starcluster_in_state_player_choose_entrypoint($tileId, $clickAreaId) {
        self::checkAction('chooseEntryPoint');
        self::checkIfEntryPointIsValid($clickAreaId);
        self::placeShipAtEntryPoint($clickAreaId);
        self::sendShipPosition();
        $this->gamestate->nextState("shipChoosen");
    }    

    function click_starcluster_in_state_player_select_ship_route($tileId, $clickAreaId) {
        $path = self::calculateFlightPath($clickAreaId);
        self::checkIfNodeIsReachable($clickAreaId, $path);
        self::checkIfPathIsAlreadyUsed($path);
        self::moveShip($clickAreaId, $path);
        self::sendShipPosition();
        if (self::isPathFinished()) {
            $pulsar = self::examineNodeForPulsar($clickAreaId);
            self::sendPulsarInformation($pulsar);

            $systems = self::inspectRouteForPlanetarySystems($clickAreaId);
            self::claimPlanets($systems, $clickAreaId); 
            self::sendSystemInformation($systems);
            self::sendTokens();
            $this->gamestate->nextState("routeEnded");
        }
    }        

    function click_ship_in_state_player_choose_action_or_modifier($tileId, $tokenId, $posId, $variantId) {
        self::checkAction('flyShip');
        self::checkIfCorrectShipIsChoosen($variantId);
        JSON::write('flightpath', array('path' => [], 'nodes' => []));
        $this->gamestate->nextState("flyShip");
    }

    function click_dice_in_state_player_choose_action_die($tileId, $tokenId, $posId, $variantId) {
        self::checkAction('chooseDie');
        self::checkIfItIsPlayerDie($tileId);
        self::movePlayerDieToBlackHole($variantId);
        self::sendDieUpdate($variantId);
        self::setGameStateValue("choosenDie", $variantId);
        $this->gamestate->nextState("dieChoosen");
    }
    
    function click_A_1_1_in_state_player_choose_action($tileId) {
        self::checkAction('patentTechnology');
        self::checkIfPatentIsAvailable("A-1-1");
        self::checkIfPlayerHasCorrectDice(1);
        self::assignPatentToPlayer("A-1-1");
        self::movePlayerDieToBlackHole(1);
        self::sendTechboardToken("A-1-1");
        self::sendDieUpdate(1);
        $this->gamestate->nextState("actionChoosen");
    }
    
//////////////////////////////////////////////////////////////////////////////
//////////// Game state arguments
////////////


//////////////////////////////////////////////////////////////////////////////
//////////// Game state actions
////////////
    
    // in the first round the player order and the tokens on the engineering track do not match!
    // the first player is on the bottom of the stack.
    function stStartFirstRound () {
        $players = DBUtil::get('player', null, 'player_no', 'player_id');
        for ($i = 0; $i < count($players); $i++) {
            $order [] = $players[$i]['player_id'];
            $points [$players[$i]['player_id']] = $i + 5;
        }
        self::createDice (count($players));
        JSON::write('playerorderround', $order);
        JSON::write('playerpoints', $points);
        
        self::calculatePlayerOrderShipPlacement();
        self::initializeDiceboardTracks();

        $this->gamestate->nextState("roundStarted");
    }

    function stStartRound () {
        self::calculatePlayerOrderRound();
        self::sendShipOrder();
        $this->gamestate->nextState("roundStarted");
    }
    
    function stCalculateNextPlayerDuringShipPlacement () {
        if (self::activateNextPlayer() == true) {
            $this->gamestate->nextState("nextPlayerCalculated");
        } else {
            $this->gamestate->nextState("startDicePhase");
        }
    }    

    function stStartDicePhase () {
        self::rollDice();
        self::sendDiceboard();

        self::calculateMarker();
        self::sendMarkerPosition();

        self::calculatePlayerOrderDicePhase();
        $this->gamestate->nextState("dicePhaseStarted");
    }    

    function stCalculateNextPlayerDuringDicePhase () {
        if (self::activateNextPlayer() == true) {
            $this->gamestate->nextState("nextPlayerCalculated");
        } else {
            $this->gamestate->nextState("startActionPhase");
        }
    }

    function stStartActionPhase() {
        self::calculatePlayerOrderActionPhase();
        self::activateNextPlayer();
        $this->gamestate->nextState("actionPhaseStarted");
    }

    function stCalculateNextPlayerDuringActionPhase() {
        $dice = DBUtil::get('dice', array('player' => self::getActivePlayerId(), 'location' => 'player'));
        if (count($dice) > 0) {
            $this->gamestate->nextState('nextPlayerCalculated');
        } else if (self::activateNextPlayer() == true) {
            $this->gamestate->nextState("nextPlayerCalculated");
        } else {
            $this->gamestate->nextState("roundEnded");
        }
    }

    function stStartProductionPhase() {
        $this->gamestate->nextState("productionPhaseCompleted");
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
