////////////////////////////////////////////////////////////////////////
// Game Variables
////////////////////////////////////////////////////////////////////////
// Initialized game variables to be used throughout code

// Number of turns that player has taken
var numTurns = 0;

// Number of paired turns that player has taken (this is the actual user score)
var numPairedTurns = 0;

// Number of Points (for every cards matched)
var gamePoints = 0;

// Card that player has selected on previous turn
var selectedCard = null;

// This is an array that will capture every card that is selected by player
var selectedCardArray = [];

// This var will check how many cards are faced up at any given moment. If 
// there are already 2 faced up, don't allow player to see another card
var cardsFacedUp = 0;

// Game Status: Will be used to control start button (0 - not started, 1 - started)
var gameStatus = 0;

////////////////////////////////////////////////////////////////////////
// Image Box
////////////////////////////////////////////////////////////////////////
// Imagebox handler function for when image is clicked. CardBox event
// listener already made in startBtnHandler (where cardBoxs are created)

var cardTransitionTime = 500;
var switching = false;

var pairScore = document.getElementById('pairs-score');
var pairedTurns = document.getElementById('turns-score');


function cardBoxHandler() {
    // Note: 'this' is the specific cardBox related to the eventhandler
    // that it was assigned to - when the specific eventhandler was 
    // created for the specific cardBox. 

    // // If there are already 2 cards that are faced up, return. Don't allow
    // // player to turn over any card
    // cardsFacedUp++;
    // if (cardsFacedUp > 2) {
    //     return;
    // }

    // In order to use "this" inside the setTimeout function, you need to 
    // save "this" into another variable. "this" used directly inside setTimeout
    // will reference something other than the cardBox element we are referencing to
    var currentCardBox = this;

    // setTimeout(function (){
    //     specificCardBox.classList.toggle('flipped');
    // }, 1000);

    // Increase turns taken by player
    numTurns++;

    // Add in the card number that was selected by player
    selectedCardArray.push(this.id.replace('cardBox-', ''));

    // If there are already 2 cards that are faced up, return. Don't allow
    // player to turn over any card
    cardsFacedUp++;
    // if (cardsFacedUp > 1) {
    //     return;

    // If numTurns is odd, that means we want to wait for the next card
    // pair to be selected by player. Therefore, keep that card faced up
    // until next card is selected. If the numTurns is even, then we compare
    // both cards to see if they are the same cards (the ids for the paired boxes 
    // will be 1 & 2, 3 & 4... 35 & 36)
    if (!(numTurns % 2 === 0)) {
        console.log(cardsFacedUp);
        if (cardsFacedUp > 2) {
            numTurns = numTurns - 1;
            cardsFacedUp = cardsFacedUp - 1;
            console.log('too many at once');
            console.log('numturns: ' + numTurns);
            console.log('cardsFacedUp: ' + cardsFacedUp);
            return;
        }

        // selectedCard is the most recent card selected, and we will keep
        // card face up. PreviousCard will be used for next turn!
        currentCardBox.classList.toggle('flipped');
        previousCard = selectedCardArray[selectedCardArray.length - 1];
        return;
    } else {
        // Timeout for the previous card Box selected (not previousCard - that's different)
        var previousCardBox = document.getElementById(`cardBox-${previousCard}`);

        // If by chance the user clicks the same card again, then just return
        var currentCard = selectedCardArray[selectedCardArray.length - 1];
        if (currentCard === previousCard) {
            numTurns = numTurns - 1;
            cardsFacedUp = cardsFacedUp - 1;
            return;
        }
        currentCardBox.classList.toggle('flipped');

        // For two numbers to be a pair, min of the two pairs should be an odd number. 
        // And the max of the pair should be greater than the min by exactly 1
        var minPair = Math.min(currentCard, previousCard);
        var maxPair = Math.max(currentCard, previousCard);

        if (!(minPair % 2 === 0) && (maxPair - minPair === 1)) {
            // We have paired. Therefore, keep the cards faced up, and add
            // to the score. 
            gamePoints++;

            // Now update the gamePoints
            pairScore.innerHTML = containerNum / 2 - gamePoints;

            // Reset cardsFacedUp, since we are resetting the player picking pairs
            // This time, we don't have to worry about setTimeout since the cards are
            // already flipped, and the player is now allowed to select whatever cards
            // they want (in comparison to below, where a pair is not made)
            cardsFacedUp = 0;

            // Remove event-listeners so that cards can't be flipped again
            previousCardBox.removeEventListener("click", cardBoxHandler);
            currentCardBox.removeEventListener("click", cardBoxHandler);
        } else {
            // User has not paired. Therefore, flip both cards after setting a timeout
            // for both cards

            // Timeout for the specific card
            setTimeout(function () {
                previousCardBox.classList.toggle('flipped');
                currentCardBox.classList.toggle('flipped');

                // Reset cardsFacedUp, since we are resetting the player picking pairs
                // We want this in the delay because we don't want the cardsFaceUp to
                // be zero right away (or else player will be able to click a 2+ cards at once)
                cardsFacedUp = 0;
            }, 1500);
        }

        // Increase the actual paired tries that the user made (this is the actual score)
        numPairedTurns++;
        // Update the stats on number of paired turns
        pairedTurns.innerHTML = numPairedTurns;

        // Player wins game if all pairs have been matched
        if (containerNum / 2 === gamePoints) {
            // reset game status
            gameStatus = 0;
            // reset game values
            numPairedTurns = 0;
            numTurns = 0;
            numPairedTurns = 0;
            gamePoints = 0;
            selectedCard = null;
            selectedCardArray = [];
            cardsFacedUp = 0;

            setTimeout(function () {
                window.alert("you won!");
            }, 1750);
        }

        console.log('tried a pair');
        console.log('numturns: ' + numTurns);

        pairsScore = document.getElementById('pairs-score');
        console.log(pairsScore.innerHTML);
    }

    // if (!(this.classList.contains('flipped'))) {
    //     this.classList.toggle('flipped');
    // } else {
    //     this.classList.toggle('flipped');
    // }
    // cardsFacedUp++;


    // console.log(cardBox.classList.includes("flipped"));
    // event.stopPropagation();

    // window.setTimeout(function () {
    //     cardCanvas.children[0].children[0].classList.toggle('front');
    //     switching = false;
    // }, cardTransitionTime / 2);
}


