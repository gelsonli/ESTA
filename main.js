(function () {
    // Função para facilitar a seleção de elementos DOM
    const $ = (q) => document.querySelector(q);
  
    // Define as tarifas por tipo de veículo e tempo
    const rates = {
      Carro: 5, // R$5,00 até 3 horas
      Moto: 2, // R$2,00 até 3 horas
      Van: 7, // R$7,00 até 3 horas
    };
  
    // Define a tarifa por hora extra após 3 horas
    const extraRate = {
      Carro: 2, // R$2,00 por hora extra
      Moto: 1.5, // R$1,50 por hora extra
      Van: 3, // R$3,00 por hora extra
    };
  
    let availableSpots = 100; // Número de vagas disponíveis
    let totalIncome = 0; // Rendimento total do dia
  
    // Inicializa o histórico de veículos no localStorage, se não existir
    if (!localStorage.vehicleHistory) {
      localStorage.vehicleHistory = JSON.stringify([]);
    }
  
    // Atualiza a exibição do número de vagas disponíveis
    function updateSpotsDisplay() {
      $("#spots-remaining").textContent = `Vagas: ${availableSpots}`;
    }
  
    // Adiciona um veículo à garagem e à tabela
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
                <button class="delete">Sair</button>
            </td>
        `;
      $("#garage").appendChild(row);
  
      // Adiciona evento para excluir o veículo
      row.querySelector(".delete").addEventListener("click", function () {
        // Calcula o valor a ser pago
        const now = new Date();
        const entryTime = new Date(car.time);
        const timeInGarage = now - entryTime; // Calcula o tempo total de permanência
        const minutes = Math.floor(timeInGarage / (1000 * 60)); // Minutos totais
        const hours = Math.floor(timeInGarage / (1000 * 60 * 60)); // Horas totais
        const extraMinutes = minutes % 60; // Minutos extras além das horas completas
  
        // Calcula o custo com base no tempo de permanência
        let totalCost = rates[car.name];
        if (hours > 3) {
          totalCost += (hours - 3) * extraRate[car.name];
        }
  
        // Cria o cupom com o resumo
        const coupon = `
          <h2>Resumo de Pagamento</h2>
          <p>Veículo: ${car.name}</p>
          <p>Modelo: ${car.model}</p>
          <p>Placa: ${car.licence}</p>
          <p>Tempo de Permanência: ${hours > 0 ? hours + " horas e " + extraMinutes + " minutos" : minutes + " minutos"}</p>
          <p>Valor a Cobrar: R$ ${totalCost.toFixed(2)}</p>
          <p>Forma de Pagamento: <select id="payment-method">
              <option value="debito">Débito</option>
              <option value="credito">Crédito</option>
              <option value="avista">À Vista</option>
              <option value="pix">Pix</option>
          </select></p>
          <button id="confirm-payment">Confirmar Pagamento</button>
        `;
  
        // Exibe o cupom em uma nova janela
        const couponWindow = window.open("", "Cupom", "width=300,height=400");
        couponWindow.document.write(coupon);
  
        // Adiciona evento para confirmar o pagamento
        couponWindow.document.querySelector("#confirm-payment").addEventListener("click", function () {
          const paymentMethod = couponWindow.document.querySelector("#payment-method").value;
  
          // Armazena o histórico do veículo
          const vehicleHistory = JSON.parse(localStorage.vehicleHistory);
          vehicleHistory.push({
            ...car,
            exitTime: now.toLocaleString(), // Hora de saída
            totalCost,
            paymentMethod,
          });
          localStorage.vehicleHistory = JSON.stringify(vehicleHistory);
  
          totalIncome += totalCost; // Atualiza o total arrecadado
          couponWindow.close(); // Fecha o cupom após confirmar pagamento
        });
  
        row.remove(); // Remove a linha da tabela
        removeCarFromStorage(car); // Remove o veículo do armazenamento
  
        availableSpots++; // Libera uma vaga
        updateSpotsDisplay(); // Atualiza o número de vagas disponíveis
      });
    }
  
    // Remove um carro do armazenamento local
    function removeCarFromStorage(car) {
      // Recupera a lista de veículos do localStorage
      const garage = JSON.parse(localStorage.garage);
      // Filtra o veículo que deve ser removido
      const updatedGarage = garage.filter((c) => c.licence !== car.licence);
      // Atualiza o localStorage com a nova lista
      localStorage.garage = JSON.stringify(updatedGarage);
    }
  
    // Carrega os veículos armazenados ao iniciar
    function loadGarage() {
      // Recupera a lista de veículos do localStorage, ou inicializa como vazia
      const garage = localStorage.garage ? JSON.parse(localStorage.garage) : [];
      availableSpots -= garage.length; // Reduz o número de vagas disponíveis pelo número de veículos já na garagem
      updateSpotsDisplay(); // Atualiza o número de vagas disponíveis
      // Adiciona cada veículo na tabela
      garage.forEach((car) => addCarToGarage(car));
    }
  
    // Gera um resumo do dia
    function generateSummary() {
      // Recupera o histórico de veículos do localStorage
      const vehicleHistory = JSON.parse(localStorage.vehicleHistory);
  
      // Calcula totais por método de pagamento
      const paymentTotals = {
        debito: 0,
        credito: 0,
        avista: 0,
        pix: 0,
      };
  
      vehicleHistory.forEach((entry) => {
        paymentTotals[entry.paymentMethod] += entry.totalCost;
      });
  
      // Gera o resumo
      const summary = `
        <h2>Resumo do Dia</h2>
        <p>Total de Veículos: ${vehicleHistory.length}</p>
        <p>Total Arrecadado: R$ ${totalIncome.toFixed(2)}</p>
        <p>Pagamentos por Débito: R$ ${paymentTotals.debito.toFixed(2)}</p>
        <p>Pagamentos por Crédito: R$ ${paymentTotals.credito.toFixed(2)}</p>
        <p>Pagamentos à Vista: R$ ${paymentTotals.avista.toFixed(2)}</p>
        <p>Pagamentos por Pix: R$ ${paymentTotals.pix.toFixed(2)}</p>
      `;
  
      // Abre uma nova janela para exibir o resumo
      const summaryWindow = window.open("", "Resumo", "width=400,height=500");
      summaryWindow.document.write(summary);
    }
  
    // Adiciona evento de clique ao botão de enviar
    $("#send").addEventListener("click", (e) => {
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
  
      // Verifica se há vagas disponíveis
      if (availableSpots <= 0) {
        alert("Não há vagas disponíveis!");
        return;
      }
  
      const time = new Date().toLocaleString(); // Captura o horário de entrada
  
      // Armazena o veículo no localStorage
      const car = { name, model, licence, observation, time };
      const garage = localStorage.garage ? JSON.parse(localStorage.garage) : [];
      garage.push(car);
      localStorage.garage = JSON.stringify(garage);
  
      addCarToGarage(car); // Adiciona o veículo na tabela
      availableSpots--; // Diminui uma vaga disponível
      updateSpotsDisplay(); // Atualiza o número de vagas disponíveis
  
      // Limpa os campos de entrada
      $("#name").value = "";
      $("#model").value = "";
      $("#licence").value = "";
      $("#observation").value = "";
    });
  
    // Adiciona evento para gerar resumo
    $("#generate-summary").addEventListener("click", generateSummary);
  
    loadGarage(); // Carrega os veículos armazenados ao iniciar
  })();
  