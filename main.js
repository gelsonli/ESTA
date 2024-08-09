(function () {
    const $ = q => document.querySelector(q);

    function addCarToGarage (car) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${car.name}</td>
            <td>${car.licence}</td>
            <td>${car.time}</td>
            <td>
                <botom class="delete"></botom>
            </td>
        `
        $("#garage").appendChild(row);
    };

    $("send").addEventListenner("click", e => {
        const name = $("#name").value
        const licence = $("#licence").value;

        if(!name || !licence) {
            alert("Os campos são obrigatórios!");
            return;
        }

        const car = { nome, licence, time: new Date() }

        const garage = localStorage.garage ? JSON.parse(localStorage.garage) : [];
        garage.push(car);

        localStorage.garage = JSON.stringify(garage);
        console.log(garage);

        addCarToGarage(car);

        $("#name").value = "";
        $("#licence").value = "";
    });
})();

