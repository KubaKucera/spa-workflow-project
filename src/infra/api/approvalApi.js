// IR03 – simulace API pro schvaleni (async operace)
export function approveApi(requestId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!requestId) {
        return reject({
          status: 400,
          message: "Missing requestId"
        });
      }

      resolve({
        status: 200,
        data: {
          requestId,
          result: "APPROVED",
          timestamp: Date.now()
        }
      });
    }, 500);
  });
}

// IR03 – simulace API pro zamitnuti (async operace)
export function rejectApi(requestId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!requestId) {
        return reject({
          status: 400,
          message: "Missing requestId"
        });
      }

      resolve({
        status: 200,
        data: {
          requestId,
          result: "REJECTED",
          timestamp: Date.now()
        }
      });
    }, 500);
  });
}