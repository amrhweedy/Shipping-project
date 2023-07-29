export function formatDate() {
  const month = new Date().getMonth() + 1;
  const day = new Date().getDate();
  const year = new Date().getFullYear();
  const hour = new Date().getHours();
  const minute = new Date().getMinutes();
  const second = new Date().getSeconds();
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedDate = `${month}/${day}/${year} ${
    hour % 12
  }:${minute}:${second} ${ampm}`;
  return formattedDate;
}
