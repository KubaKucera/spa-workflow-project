import { approveApi, rejectApi } from "../infra/async/approvalApi.js";

/**
 * IR02 – Dispatcher
 * ------------------
 * Hlavní vstupní bod pro business akce.
 * Přijímá:
 *  - state (aktuální stav aplikace)
 *  - action (co uživatel udělal)
 *  - dispatch (funkce pro komunikaci se store / IR01)
 */
export function dispatcher(state, action, dispatch) {
  switch (action.type) {

    // =========================================================
    // APPROVE REQUEST (schválení žádosti)
    // =========================================================
    case "APPROVE_REQUEST": {

      const approval = state.approvals.find(a => a.id === action.approvalId);

      if (!approval) throw new Error("Approval nenalezen");

      const request = state.requests.find(r => r.id === approval.requestId);

      if (!request) throw new Error("Request nenalezen");

      // IR03 – začátek async operace
      // UI se přepne do loading stavu
      dispatch({ type: "LOADING" });

      // Simulace API volání (backend)
      approveApi()
        .then(() => {

          // Business logika Approval entity
          // změní stav PENDING → APPROVED
          approval.approve(request.status);

          updateRequestState(state, request.id);

          // UI notifikace o úspěchu
          dispatch({ type: "SUCCESS" });
        })
        .catch(() => {

          // UI notifikace o chybě
          dispatch({ type: "ERROR" });
        });

      // důležité: state se nemění okamžitě (async flow)
      return state;
    }

    // =========================================================
    // REJECT REQUEST (zamítnutí žádosti)
    // =========================================================
    case "REJECT_REQUEST": {

      const approval = state.approvals.find(a => a.id === action.approvalId);
      if (!approval) throw new Error("Approval nenalezen");

      const request = state.requests.find(r => r.id === approval.requestId);
      if (!request) throw new Error("Request nenalezen");

      // UI loading stav
      dispatch({ type: "LOADING" });

      // Async simulace zamítnutí
      rejectApi()
        .then(() => {

          approval.reject(request.status);

          // Přepočet requestu podle approvals
          updateRequestState(state, request.id);

          // success UI stav
          dispatch({ type: "SUCCESS" });
        })
        .catch(() => {

          // error UI stav
          dispatch({ type: "ERROR" });
        });

      return state;
    }

    // =========================================================
    // DEFAULT – neznámá akce
    // =========================================================
    default:
      return state;
  }
}

/**
 * Přepočítá stav Requestu podle všech Approval entit
 * 
 * Pravidla:
 *  - pokud alespoň jeden REJECTED → Request = REJECTED
 *  - pokud všechny APPROVED → Request = APPROVED
 */
function updateRequestState(state, requestId) {

  const approvals = state.approvals.filter(a => a.requestId === requestId);

  const request = state.requests.find(r => r.id === requestId);

  if (!request) return state;

  // pokud existuje alespoň jedno zamítnutí
  if (approvals.some(a => a.status === "REJECTED")) {
    request.status = "REJECTED";
  } 

  // pokud všichni schválili
  else if (approvals.every(a => a.status === "APPROVED")) {
    request.status = "APPROVED";
  }

  return state;
}