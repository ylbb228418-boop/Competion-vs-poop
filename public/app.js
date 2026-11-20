const form = document.querySelector('#check-form');
const button = document.querySelector('#check-button');
const status = document.querySelector('#status');
const result = document.querySelector('#result');
const history = document.querySelector('#history');

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
      <div><strong>${item.frequency}</strong><span>${item.duration}</span></div>
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
  const location = String(formData.get('location'));
  const type = String(formData.get('type'));
  const report = `How long: ${duration}\nHow often: ${frequency}\nWhere: ${location}\nPossible behavior type: ${type}\nWhat happened: ${details}`;
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
    result.innerHTML = `<h2>What may be happening</h2><p>${data.answer.replaceAll('\n', '<br>')}</p><div class="next-step">Next step: save this screen and talk to a trusted adult.</div>`;
    result.className = 'result';
    window.reportStorage.saveReport({ id: crypto.randomUUID(), createdAt: new Date().toISOString(), duration, frequency, location, type, details, answer: data.answer });
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
