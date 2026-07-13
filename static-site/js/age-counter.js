/* ===== CLYVEXA — Website Age Counter ===== */
(function() {
  const LAUNCH_DATE = new Date('2026-02-16T00:00:00Z');

  function calculateAge(now) {
    let years = now.getFullYear() - LAUNCH_DATE.getFullYear();
    let months = now.getMonth() - LAUNCH_DATE.getMonth();
    let days = now.getDate() - LAUNCH_DATE.getDate();
    let hours = now.getHours() - LAUNCH_DATE.getHours();
    let minutes = now.getMinutes() - LAUNCH_DATE.getMinutes();
    let seconds = now.getSeconds() - LAUNCH_DATE.getSeconds();

    if (seconds < 0) { seconds += 60; minutes--; }
    if (minutes < 0) { minutes += 60; hours--; }
    if (hours < 0) { hours += 24; days--; }
    if (days < 0) {
      months--;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) { months += 12; years--; }

    return { years, months, days, hours, minutes, seconds };
  }

  function pad(n) { return String(n).padStart(2, '0'); }

  function updateCounters() {
    const now = new Date();
    const age = calculateAge(now);

    const fields = ['years', 'months', 'days', 'hours', 'minutes', 'seconds'];
    fields.forEach(function(field) {
      const el = document.getElementById('age-' + field);
      if (el) el.textContent = pad(age[field]);
    });
  }

  function init() {
    updateCounters();
    setInterval(updateCounters, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.AgeCounter = { calculate: calculateAge, update: updateCounters };
})();
