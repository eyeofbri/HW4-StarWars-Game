//im adding this line so the js file updates and uses PNG

var characters = [
	// upper row
	{ name: "Boba Fett",	
		hp:70, ap:43, counter:17 },
	{ name: "Chewbacca",
		hp:80, ap:46, counter:20 },
	{ name: "Darth Sidious",
		hp:160, ap:49, counter:23 },
	{ name: "Darth Vader", 
		hp:180, ap:51, counter:25 },
	// lower row
	{ name: "Luke Skywalker",
		hp:40, ap:33, counter:5 },
	{ name: "Leia Organa", 
		hp:60, ap:36, counter:8 },
	{ name: "Padme Amidala",
		hp:80, ap:39, counter:11 },
	{ name: "Obi-Wan Kenobi",
		hp:100, ap:41, counter: 14 },

	{ name: "empty",
		hp:0, ap:0, counter: 0 }
];

var charactersCopy = [];
var canSelect_p1 = true;
var canSelect_p2 = true;
var canFight = true;
var gameOver = false;
var currentATKpower = 0;

$(document).ready(function() {
	resetGame();

	$('.card').click(function(event) {
    	//Select un-used cards ONLY
    	if(!$(this).hasClass( "card_used" ) ){
    		clickAI(this);
    	}
	});

	$('#attackButton').click(function(event) {
    	if(canFight){ fightAI(); }
    	if(gameOver){ resetGame(); }
	});
});

function clickAI(el) {
	if(canSelect_p1){

		var characterName = $(el).attr("data-content");
		
		//shake p1 label
		shakeThings( "p1_Label" );

		//set p1 character name
		$("#p1_Name" ).html(characterName);

		//set p1 image
		var imgSRC = characterName.replace(/\s+/g, '');
		var imgLink = "./assets/images/characters/"+imgSRC+".PNG";
		$("#p1_img").attr('src',imgLink);
		//shake p1 image
		shakeThings( "p1_img" );

		//show & set stats for selected p1
		$("#stat_H_p1").removeClass("hide");
		adjustVisibleStats("stat_H_p1", characterName);

		//confirm player
		$(el).addClass("card_used");

		console.important("Player 1 Selected! " + characterName);

		canSelect_p1 = false;

		$("#titleRow").addClass("p2_rowTitle");

		currentATKpower = charactersCopy[returnCharNum(characterName)].ap;

	}else if(!canSelect_p1 && canSelect_p2){
		var characterName = $(el).attr("data-content");
		
		//shake p2 label
		shakeThings( "p2_Label" );

		//set p2 character name
		$("#p2_Name" ).html(characterName);

		//of the game has started, we need to clear this
		$("#p2_img").removeClass("spin");

		//set p2 image
		var imgSRC = characterName.replace(/\s+/g, '');
		var imgLink = "./assets/images/characters/"+imgSRC+".PNG";
		$("#p2_img").attr('src',imgLink);
		//shake p2 image
		shakeThings( "p2_img" );

		//show & set stats for selected p2
		$("#stat_H_p2").removeClass("hide");
		adjustVisibleStats("stat_H_p2", characterName);

		//confirm player
		$(el).addClass("card_used");

		console.important("Player 2 Selected! " + characterName);

		canSelect_p2 = false;

		//CHANGE TEXT TO FIGHT!
		$("#titleRow").addClass("fight_rowTitle");

		setTimeout(function() {

			//adjust fight button
			$("#attackButton").html("Attack <br>" +	$("#p2_Name").html() + "?");

			//show fight button
			$("#attackButton_Wrapper").removeClass("hide");
			
			//hide the characters selection cards
			$("#titleRow").addClass("hide");
			$("#row2").addClass("hide");

			//maximize the battle display!
			$("#selected_Holder").addClass("selectedHolder_battle");
		}, 1000);


		
	}
}


