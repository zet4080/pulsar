<?php
/**
 *------
 * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
 * PulsarZet implementation : © <Your name here> <Your email address here>
 *
 * This code has been produced on the BGA studio platform for use on https://boardgamearena.com.
 * See http://en.doc.boardgamearena.com/Studio for more information.
 * -----
 * 
 * pulsarzet.action.php
 *
 * PulsarZet main action entry point
 *
 *
 * In this file, you are describing all the methods that can be called from your
 * user interface logic (javascript).
 *       
 * If you define a method "myAction" here, then you can call it from your javascript code with:
 * this.ajaxcall( "/pulsarzet/pulsarzet/myAction.html", ...)
 *
 */
  
  
  class action_pulsarzet extends APP_GameAction
  { 
   	public function __default()
  	{
  	    if( self::isArg( 'notifwindow') )
  	    {
            $this->view = "common_notifwindow";
  	        $this->viewArgs['table'] = self::getArg( "table", AT_posint, true );
  	    }
  	    else
  	    {
            $this->view = "pulsarzet_pulsarzet";
            self::trace( "Complete reinitialization of board game" );
      }
  	} 
  	
    public function click() {
      
      self::setAjaxMode();
      
      $tileId = self::getArg("tileId", AT_alphanum, false);
      $tokenId = self::getArg("tokenId", AT_alphanum, false);
      $posId = self::getArg("posId", AT_alphanum, false);
      $variantId = self::getArg("variantId", AT_alphanum, false);
      $clickAreaId = self::getArg("clickAreaId", AT_alphanum, false);
      $currentState = $this->game->gamestate->state();
      
      /*
      try {
      */
        if (isset($tokenId)) {
          $methodName = "click_" . $tokenId . '_in_state_' . $currentState['name'];
          $this->game->$methodName($tileId, $tokenId, $posId, $variantId);
        } else if ($tileId == "starcluster") {
          $methodName = "click_" . $tileId . '_in_state_' . $currentState['name'];
          $this->game->$methodName($tileId, $clickAreaId);
        } else {
          $methodName = "click_" . $clickAreaId . '_in_state_' . $currentState['name'];
          $this->game->$methodName($tileId, $clickAreaId, $posId, $variantId);
        }
      /*
      } catch (\Throwable $e) {
        $this->game->actionNotAvailable();
      }
      */
      self::ajaxResponse();
    }
  }