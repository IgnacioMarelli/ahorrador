

async function primerClick(){
    try{
        const objetivo= document.querySelector(".objetivo").value;
        const ahorros = document.querySelector(".ahorros").value;
        const ahorrosUSD = document.querySelector(".ahorrosUSD").value;
        const salario = document.querySelector(".salario").value;
        const tiempo = document.querySelector(".tiempo").value;
        const response = await api.post(`/api`,{objetivo,ahorros,tiempo,salario,ahorrosUSD});
        if (response.ok) {
            Swal.fire({
                title: 'Excelente',
                text: 'Aportaste todos los datos necesarios',
                icon: 'success'
            });
            setTimeout( async function() {
                await api.get('/api/inicio');
            }, 500);
        }else{
            if(response.status===500){
                Swal.fire({
                    title: 'Error al comprar',
                    text: 'Es probable que no haya suficiente stock, elimine el producto y vuelva a elegir por favor',
                    icon: 'error'
                  });   
            }else{
                throw new Error
            }
            
        }
    }catch(error){
        Swal.fire({
            title: 'Error',
            text: 'Hubo un error en la solicitud',
            icon: 'error'
          });   
    }
}

function descheck(elem) {
    const element = document.getElementById(`${elem.id}`);
    element.checked = false;
    element.setAttribute("onclick",`check(${elem.id})`)
}
function check(elem) {
    const element = document.getElementById(`${elem.id}`);
    element.checked = true;
    element.setAttribute("onclick",`descheck(${elem.id})`)
}


async function segundoClick(){
    try{
        const nuevoIngreso= document.querySelector(".nuevoIngreso").value;
        const nuevoGasto = document.querySelector(".nuevoGasto").value*-1;
        const banco = document.getElementById("Banco");
        const mercadopago = document.getElementById("MercadoPago");
        const mercadopagoGasto = document.getElementById("MercadoPagoGasto");
        const mercadoPagoIngreso = document.getElementById("MercadoPagoIngreso");
        const razon = document.querySelector(".razon").value;
        let response;
        let ingreso;
        let plazoFijo;
        if (banco.checked == true) {
            ingreso=nuevoIngreso;
            plazoFijo='banco';
            response = await api.put(`/api/inicio`,{ingreso, plazoFijo});
          }else if(mercadopago.checked==true){
            ingreso=nuevoIngreso;
            plazoFijo='mercadopago';
            response = await api.put(`/api/inicio`,{ingreso, plazoFijo});
          }else if(mercadoPagoIngreso.checked){
            ingreso=nuevoIngreso;
            const mpGasto = mercadoPagoIngreso.checked;
            response = await api.put(`/api/inicio`,{ingreso, mpGasto});
          } else {
            if (nuevoGasto<0) {
                ingreso=nuevoGasto;
                const mpGasto= mercadopagoGasto.checked;
                response = await api.put(`/api/inicio`,{ingreso, mpGasto, razon});
              }else{
                  ingreso=nuevoIngreso;
                  response = await api.put(`/api/inicio`,{ingreso});
              }
        }

        if (response.ok) {
            Swal.fire({
                title: 'Excelente',
                text: 'Recalcularemos tus sueños',
                icon: 'success'
            });
            setTimeout(function() {
                location.reload(true);
            }, 500);
        }else{
            if(response.status===500){
                Swal.fire({
                    title: 'Error del servidor',
                    text: 'Error al depositar',
                    icon: 'error'
                  });   
            }else if(response.status===400){
                Swal.fire({
                    title: 'Error',
                    text: 'Campo de ingreso o gasto vacío',
                    icon: 'error'
                  });   
            }else{
                throw new Error
            }
            
        }
    }catch(error){
        Swal.fire({
            title: 'Error',
            text: 'Hubo un error en la solicitud',
            icon: 'error'
          });   
    }
}

async function nombreClick(){
    try{
        const first_name = document.querySelector(".nombre").value;
        if(first_name===""){
            Swal.fire({
                    title: 'Error',
                    text: 'El campo de nombre esta vacío',
                    icon: 'error'
                  });   
        }else{
        const response = await api.post('/inicio',{first_name});
        if (response.ok) {
            Swal.fire({
                title: 'Excelente',
                text: 'Aportaste todos los datos necesarios',
                icon: 'success'
            });
            await api.get('/api')
        }else{
            if(response.status===500){
                Swal.fire({
                    title: 'Error',
                    text: 'Es probable que el servidor no este funcionando como debería',
                    icon: 'error'
                  });   
            }else if(response.status===400){
                Swal.fire({
                    title: 'Error',
                    text: 'Campo nombre vacío',
                    icon: 'error'
                  });   
            }else{
                throw new Error
            }
            
        }}
    }catch(error){
        Swal.fire({
            title: 'Error',
            text: 'Hubo un error en la solicitud',
            icon: 'error'
          });   
    }
}


async function depositar(){
    try {
        const deposito = document.querySelector(".deposito").value;
        const response = await api.post(`/guiso`,{deposito});
        if (response.ok) {
            Swal.fire({
                title: 'Excelente',
                text: 'Aportaste todos los datos necesarios',
                icon: 'success'
            });
            setTimeout(async function() {
                await api.get('/guiso');
            }, 3000);
        }else{
            if(response.status===500){
                Swal.fire({
                    title: 'Error del servidor',
                    text: 'Error al depositar',
                    icon: 'error'
                  });   
            }else{
                throw new Error
            }
            
        }
    }catch(error){
        Swal.fire({
            title: 'Error',
            text: 'Hubo un error en la solicitud',
            icon: 'error'
          });   
    }
}
function mostrarOpciones() {
    const checkbox = document.getElementById("checkbox");
    const opciones = document.getElementById("opciones");
    if (checkbox.checked == true) {
      opciones.style.display = "block";
    } else {
      opciones.style.display = "none";
    }
}
function options(elem1, elem2, elem3){
    const checkbox = document.getElementById(`${elem1.id}`);
    checkbox.style.display = "block";
    const opciones = document.getElementById(`${elem2.id}`);
    opciones.setAttribute("onclick",`noOption(${elem1.id},${elem2.id})`)
    
}
function noOption(elem1, elem2){
    const checkbox = document.getElementById(`${elem1.id}`);
    checkbox.style.display = "none";
    const opciones = document.getElementById(`${elem2.id}`);
    opciones.setAttribute("onclick",`options(${elem1.id},${elem2.id})`)
}
const animateButton = function(e) {
    e.preventDefault;
    e.target.classList.remove('animate');
    e.target.classList.add('animate');
    setTimeout(function(){
      e.target.classList.remove('animate');
    },700);
  };
  
  const bubblyButtons = document.getElementsByClassName("bubbly-button");
  
  for (let i = 0; i < bubblyButtons.length; i++) {
    bubblyButtons[i].addEventListener('click', animateButton, false);
  }