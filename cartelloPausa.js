// Configurazione
    const PAUSA_DURATA = 15 * 60 * 1000; // 15 minuti in ms
    
    // Stato applicazione
    let timerInterval = null;
    let startTime = null;
    let endTime = null;
    
    // Elementi DOM
    const els = {
      bottoneInizia: document.getElementById('bottoneInizia'),
      bottoneReset: document.getElementById('bottoneReset'),
      inizioPausa: document.getElementById('inizioPausa'),
      finePausa: document.getElementById('finePausa'),
      countdown: document.getElementById('countdown')
    };

    // Utility: formatta orario HH:MM
    const formatTime = date => {
      const h = date.getHours().toString().padStart(2, '0');
      const m = date.getMinutes().toString().padStart(2, '0');
      return `${h}:${m}`;
    };

    // Gestione notifiche
    const notificaPausaTerminata = () => {
      if ('Notification' in window && Notification.permission === 'granted') {
        try {
          new Notification('🐕 Pausa terminata!', {
            body: 'La tua pausa di 15 minuti è finita.',
            icon: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=100',
            tag: 'pausa-timer',
            requireInteraction: true
          });
        } catch (e) {
          console.warn('Notifica non supportata:', e);
        }
      }
    };

    // Aggiorna countdown
    const updateCountdown = () => {
      const now = Date.now();
      const diff = endTime - now;

      if (diff <= 0) {
        els.countdown.innerHTML = '<i class="bi bi-check-circle-fill me-3"></i>Pausa terminata!';
        els.countdown.className = 'text-center finished';
        clearInterval(timerInterval);
        timerInterval = null;
        els.bottoneInizia.disabled = false;
        notificaPausaTerminata();
        return;
      }

      const min = Math.floor(diff / 60000);
      const sec = Math.floor((diff % 60000) / 1000);
      els.countdown.innerHTML = `<i class="bi bi-hourglass-split me-3"></i>${min}m ${sec.toString().padStart(2, '0')}s`;

      // Classe CSS in base al tempo rimanente
      els.countdown.className = min < 1 ? 'text-center danger' : 
                                 min < 3 ? 'text-center warning' : 
                                 'text-center';
    };

    // Inizia pausa
    const iniziaPausa = () => {
      startTime = Date.now();
      endTime = startTime + PAUSA_DURATA;
      
      els.inizioPausa.textContent = formatTime(new Date(startTime));
      els.finePausa.textContent = formatTime(new Date(endTime));
      els.bottoneInizia.disabled = true;
      
      if (timerInterval) clearInterval(timerInterval);
      timerInterval = setInterval(updateCountdown, 1000);
      updateCountdown();
    };

    // Reset pausa
    const resetPausa = () => {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
      
      els.inizioPausa.textContent = '--:--';
      els.finePausa.textContent = '--:--';
      els.countdown.textContent = '';
      els.countdown.className = 'text-center';
      els.bottoneInizia.disabled = false;
      startTime = null;
      endTime = null;
    };

    // Event listeners
    els.bottoneInizia.addEventListener('click', iniziaPausa);
    els.bottoneReset.addEventListener('click', resetPausa);

    // Richiedi permesso notifiche al primo click
    document.addEventListener('click', () => {
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }, { once: true });

    // Pulizia al beforeunload
    window.addEventListener('beforeunload', () => {
      if (timerInterval) clearInterval(timerInterval);
    });