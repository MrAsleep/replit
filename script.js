// Niz u koji cuvamo sve vezbace
var vezbaci = [];

// Uzimamo elemente iz HTML-a
var btnDodajVezbaca = document.getElementById("btnDodajVezbaca");
var btnPrikaziVezbace = document.getElementById("btnPrikaziVezbace");
var btnPrimeni = document.getElementById("btnPrimeni");

var formaSekcija = document.getElementById("formaSekcija");
var vezbaciSekcija = document.getElementById("vezbaciSekcija");

var vezbacForm = document.getElementById("vezbacForm");

var imeInput = document.getElementById("ime");
var godineInput = document.getElementById("godine");
var visinaInput = document.getElementById("visina");
var tezinaInput = document.getElementById("tezina");
var ciljInput = document.getElementById("cilj");
var clanarinaInput = document.getElementById("clanarina");
var napomenaInput = document.getElementById("napomena");

var filterKategorija = document.getElementById("filterKategorija");
var sortiranje = document.getElementById("sortiranje");

var vezbaciContainer = document.getElementById("vezbaciContainer");
var brojVezbaca = document.getElementById("brojVezbaca");

// Povezivanje dugmica sa funkcijama
btnDodajVezbaca.addEventListener("click", prikaziFormu);
btnPrikaziVezbace.addEventListener("click", prikaziVezbace);
btnPrimeni.addEventListener("click", prikaziVezbace);
vezbacForm.addEventListener("submit", dodajVezbaca);

// Prikaz forme
function prikaziFormu() {
  formaSekcija.classList.remove("d-none");
  vezbaciSekcija.classList.add("d-none");
}

// Dodavanje vezbaca
function dodajVezbaca(e) {
  e.preventDefault();

  var ime = imeInput.value.trim();
  var godine = parseInt(godineInput.value);
  var visina = parseFloat(visinaInput.value);
  var tezina = parseFloat(tezinaInput.value);
  var cilj = ciljInput.value;
  var clanarina = clanarinaInput.value;
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

  // Pravljenje objekta vezbaca
  var vezbac = {
    id: new Date().getTime(),
    ime: ime,
    godine: godine,
    pol: pol,
    visina: visina,
    tezina: tezina,
    bmi: bmi,
    kategorija: kategorija,
    cilj: cilj,
    clanarina: clanarina,
    napomena: napomena,
  };

  // Dodavanje objekta u niz
  vezbaci.push(vezbac);

  // Reset forme
  vezbacForm.reset();
  document.getElementById("muski").checked = true;

  alert("Vežbač je dodat.");

  // Posle dodavanja prikazujemo vezbace
  prikaziVezbace();
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

// Ikonica za cilj treninga
function ikonicaZaCilj(cilj) {
  if (cilj == "Mršavljenje") return "🔥";
  if (cilj == "Izgradnja mišića") return "💪";
  if (cilj == "Održavanje forme") return "⚖️";
  if (cilj == "Povećanje snage") return "🏆";
  if (cilj == "Kardio kondicija") return "🏃";
  return "🎯";
}

// Prikaz vezbaca
function prikaziVezbace() {
  // Sakrij formu, prikazi sekciju vezbaca
  formaSekcija.classList.add("d-none");
  vezbaciSekcija.classList.remove("d-none");

  // Praznimo prethodni prikaz
  vezbaciContainer.innerHTML = "";

  // Pravimo pomocni niz
  var listaZaPrikaz = [];

  for (var i = 0; i < vezbaci.length; i++) {
    listaZaPrikaz.push(vezbaci[i]);
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

  // Broj vezbaca
  var tekst = listaZaPrikaz.length == 1 ? " vežbač" : " vežbača";
  brojVezbaca.textContent = listaZaPrikaz.length + tekst;

  // Ako nema vezbaca
  if (listaZaPrikaz.length == 0) {
    vezbaciContainer.innerHTML =
      '<div class="col-12">' +
      '<div class="empty-box p-5 text-center">' +
      '<div style="font-size:3rem">🏋️</div>' +
      '<h4 class="mb-2 mt-2">Nema vežbača za prikaz</h4>' +
      '<p class="text-muted mb-0">Dodaj vežbača ili promeni filter.</p>' +
      "</div>" +
      "</div>";
    return;
  }

  // Pravljenje kartica
  for (var i = 0; i < listaZaPrikaz.length; i++) {
    var vezbac = listaZaPrikaz[i];
    var linija = "";
    var badge = "";

    if (vezbac.kategorija == "Pothranjenost") {
      linija = "line-pothranjenost";
      badge = "text-bg-info";
    } else if (vezbac.kategorija == "Normalna težina") {
      linija = "line-normalna";
      badge = "text-bg-success";
    } else if (vezbac.kategorija == "Prekomerna težina") {
      linija = "line-prekomerna";
      badge = "text-bg-warning";
    } else {
      linija = "line-gojaznost";
      badge = "text-bg-danger";
    }

    var napomenaTekst = "Nema napomene.";

    if (vezbac.napomena != "") {
      napomenaTekst = vezbac.napomena;
    }

    vezbaciContainer.innerHTML +=
      '<div class="col-12 col-md-6 col-xl-4">' +
      '<div class="card vezbac-card">' +
      '<div class="card-top-line ' +
      linija +
      '"></div>' +
      '<div class="card-body p-4">' +
      '<h4 class="card-title mb-3">' +
      vezbac.ime +
      "</h4>" +
      '<div class="info-line"><strong>Godine:</strong> ' +
      vezbac.godine +
      "</div>" +
      '<div class="info-line"><strong>Pol:</strong> ' +
      vezbac.pol +
      "</div>" +
      '<div class="info-line"><strong>Visina:</strong> ' +
      vezbac.visina +
      " m</div>" +
      '<div class="info-line"><strong>Težina:</strong> ' +
      vezbac.tezina +
      " kg</div>" +
      '<div class="info-line"><strong>BMI:</strong> ' +
      vezbac.bmi.toFixed(2) +
      "</div>" +
      '<div class="info-line"><strong>BMI kategorija:</strong> <span class="badge ' +
      badge +
      '">' +
      vezbac.kategorija +
      "</span></div>" +
      '<div class="info-line"><strong>Cilj:</strong> ' +
      ikonicaZaCilj(vezbac.cilj) +
      " " +
      vezbac.cilj +
      "</div>" +
      '<div class="info-line"><strong>Članarina:</strong> ' +
      vezbac.clanarina +
      "</div>" +
      '<div class="mt-3"><strong>Napomena:</strong><p class="text-muted mb-0">' +
      napomenaTekst +
      "</p></div>" +
      "</div>" +
      "</div>" +
      "</div>";
  }
}
