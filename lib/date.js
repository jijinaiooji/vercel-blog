import moment from 'moment';

export function formatTwitterDate(dateStr) {
  const date = moment(dateStr);
  const now = moment();
  const diffSeconds = now.diff(date, 'seconds');
  const diffMinutes = now.diff(date, 'minutes');
  const diffHours = now.diff(date, 'hours');
  const diffDays = now.diff(date, 'days');

  if (diffSeconds < 60) {
    return `${diffSeconds}s`;
  }
  if (diffMinutes < 60) {
    return `${diffMinutes}m`;
  }
  if (diffHours < 24) {
    return `${diffHours}h`;
  }
  if (diffDays < 365) {
    return `${diffDays}d`;
  }
  
  return date.format('MMM D, YYYY');
}

export function formatDateFull(dateStr) {
  return moment(dateStr).format('MMMM D, YYYY h:mm A');
}
