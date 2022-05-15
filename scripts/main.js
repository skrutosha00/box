import { setBalanceField } from './functions.js'

if (!localStorage.getItem('balance_box')) {
    localStorage.setItem('balance_box', 1500)
}

setBalanceField()
