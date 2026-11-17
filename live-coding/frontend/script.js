let file = "http://localhost:8000/backend/api/api_ctg.php";
document.addEventListener("DOMContentLoaded" , function(){



// function getall data 

 async function getallData(file){
    try{
    let tbdoy = document.querySelector('#table-categories-body');

    let reponse = await fetch(file);
    if(!reponse.ok){
        toast('you have a error in reponse backend api' , 'error');
        throw new Error('error in reponse');
    }


    let data = await reponse.json();

      tbdoy.innerHTML = "";

         data.forEach(datas => {
           let tr = document.createElement("tr");
            tr.insertAdjacentHTML("beforeend" , `
               <td>${datas.id}</td>
                 <td>${datas.nom}</td>
                 <td>${datas.colour}</td>
                <td>${datas.incon}</td>
            ` )
             tbdoy.appendChild(tr);       
         });

    }catch(Error){
        console.log(Error);
    }
    }




 getallData(file);

// add data to file json
async function addData(file){
    isLoading();

    isLoading(true);
        let nom = document.querySelector("#cat-nom");
        let colour = document.querySelector("#cat-couleur");
        let incon = document.querySelector("#cat-icone");

        let nomValue = nom.value;
        let colourValue = colour.value;
        let inconValue = incon.value;

        let alldata = {
            "nom" : nomValue,
            "colour" : colourValue,
            "incon" : inconValue 
        }
        
 try{

       let reponse = await fetch(file ,{
                method : "POST",
                headers:{"Content-type":"application/json"},
                body:JSON.stringify(alldata)
                })
            
        if(!reponse.ok){
            toast('eror in add backend reponse' , 'error');
            throw new Error('error in add backend reponse');
        }

        await getallData(file);

            nom.value = "";
            colour.value = "";
            incon.value = "";

            toast('category added succese' , 'success');
    }catch(Error){
      console.log(Error)
    }finally{
       isLoading(false);
        
    }
}

let form = document.getElementById("form-categorie");
form.addEventListener('submit',function(e){
   e.preventDefault();
   addData(file);
})


})




//function afichage message;
let toastTimeout;

function toast(message,type){
   let toastdiv = document.querySelector("#toast");
   toastdiv.textContent = message;

   toastdiv.className = `fixed bottom-4 right-4 z-50 text-white p-3 rounded shadow-lg ${
       type === 'success' ? 'bg-green-500' : 'bg-red-500'
   }`;
   clearTimeout(toastTimeout);
   toastTimeout = setTimeout(()=>{
    toastdiv.textContent = "";
    toastdiv.className = "";
   },3000);
}




let originalText = "Enregistrer";

function isLoading(loading) {
    let btnsubmit = document.querySelector('#btnSubmit');
    let spinner = document.querySelector('#spinner');
    let btnText = document.querySelector('#btnText');
    let originalText = "Enregistrer";
    if (loading) {
        btnText.textContent = "Enregistr...";
        btnsubmit.disabled = true;
        spinner.classList.remove("hidden");
    } else {
          setTimeout(()=>{
           btnText.textContent = originalText;
            btnsubmit.disabled = false;
            spinner.classList.add("hidden");
        },1000)
    }
}