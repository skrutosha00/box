import { setBalanceField } from "./functions.js";

setBalanceField()

for (let button of document.querySelectorAll('.card a')) {
    button.onclick = () => {
        localStorage.setItem('animal_box', button.dataset.animal)
    }
}