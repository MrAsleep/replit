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
var ciljInput = document.getElementById("cilj");
var clanarinaInput = document.getElementById("clanarina");
var datumUplateInput = document.getElementById("datumUplate");
var napomenaInput = document.getElementById("napomena");

var filterStatus = document.getElementById("filterStatus");
var sortiranje = document.getElementById("sortiranje");

var vezbaciContainer = document.getElementById("vezbaciContainer");
var brojVezbaca = document.getElementById("brojVezbaca");

// Postavi danasnji datum kao default
datumUplateInput.value = new Date().toISOString().split("T")[0];

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

// Broj dana vazenja clanarine
function danaClanarine(tip) {
  if (tip === "Mesečna") return 30;
  if (tip === "Tromesečna") return 90;
  if (tip === "Godišnja") return 365;
  if (tip === "Jednokratna") return 1;
  return 30;
}

// Izracunaj status i dane do isteka
function statusClanarine(datumUplate, tipClanarine) {
  var danas = new Date();
  danas.setHours(0, 0, 0, 0);
  var uplata = new Date(datumUplate);
  uplata.setHours(0, 0, 0, 0);
  var dana = danaClanarine(tipClanarine);
  var istice = new Date(uplata);
  istice.setDate(istice.getDate() + dana);
  var preostalo = Math.ceil((istice - danas) / (1000 * 60 * 60 * 24));

  if (preostalo < 0) {
    return { status: "Istekla", preostalo: preostalo, istice: istice };
  } else if (preostalo <= 7) {
    return { status: "Uskoro ističe", preostalo: preostalo, istice: istice };
  } else {
    return { status: "Aktivna", preostalo: preostalo, istice: istice };
  }
}

// Formatiranje datuma
function formatirajDatum(datum) {
  var d = new Date(datum);
  d.setHours(0, 0, 0, 0);
  var dan = String(d.getDate()).padStart(2, "0");
  var mesec = String(d.getMonth() + 1).padStart(2, "0");
  var god = d.getFullYear();
  return dan + "." + mesec + "." + god + ".";
}

// Ikonica za cilj treninga
function ikonicaZaCilj(cilj) {
  if (cilj === "Mršavljenje") return "🔥";
  if (cilj === "Izgradnja mišića") return "💪";
  if (cilj === "Održavanje forme") return "⚖️";
  if (cilj === "Povećanje snage") return "🏆";
  if (cilj === "Kardio kondicija") return "🏃";
  return "🎯";
}

// Dodavanje vezbaca
function dodajVezbaca(e) {
  e.preventDefault();

  var ime = imeInput.value.trim();
  var godine = parseInt(godineInput.value);
  var cilj = ciljInput.value;
  var clanarina = clanarinaInput.value;
  var datumUplate = datumUplateInput.value;
  var napomena = napomenaInput.value.trim();

  var polRadio = document.querySelector('input[name="pol"]:checked');
  var pol = polRadio ? polRadio.value : "Nije definisano";

  if (ime === "" || isNaN(godine) || datumUplate === "") {
    alert("Unesi ispravne podatke.");
    return;
  }

  var info = statusClanarine(datumUplate, clanarina);

  var vezbac = {
    id: new Date().getTime(),
    ime: ime,
    godine: godine,
    pol: pol,
    cilj: cilj,
    clanarina: clanarina,
    datumUplate: datumUplate,
    status: info.status,
    preostalo: info.preostalo,
    istice: info.istice,
    napomena: napomena,
  };

  vezbaci.push(vezbac);

  vezbacForm.reset();
  document.getElementById("muski").checked = true;
  datumUplateInput.value = new Date().toISOString().split("T")[0];

  alert("Vežbač je dodat.");
  prikaziVezbace();
}

