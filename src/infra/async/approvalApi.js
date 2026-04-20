// IR03 – simulace API pro schválení (async operace)
export function approveApi() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("OK"); // úspěšná odpověď serveru
    }, 500);
  });
}

// IR03 – simulace API pro zamítnutí (async operace)
export function rejectApi() {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject("ERROR"); // simulace chyby serveru
    }, 500);
  });
}