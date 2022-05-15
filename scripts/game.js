import { changeBalance, randElem, setBalanceField } from "./functions.js"

let field = document.querySelector('.field')
let betField = document.querySelector('.bet_field')
let boxCont = document.querySelector('.box_cont')
let betAmount = document.querySelector('.bet_amount')
let box = document.querySelector('.box')
let warning = document.querySelector('.warning')
let intro = document.querySelector('.speech')
let arrow = document.querySelector('.arrow')

setBalanceField()
let balance = document.querySelector('.balance')

let levelData = { 'Easy': 4, 'Medium': 3, 'Hard': 2 }
let animalData = {
    'crow': 1,
    'goose': 1.7,
    'worm': 2.2,
    'eagle': 2.8,
    'parrot': 3.0,
    'rabbit': 3.2,
    'mantis': 2.8,
    'goat': 3.8,
    'pig': 4.2,
    'frog': 4.8,
    'cow': 5,
    'hyppo': 5.1,
    'tiger': 7,
    'snake': 6.5,
    'turtle': 6.8,
    'croco': 9
}

let level = localStorage.getItem('level_box')
let active = false
let chosen = []

if (localStorage.getItem(level + '_box')) {
    chosen = localStorage.getItem(level + '_box').split(',')
    updateBet()
}

intro.innerHTML = 'Hi! Take a short training before starting the game.'
intro.parentElement.style.left = '5%'
setTimeout(() => {
    intro.innerHTML = 'Choose some animals'
    arrow.style.animation = 'arrow1 2s ease'
}, 1500);
setTimeout(() => {
    intro.innerHTML = 'They will be displayed here'
    arrow.style.animation = 'arrow2 2s ease'
}, 3000);
setTimeout(() => {
    intro.innerHTML = 'Select the bet and play!'
    arrow.style.transform = 'rotate(90deg)'
    arrow.style.animation = 'arrow3 2s ease'
}, 5000);
setTimeout(() => {
    intro.parentElement.style.left = '-35%'
    active = true
}, 7000);

let i = 0
for (let animal in animalData) {
    let cell = document.createElement('div');
    cell.dataset.animal = animal;

    (Math.floor(i / 4) + (i - (Math.floor(i / 4) * 4))) % 2 == 0 ? cell.classList.add('cell', 'dark') : cell.classList.add('cell', 'light')

    let cellPic = document.createElement('img')
    cellPic.src = '../png/' + animal + '.png'

    let cf = document.createElement('div')
    cf.innerHTML = 'X' + animalData[animal]

    cell.appendChild(cellPic)
    cell.appendChild(cf)

    cell.onclick = () => {
        if (!active || chosen.includes(cell.dataset.animal) || chosen.length == levelData[level] + 1) { return }

        chosen.push(cell.dataset.animal)
        updateBet()
    }

    field.appendChild(cell)
    i++
}

for (let i = 0; i < levelData[level]; i++) {
    let box = document.createElement('img')
    box.src = '../png/box.png'
    box.classList.add('stable_box')

    i % 2 == 0 ? box.style.left = 0 : box.style.right = 0
    box.style.bottom = 20 + i * 15 + '%'
    box.style.zIndex = 5 - i

    boxCont.appendChild(box)
}



document.querySelector('.clear').onclick = () => {
    if (!active) { return }
    chosen = []
    updateBet()
    localStorage.removeItem(level + '_box')
}

document.querySelector('.lock').onclick = () => {
    if (!active) { return }
    localStorage.setItem(level + '_box', chosen)
}

document.querySelector('.left').onclick = () => {
    if (!active || !Number(betAmount.innerHTML)) { return }
    betAmount.innerHTML = Number(betAmount.innerHTML) - 10
}

document.querySelector('.right').onclick = () => {
    if (!active || Number(betAmount.innerHTML) + 10 > Number(balance.innerHTML)) { return }
    betAmount.innerHTML = Number(betAmount.innerHTML) + 10
}

document.querySelector('.play_button').onclick = () => {
    if (!active || Number(balance.innerHTML) < Number(betAmount.innerHTML) || !chosen.length || !Number(betAmount.innerHTML)) { return }
    changeBalance(-Number(betAmount.innerHTML))
    active = false

    box.style.animation = 'box 1.5s ease'

    setTimeout(() => {
        box.querySelector('.front').classList.remove('hidden')
        box.querySelector('.back').classList.remove('hidden')
        box.querySelector('.closed').classList.add('hidden')
    }, 1700);

    let outcome = randElem(Object.keys(animalData))
    let prize = 0
    if (chosen.includes(outcome)) {
        prize = Number(betAmount.innerHTML) * animalData[outcome]
    }

    let animal = document.createElement('img')
    animal.src = '../png/' + outcome + '.png'
    animal.classList.add('box_animal')
    box.querySelector('.inner_box').appendChild(animal)

    setTimeout(() => {
        animal.style.top = 0
    }, 2000);

    setTimeout(() => {
        warning.querySelector('.text').innerHTML = prize ? 'Congrats! You have won ' + prize + ' stars' : 'No way! Try again right now'
        warning.style.top = 0
        if (prize) { changeBalance(prize) }
    }, 2800);
}

document.querySelector('.warning .button').onclick = () => {
    warning.style.top = '-50%'
    box.style.animation = ''
    box.querySelector('.box_animal').style.top = '100%'

    setTimeout(() => {
        box.querySelector('.box_animal').remove()

        box.querySelector('.front').classList.add('hidden')
        box.querySelector('.back').classList.add('hidden')
        box.querySelector('.closed').classList.remove('hidden')

        active = true
    }, 500);
}

function updateBet() {
    betField.innerHTML = ''

    for (let animal of chosen) {
        let icon = document.createElement('img')
        icon.src = '../png/small_' + animal + '.png'

        betField.appendChild(icon)
    }
}

