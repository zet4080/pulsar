<?php
 
  
  class action_pulsarzet extends APP_GameAction
  { 
    // Constructor: please do not modify
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
    
    public function rolldice() {
      self::setAjaxMode();
      $this->game->doRollDice();
      self::ajaxResponse();
    }

    public function chooseDice() {
      self::setAjaxMode();
      $id = self::getArg( "id", AT_posint, true );
      $this->game->chooseDice($id);
      self::ajaxResponse();
    }

  }
  

