const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;

const MODE_ATTACK = 'ATTACK';
const MODE_STRONG_ATTACK = 'STRONG_ATTACK';
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';

function getCurrentResult() {
  if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
    return "draw";
  } else if (currentPlayerHealth > 0 && currentMonsterHealth <= 0) {
    return "win";
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    return "loss";
  } else {
    return "in progress";
  }
}


const enteredValue = prompt('Maximum life for you and the monster.','100');
let chosenMaxLife = parseInt(enteredValue);

let battleLog = [];

if (isNaN(chosenMaxLife) || chosenMaxLife <= 0) {
  chosenMaxLife = 100;
  alert('You entered the wrong value, the default value was set! ');
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);

function writeToLog(event, value, monsterHealth, playerHealth) {
  let target;
  if (event === LOG_EVENT_MONSTER_ATTACK || event === LOG_EVENT_PLAYER_HEAL) {
    target = "Player";
  }
  else if(event === LOG_EVENT_PLAYER_ATTACK || event === LOG_EVENT_PLAYER_STRONG_ATTACK ){
    target = "Monster";
  }
  else {
    if (getCurrentResult() === 'draw')
      target = 'both'
    else if (getCurrentResult() === 'win')
      target = 'player'
    else if (getCurrentResult() === 'loss')
      target = 'player'
  }

  battleLog.push({
    event,
    value,
    finalMonsterHealth: monsterHealth,
    finalPlayerHealth: playerHealth,
    result: getCurrentResult(),
    target
  });
}

function reset(){
  currentMonsterHealth = chosenMaxLife;
  currentPlayerHealth = chosenMaxLife;
  resetGame(chosenMaxLife);
}
function endRound(){
  const initialPlayerHealth = currentPlayerHealth;
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;
  writeToLog(LOG_EVENT_MONSTER_ATTACK,
      playerDamage,
      currentMonsterHealth,
      currentPlayerHealth
  );

  if (currentPlayerHealth <= 0 && hasBonusLife){
    hasBonusLife = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerHealth;
    alert('You would be dead but the bonus life saved you! ');
    setPlayerHealth(initialPlayerHealth);
  }

  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert('You won!');
    writeToLog(LOG_EVENT_GAME_OVER,0,currentMonsterHealth,currentPlayerHealth);
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert('You lost!');
    writeToLog(LOG_EVENT_GAME_OVER,0,currentMonsterHealth,currentPlayerHealth);
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
    alert('You have a draw!');
    writeToLog(LOG_EVENT_GAME_OVER,0,currentMonsterHealth,currentPlayerHealth);
  }
  if (currentPlayerHealth <= 0 || currentMonsterHealth <= 0){
    reset();
  }
}
function attackMonster (mode){
  let maxDamage;
  let modeToLog;
  if (mode === MODE_ATTACK){
    maxDamage = ATTACK_VALUE;
    modeToLog = LOG_EVENT_PLAYER_ATTACK;
  }
  else if (mode === MODE_STRONG_ATTACK){
    maxDamage = STRONG_ATTACK_VALUE;
    modeToLog = LOG_EVENT_PLAYER_STRONG_ATTACK;
  }
  const damage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= damage;
  writeToLog(modeToLog,damage,currentMonsterHealth,currentPlayerHealth);
  endRound();
}

function attackHandler() {
  attackMonster(MODE_ATTACK);
}
function strongAttackHandler() {
  attackMonster(MODE_STRONG_ATTACK);
}
function healPlayerHandler(){
  let healValue;
  if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE){
    alert("You can't heal to more then your max initial health.");
    healValue = chosenMaxLife - currentPlayerHealth;
  }
  else{
    healValue = HEAL_VALUE;
  }
  increasePlayerHealth(healValue);
  currentPlayerHealth += healValue;
  writeToLog(LOG_EVENT_PLAYER_HEAL,healValue,currentMonsterHealth,currentPlayerHealth);
  endRound();
}

function printLogHandler(){
  console.log(battleLog);
}

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click',strongAttackHandler);
healBtn.addEventListener('click',healPlayerHandler);
logBtn.addEventListener('click', printLogHandler);