function adjustVisibleStats(whichPlayer, playerName) {
	var charNum = returnCharNum(playerName);

	$("#" +whichPlayer).children(".stat_HP").html( charactersCopy[charNum].hp );
	$("#" +whichPlayer).children(".stat_AP").html( charactersCopy[charNum].ap );
	$("#" +whichPlayer).children(".stat_CAP").html( charactersCopy[charNum].counter );

	$("#" +whichPlayer).children(".stat_HP").width( (charactersCopy[charNum].hp +"%") );
	if( charactersCopy[charNum].hp > 100){
		$("#" +whichPlayer).children(".stat_HP").width(100+"%");
	}
	$("#" +whichPlayer).children(".stat_AP").width( (charactersCopy[charNum].ap +"%") );
	$("#" +whichPlayer).children(".stat_CAP").width( (charactersCopy[charNum].counter +"%") );

}

function returnCharNum(pName) {
	var returnNum = 0;
	if(pName == "Boba Fett"){ returnNum = 0;}
	if(pName == "Chewbacca"){ returnNum = 1;}
	if(pName == "Darth Sidious"){ returnNum = 2;}
	if(pName == "Darth Vader"){ returnNum = 3;}
	if(pName == "Luke Skywalker"){ returnNum = 4;}
	if(pName == "Leia Organa"){ returnNum = 5;}
	if(pName == "Padme Amidala"){ returnNum = 6;}
	if(pName == "Obi-Wan Kenobi"){ returnNum = 7;}
	if(pName == "empty"){ returnNum = 8;}
	return returnNum;
}





function fightAI() {
	canFight = false;
	var p1_Name = $("#p1_Name").html();
	var p1_CharNum = returnCharNum(p1_Name);
	var p1_HP = $("#stat_H_p1").children(".stat_HP").html();
	var p1_AP_power = $("#stat_H_p1").children(".stat_AP").html();

	var p2_Name = $("#p2_Name").html();
	var p2_CharNum = returnCharNum(p2_Name);
	var p2_HP = $("#stat_H_p2").children(".stat_HP").html();
	var p2_C_power = $("#stat_H_p2").children(".stat_CAP").html();

	//get a P1 AttackPower(AP) number near the current p1 AP
	// p1_AP_power = Math.floor((Math.random() * p1_AP_power) + (p1_AP_power/1.8) );
	
	//subtract playerHit_power from enemy hp
	var newEnemyHP = p2_HP -p1_AP_power;
	if(newEnemyHP < 0){ newEnemyHP = 0;}

	//update enemy visual & HP
	$("#stat_H_p2").children(".stat_HP").html( newEnemyHP );
	$("#stat_H_p2").children(".stat_HP").width( (newEnemyHP +"%") );
	if( newEnemyHP > 100){
		$("#stat_H_p2").children(".stat_HP").width( ("100%") );
	}

	shakeThings("stat_H_p2");

	//shake enemy
	shakeThings("p2_img");

	//INCREASE and update player attack power AP
	currentATKpower += (charactersCopy[p1_CharNum].ap);
	//update PLAYER visual AP
	$("#stat_H_p1").children(".stat_AP").html( currentATKpower );
	if( $("#stat_H_p1").children(".stat_AP").width() < 100){
		$("#stat_H_p1").children(".stat_AP").width( (currentATKpower +"%") );
	}

	if(newEnemyHP == 0){
		//!!!!!!!!!!!!!!!
		// enemy is KO'd!

		$("#p2_img").addClass("spin");

		setTimeout(function() {
						
			//ARE THERE ANY MORE SELECTABLE characters?
			var cards = document.getElementsByClassName("card");
			var fightableCharacter = false;
			for (var i = 0; i < cards.length; i++) {
			    var elClasses = cards[i].classList;
			    if (!elClasses.contains("card_used")) { 
			    	fightableCharacter = true;
			    }
			    if(i == cards.length-1){
			    	if(fightableCharacter){
			    		canSelect_p2 = true;
						canFight = true;

						//hide fight button
						$("#attackButton_Wrapper").addClass("hide");
							
						//show the characters selection cards
						$("#titleRow").removeClass("hide");
						$("#row2").removeClass("hide");

						//minimize the battle display!
						$("#selected_Holder").removeClass("selectedHolder_battle");

						//reset p2 image
						var imgLink = "./assets/images/question.PNG";
						$("#p2_img").attr('src',imgLink);
						//shake p2 image
						shakeThings( "p2_img" );

						

			    	}else{
			    		$("#attackButton").text("YOU WON!");

			    		setTimeout(function() {
			    			gameOver = true;
			    			$("#attackButton").text("RESTART?");
			    		}, 5000);
			    	}

			    	//empty & hide p2 stats
					$("#stat_H_p2").addClass("hide");

					//empty p2 character name
					$("#p2_Name" ).html("");
			    }
			}
			

		}, 1000);
	}else{
		//ENEMY ATTACK!!!!!!!!!!!!!!!!!!!!
		//enemy attacks player in response
		setTimeout(function() {

			//get a P2 CounterAttackPower(C) number near the current p2 Counter
			// p2_C_power = Math.floor((Math.random() * p2_C_power) + (p2_C_power/1.8) );
			
			//subtract p2_C_power from Player hp
			var newPlayerHP = p1_HP -p2_C_power;
			if(newPlayerHP < 0){ newPlayerHP = 0;}

			//update player visual & HP
			$("#stat_H_p1").children(".stat_HP").html( newPlayerHP );
			$("#stat_H_p1").children(".stat_HP").width( (newPlayerHP +"%") );
			if( newPlayerHP > 100){
				$("#stat_H_p1").children(".stat_HP").width( ("100%") );
			}

			shakeThings("stat_H_p1");

			//shake player
			shakeThings("p1_img");

			if(newPlayerHP == 0){ 
				newPlayerHP = 0;
				//!!!!!!!!!!!!!!!!!
				//PLAYER IS KO'd
				//GAME OVER
				
				$("#p1_img").addClass("spin");

				$("#attackButton").text("GAME OVER");

				setTimeout(function() {
					gameOver = true;
					$("#attackButton").text("RESTART?");
					charactersCopy = characters.slice();
				}, 2000);
				

			}else{
				canFight = true;
			}
		}, 1000);
	}
	
}


