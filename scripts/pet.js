import { changeBalance, setBalanceField } from "./functions.js";

if (!localStorage.getItem('salad_box')) {
    localStorage.setItem('salad_box', 2)
}

if (!localStorage.getItem('drop_box')) {
    localStorage.setItem('drop_box', 2)
}

if (!localStorage.getItem('last_drop_box')) {
    localStorage.setItem('last_drop_box', new Date().getTime())
}

if (!localStorage.getItem('last_salad_box')) {
    localStorage.setItem('last_salad_box', new Date().getTime())
}

setBalanceField()
let balance = document.querySelector('.balance')
let state = document.querySelector('.state')

let nameData = { 'eagle': 'Billy', 'frog': 'Pops', 'parrot': 'Coco' }
let barData = [35, 70, 90]

let animal = localStorage.getItem('animal_box')
let name = nameData[animal]

document.querySelector('.name').innerHTML = name

updateBars()
setInterval(() => {
    updateBars()
    updateState()
}, 10000);

updateState()

document.querySelector('.pet').src = '../png/big_' + animal + '.png'
if (animal == 'frog') { document.querySelector('.pet').classList.add('frog') }

for (let button of document.querySelectorAll('.button')) {
    let good = button.dataset.good
    button.onclick = () => {
        if (Number(balance.innerHTML) <= 10) { return }

        if (Number(localStorage.getItem(good + '_box')) != 2) {
            changeBalance(-15)

            localStorage.setItem(good + '_box', Number(localStorage.getItem(good + '_box')) + 1)
            localStorage.setItem('last_' + good + '_box', new Date().getTime())
            updateBars()
            updateState()
        }
    }
}

function updateBars() {
    let now = new Date()

    if (Number(localStorage.getItem('drop_box'))) {
        if (now - localStorage.getItem('last_drop_box') >= 10 * 60 * 1000) {
            localStorage.setItem('drop_box', 0)
        } else if (now - localStorage.getItem('last_drop_box') >= 5 * 60 * 1000) {
            localStorage.setItem('drop_box', 1)
        }
    }

    if (Number(localStorage.getItem('salad_box'))) {
        if (now - localStorage.getItem('last_salad_box') >= 10 * 60 * 1000) {
            localStorage.setItem('salad_box', 0)
        } else if (now - localStorage.getItem('last_salad_box') >= 5 * 60 * 1000) {
            localStorage.setItem('salad_box', 1)
        }
    }

    document.querySelector('.drop.bar').style.width = barData[Number(localStorage.getItem('drop_box'))] + '%'
    document.querySelector('.salad.bar').style.width = barData[Number(localStorage.getItem('salad_box'))] + '%'
}

function updateState() {
    if (Number(localStorage.getItem('drop_box')) < 2) {
        state.innerHTML = 'Need water!'
    } else if (Number(localStorage.getItem('salad_box')) < 2) {
        state.innerHTML = 'Need salad!'
    } else {
        state.innerHTML = name + ' is happy!'
    }
}