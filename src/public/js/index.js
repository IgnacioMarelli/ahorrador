

async function primerClick(){
    try{
        const objetivo= document.querySelector(".objetivo").value;
        const ahorros = document.querySelector(".ahorros").value;
        const salario = document.querySelector(".salario").value;
        const tiempo = document.querySelector(".tiempo").value;
        const response = await api.post(`/api`,{objetivo,ahorros,tiempo,salario});
        if (response.ok) {
            Swal.fire({
                title: 'Excelente',
                text: 'Aportaste todos los datos necesarios',
                icon: 'success'
            });
            setTimeout(function() {
                location.href = 'https://ahorrador-production.up.railway.app/api/inicio';
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


async function segundoClick(){
    try{
        const nuevoIngreso= document.querySelector(".nuevoIngreso").value;
        const nuevoGasto = document.querySelector(".nuevoGasto").value*-1;
        const banco = document.getElementById("Banco");
        const mercadopago = document.getElementById("MercadoPago");
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
          } else {
            if (nuevoGasto<0) {
                ingreso=nuevoGasto;
                response = await api.put(`/api/inicio`,{ingreso});
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
            setTimeout(function() {
                location.href = 'https://ahorrador-production.up.railway.app/api';
            }, 500);
        }else{
            if(response.status===500){
                Swal.fire({
                    title: 'Error',
                    text: 'Es probable que el servidor no este funcionando como debería',
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
            setTimeout(function() {
                location.href = 'https://ahorrador-production.up.railway.app/guiso';
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
