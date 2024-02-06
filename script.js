// Get the Dom elements 

const resultElement = document.getElementById("result");
const pokemonImageElement = document.getElementById("pokemonImage");
const optionsContainer = document.getElementById("options");
const pointsElement = document.getElementById("pointsValue");
const totalCount = document.getElementById("totalCount");
const mainContainer = document.getElementsByClassName("container");
const loadingContainer = document.getElementById("loadingContainer");

// Initialise variables
let usedPokemonIds = [];
let count = 0;
let points = 0;
let showLoading = false;

// function to fetch a pokemon with an id

async function fetchPokemonById(id){
    showLoading = true;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await response.json();
    return data;
    
}

// // function to see the results

//  async function testFetch(){
//     const pokemon = await fetchPokemonById( getRandomPokemon());
//     console.log(pokemon);
// }

// // call function
// testFetch();
// 3:32,20

// function to  load questions with options
async function loadQuestionWithOptions(){
    if(showLoading){
        showLoadingWindow();
        hidePuzzleWindow();
    }
    // fetch the correct answer first
    let pokemonId = getRandomPokemon();
    while (usedPokemonIds.includes(pokemonId)){
        pokemonId = getRandomPokemon();
    }

    //check if pokemon has been displayed yet, if not add to usedPokemonIds
    // set it as  as new pokemon 
    usedPokemonIds.push(pokemonId);
    const pokemon = await fetchPokemonById(pokemonId); // Add await here

    const options = [pokemon.name];
    const optionIds = [pokemon.id];

    // fetch additional random pokemon names to use as options
    while(options.length< 4){
        let randomPokemonId = getRandomPokemon();
        //ensure fetched option does not exist in options list
        
        while(optionIds.includes(randomPokemonId)){
            randomPokemonId= getRandomPokemon();

        }

        optionIds.push(randomPokemonId);
        const randomPokemon = await fetchPokemonById(randomPokemonId);
        const randomOption = randomPokemon.name;
        options.push(randomOption);
        console.log(options);
        console.log(optionIds);

        // turn off loading if all options have been fetched 
        if(options.length === 4){
            showLoading = false;
        }
    }


    shuffleArray(options);
    // clear any previous values and fetch image urls sprites
    resultElement.textContent = `Who's that Pokemon?`;
    pokemonImageElement.src = pokemon.sprites.other.dream_world.front_default;

    // option html elements from options array
    optionsContainer.innerHTML = ""; 
    options.forEach((option, index) => {
      const button = document.createElement("button");
      button.textContent = option;
      button.onclick = (event) => checkAnswer(option === pokemon.name, event);
      optionsContainer.appendChild(button);
    });

    if(!showLoading){
        hideLoadingWindow();
        showPuzzleWindow();
    }


}

//check Answer option

function checkAnswer(isCorrect,event){
    // check for button selection else returns null
    const selectedButton = document.querySelector('.selected');

    if(selectedButton){
        return;
    }
    event.target.classList.add('selected');
    count ++;
    totalCount.textContent = count;

    if(isCorrect){
        displayResult("Correct answer!");
        // if correct increment the points
        points++;
        pointsElement.textContent = points;
        event.target.classList.add("correct")
    }
    else{
        displayResult("Wrong answer ..");
        event.target.classList.add("wrong");
    }

    // adding some delay 
    setTimeout(() => {
        showLoading = true;
        loadQuestionWithOptions();
    }, 1000)

}


//testing initial load
loadQuestionWithOptions();



// -----UTILITY FUNCTIONS-----

// Function to randomise pokemon id
function getRandomPokemon() {
    return Math.floor(Math.random() * 150) + 1;
    
}

// shuffling the array sent
function shuffleArray(array){
    return array.sort(() => Math.random() - 0.5)
}

// display the results
function displayResult(result){
    resultElement.textContent = result;
}

// hide loading
function hideLoadingWindow(){
    loadingContainer.classList.add('hide')
}

// show loading

function showLoadingWindow(){
    loadingContainer.classList.add('hide')
    loadingContainer.classList.add('show')

}