////////////////////////////////////////////////////////////////////////
// Start Button
////////////////////////////////////////////////////////////////////////
// Start Button will create all the imageBox(s) and the randomly place
// them in a grid format

// We want to a 6 by 6 grid of flipcards
var containerNum = 36;

var startBtn = document.getElementById('btn-start');
startBtn.addEventListener('click', startBtnHandler);

function startBtnHandler() {
    // Let's check if game is ongoing. If there is already a game, 
    // don't create another game
    if (gameStatus === 1) {
        return;
    }

    // Now that we're started game, change gameStatus
    gameStatus = 1;

    // Reset the stats of the game
    pairedTurns.innerHTML = 0;
    pairScore.innerHTML = containerNum / 2;

    // Empty any childNodes that may exist on current board
    deleteGame = document.getElementById('card-container');
    deleteGame.innerHTML = '';

    randomArr = randomArray(containerNum);
    row = document.getElementById('card-container');

    for (var i = 0; i < containerNum; i++) {
        // Create the cardBox, which will hold the iamge
        cardBox = document.createElement('div');
        cardBox.classList.add('card-box');
        // Add ID attribute
        cardBox.setAttribute("id", `cardBox-${randomArr[i]}`);

        // Add event listener to cardBox (on click)
        cardBox.addEventListener("click", cardBoxHandler);


        // Create front and backside of cards
        frontCard = document.createElement('div');
        frontCard.classList.add('card__face');
        frontCard.classList.add('card__face--front');
        frontCard.innerHTML = randomArr[i];
        backCard = document.createElement('div');
        backCard.classList.add('card__face');
        backCard.classList.add('card__face--back');

        // Create image element
        imageCard = document.createElement('img');
        imageCard.src = `img/${randomArr[i]}.png`;
        // <svg class="side-nav_icon">
        //                         <use xlink:href="img/sprite.svg#icon-info-with-circle"></use>
        //                     </svg>
        // imageCard = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
        // useElem = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        // useElem.setAttributeNS('img/company-logos/sprite.svg', 'xlink:href', 'img/company-logos/sprite.svg#adobe');
        // imageCard.appendChild(useElem);

        imageCard.classList.add(`card-image`);
        imageCard.classList.add(`card-image-${randomArr[i]}`);

        // Append all elements
        backCard.appendChild(imageCard);
        cardBox.appendChild(frontCard)
        cardBox.appendChild(backCard);
        row.appendChild(cardBox);
    }
}

function randomArray(n) {
    // Creates random array set of 1 to n
    var arr = [];
    while (arr.length < n) {
        var random = Math.floor(Math.random() * n) + 1;

        // Only place random number in arr if it does not exist (keep set unique)
        if (!(arr.includes(random))) {
            arr.push(random);
        }
    }
    return arr;
}


////////////////////////////////////////////////////////////////////////
// Local Storage for Keeping High Scores
////////////////////////////////////////////////////////////////////////

// When game is loaded, call function to update chart
var existingStats = localStorage.getItem("stats");

function updateChart() {
    console.log(existingStats);
    // remove whatever stats was in the chart
    scoreTable = document.getElementById('high-score-table');
    scoreTable.innerHTML = '';

    if (existingStats === null) {
        return;
    } else {
        // parse through the information
        scorePairs = existingStats.split(',');

        // all stats will be separated by names, at index 1, 3, 5, ...
        tempStats = [];
        for (var i = 1; i < scorePairs.length; i = i + 2) {
            tempStats.push(scorePairs[i]);
        }
        // sort the scores
        tempStats = tempStats.sort(function (a, b) {
            return a - b;
        });
    }

    // Create the html elements
    for (var j=0; j<scorePairs.length/2; j++) {
        leader = document.createElement('div');
        leader.classList.add('highscore-leader'); 
        leader.setAttribute('id',`score-${j+1}`);

        count = document.createElement('span');
        count.classList.add('highscore-count'); 
        count.setAttribute('id',`highscore-count`);
        count.innerHTML = j+1;
     
        initials = document.createElement('span');
        initials.classList.add('highscore-initials'); 
        initials.setAttribute('id',`highscore-initials`);
        initials.innerHTML = 'MJ';
     
        stat = document.createElement('span');
        stat.classList.add('highscore-stat'); 
        stat.setAttribute('id',`highscore-stat`);
        stat.innerHTML = tempStats[j];

        // append all
        leader.appendChild(count);
        leader.appendChild(initials);
        leader.appendChild(stat);
        scoreTable.appendChild(leader);
        console.log(j);
    }
    console.log('we came');
}

// When game first loads, run updateChart
updateChart();

function addToChart(initials, stats) {

}