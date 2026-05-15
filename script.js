// Niz u koji cuvamo sve pacijente
var pacijenti = [];

// Uzimamo elemente iz HTML-a
var btnDodajPacijenta = document.getElementById("btnDodajPacijenta");
var btnPrikaziPacijente = document.getElementById("btnPrikaziPacijente");
var btnPrimeni = document.getElementById("btnPrimeni");

var formaSekcija = document.getElementById("formaSekcija");
var pacijentiSekcija = document.getElementById("pacijentiSekcija");

var patientForm = document.getElementById("patientForm");

var imeInput = document.getElementById("ime");
var godineInput = document.getElementById("godine");
var visinaInput = document.getElementById("visina");
var tezinaInput = document.getElementById("tezina");
var napomenaInput = document.getElementById("napomena");

var filterKategorija = document.getElementById("filterKategorija");
var sortiranje = document.getElementById("sortiranje");

var patientsContainer = document.getElementById("patientsContainer");
var brojPacijenata = document.getElementById("brojPacijenata");

// Povezivanje dugmica sa funkcijama
btnDodajPacijenta.addEventListener("click", prikaziFormu);
btnPrikaziPacijente.addEventListener("click", prikaziPacijente);
btnPrimeni.addEventListener("click", prikaziPacijente);
patientForm.addEventListener("submit", dodajPacijenta);

// Prikaz forme
function prikaziFormu() {
  formaSekcija.classList.remove("d-none");
  pacijentiSekcija.classList.add("d-none");
}

// Dodavanje pacijenta
function dodajPacijenta(e) {
  e.preventDefault();

  var ime = imeInput.value.trim();
  var godine = parseInt(godineInput.value);
  var visina = parseFloat(visinaInput.value);
  var tezina = parseFloat(tezinaInput.value);
  var napomena = napomenaInput.value.trim();

  var polRadio = document.querySelector('input[name="pol"]:checked');
  var pol;

  if (polRadio) {
    pol = polRadio.value;
  } else {
    pol = "Nije definisano";
  }

  // Provera podataka
  if (
    ime == "" ||
    isNaN(godine) ||
    isNaN(visina) ||
    isNaN(tezina) ||
    visina <= 0 ||
    tezina <= 0
  ) {
    alert("Unesi ispravne podatke.");
    return;
  }

  // Racunanje BMI i kategorije
  var bmi = izracunajBMI(visina, tezina);
  var kategorija = odrediKategorijuBMI(bmi);

  // Pravljenje objekta pacijenta
  var pacijent = {
    id: new Date().getTime(),
    ime: ime,
    godine: godine,
    pol: pol,
    visina: visina,
    tezina: tezina,
    bmi: bmi,
    kategorija: kategorija,
    napomena: napomena,
  };

  // Dodavanje objekta u niz
  pacijenti.push(pacijent);

  // Reset forme
  patientForm.reset();
  document.getElementById("muski").checked = true;

  alert("Pacijent je dodat.");

  // Posle dodavanja prikazujemo pacijente
  prikaziPacijente();
}

// Racunanje BMI
function izracunajBMI(visina, tezina) {
  return tezina / (visina * visina);
}

// Odredjivanje BMI kategorije
function odrediKategorijuBMI(bmi) {
  if (bmi < 18.5) {
    return "Pothranjenost";
  } else if (bmi < 25) {
    return "Normalna težina";
  } else if (bmi < 30) {
    return "Prekomerna težina";
  } else {
    return "Gojaznost";
  }
}

// Prikaz pacijenata
function prikaziPacijente() {
  // Sakrij formu, prikazi sekciju pacijenata
  formaSekcija.classList.add("d-none");
  pacijentiSekcija.classList.remove("d-none");

  // Praznimo prethodni prikaz
  patientsContainer.innerHTML = "";

  // Pravimo pomocni niz
  var listaZaPrikaz = [];

  for (var i = 0; i < pacijenti.length; i++) {
    listaZaPrikaz.push(pacijenti[i]);
  }

  // Filtriranje po kategoriji
  var kategorijaFilter = filterKategorija.value;

  if (kategorijaFilter != "Sve") {
    var filtrirani = [];

    for (var i = 0; i < listaZaPrikaz.length; i++) {
      if (listaZaPrikaz[i].kategorija == kategorijaFilter) {
        filtrirani.push(listaZaPrikaz[i]);
      }
    }

    listaZaPrikaz = filtrirani;
  }

  // Sortiranje po BMI
  var nacinSortiranja = sortiranje.value;

  if (nacinSortiranja == "min-max") {
    listaZaPrikaz.sort(function (a, b) {
      return a.bmi - b.bmi;
    });
  }

  if (nacinSortiranja == "max-min") {
    listaZaPrikaz.sort(function (a, b) {
      return b.bmi - a.bmi;
    });
  }

  // Broj pacijenata
  brojPacijenata.textContent = listaZaPrikaz.length + " pacijenata";

  // Ako nema pacijenata
  if (listaZaPrikaz.length == 0) {
    patientsContainer.innerHTML =
      '<div class="col-12">' +
      '<div class="empty-box p-5 text-center">' +
      '<h4 class="mb-2">Nema pacijenata za prikaz</h4>' +
      '<p class="text-muted mb-0">Dodaj pacijenta ili promeni filter.</p>' +
      "</div>" +
      "</div>";
    return;
  }

  // Pravljenje kartica
  for (var i = 0; i < listaZaPrikaz.length; i++) {
    var pacijent = listaZaPrikaz[i];
    var linija = "";
    var badge = "";

    if (pacijent.kategorija == "Pothranjenost") {
      linija = "line-pothranjenost";
      badge = "text-bg-info";
    } else if (pacijent.kategorija == "Normalna težina") {
      linija = "line-normalna";
      badge = "text-bg-success";
    } else if (pacijent.kategorija == "Prekomerna težina") {
      linija = "line-prekomerna";
      badge = "text-bg-warning";
    } else {
      linija = "line-gojaznost";
      badge = "text-bg-danger";
    }

    var napomenaTekst = "Nema napomene.";

    if (pacijent.napomena != "") {
      napomenaTekst = pacijent.napomena;
    }

    patientsContainer.innerHTML +=
      '<div class="col-12 col-md-6 col-xl-4">' +
      '<div class="card patient-card">' +
      '<div class="card-top-line ' +
      linija +
      '"></div>' +
      '<div class="card-body p-4">' +
      '<h4 class="card-title mb-3">' +
      pacijent.ime +
      "</h4>" +
      '<div class="info-line"><strong>Godine:</strong> ' +
      pacijent.godine +
      "</div>" +
      '<div class="info-line"><strong>Pol:</strong> ' +
      pacijent.pol +
      "</div>" +
      '<div class="info-line"><strong>Visina:</strong> ' +
      pacijent.visina +
      " m</div>" +
      '<div class="info-line"><strong>Težina:</strong> ' +
      pacijent.tezina +
      " kg</div>" +
      '<div class="info-line"><strong>BMI:</strong> ' +
      pacijent.bmi.toFixed(2) +
      "</div>" +
      '<div class="info-line"><strong>Kategorija:</strong> <span class="badge ' +
      badge +
      '">' +
      pacijent.kategorija +
      "</span></div>" +
      '<div class="mt-3"><strong>Napomena:</strong><p class="text-muted mb-0">' +
      napomenaTekst +
      "</p></div>" +
      "</div>" +
      "</div>" +
      "</div>";
  }
}
