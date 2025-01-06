export function formatTimestamp(ts) {
  if (isNaN(Date.parse(ts))) {
    return "unknown";
  }

  const dateObj = new Date(ts);

  const time = dateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  const date = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  return `${time}, ${date}`;
}