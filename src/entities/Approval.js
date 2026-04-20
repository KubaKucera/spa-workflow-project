// IR02 – Business entita Approval (schvalování žádosti)
// Reprezentuje rozhodnutí jednoho schvalovatele
export class Approval {
  constructor(id, requestId, approverId) {
    this.id = id;                 // unikátní ID schválení
    this.requestId = requestId;   // vazba na Request
    this.approverId = approverId; // kdo schvaluje
    this.status = "PENDING";      // výchozí stav
  }

  // schválení žádosti
  approve(requestStatus) {
    // kontrola, že rozhodnutí ještě nepadlo
    if (this.status !== "PENDING") {
      throw new Error("Approval už bylo rozhodnuto");
    }

    // kontrola stavu requestu
    if (requestStatus !== "UNDER_REVIEW") {
      throw new Error("Request není ve správném stavu");
    }

    // změna stavu
    this.status = "APPROVED";
  }

  // zamítnutí žádosti
  reject(requestStatus) {
    // kontrola, že rozhodnutí ještě nepadlo
    if (this.status !== "PENDING") {
      throw new Error("Approval už bylo rozhodnuto");
    }

    // kontrola stavu requestu
    if (requestStatus !== "UNDER_REVIEW") {
      throw new Error("Request není ve správném stavu");
    }

    // změna stavu
    this.status = "REJECTED";
  }
}