function resetGame() {
	charactersCopy.length=0;
	charactersCopy = characters.slice();

	//hide fight button
	$("#attackButton_Wrapper").addClass("hide");
		
	//show the characters selection cards
	$("#titleRow").removeClass("hide");
	$("#row2").removeClass("hide");

	//minimize the battle display!
	$("#selected_Holder").removeClass("selectedHolder_battle");

	//reset p1 image
	var imgLink = "./assets/images/question.PNG";
	$("#p1_img").attr('src',imgLink);
	//shake p2 image
	shakeThings( "p1_img" );

	//empty & hide p1 stats
	$("#stat_H_p1").addClass("hide");

	//empty p1 character name
	$("#p1_Name" ).html("");	



	//reset p2 image
	var imgLink = "./assets/images/question.PNG";
	$("#p2_img").attr('src',imgLink);
	//shake p2 image
	shakeThings( "p2_img" );

	//empty & hide p2 stats
	$("#stat_H_p2").addClass("hide");

	//empty p2 character name
	$("#p2_Name" ).html("");			


	//reset used cards
	var cards = document.getElementsByClassName("card");
	for (var i = 0; i < cards.length; i++) {
		$(cards[i]).removeClass("card_used");
	}


	$("#titleRow").removeClass("p1_rowTitle");
	$("#titleRow").removeClass("p2_rowTitle");
	$("#titleRow").removeClass("fight_rowTitle");
	$("#titleRow").addClass("p1_rowTitle");
	
	$("#p1_img").removeClass("spin");
	$("#p2_img").removeClass("spin");

	canSelect_p1 = true;
	canSelect_p2 = true;
	canFight = true;
	gameOver = false;
	currentATKpower = 0;
}









/*///////*/
/*BEGIN */
/*NON SPECIFIC, USUAL JAVASCRIPT*/

console.todo = function( msg){
 	console.log( '%c %s %s %s ', 'color: yellow; background-color: black;', '--', msg, '--');
}

console.important = function( msg){
        console.log( '%c%s %s %s', 'color: white; font-weight: bold; background-color: brown', '--', msg, '--');
}

function shakeThings(el) {
    var thingToShake = document.getElementById(el);

    var elClasses = thingToShake.classList;
    if (elClasses.contains("shake")) { 
    	elClasses.remove("shake"); 
    }

	thingToShake.classList.add("shake");
	setTimeout(function(){ elClasses.remove("shake"); }, 500);
}

/*END */
/*NON SPECIFIC, USUAL JAVASCRIPT*/
/*///////*/

