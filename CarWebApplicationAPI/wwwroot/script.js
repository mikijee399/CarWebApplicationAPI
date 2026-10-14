const forma = document.getElementById("formaAuto");
const tabela = document.getElementById("automobiliTabela");
const poruka = document.getElementById("poruka");
const spremiDugme = document.getElementById("spremiDugme");
const odustaniDugme = document.getElementById("odustaniDugme");
const pretragaMarka = document.getElementById("pretragaMarka");
const pretraziDugme = document.getElementById("pretraziDugme");
const ucitajDugme = document.getElementById("ucitajDugme");

let odabraniAutoId = null;
let izmjenaUToku = false;
let aktivnaMarka = "";
let posljednjiZahtjev = 0;

forma.addEventListener("submit", spremiAuto);
odustaniDugme.addEventListener("click", resetujFormu);
pretraziDugme.addEventListener("click", pretraziAutomobile);
ucitajDugme.addEventListener("click", ucitajAutomobile);

pretragaMarka.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        event.preventDefault();
        pretraziAutomobile();
    }
});

// UČITAVANJE SVIH AUTOMOBILA
async function ucitajAutomobile() {
    pretragaMarka.value = "";
    aktivnaMarka = "";

    await osvjeziAutomobile();
}

// PRETRAGA PO MARKI
async function pretraziAutomobile() {
    const marka = pretragaMarka.value.trim();

    if (marka === "") {
        await ucitajAutomobile();
        return;
    }

    aktivnaMarka = marka;
    await osvjeziAutomobile();
}

// POZIV API-JA ZA SVE AUTOMOBILE ILI AKTIVNU PRETRAGU
async function osvjeziAutomobile() {
    const brojZahtjeva = ++posljednjiZahtjev;
    const trazenaMarka = aktivnaMarka;

    const url = trazenaMarka === ""
        ? "/api/Cars"
        : `/api/Cars/pretraga?marka=${encodeURIComponent(trazenaMarka)}`;

    poruka.textContent = "Učitavanje...";

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("API je vratio grešku: " + response.status);
        }

        const automobili = await response.json();

        // Stariji odgovor ne smije zamijeniti novije rezultate.
        if (brojZahtjeva !== posljednjiZahtjev) {
            return;
        }

        prikaziAutomobile(automobili);

        if (automobili.length === 0) {
            poruka.textContent = trazenaMarka === ""
                ? "Nema automobila u bazi."
                : "Nema rezultata.";
        } else {
            poruka.textContent = `Broj automobila: ${automobili.length}.`;
        }
    } catch (error) {
        if (brojZahtjeva !== posljednjiZahtjev) {
            return;
        }

        tabela.replaceChildren();
        poruka.textContent = "Greška pri učitavanju automobila.";
        console.error(error);
    }
}

// ZAJEDNIČKI PRIKAZ REZULTATA U TABELI
function prikaziAutomobile(automobili) {
    tabela.replaceChildren();

    for (const auto of automobili) {
        const red = document.createElement("tr");

        const vrijednosti = [
            auto.marka,
            auto.model,
            auto.godiste,
            Number(auto.cijena).toFixed(2)
        ];

        for (const vrijednost of vrijednosti) {
            const celija = document.createElement("td");
            celija.textContent = vrijednost;
            red.appendChild(celija);
        }

        const akcije = document.createElement("td");

        const urediDugme = document.createElement("button");
        urediDugme.type = "button";
        urediDugme.textContent = "Uredi";
        urediDugme.disabled = izmjenaUToku;
        urediDugme.addEventListener("click", () => urediAuto(auto));

        const obrisiDugme = document.createElement("button");
        obrisiDugme.type = "button";
        obrisiDugme.textContent = "Obriši";
        obrisiDugme.disabled = izmjenaUToku;
        obrisiDugme.addEventListener("click", () => obrisiAuto(auto.id));

        akcije.append(
            urediDugme,
            document.createTextNode(" "),
            obrisiDugme
        );

        red.appendChild(akcije);
        tabela.appendChild(red);
    }
}

// POPUNJAVANJE FORME ZA UREĐIVANJE
function urediAuto(auto) {
    if (izmjenaUToku) {
        return;
    }

    if (!Number.isInteger(auto.id) || auto.id <= 0) {
        poruka.textContent = "Auto nema ispravan ID. Provjeri backend.";
        return;
    }

    odabraniAutoId = auto.id;

    document.getElementById("marka").value = auto.marka;
    document.getElementById("model").value = auto.model;
    document.getElementById("godiste").value = auto.godiste;
    document.getElementById("cijena").value = auto.cijena;

    spremiDugme.textContent = "Sačuvaj izmjene";
    odustaniDugme.hidden = false;
    poruka.textContent = "Promijeni podatke i sačuvaj izmjene.";

    document.getElementById("marka").focus();
}

// POVRATAK NA DODAVANJE
function resetujFormu() {
    odabraniAutoId = null;
    forma.reset();
    spremiDugme.textContent = "Dodaj auto";
    odustaniDugme.hidden = true;
}

// ONEMOGUĆAVANJE PARALELNIH IZMJENA
function postaviIzmjenuUToku(vrijednost) {
    izmjenaUToku = vrijednost;

    for (const element of forma.elements) {
        element.disabled = vrijednost;
    }

    for (const dugme of tabela.querySelectorAll("button")) {
        dugme.disabled = vrijednost;
    }
}

// DODAVANJE I UREĐIVANJE
async function spremiAuto(event) {
    event.preventDefault();

    if (izmjenaUToku || !forma.reportValidity()) {
        return;
    }

    const auto = {
        marka: document.getElementById("marka").value.trim(),
        model: document.getElementById("model").value.trim(),
        godiste: Number(document.getElementById("godiste").value),
        cijena: Number(document.getElementById("cijena").value)
    };

    if (auto.marka === "" || auto.model === "") {
        poruka.textContent = "Unesi marku i model.";
        return;
    }

    const uredjivanje = odabraniAutoId !== null;

    const url = uredjivanje
        ? `/api/Cars/${odabraniAutoId}`
        : "/api/Cars";

    postaviIzmjenuUToku(true);
    poruka.textContent = "Spremanje...";

    try {
        const response = await fetch(url, {
            method: uredjivanje ? "PUT" : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(auto)
        });

        if (!response.ok) {
            throw new Error("API je vratio grešku: " + response.status);
        }

        resetujFormu();
        await osvjeziAutomobile();
    } catch (error) {
        poruka.textContent = "Greška pri spremanju auta.";
        console.error(error);
    } finally {
        postaviIzmjenuUToku(false);
    }
}

// BRISANJE
async function obrisiAuto(id) {
    if (izmjenaUToku) {
        return;
    }

    if (!Number.isInteger(id) || id <= 0) {
        poruka.textContent = "Auto nema ispravan ID. Provjeri backend.";
        return;
    }

    if (!confirm("Želiš li obrisati ovaj automobil?")) {
        return;
    }

    postaviIzmjenuUToku(true);
    poruka.textContent = "Brisanje...";

    try {
        const response = await fetch(`/api/Cars/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("API je vratio grešku: " + response.status);
        }

        if (odabraniAutoId === id) {
            resetujFormu();
        }

        await osvjeziAutomobile();
    } catch (error) {
        poruka.textContent = "Greška pri brisanju auta.";
        console.error(error);
    } finally {
        postaviIzmjenuUToku(false);
    }
}

// AUTOMATSKO UČITAVANJE PRI OTVARANJU STRANICE
ucitajAutomobile();