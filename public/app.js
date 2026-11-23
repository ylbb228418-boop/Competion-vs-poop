const form = document.querySelector('#check-form');
const button = document.querySelector('#check-button');
const status = document.querySelector('#status');
const result = document.querySelector('#result');
const history = document.querySelector('#history');
const incidentDateInput = form.querySelector('[name="incidentDate"]');

const today = new Date();
today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
incidentDateInput.value = today.toISOString().slice(0, 10);

document.querySelectorAll('.choice-option').forEach((option) => {
  option.addEventListener('click', () => {
    const choiceName = option.dataset.choice;
    document.querySelector(`input[name="${choiceName}"]`).value = option.dataset.value;
    document.querySelectorAll(`.choice-option[data-choice="${choiceName}"]`).forEach((item) => {
      const selected = item === option;
      item.classList.toggle('selected', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
  });
});

function showHistory() {
  const reports = window.reportStorage.getReports();
  history.innerHTML = reports.map((item) => `
    <article class="history-card">
      <div><strong>${item.incidentDate ? new Date(`${item.incidentDate}T00:00:00`).toLocaleDateString() : 'Date not recorded'}</strong><span>${item.frequency}</span></div>
      <div><span>${item.duration}</span><span>${item.type || 'Pattern note'}</span></div>
      <p>${item.details}</p>
      <small>${item.location} · saved on this computer</small>
    </article>
  `).join('');
}

function setBusy(busy) {
  button.disabled = busy;
  button.textContent = busy ? 'Thinking…' : 'Check the pattern';
  status.textContent = busy ? 'The AI is reading your report. Please wait.' : '';
}

function patternSignal(duration, frequency) {
  const durationScore = {
    'Today only': 15,
    'A few days': 35,
    'About 2 weeks': 65,
    'More than a month': 85
  }[duration] || 0;
  const frequencyScore = {
    Once: 10,
    'A few times': 35,
    'Almost every day': 70,
    'Many times a day': 90
  }[frequency] || 0;
  const score = Math.round((durationScore + frequencyScore) / 2);
  const label = score < 25 ? 'Probably not' : score < 50 ? 'Maybe' : score < 75 ? 'Possibly' : 'Yes, very possible';
  const tone = score < 50 ? 'green' : score < 75 ? 'yellow' : 'red';
  return { score, label, tone };
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const details = String(formData.get('details') || '').trim();
  if (!details) {
    status.textContent = 'Please write what happened first.';
    return;
  }

  const duration = String(formData.get('duration'));
  const frequency = String(formData.get('frequency'));
  const incidentDate = String(formData.get('incidentDate') || '');
  const location = String(formData.get('location'));
  const type = String(formData.get('type'));
  if (!incidentDate) {
    status.textContent = 'Please choose the date first.';
    return;
  }
  const report = `Date: ${incidentDate}\nHow long: ${duration}\nHow often: ${frequency}\nWhere: ${location}\nPossible behavior type: ${type}\nWhat happened: ${details}`;
  setBusy(true);
  result.className = 'result hidden';

  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ report })
    });
    const data = await response.json();
    if (!response.ok) {
      const message = typeof data.error === 'string' ? data.error : data.error?.message;
      throw new Error(message || 'The AI could not answer.');
    }
    const signal = patternSignal(duration, frequency);
    result.innerHTML = `<h2>What may be happening</h2><p>${data.answer.replaceAll('\n', '<br>')}</p><div class="signal-meter"><div class="meter-sticker">A gentle clue</div><div class="meter-heading"><strong>Could this be a pattern?</strong><span>${signal.label}</span></div><div class="meter-track" role="progressbar" aria-label="Repeated-pattern signal" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${signal.score}"><div class="meter-fill ${signal.tone}" style="width:0%"></div></div><div class="meter-labels"><span>Probably not</span><span>Yes, very possible</span></div><p class="meter-note">This is a clue based on how long and how often it happened—not proof. A trusted adult can help you decide what to do.</p></div><div class="next-step">Next step: save this screen and talk to a trusted adult.</div>`;
    const meter = result.querySelector('.signal-meter');
    const fill = result.querySelector('.meter-fill');
    const revealMeter = () => { fill.style.width = `${signal.score}%`; };
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          revealMeter();
          observer.disconnect();
        }
      }, { threshold: 0.35 });
      observer.observe(meter);
    } else {
      revealMeter();
    }
    result.className = 'result';
    window.reportStorage.saveReport({ id: crypto.randomUUID(), createdAt: new Date().toISOString(), incidentDate, duration, frequency, location, type, details, answer: data.answer });
    showHistory();
  } catch (error) {
    result.innerHTML = `<h2>The helper needs a quick check</h2><p>${error.message || 'Ask a trusted adult to check the AI key and internet connection, then try again.'}</p>`;
    result.className = 'result error';
  } finally {
    setBusy(false);
  }
});

document.querySelector('#clear-history').addEventListener('click', () => {
  localStorage.removeItem('anti-bullies-reports-v1');
  showHistory();
  status.textContent = 'Local sample history cleared from this browser.';
});

showHistory();
