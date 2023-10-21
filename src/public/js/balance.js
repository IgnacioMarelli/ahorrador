const balance = document.querySelector('.balance');
const diario = document.querySelector('.diario');
const balanceNumber= Number(balance.innerHTML);
const diarioNumber= Number(diario.innerHTML)*-1;
if(balanceNumber<diarioNumber){
    balance.style.color="red";
}
if (balanceNumber>0) {
    balance.style.color="green";
}