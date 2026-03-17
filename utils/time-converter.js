export function timeConverter(isoTime) {
  const currentTime = Date.now();
  const pastTime = new Date(isoTime).getTime();

  if (Number.isNaN(pastTime)) return '';
  const timeDifference = currentTime - pastTime;
  if (timeDifference < 0) return 'just now';

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (seconds < 60) return `${seconds} seconds ago`;
  if (minutes < 60) return `${minutes} minutes ago`;
  if (hours < 24) return `${hours} hours ago`;
  if (days < 30) return `${days} days ago`;
  if (months < 12) return `${months} months ago`;
  return `${years} years ago`;
}