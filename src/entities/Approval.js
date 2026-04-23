// IR02 – Business entita Approval (schvalování žádosti)
// Reprezentuje rozhodnutí jednoho schvalovatele
export class Approval {
  constructor(id, requestId, approverId) {
    this.id = id;
    this.requestId = requestId;
    this.approverId = approverId;
    this.state = "PENDING";
  }

  #checkAuthorization(user) {
    if (!user || user.state !== "ACTIVE" || user.role !== "APPROVER") {
      throw new Error("Unauthorized");
    }
  }

  approve(requestStatus, user) {
    this.#checkAuthorization(user);

    if (this.state !== "PENDING") throw new Error("Already decided");
    if (requestStatus !== "UNDER_REVIEW") throw new Error("Invalid request");

    this.state = "APPROVED";
  }

  reject(requestStatus, user) {
    this.#checkAuthorization(user);

    if (this.state !== "PENDING") throw new Error("Already decided");
    if (requestStatus !== "UNDER_REVIEW") throw new Error("Invalid request");

    this.state = "REJECTED";
  }
}