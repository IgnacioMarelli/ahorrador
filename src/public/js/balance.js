const balance = document.querySelector('.balance');
const diario = document.querySelector('.diario');
const mensual = document.querySelector('.mensual');
const balanceMensual=document.querySelector('.balanceMensual');

const mensualNumber=Number(mensual.innerHTML)*-1;
const bMNumber= Number(balanceMensual.innerHTML);
const balanceNumber= Number(balance.innerHTML);
const diarioNumber= Number(diario.innerHTML)*-1;

if(balanceNumber<diarioNumber){
    balance.style.color="red";
}
if (balanceNumber>0) {
    balance.style.color="green";
}
if (bMNumber<mensualNumber) {
    balanceMensual.style.color="red";
}
if (bMNumber>0) {
    balanceMensual.style.color="green";
}