// Prikaz vezbaca
function prikaziVezbace() {
  formaSekcija.classList.add("d-none");
  vezbaciSekcija.classList.remove("d-none");
  vezbaciContainer.innerHTML = "";

  // Azuriraj statuse pre prikaza (datum se menja svaki dan)
  for (var i = 0; i < vezbaci.length; i++) {
    var info = statusClanarine(vezbaci[i].datumUplate, vezbaci[i].clanarina);
    vezbaci[i].status = info.status;
    vezbaci[i].preostalo = info.preostalo;
    vezbaci[i].istice = info.istice;
  }

  var listaZaPrikaz = vezbaci.slice();

  // Filtriranje po statusu
  var statusFilter = filterStatus.value;
  if (statusFilter !== "Sve") {
    listaZaPrikaz = listaZaPrikaz.filter(function (v) {
      return v.status === statusFilter;
    });
  }

  // Sortiranje po datumu uplate
  var nacinSortiranja = sortiranje.value;
  if (nacinSortiranja === "najnoviji") {
    listaZaPrikaz.sort(function (a, b) {
      return new Date(b.datumUplate) - new Date(a.datumUplate);
    });
  } else if (nacinSortiranja === "najstariji") {
    listaZaPrikaz.sort(function (a, b) {
      return new Date(a.datumUplate) - new Date(b.datumUplate);
    });
  }

  // Broj vezbaca
  var tekst = listaZaPrikaz.length === 1 ? " vežbač" : " vežbača";
  brojVezbaca.textContent = listaZaPrikaz.length + tekst;

  // Ako nema vezbaca
  if (listaZaPrikaz.length === 0) {
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
    var v = listaZaPrikaz[i];
    var linija = "";
    var badge = "";
    var preostalaTekst = "";

    if (v.status === "Aktivna") {
      linija = "line-aktivna";
      badge = "text-bg-success";
      preostalaTekst = "Preostalo: " + v.preostalo + " dana";
    } else if (v.status === "Uskoro ističe") {
      linija = "line-uskoro";
      badge = "text-bg-warning";
      preostalaTekst = "Ističe za: " + v.preostalo + " " + (v.preostalo === 1 ? "dan" : "dana");
    } else {
      linija = "line-istekla";
      badge = "text-bg-danger";
      preostalaTekst = "Istekla pre " + Math.abs(v.preostalo) + " dana";
    }

    var napomenaTekst = v.napomena !== "" ? v.napomena : "Nema napomene.";

    vezbaciContainer.innerHTML +=
      '<div class="col-12 col-md-6 col-xl-4">' +
      '<div class="card vezbac-card">' +
      '<div class="card-top-line ' + linija + '"></div>' +
      '<div class="card-body p-4">' +
      '<div class="d-flex justify-content-between align-items-start mb-3">' +
      '<h4 class="card-title mb-0">' + v.ime + "</h4>" +
      '<span class="badge ' + badge + '">' + v.status + "</span>" +
      "</div>" +
      '<div class="info-line"><strong>Godine:</strong> ' + v.godine + "</div>" +
      '<div class="info-line"><strong>Pol:</strong> ' + v.pol + "</div>" +
      '<div class="info-line"><strong>Cilj:</strong> ' + ikonicaZaCilj(v.cilj) + " " + v.cilj + "</div>" +
      '<div class="info-line"><strong>Tip članarine:</strong> ' + v.clanarina + "</div>" +
      '<div class="info-line"><strong>Zadnja uplata:</strong> ' + formatirajDatum(v.datumUplate) + "</div>" +
      '<div class="info-line"><strong>Ističe:</strong> ' + formatirajDatum(v.istice) + "</div>" +
      '<div class="info-line status-info ' + (v.status === "Istekla" ? "text-danger" : v.status === "Uskoro ističe" ? "text-warning-emphasis" : "text-success") + '"><strong>' + preostalaTekst + "</strong></div>" +
      '<div class="mt-3"><strong>Napomena:</strong><p class="text-muted mb-0">' + napomenaTekst + "</p></div>" +
      "</div>" +
      "</div>" +
      "</div>";
  }
}
