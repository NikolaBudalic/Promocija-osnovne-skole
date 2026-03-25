/* script.js*/

document.addEventListener('DOMContentLoaded', () => {
    /* ---------- HAMBURGER MENI (deluje za sve stranice) ---------- */
    const dugmeHamburger = document.querySelector('#dugmeHamburger') || document.querySelector('#dugmeHamburgerONama') || document.querySelector('#dugmeHamburgerUsluga') || document.querySelector('#dugmeHamburgerKontakt');
    const meniGlavni = document.querySelector('#meniGlavni') || document.querySelector('#meniGlavniONama') || document.querySelector('#meniGlavniUsluga') || document.querySelector('#meniGlavniKontakt');

    if (dugmeHamburger && meniGlavni) {
        dugmeHamburger.addEventListener('click', () => {
            const otvoren = dugmeHamburger.getAttribute('aria-expanded') === 'true';
            dugmeHamburger.setAttribute('aria-expanded', String(!otvoren));
            // toggle prikaza menija
            if (otvoren) {
                meniGlavni.style.display = '';
            } else {
                meniGlavni.style.display = 'block';
            }
        });
        // Ako se prozor menja, vratiti prikaz menija na automatski za veće ekrane
        window.addEventListener('resize', () => {
            if (window.innerWidth > 900) meniGlavni.style.display = '';
        });
    }

    /* ---------- SLAJDER ---------- */
    const kontejnerSlajder = document.querySelector('#slajder .slajder__kontejner');
    const stavkeSlajder = document.querySelectorAll('.slajder__stavka');
    const dugmePrethodni = document.getElementById('slajderPrethodni');
    const dugmeSledeci = document.getElementById('slajderSledeci');
    const indikatori = document.querySelectorAll('.indikator');
    let trenutniSlajd = 0;
    let automatskiInterval = null;
    const trajanjeAuto = 5000; // 5s

    function prikaziSlajd(indeks) {
        stavkeSlajder.forEach((st, i) => {
            st.classList.toggle('aktivna', i === indeks);
            st.setAttribute('aria-hidden', String(i !== indeks));
        });
        indikatori.forEach((ind, i) => {
            ind.classList.toggle('aktivan', i === indeks);
            ind.setAttribute('aria-selected', String(i === indeks));
        });
        trenutniSlajd = indeks;
    }

    function sledeciSlajd() { prikaziSlajd((trenutniSlajd + 1) % stavkeSlajder.length); }
    function prethodniSlajd() { prikaziSlajd((trenutniSlajd - 1 + stavkeSlajder.length) % stavkeSlajder.length); }

    dugmeSledeci?.addEventListener('click', () => { sledeciSlajd(); resetujAuto(); });
    dugmePrethodni?.addEventListener('click', () => { prethodniSlajd(); resetujAuto(); });

    indikatori.forEach(ind => ind.addEventListener('click', (e) => {
        const idx = parseInt(ind.getAttribute('data-indeks'), 10);
        prikaziSlajd(idx);
        resetujAuto();
    }));

    function pokreniAuto() {
        automatskiInterval = setInterval(sledeciSlajd, trajanjeAuto);
    }
    function resetujAuto() {
        clearInterval(automatskiInterval);
        pokreniAuto();
    }
    if (stavkeSlajder.length > 0) {
        prikaziSlajd(0);
        pokreniAuto();
    }

    /* ---------- ANIMACIJA PRI SKROLU (Intersection Observer) ---------- */
    const sekcijeZaAnimaciju = document.querySelectorAll('.section-anim');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.2 });
    sekcijeZaAnimaciju.forEach(s => observer.observe(s));

    /* ---------- PRISTUPAČNOST: TAMNI REŽIM, KONTRAST, VELIČINA TEKSTA ---------- */
    const dugmeTamniRezim = document.querySelector('#dugmeTamniRezim') || document.querySelector('#dugmeTamniRezimONama') || document.querySelector('#dugmeTamniRezimUsluga') || document.querySelector('#dugmeTamniRezimKontakt');
    const dugmeKontrast = document.querySelector('#dugmeKontrast') || document.querySelector('#dugmeKontrastONama') || document.querySelector('#dugmeKontrastUsluga') || document.querySelector('#dugmeKontrastKontakt');
    const dugmePovecaj = document.querySelector('#dugmePovecajTekst') || document.querySelector('#dugmePovecajTekstONama') || document.querySelector('#dugmePovecajTekstUsluga') || document.querySelector('#dugmePovecajTekstKontakt');
    const dugmeSmanji = document.querySelector('#dugmeSmanjiTekst') || document.querySelector('#dugmeSmanjiTekstONama') || document.querySelector('#dugmeSmanjiTekstUsluga') || document.querySelector('#dugmeSmanjiTekstKontakt');

    // Tamni režim
    if (dugmeTamniRezim) {
        dugmeTamniRezim.addEventListener('click', () => {
            document.body.classList.toggle('tamni-rezim');
            const pr = dugmeTamniRezim.getAttribute('aria-pressed') === 'true';
            dugmeTamniRezim.setAttribute('aria-pressed', String(!pr));
            localStorage.setItem('tamniRezim', document.body.classList.contains('tamni-rezim'));
        });
        // init iz localStorage
        if (localStorage.getItem('tamniRezim') === 'true') document.body.classList.add('tamni-rezim');
    }

    // Visoki kontrast
    if (dugmeKontrast) {
        dugmeKontrast.addEventListener('click', () => {
            document.body.classList.toggle('visoki-kontrast');
            const pr = dugmeKontrast.getAttribute('aria-pressed') === 'true';
            dugmeKontrast.setAttribute('aria-pressed', String(!pr));
            localStorage.setItem('visokiKontrast', document.body.classList.contains('visoki-kontrast'));
        });
        if (localStorage.getItem('visokiKontrast') === 'true') document.body.classList.add('visoki-kontrast');
    }

    // Povećavanje / smanjivanje teksta
    function promeniVelicinuTeksta(faktor) {
        const stil = getComputedStyle(document.documentElement);
        const vel = parseFloat(stil.getPropertyValue('--velicina-osnovna')) || 16;
        const nova = Math.max(12, Math.min(24, vel + faktor));
        document.documentElement.style.setProperty('--velicina-osnovna', nova + 'px');
        localStorage.setItem('velicinaTeksta', nova);
    }

    if (dugmePovecaj) dugmePovecaj.addEventListener('click', () => promeniVelicinuTeksta(1));
    if (dugmeSmanji) dugmeSmanji.addEventListener('click', () => promeniVelicinuTeksta(-1));
    if (localStorage.getItem('velicinaTeksta')) document.documentElement.style.setProperty('--velicina-osnovna', localStorage.getItem('velicinaTeksta') + 'px');

    /* ---------- VALIDACIJA KONTAKT FORME (klijent) ---------- */
    const forma = document.getElementById('kontaktForma');
    if (forma) {
        forma.addEventListener('submit', (e) => {
            e.preventDefault();
            const ime = document.getElementById('imeIPrezime').value.trim();
            const email = document.getElementById('emailKontakt').value.trim();
            const poruka = document.getElementById('porukaKontakt').value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!ime || !email || !poruka) {
                alert('Molimo popunite sva polja.');
                return;
            }
            if (!emailRegex.test(email)) {
                alert('Unesite ispravan email.');
                return;
            }
            alert('Poruka je poslana. Hvala!');
            forma.reset();
        });
    }

    /* ---------- DODATNA POBOLJŠANJA: tastatura i pristupačnost menija ---------- */
    // zatvori meni pritiskom ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (meniGlavni && window.innerWidth <= 900) {
                meniGlavni.style.display = 'none';
                dugmeHamburger?.setAttribute('aria-expanded', 'false');
            }
        }
    });

});
