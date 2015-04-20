var gameAnswer = "";
var gameShownAnswer = "";
var hangmanState = -1;
var words = ['anthropology', 'history', 'religion', 'science'];
// pick a word randomly for the game
var pickWord = function(words){
  var randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];

};

// creates _ based on chosen word
var blanks = function(word){
  var result = "";
  
  for(var i = 0; i < word.length; i++){
    result = "_" + result;
  }

  return result;
};

// when player guesses a letter correctly, update the blanks accordingly
var updateBlanks = function(position,c,originalString){
  return originalString.substr(0,position) + c + originalString.substr(position+1, originalString.length);
};

var guessLetter = function(letter, displayed, solution){
  var letterIndex = 0;
  letterIndex = solution.indexOf(letter);

  // iterate through displayed and update blanks
  while( letterIndex >= 0 ){
    displayed = updateBlanks(letterIndex,letter,displayed);
    letterIndex = solution.indexOf(letter,letterIndex + 1);
  }

  return displayed;
};

var incorrectLetters = function(letter){
  var span = $("<span class='guessed-letter'></span>").text(letter);  
  $("#wrong-letters").append(span);
};

var displayWord = function(solution){
  for(var i = 0; i < solution.length; i++){
    $("<span class='shown-letter'></span>").appendTo(".word-display").html("&nbsp");
  }
};

var updateWord = function(solution){
  var first = $(".shown-letter:first");

  for(var i = 0; i < solution.length; i++){
    if(solution.charAt(i) === "_"){
      first.html("&nbsp");    
    } else {
      first.text(solution.charAt(i));
    }
    first = first.next();
  }
};

// these functions draw the person as the player makes incorrect guesses
var addHead = function(){
  $(".draw-area").append("<div class='head'></div>"); 
};

var addTorso = function(){
  $(".draw-area").append("<div class='armbox'></div>"); 
  $(".armbox").append("<div class='torso'></div>");
  $(".draw-area").append("<div class='legbox'></div>"); 
  $(".legbox").append("<div class='pelvis'></div>");
};

var addLeftArm = function(){
  $(".armbox").prepend("<div class='leftarm'></div>");  
};

var addRightArm = function(){
  $(".armbox").prepend("<div class='rightarm'></div>"); 
};

var addLeftLeg = function(){
 $(".legbox").prepend("<div class='leftleg'></div>"); 
};

var addRightLeg = function(){
  $(".legbox").prepend("<div class='rightleg'></div>"); 
};

var addSequence = [addHead, addTorso, addLeftArm, addRightArm, addLeftLeg, addRightLeg];

var resetInterface = function(){
  $(".body-part").add(".guessed-letter").add(".shown-letter").remove();
  $(".head").remove();
  $(".armbox").remove();
  $(".legbox").remove();
};

var resetGame = function(){
  resetInterface();
  gameAnswer = pickWord(words);
  gameShownAnswer = blanks(gameAnswer);
  hangmanState = 0;
  displayWord(gameShownAnswer);
};

var win = function(){
  alert("You Won!");
  resetGame();
};

var lose = function(){
  alert("You Lost!");
  resetGame();
};

var onKeyPress = function(){
  var tempChar = $("#letter-input").val().toLowerCase();
  var tempString = guessLetter(tempChar,gameShownAnswer,gameAnswer);
  $("#letter-input").val("");
  if(tempString !== gameShownAnswer) {
    updateWord(tempString);
    gameShownAnswer = tempString;
    if(tempString === gameAnswer){   
      win();
    }
  } else {
    incorrectLetters(tempChar);
    if(hangmanState >= 0){
      addSequence[hangmanState]();
    }
    hangmanState++;
    if(hangmanState === addSequence.length){
      lose();    
    }
  }
};

$(document).ready(resetGame);
$("#letter-input").keyup(onKeyPress);


