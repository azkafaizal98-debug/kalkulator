// Kalkulator sederhana — mendukung: angka, operator, desimal, =, CLEAR (C) dan BACKSPACE (⌫)
(function () {
  const elAngka1 = document.getElementById('angka1');
  const elOpera = document.getElementById('opera');
  const elAngka2 = document.getElementById('angka2');
  const elHasil = document.getElementById('hasil');

  let angka1 = '';
  let angka2 = '';
  let opera = null; // store as + - * /
  let justComputed = false;

  function render() {
    // Jika baru saja menghitung, hanya tampilkan hasil (hindari duplikasi)
    if (justComputed) {
      elAngka1.textContent = '';
      elOpera.textContent = '';
      elAngka2.textContent = '';
      return;
    }
    elAngka1.textContent = angka1 || '';
    elOpera.textContent = opera || '';
    elAngka2.textContent = angka2 || '';
  }

  function parseNum(s) {
    if (!s) return NaN;
    return parseFloat(s.replace(',', '.'));
  }

  function compute() {
    if (!angka1 || !opera || !angka2) return;
    const a = parseNum(angka1);
    const b = parseNum(angka2);
    if (Number.isNaN(a) || Number.isNaN(b)) {
      elHasil.textContent = 'Error';
      justComputed = true;
      return;
    }
    let res;
    switch (opera) {
      case '+': res = a + b; break;
      case '-': res = a - b; break;
      case 'x':
      case '*': res = a * b; break;
      case '/': res = b === 0 ? '∞' : a / b; break;
      default: res = 'Err';
    }
    // tampilkan tanpa trailing .0 jika integer
    if (typeof res === 'number' && isFinite(res)) {
      elHasil.textContent = Number.isInteger(res) ? String(res) : String(res);
      // siapkan chaining
      angka1 = String(res);
    } else {
      elHasil.textContent = String(res);
      angka1 = '';
    }
    opera = null;
    angka2 = '';
    justComputed = true;
    render();
  }

  function clearAll() {
    angka1 = '';
    angka2 = '';
    opera = null;
    elHasil.textContent = '';
    justComputed = false;
    render();
  }

  function backspace() {
    if (justComputed) {
      // jika baru menghitung, backspace -> hapus hasil (reset)
      clearAll();
      return;
    }
    if (opera) {
      // hapus dari angka2 jika ada
      if (angka2.length > 0) angka2 = angka2.slice(0, -1);
      else opera = null; // jika angka2 kosong, hapus operator
    } else {
      // hapus dari angka1
      if (angka1.length > 0) angka1 = angka1.slice(0, -1);
    }
    render();
  }

  // Ambil semua tombol di dalam container operasi
  const buttons = document.querySelectorAll('.container-kalkulator .operasi button');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const txt = (btn.textContent || '').trim();

      // CLEAR
      if (btn.id === 'clear' || txt.toUpperCase() === 'C') {
        clearAll();
        return;
      }

      // BACKSPACE
      if (btn.id === 'backspace' || txt === '⌫') {
        backspace();
        return;
      }

      // EQUAL
      if (txt === '=') {
        compute();
        return;
      }

      // Operator
      if (['+', '-', 'x', '*', '/'].includes(txt)) {
        // jika belum ada angka1 dan user klik operator, abaikan
        if (!angka1) return;
        // jika sudah ada operator tapi angka2 kosong, ganti operator
        if (opera && !angka2) {
          opera = txt;
          render();
          return;
        }
        // jika ada angka1 dan angka2, lakukan compute lalu set operator untuk chaining
        if (angka1 && opera && angka2) {
          compute();
          opera = txt;
          justComputed = false;
          render();
          return;
        }
        // normal case: set operator
        opera = txt;
        justComputed = false;
        elHasil.textContent = '';
        render();
        return;
      }

      // Desimal . atau ,
      if (txt === '.' || txt === ',') {
        if (!opera) {
          if (!angka1.includes('.')) angka1 += '.';
        } else {
          if (!angka2.includes('.')) angka2 += '.';
        }
        render();
        return;
      }

      // Angka 0-9
      if (/^\d$/.test(txt)) {
        // jika sebelumnya baru menghitung dan user mengetik angka baru, reset angka1
        if (justComputed && !opera) {
          angka1 = '';
          justComputed = false;
          elHasil.textContent = '';
        }

        if (!opera) {
          angka1 += txt;
        } else {
          angka2 += txt;
        }
        render();
        return;
      }
    });
  });

  // support keyboard (opsional): angka, operators, backspace, enter, c
  window.addEventListener('keydown', (e) => {
    const key = e.key;
    if (/^\d$/.test(key)) {
      if (justComputed && !opera) { angka1 = ''; justComputed = false; elHasil.textContent = ''; }
      if (!opera) angka1 += key; else angka2 += key; render();
      e.preventDefault();
      return;
    }
    if (key === '.' || key === ',') { if (!opera) { if (!angka1.includes('.')) angka1 += '.'; } else { if (!angka2.includes('.')) angka2 += '.'; } render(); e.preventDefault(); return; }
    if (['+', '-', '*', '/'].includes(key)) { 
      if (!angka1) return; 
      if (opera && !angka2) { opera = key; justComputed = false; render(); return; }
      if (angka1 && opera && angka2) { compute(); opera = key; justComputed = false; render(); return; }
  opera = key; elHasil.textContent = ''; justComputed = false; render(); e.preventDefault(); return; }
    if (key === 'Enter') { compute(); e.preventDefault(); return; }
    if (key === 'Backspace') { backspace(); e.preventDefault(); return; }
    if (key.toLowerCase() === 'c') { clearAll(); e.preventDefault(); return; }
  });

  // init
  elHasil.textContent = '';
  render();
})();
