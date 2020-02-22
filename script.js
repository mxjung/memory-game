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

////////////////////////////////////////////////////////////////////////
// Image Box
////////////////////////////////////////////////////////////////////////
// Imagebox handler function for when image is clicked. CardBox event
// listener already made in startBtnHandler (where cardBoxs are created)

var cardTransitionTime = 500;
var switching = false;

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

        // Player wins game if all pairs have been matched
        if (containerNum / 2 === gamePoints) {
            window.alert("you won!");
        }

        console.log('tried a pair');
        console.log('numturns: ' + numTurns);
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
        imageCard.src = 'img/user-4.jpg';
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
