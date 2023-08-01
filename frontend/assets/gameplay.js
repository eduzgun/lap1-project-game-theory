const buttonHigh = document.querySelector('#buttonHigh')
const buttonLow = document.querySelector('#buttonLow')
const infoSection = document.querySelector('#infoSection')
const scoreSection = document.querySelector('#scoreSection')
const gameObject = {
    strategy: '',
    userScore: [0],
    userChoice: [],
    appScore: [0],
    appChoice: [],
}
let currentRound = 1
let userProfit = 0
let appProfit = 0

gameObject.strategy = getRandomStrategy()

buttonHigh.addEventListener('click', handleButtonPressed)
buttonLow.addEventListener('click', handleButtonPressed)
updateUI()

function handleButtonPressed(event) {
    let playerMove
    event.preventDefault()
    if (event.target.id === 'buttonHigh') {
        playerMove = 'h'
    } else if (event.target.id === 'buttonLow') {
        playerMove = 'l'
    }
    storeMove(playerMove, 'player')
    marketMove = getMarketMove(gameObject.strategy)
    storeMove(marketMove, 'market')
    if (playerMove === 'h' && marketMove === 'h') {
        userProfit = 2000
        appProfit = 2000
        gameObject.userScore[0] += userProfit
        gameObject.appScore[0] += appProfit
    } else if (playerMove === 'h' && marketMove === 'l') {
        userProfit = 0
        appProfit = 3000
        gameObject.userScore[0] += userProfit
        gameObject.appScore[0] += appProfit
    } else if (playerMove === 'l' && marketMove === 'h') {
        userProfit = 3000
        appProfit = 0
        gameObject.userScore[0] += userProfit
        gameObject.appScore[0] += appProfit
    } else if (playerMove === 'l' && marketMove === 'l') {
        userProfit = 1000
        appProfit = 1000
        gameObject.userScore[0] += userProfit
        gameObject.appScore[0] += appProfit
    }
    updateUI()
    currentRound++
    if (currentRound > 10) {
        postObject(gameObject)
        window.location.replace('./results.html')
    }
}

function formatMove(move) {
    if (move === 'l') {
        return 'Low'
    } else if (move === 'h') {
        return 'High'
    }
}

function storeMove(move, player) {
    if (player === 'player') {
        gameObject.userChoice.push(move)
    } else if (player === 'market') {
        gameObject.appChoice.push(move)
    }
}

function getRandomStrategy() {
    let num = Math.floor(Math.random() * 3)
    if (num === 0) {
        return 'random'
    } else if (num === 1) {
        return 'tit-for-tat'
    } else if (num === 2) {
        return 'alternate'
    }
}

function getMarketMove(str) {
    if (str === 'random') {
        // 0. Random
        let rand = Math.floor(Math.random() * 2)
        if (rand === 0) {
            return 'l'
        } else {
            return 'h'
        }
    } else if (str === 'tit-for-tat') {
        // 1. Tit for tat
        if (currentRound === 1) {
            return 'h'
        }
        return gameObject.userChoice[currentRound - 1]
    } else if (str === 'alternate') {
        // 2. Alternate
        if (currentRound % 2 === 0) {
            return 'l'
        } else {
            return 'h'
        }
    }
}

function updateUI() {
    infoSection.children[0].textContent = `${currentRound}/10`
    if (currentRound > 0) {
        infoSection.children[1].textContent = `Previous Move: ${formatMove(
            gameObject.userChoice[currentRound - 1]
        )}`
        infoSection.children[2].textContent = `Market Previous Move: ${formatMove(
            gameObject.appChoice[currentRound - 1]
        )}`
    }
    scoreSection.children[0].textContent = `Profit: £${userProfit}`
    scoreSection.children[1].textContent = `Revenue: £${gameObject.userScore[0]}`
}

async function postObject(obj) {
    const data = JSON.stringify(obj)
    console.log(data)
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: data,
    }
    const response = await fetch(`http://127.0.0.1:3000/results`, options)
}
