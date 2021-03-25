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
 * material.inc.php
 *
 * PulsarZet game material description
 *
 * Here, you can describe the material of your game with PHP variables.
 *   
 * This file is loaded in your game logic class constructor, ie these variables
 * are available everywhere in your game logic code.
 *
 */

$this->entrypoints = array(1, 14, 24, 37);
$this->pulsar = array(5, 11, 16, 22, 28, 35, 42, 47, 50, 61, 66, 87);
$this->isolatedpulsar = array(70, 71, 76);

$this->segments = array (
  "1-2", "2-3", "2-48", "3-4", "4-5", "4-6", "5-6", "6-7", "7-8", "8-9", "9-10", "9-86", 
  "10-11", "10-13", "11-12", "12-13", "13-14", "13-15", "15-16", "15-17", "15-74", "16-17", "17-18", 
  "18-19", "19-20", "20-21", "20-22", "21-23", "23-24", "23-25", "25-26", "25-69", "25-26", "26-27",
  "27-28", "27-29", "28-29", "29-30", "30-31", "31-32", "32-33", "32-58", "32-59", "33-34", "33-36",
  "34-35", "35-36", "36-38", "37-38", "38-39", "39-40", "39-41", "40-54", "41-42", "41-43", "42-42",
  "43-44", "44-45", "44-49", "44-83", "45-46", "45-48", "46-47", "47-48", "49-50", "49-51", "50-51",
  "51-52", "52-53", "53-54", "54-55", "55-56", "56-57", "57-58", "59-60", "60-61", "61-62", "62-63",
  "63-64", "63-66", "64-65", "65-66", "67-68", "68-69", "68-72", "72-73", "73-75", "74-75", "75-77",
  "77-78", "77-79", "78-79", "79-80", "80-81", "81-84", "82-84", "83-84", "84-85", "85-86", "85-87"
);