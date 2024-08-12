(function () {
    const $ = q => document.querySelector(q);

    function addCarToGarage(car) {
        // Cria uma nova linha na tabela para o veículo
        const row = document.createElement("tr");

        // Preenche a linha com os dados do veículo
        row.innerHTML = `
            <td>${car.name}</td>
            <td>${car.model}</td>
            <td>${car.licence}</td>
            <td>${car.observation}</td>
            <td>${car.time}</td>
            <td>
                <button class="delete">Excluir</button>
            </td>
        `;
        $("#garage").appendChild(row);

        // Adiciona evento para excluir o veículo
        row.querySelector(".delete").addEventListener("click", function () {
            row.remove(); // Remove a linha da tabela
            removeCarFromStorage(car); // Remove o veículo do armazenamento
        });
    }

    function removeCarFromStorage(car) {
        // Recupera a lista de veículos do localStorage
        const garage = JSON.parse(localStorage.garage);
        // Filtra o veículo que deve ser removido
        const updatedGarage = garage.filter(c => c.licence !== car.licence);
        // Atualiza o localStorage com a nova lista
        localStorage.garage = JSON.stringify(updatedGarage);
    }

    function loadGarage() {
        // Recupera a lista de veículos do localStorage, ou inicializa como vazia
        const garage = localStorage.garage ? JSON.parse(localStorage.garage) : [];
        // Adiciona cada veículo na tabela
        garage.forEach(car => addCarToGarage(car));
    }

    $("#send").addEventListener("click", e => {
        // Captura os valores dos campos de entrada
        const name = $("#name").value;
        const model = $("#model").value;
        const licence = $("#licence").value;
        const observation = $("#observation").value;

        // Verifica se todos os campos estão preenchidos
        if (!name || !licence || !model || !observation) {
            alert("Todos os campos são obrigatórios!");
            return;
        }

        // Cria um objeto com as informações do veículo
        const car = { name, model, licence, observation, time: new Date().toLocaleString() };

        // Recupera a lista de veículos do localStorage
        const garage = localStorage.garage ? JSON.parse(localStorage.garage) : [];
        // Adiciona o novo veículo à lista
        garage.push(car);

        // Atualiza o localStorage com a nova lista
        localStorage.garage = JSON.stringify(garage);

        // Adiciona o veículo à tabela
        addCarToGarage(car);

        // Limpa os campos após adicionar
        $("#name").value = "Carro"; // Reset para a primeira opção do select
        $("#model").value = "";
        $("#licence").value = "";
        $("#observation").value = "";
    });

    // Carrega os veículos salvos ao iniciar
    loadGarage();
})();
