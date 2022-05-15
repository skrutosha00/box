import { setBalanceField } from "./functions.js";

setBalanceField()

for (let playButton of document.querySelectorAll('a')) {
    playButton.onclick = () => {
        localStorage.setItem('level_box', playButton.previousElementSibling.innerHTML)
    }
}