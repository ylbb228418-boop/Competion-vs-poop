const STORAGE_KEY = 'anti-bullies-reports-v1';

const sampleReports = [
  {
    id: 'sample-1',
    createdAt: '2026-10-20T15:30:00.000Z',
    duration: 'About 2 weeks',
    frequency: 'Almost every day',
    location: 'Between classes',
    details: 'Made-up sample: a group keeps making the same comments when I walk to class.',
    answer: 'Sample only: This sounds like a repeated pattern that should be shared with a trusted adult. You do not have to handle it alone.'
  },
  {
    id: 'sample-2',
    createdAt: '2026-10-22T16:10:00.000Z',
    duration: 'A few days',
    frequency: 'A few times',
    location: 'Online',
    details: 'Made-up sample: someone keeps sending mean messages, then says they were joking.',
    answer: 'Sample only: Save the messages and ask a trusted adult to help you decide what to do next.'
  }
];

function getReports() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleReports));
    return sampleReports;
  }
  try { return JSON.parse(saved); } catch { return []; }
}

function saveReport(report) {
  const reports = [report, ...getReports()];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  return reports;
}

window.reportStorage = { getReports, saveReport };
