/**Card Deck Generation - Differentiating between suits aren't necessary since Blackjack only deals with point values.
Ace is purposely left out because it requires separate functionality (can be either 1 or 11 depending on player's deck) **/
let deck = [];
let start = true;
let hands = [[],[],[],[],[],[],[],[]];
let scores = [];
var num = parseInt(localStorage.getItem("numVal")); //TAKEN FROM LOCALSTORAGE

function deckCreation()
{
    let possible = ['2','3','4','5','6','7','8','9','10','J','Q','K', 'A'];
    let a = 0;
    for (let j = 0; j < 4; j++)
    {
            for (let c = 0; c < 13; ++c)
            {
                deck[a] = possible[c]
                a += 1;
            }
    }
}

//Giving javascript access to HTML player fields
let pl1 = document.querySelector("#player1");
let pl2 = document.querySelector("#player2");
let pl3 = document.querySelector("#player3");
let pl4 = document.querySelector("#player4");
let pl5 = document.querySelector("#player5");
let pl6 = document.querySelector("#player6");
let pl7 = document.querySelector("#player7");
let plComp = document.querySelector("#computer");
let currTurn = document.querySelector("#turn");
let scoreVal = document.querySelector("#check");

let plNum = document.querySelector("#playerCount");

players = [pl1, pl2, pl3, pl4, pl5, pl6, pl7, plComp];

function clearHands()
{
    for (let i = 0; i < 8; ++i)
    {
        hands[i] = [];
        players[i].value = "";
    }
    currTurn.value = "";
}

function cardDraw(player) //Drawing a Card
{
    let actual = player - 1;
    let rand1 = Math.floor(Math.random() * deck.length);
    hands[actual][hands[actual].length] = deck[rand1]; /*Hands is a 2 dimensional array (each value in the array
														is its own array). Each value (array) is a single player's
                                                        hand, and a new card is added to the last (and newest)
                                                        position of the value array. 
                                                        
                                                        
                                                        2 DIMENSIONAL ARRAY SYNTAX TAKEN FROM W3SCHOOLS*/
                                                               
    players[actual].value = hands[actual];
	deck.splice(rand1, 1); //Deleting value from deck.   SPLICE METHOD SYNTAX TAKEN FROM W3SCHOOLS
    
}

function play()
{
    let val = plNum.value;
    if (val > 7 || val < 1){
        alert("Error - please enter in a valid number of players (between 1 to 7)")
    }
	else
    {
        localStorage.setItem("numVal", val); //SYNTAX TAKEN FROM LOCALSTORAGE
        window.location.href = "blackJack.html"; /* SYNTAX TAKEN FROM LOCALSTORAGE  */
        location.replace("blackJack.html");      
    }
}

function winCalc(winners)
{
    plComp.value = hands[7];
    if (winners.length < 1){
        alert("No one won");
    }
    else
    {
        if (winners[winners.length - 1] == 8)
        {
            if (winners.length == 1){
                alert("Dealer wins! Press the start game button to play again!");
            }
            else
            {
                winners.splice(winners.length - 1, 1);
                alert("Dealer and players " + winners + " won! Press the start game button to play again!");
            }
        }
        else{
            alert("player(s) " + winners + " won! Press the start game button to play again!");
        }
        start = true;
    }
}

function findMax(scores)
{
    let c = 0;
    for (let i = 0; i < scores.length; ++i) //Finding max score
    {
        if (scores[i][0] > scores[c][0]){
            c = i;
        }
    }
    checkDuplicate(c, scores);
}

function checkDuplicate(max, scores)
{
    let counter1 = 0;
    let winners = [];
    for (let i = 0; i < scores.length; ++i) //Checking for duplicates
    {
        if (scores[i][0] == scores[max][0])
        {
            winners[counter1] = scores[i][1];
            counter1++;
        }
    }
    winCalc(winners);
}

function filterScore(finalScore)
{
    let newScore = [];
    let c = 0;
    let counter1 = 0;
    for (let i = 0; i < finalScore.length; ++i) //Filtering scores greater than 21
    {
        if (finalScore[i][0] != undefined)
        {
            if (finalScore[i][0] <= 21)
            {
                newScore[counter1] = finalScore[i];
                counter1++;
            }	
        }			
    }
    findMax(newScore);
}

function dealer()
{
    currTurn.value = 8;
    scoreCalc(8);
    while (scores[7][0] <= 17)
    {
        cardDraw(8);
        scoreCalc(8);
    }
    filterScore(scores);
}

function addValues(pl)
{
    let score = [];
    let set = 0;
    let counter = 0;
    score[1] = (pl);
    for (let i = 0; i < hands[pl - 1].length; ++i)
    {
            let curr = hands[pl - 1][i];
            if (curr == "Q" || curr == "K" || curr == "J"){
                set += 10;
            }
            else if (curr == "A"){
                counter++;
                continue;
            }
            else {
                set += parseInt(hands[pl - 1][i]);
            }
    }
    score[0] = set;
    score[2] = counter;
    scores[pl - 1] = score;
}

function ace(pl)
{
    let counter = scores[pl - 1][2];
    let set = scores[pl - 1][0];
    for (let i = 0; i < counter; ++i)
    {
            if (set < 11){
                set += 11;
            }
            else{
                set++;
            }
    }
    scores[pl - 1][0] = set;
}

function scoreCalc(pl)
{
    addValues(pl);
    ace(pl);
}

function stand()
{
    if (start == false)
    {
        let plTurn = parseInt(currTurn.value);
        plTurn += 1;
        if (plTurn > num)
        {
            scoreCalc(plTurn - 1);
            alert("No other players remaining - skipping to dealer");
            dealer();
        }
        else
        {
            scoreCalc(plTurn - 1);
            currTurn.value = plTurn;
        }
    }
    else{
        alert("New game has not started yet");
    }
}


function hit()
{
    if (start == false)
    {
        let pl = currTurn.value;
        scoreCalc(pl);
        if (scores[pl -	1][0] > 21)
        {
            alert("You cannot draw any further cards! Your turn will now end");
            stand();
        }
        else
        {
            cardDraw(pl);
            scoreCalc(pl);
        }
    }
    else{
        alert("New game has not started yet");
    }
}

function gameStart()
{
    deckCreation();
	if (start == true)
        {
        start = false;
        clearHands();
	    for (let i = 1; i <= 8; ++i)  //Hand Generation
            {
	        if (i < (num + 1) || i == 8)
                {
		    cardDraw(i);
		    cardDraw(i);
	        }
		else
                {
		    hands[i - 1] = [null];
		    players[i - 1].value = hands[i - 1];
                }
            scoreCalc(i)
	    }
        currTurn.value = 1; 
	}
	else{
		alert("Game already started! There are instructions on the main page (link provided in the bottom right corner)")
	}
}
