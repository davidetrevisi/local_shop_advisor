//funzione di inserimento prodotto

function inserimento() {
    var idProdotto = document.getElementById("idProdotto").value;
    var nomeProdotto = document.getElementById("nomeProdotto").value;
    var prezzoProdotto = document.getElementById("prezzoProdotto").value;
    var quantitaProdotto = document.getElementById("quantitaProdotto").value;

    fetch('../api/v1/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ID: idProdotto, nome: nomeProdotto, prezzo: prezzoProdotto, quantita: quantitaProdotto }),
    })
        .then((resp) => {
            console.log(resp);
            console.log(idProdotto);
            stato();
            return;
        })
        .catch(error => console.error(error)); // If there is any error you will catch them here
};

//funzione per lo stato inserimento

function stato() {
    const ul = documento.getElementById('statoInserimento');
};
