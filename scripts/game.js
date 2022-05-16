import { changeBalance, randElem, setBalanceField, shuffle } from "./functions.js"

let field = document.querySelector('.field')
let betField = document.querySelector('.bet_field')
let boxCont = document.querySelector('.box_cont')
let betAmount = document.querySelector('.bet_amount')
let warning = document.querySelector('.warning')
let intro = document.querySelector('.intro')
let introText = document.querySelector('.speech span')
let arrow = document.querySelector('.arrow')

setBalanceField()
let balance = document.querySelector('.balance')

let levelData = { 'Easy': 5, 'Medium': 4, 'Hard': 3 }
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

introText.innerHTML = 'Hi! Take a short training.'
intro.style.left = '5%'
setTimeout(() => {
    introText.innerHTML = ''
    introText.innerHTML = 'Choose some animals'
    arrow.style.animation = 'arrow1 2s ease'
}, 1500);
setTimeout(() => {
    introText.innerHTML = 'They will be displayed here'
    arrow.style.animation = 'arrow2 2s ease'
}, 3000);
setTimeout(() => {
    introText.innerHTML = 'Select the bet and play!'
    arrow.style.transform = 'rotate(90deg)'
    arrow.style.animation = 'arrow3 2s ease'
}, 5000);
setTimeout(() => {
    intro.style.left = '-35%'
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
        if (!active || chosen.includes(cell.dataset.animal) || chosen.length == levelData[level]) { return }

        chosen.push(cell.dataset.animal)
        updateBet()
    }

    field.appendChild(cell)
    i++
}

for (let i = 0; i < levelData[level]; i++) {

    let box = document.createElement('div')
    box.classList.add('box')

    i % 2 == 0 ? box.style.left = 0 : box.style.right = 0
    box.style.bottom = 5 + i * 15 + '%'
    box.style.zIndex = 5 - i

    let innerBox = document.createElement('div')
    innerBox.classList.add('inner_box')

    box.appendChild(innerBox)

    let img = document.createElement('img')
    img.src = '../png/box.png'
    img.classList.add('closed')
    box.appendChild(img)

    for (let item of ['back', 'front']) {
        let img = document.createElement('img')
        img.src = '../png/' + item + '_box.png'
        img.classList.add(item)
        box.appendChild(img)
    }

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

    let outcome = shuffle(Object.keys(animalData)).slice(0, levelData[level])

    let i = 0
    for (let box of document.querySelectorAll('.box')) {
        box.style.animation = 'box 1.5s ease'

        setTimeout(() => {
            box.querySelector('.front').classList.remove('hidden')
            box.querySelector('.back').classList.remove('hidden')
            box.querySelector('.closed').classList.add('hidden')

            let animal = document.createElement('img')
            animal.src = '../png/' + outcome[i] + '.png'
            animal.classList.add('box_animal')
            box.querySelector('.inner_box').appendChild(animal)
            i++

            setTimeout(() => {
                animal.style.top = 0
            }, 300);
        }, 1700);
    }

    let prize = getPrize(outcome)

    setTimeout(() => {
        warning.querySelector('.text').innerHTML = prize ? 'Congrats! You have won ' + prize + ' stars' : 'No way! Try again right now'
        warning.style.top = 0
        if (prize) { changeBalance(prize) }
    }, 2800);
}

document.querySelector('.warning .button').onclick = () => {
    warning.style.top = '-50%'

    for (let box of document.querySelectorAll('.box')) {
        box.style.animation = ''
        box.querySelector('.box_animal').style.top = '100%'

        setTimeout(() => {
            box.querySelector('.box_animal').remove()

            box.querySelector('.front').classList.add('hidden')
            box.querySelector('.back').classList.add('hidden')
            box.querySelector('.closed').classList.remove('hidden')
        }, 500);
    }
    active = true
}

function updateBet() {
    betField.innerHTML = ''

    for (let animal of chosen) {
        let icon = document.createElement('img')
        icon.src = '../png/small_' + animal + '.png'

        betField.appendChild(icon)
    }
}

function getPrize(outcome) {
    let maxCf = 0
    for (let animal of outcome) {
        if (chosen.includes(animal)) {
            if (maxCf < animalData[animal]) {
                maxCf = animalData[animal]
            }
        }
    }
    return Number(betAmount.innerHTML) * maxCf
}