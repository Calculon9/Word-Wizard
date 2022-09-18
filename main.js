let words;
let randomIndex;
let currentWord;

$(document).ready(function(){

    // Fetch word list
    
    let req = new XMLHttpRequest();

    req.open("GET","https://raw.githubusercontent.com/dwyl/english-words/master/words_dictionary.json")

    req.onload = function(){
        if(req.status == 200){
            words = Object.keys(JSON.parse(req.responseText));

        // Initialize 
        letterBoxCreator()
        } else (alert("Word list could not be loaded"))
    
    }

    req.send();    
})

// Functions

function gameFinished(){
    let word = $('.letter-box .word-letter').text();
    //word = Array.from(document.querySelectorAll('.word-letter')).reduce((word,letter) => word+=letter.textContent,'');

    // Get current number of guesses
    let guesses = parseInt($('#guess-num').text());

    // Get current streak
    let streak = parseInt($('.score #score-num').text());

    // If game won
    if(word === currentWord.toUpperCase()) {

        // Increase streak
        streak+=1;
        $('.score #score-num').text(streak);
      
        // Display current score
        $('body .info').after(`<div class='well-done border'>
                                 <p>WELL DONE!</p>
                                 <p>Current score:&#160<span id="current-score"></span></p>
                                 <button id="next-word">NEXT WORD</button>
                               </div>`);  
        $('.well-done #current-score').text(streak);
        $('.well-done').fadeOut(0).fadeIn(300);
       

        // Add click event on 'Next word' button

        $('.well-done #next-word').click(function(){
            
            // Remove current word
            $('.word .letter-box').remove();

            // Reset guesses
            $('#guess-num').text(5)

            // Reset keyboard letter colors
            $('.letter').removeClass('letter-correct');
            $('.letter').removeClass('letter-wrong');

            // Get new word
            letterBoxCreator();

            // Reactivate keyboard click event
            $('.keyboard .row .letter').on('click',letterClick);

            // Remove 'Well done' message
            $('.well-done').remove();
        })

        // Stop keyboard event listeners
        $('.keyboard .row .letter').off('click',letterClick);
    }

    if(guesses <= 0) {
        // Display final score
        $('body .info').after(`<div class='game-over border'>
                                 <p>GAME OVER</p>
                                 <p>Your score:&#160<span id="game-over-score"></span></p>
                                 <button id="play-again">PLAY AGAIN</button>
                               </div>`);
        $('.game-over #game-over-score').text(streak);
        $('.game-over').fadeOut(0).fadeIn(300);

        // Reveal word
        revealWord();

        // Add click event on 'Play again' button
        $('.game-over #play-again').click(function(){
            window.location.reload();
        })

        // Stop keyboard event listeners
        $('.keyboard .row .letter').off('click',letterClick);
    }
}

// Random number generator
function randomGenerator(){
    return Math.round((Math.random() * (words.length - 1)));
}

// Selects a word randomly using randomGenerator
function letterBoxCreator () {
    randomIndex = randomGenerator();
    currentWord = words[randomIndex];
    currentWord.split('').forEach(function(letter) {
        $('.word').append(`<div id="${letter}" class="letter-box center"><p class="word-letter"></p></div>`);
    })
    $('.word').fadeOut(0).fadeIn(400);
}

// Shows letters if the game was lost
function revealWord () {
    $('.word-letter').css('opacity','1');
    let letterBoxes = $('.letter-box')
    console.log(letterBoxes)
    currentWord.split('').forEach((letter,i) => {
        letterBoxes[i].firstElementChild.textContent = letter.toUpperCase();
    })
}


// Add click events to letters on keyboard

$('.keyboard .row .letter').click(letterClick);

function letterClick(e) {
    
    // Check if 'currentWord' contains clicked letter 
    let check = [];

    // Get current number of guesses
    let guesses = parseInt($('#guess-num').text());

    currentWord.split('').forEach(function(letter, i) {
        
        let clickedLetter = e.currentTarget.firstChild.textContent.toLocaleUpperCase();

        if(clickedLetter === letter.toLocaleUpperCase()) {

            // If current letter isn't only occurrence, skip current letter since 'Make letter appear in letter box' places all common letters in their word boxes in one iteration
            if(i !== currentWord.lastIndexOf(currentWord[i])) {return;} 

            // Change background of correctly guessed letter
            $(e.currentTarget).addClass('letter-correct');

            // Make letter appear in letter box
            $(`#${letter} .word-letter`).text(clickedLetter);
            $(`#${letter} .word-letter`).css('opacity','1');
            check.push(1);
          
        } else if((i === currentWord.length - 1) && !check.length) {
            // Decrement guesses if letter hasn't been guessed
            if(!$(e.currentTarget).hasClass('letter-wrong')) {
                guesses+=-1;
                $('#guess-num').text(guesses);

                // Change background of incorrectly guessed letter
                $(e.currentTarget).addClass('letter-wrong');
            }
        } 
    })
    // Check if game won or lost
    gameFinished();
}