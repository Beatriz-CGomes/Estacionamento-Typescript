interface Carro {
    nome: string;
    placa: string;
    entrada: Date | string;
    clientId?: string;
}




(function () {
    const $ = (query: string): HTMLInputElement | null =>
        document.querySelector(query);

 function calcTempo(mil : number){
     const min = Math.floor(mil / 60000);
     const sec = Math.floor((mil % 60000) / 1000);

     return `${min}m e ${sec}s`;
 }


    function patio() {
        function ler(): Carro[] {
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];

        }

        function salvar(carros: Carro[]) { 
                  localStorage.setItem("patio", JSON.stringify(carros));
        }


        function adicionar(carros: Carro, salva?: boolean) {
            const row = document.createElement("tr");

            row.innerHTML = ` 
           <td>${carros.nome}</td> 
           <td>${carros.placa}</td> 
           <td>${carros.entrada}</td> 
           <td>
           <button class="delete" data-placa="${carros.placa}">X</button>
           </td> 
           `;


           row.querySelector(".delete")?.addEventListener("click", function(){
               remover(this.dataset.placa)
           });

            $("#patio")?.appendChild(row);
            if(salva) salvar([...ler(), carros]);

        }

        function remover(placa : string) { 
            const {entrada, nome} = ler().find(carro => carro.placa === placa);

            const tempo = calcTempo(new Date().getTime() - new Date(entrada).getTime());

            if(!confirm(`O Carro ${nome} permaneceu por ${tempo}. Deseja encerrar:`)) return; 
              salvar(ler().filter(carro => carro.placa !== placa));
              render()


        }


        function render() { 
            $("#patio")!.innerHTML = "";
            const patio = ler();

            if(patio.length){
                patio.forEach(carro => adicionar(carro));

            }

        }

        return { ler, adicionar, remover, salvar, render };

    }

    patio().render();


    $("#cadastrar")?.addEventListener("click", () => {

        const nome = $("#nome")?.value;
        const placa = $("#placa")?.value;


        if (!nome || !placa) {
            alert("Os campos nome e placa são obrigatórios");
            return;
        }

        patio().adicionar({ nome, placa, entrada: new Date().toISOString() }, true);

    })

})();