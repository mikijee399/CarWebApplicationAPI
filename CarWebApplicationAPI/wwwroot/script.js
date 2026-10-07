const forma = document.getElementById("formaAuto");
const tabela = document.getElementById("automobiliTabela");
const poruka = document.getElementById("poruka");
const spremiDugme = document.getElementById("spremiDugme");
const odustaniDugme = document.getElementById("odustaniDugme");

let odabraniAutoId = null;
let spremanjeUToku = false;

forma.addEventListener("submit", spremiAuto);

document.getElementById("ucitajDugme")
    .addEventListener("click", ucitajAutomobile);

odustaniDugme.addEventListener("click", resetujFormu);

// PRIKAZ AUTOMOBILA
async function ucitajAutomobile() {
    poruka.textContent = "Učitavanje...";

    try {
        const response = await fetch("/api/Cars");

        if (!response.ok) {
            throw new Error("API je vratio grešku: " + response.status);
        }

        const automobili = await response.json();

        tabela.replaceChildren();

        for (const auto of automobili) {
            const red = document.createElement("tr");

            const vrijednosti = [
                auto.marka,
                auto.model,
                auto.godiste,
                auto.cijena
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

            urediDugme.addEventListener("click", () => {
                urediAuto(auto);
            });

            const obrisiDugme = document.createElement("button");
            obrisiDugme.type = "button";
            obrisiDugme.textContent = "Obriši";

            obrisiDugme.addEventListener("click", () => {
                obrisiAuto(auto.id, obrisiDugme);
            });

            akcije.appendChild(urediDugme);
            akcije.appendChild(obrisiDugme);
            red.appendChild(akcije);

            tabela.appendChild(red);
        }

        poruka.textContent = automobili.length === 0
            ? "Nema automobila u bazi."
            : "Automobili su uspješno učitani.";
    } catch (error) {
        poruka.textContent = "Greška pri učitavanju automobila.";
        console.error(error);
    }
}

// POPUNJAVANJE FORME ZA UREĐIVANJE
function urediAuto(auto) {
    if (spremanjeUToku) {
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

// DODAVANJE I UREĐIVANJE AUTOMOBILA
async function spremiAuto(event) {
    event.preventDefault();

    if (spremanjeUToku) {
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

    const metoda = uredjivanje ? "PUT" : "POST";

    spremanjeUToku = true;
    spremiDugme.disabled = true;
    odustaniDugme.disabled = true;
    poruka.textContent = "Spremanje...";

    try {
        const response = await fetch(url, {
            method: metoda,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(auto)
        });

        if (!response.ok) {
            throw new Error("API je vratio grešku: " + response.status);
        }

        resetujFormu();

        await ucitajAutomobile();
    } catch (error) {
        poruka.textContent = "Greška pri spremanju auta.";
        console.error(error);
    } finally {
        spremanjeUToku = false;
        spremiDugme.disabled = false;
        odustaniDugme.disabled = false;
    }
}

// BRISANJE AUTOMOBILA
async function obrisiAuto(id, dugme) {
    if (spremanjeUToku) {
        return;
    }

    if (!Number.isInteger(id) || id <= 0) {
        poruka.textContent = "Auto nema ispravan ID. Provjeri backend.";
        return;
    }

    if (!confirm("Želiš li obrisati ovaj automobil?")) {
        return;
    }

    dugme.disabled = true;
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

        await ucitajAutomobile();
    } catch (error) {
        poruka.textContent = "Greška pri brisanju auta.";
        console.error(error);
    } finally {
        dugme.disabled = false;
    }
}