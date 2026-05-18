let time = 60; 
const timer = document.getElementById('giri'); 
const count = setInterval(() => { 
    if (time <= 0) { 
        clearInterval(count); 
        timer.innerHTML = `Time left: ${time}s`; 
    } else { 
        timer.innerHTML = `GAME LEFT: ${time}s`; 
    } 
    time--; 
}, 1000); 

let jjj = 15; 
const times = document.getElementById('tik'); 
const coun = setInterval(() => { 
    if (jjj <= 0) { 
        clearInterval(coun); 
        times.innerHTML = "TIME UP!"; 
    } else { 
        times.innerHTML = `PLAYER TIME: ${jjj}s`; 
        jjj--; 
    } 
}, 1000); 

const allys = document.querySelectorAll('.go'); 
allys.forEach((button) => { 
    button.addEventListener('click', () => { 
        jjj = 15; 
        times.innerHTML = `PLAYER TIME: ${jjj}s`; 
    }); 
}); 

// Lists and limits config
const j = [1,7,61,67]; 
const i = [2,3,4,5,68,69,70,71]; 

const LIMIT_J = 3;
const LIMIT_I = 2;
const LIMIT_DEFAULT = 4;


let redStats = { h: 1, n: 2, b: 3 };
let blueStats = { h: 1, n: 2, b: 3 };

let tht = 0; 
const y = document.getElementById("hh"); 

document.addEventListener('click', (event) => { 
    const element = event.target;
    
    
    if (!element.id || isNaN(element.id)) return;
    
    const elementIdNum = Number(element.id);
    
    // 1. Determine current player and emoji
    // tht starts at 0. If tht is even (0, 2, 4...), it's Red's turn. 
    const isRedTurn = (tht % 2 === 0);
    const playerEmoji = isRedTurn ? "🙋‍♂️" : "🙋";
    const currentPlayerStats = isRedTurn ? redStats : blueStats;

    // 2. Identify the cell's list category and max limit
    let category = '';
    let maxLimit = 0;

    if (j.includes(elementIdNum)) { 
        category = 'h'; 
        maxLimit = LIMIT_J;
    } else if (i.includes(elementIdNum)) { 
        category = 'n'; 
        maxLimit = LIMIT_I;
    } else { 
        category = 'b'; 
        maxLimit = LIMIT_DEFAULT;
    } 

    
    let currentEmojiCount = parseInt(element.dataset.emojiCount) || 0;
    let currentOwner = element.dataset.owner || '';

  
    if (currentOwner !== '' && currentOwner !== playerEmoji) {
        currentEmojiCount = 0;
        element.textContent = '';
    }

  
    currentEmojiCount++;

    if (currentEmojiCount > maxLimit) {
      
        element.textContent = "💥"; 
        element.dataset.emojiCount = 0;
        element.dataset.owner = '';
        
      
        setTimeout(() => { if(element.textContent === "💥") element.textContent = ''; }, 300);
    } else {
        // Stack the emoji according to the current count
        element.textContent = playerEmoji.repeat(currentEmojiCount);
        element.dataset.emojiCount = currentEmojiCount;
        element.dataset.owner = playerEmoji;
    }

    // 5. Update the correct player's specific category variable
    if (category === 'h') currentPlayerStats.h += 1;
    if (category === 'n') currentPlayerStats.n += 2;
    if (category === 'b') currentPlayerStats.b += 1;

    // 6. Switch turns and update display
    tht += 1; 
    
    // Next turn display update
    if (tht % 2 === 0) { 
        y.textContent = "BLUE PLAYER TURN"; 
    } else { 
        y.textContent = "RED PLAYER TURN"; 
    } 
    
    // Reset player turn timer on successful grid click
    jjj = 15;
    times.innerHTML = `PLAYER TIME: ${jjj}s`;



document.addEventListener('click', (event) => { 
    const element = event.target;
    if(!element.id || isNaN(element.id)) return; // Ignore clicks outside grid
    
    let idNum = Number(element.id);

    // 1. CHOOSE WHICH PLAYER IS PLAYING AND CHECK LISTS USING .includes()
    if(tht % 2 == 0) { // RED PLAYER TURN
        if(j.includes(idNum)){ red_h+=1; tht+=1; } 
        else if(i.includes(idNum)){ red_n+=2; tht+=1; } 
        else { red_b+=1; tht+=1; }
    } else { // BLUE PLAYER TURN
        if(j.includes(idNum)){ blue_h+=1; tht+=1; } 
        else if(i.includes(idNum)){ blue_n+=2; tht+=1; } 
        else { blue_b+=1; tht+=1; }
    }

    let emoji = (tht % 2 != 0) ? "🙋‍♂️" : "🙋"; // Get emoji of current player
    
    // 2. ADD THE EMOJI TO THE CLICKED CELL FIRST
    if(element.textContent.includes((emoji === "🙋‍♂️") ? "🙋" : "🙋‍♂️")) {
        // If opponent is there, convert it to yours first
        element.textContent = emoji;
    } else {
        // Otherwise stack it normally
        element.textContent += emoji;
    }

    // 3. REUSABLE CHAIN REACTION & EQUAL DIVISION FUNCTION
    function checkAndPop(cellId, playerEmoji) {
        let currentCell = document.getElementById(cellId.toString());
        if (!currentCell) return;

        let currentCount = currentCell.textContent.length / 2;
        let limit = 4;
        if (j.includes(cellId)) limit = 1;
        if (i.includes(cellId)) limit = 2;

        // If it exceeds the limit, explode it!
        if (currentCount > limit) {
            currentCell.textContent = ""; // Clear the popped cell completely

            // Find neighbors for a 6-column grid
            let up = cellId - 6;
            let down = cellId + 6;
            let left = (cellId % 6 !== 1) ? cellId - 1 : null;
            let right = (cellId % 6 !== 0) ? cellId + 1 : null;

            let potentialNeighbors = [up, down, left, right];
            let validNeighbors = [];

            // Only keep neighbors that actually exist on your board
            potentialNeighbors.forEach(id => {
                if (id && id >= 1 && id <= 72) {
                    if (document.getElementById(id.toString())) {
                        validNeighbors.push(id);
                    }
                }
            });

            // Calculate equal share (minimum of 1 emoji per neighbor)
            let share = Math.floor(currentCount / validNeighbors.length);
            if (share < 1) share = 1;

            let opponentEmoji = (playerEmoji === "🙋‍♂️") ? "🙋" : "🙋‍♂️";

            // Distribute to each neighbor
            validNeighbors.forEach(neighborId => {
                let neighborElement = document.getElementById(neighborId.toString());
                if (neighborElement) {
                    // Switch ownership if it belongs to the enemy
                    if (neighborElement.textContent.includes(opponentEmoji)) {
                        neighborElement.textContent = playerEmoji.repeat(share);
                    } else {
                        // Stack if it is yours or empty
                        neighborElement.textContent += playerEmoji.repeat(share);
                    }
                    // Immediately check if this neighbor needs to pop too
                    checkAndPop(neighborId, playerEmoji);
                }
            });
        }
    }

    // Trigger the cascade on the clicked element
    checkAndPop(idNum, emoji);

    // 4. DISPLAY NEXT TURN TEXT AND RESET PLAYER TIMER
    if(tht % 2 == 0){ 
        y.textContent="RED PLAYER TURN";
    } else { 
        y.textContent="BLUE PLAYER TURN"; 
    }
    jjj = 15;
    times.innerHTML = `PLAYER TIME: ${jjj}s`;
})
})
