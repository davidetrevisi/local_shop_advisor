//funzione di inserimento prodotto

function inserimento() {
  var nomeProdotto = document.getElementById("nomeProdotto").value;
  var descProdotto = document.getElementById("descrizioneProdotto").value;
  var prezzoProdotto = document.getElementById("prezzoProdotto").value;
  var categoriaProdotto = document.getElementById("categoriaProdotto").value;
  var tagsProdotto = document.getElementById("tagsProdotto").value;

  fetch("../api/v1/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: nomeProdotto,
      description: descProdotto,
      price: prezzoProdotto,
      category: categoriaProdotto,
      tags: tagsProdotto,
    }),
  })
    .then((resp) => {
      console.log(resp);
      console.log(idProdotto);
      stato();
      return;
    })
    .catch((error) => console.error(error)); // If there is any error you will catch them here
}

//funzione per lo stato inserimento

function stato() {
  const ul = documento.getElementById("statoInserimento");
}
