const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

const time = document.querySelector("#local-time");
if (time) {
  time.textContent = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Edmonton",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date());
}
