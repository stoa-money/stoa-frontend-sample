import {
  PotFactoryDetails,
  PotFactoryOffer,
  UserDetails,
  PaymentInstitution,
  Pot,
  BankAccount,
  EmploymentStatus,
  Industry,
  Occupation,
  SourceOfFunds,
  CardDetails,
  Deposit,
} from "@/types/types";
import { CreateUserRequest, CreatePotRequest } from "@/types/apiModel";

const CORE_API_BASE_URL =
  process.env.NEXT_PUBLIC_CORE_API_BASE_URL ?? "http://localhost:5000";
const DELAY_MS = 0;

function buildUrl(path: string) {
  return `${CORE_API_BASE_URL}${path}`;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let details: any = undefined;
    try {
      details = await res.json();
    } catch (e) {
      console.error(e);
    }
    throw new CoreApiError(res.status, details?.detail || res.statusText);
  }

  if (res.headers.get("content-length") === "0") {
    return undefined as unknown as T;
  }

  const json = await res.json();
  return json as T;
}

export const apiService = {
  /* -------------------------------------------------------------------- */
  /*                              USER                                    */
  /* -------------------------------------------------------------------- */

  async createUser(
    payload: CreateUserRequest,
    token: string
  ): Promise<{ userId: string }> {
    await delay(DELAY_MS);
    const res = await fetch(buildUrl("/api/user"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    return handleResponse<{ userId: string }>(res);
  },

  async getUserDetails(token: string): Promise<UserDetails | null> {
    await delay(DELAY_MS);
    const res = await fetch(buildUrl(`/api/user`), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse<UserDetails | null>(res);
  },

  async getUserBankAccount(token: string): Promise<BankAccount | null> {
    await delay(DELAY_MS);
    const res = await fetch(buildUrl(`/api/user/bank-account`), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse<BankAccount | null>(res);
  },

  async getUserPots(token: string): Promise<Pot[]> {
    await delay(DELAY_MS);
    const res = await fetch(buildUrl(`/api/user/pots`), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse<Pot[]>(res);
  },

  async linkUserAccount(institutionId: string, token: string): Promise<void> {
    await delay(DELAY_MS);
    const res = await fetch(buildUrl(`/api/user/link-account`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ institutionId }),
    });
    await handleResponse(res);
  },

  async unlinkUserAccount(token: string): Promise<void> {
    await delay(DELAY_MS);
    const res = await fetch(buildUrl(`/api/user/unlink-account`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    await handleResponse(res);
  },

  /* -------------------------------------------------------------------- */
  /*                              POT FACTORIES                           */
  /* -------------------------------------------------------------------- */

  async getPotFactories(token: string): Promise<PotFactoryDetails[]> {
    await delay(DELAY_MS);
    const res = await fetch(buildUrl("/api/potFactories"), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse<PotFactoryDetails[]>(res);
  },

  async getPotFactoryDetails(
    potFactoryId: string,
    token: string
  ): Promise<PotFactoryDetails | null> {
    await delay(DELAY_MS);
    const res = await fetch(
      buildUrl(`/api/potFactories/${encodeURIComponent(potFactoryId)}`),
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return handleResponse<PotFactoryDetails | null>(res);
  },

  /* -------------------------------------------------------------------- */
  /*                           POTS                                       */
  /* -------------------------------------------------------------------- */

  async createPot(
    payload: CreatePotRequest,
    token: string
  ): Promise<{ potId: string }> {
    await delay(DELAY_MS);
    const res = await fetch(buildUrl("/api/pots"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    return handleResponse<{ potId: string }>(res);
  },

  async getPot(potId: string, token: string): Promise<Pot | null> {
    await delay(DELAY_MS);
    const res = await fetch(
      buildUrl(`/api/pots/${encodeURIComponent(potId)}`),
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return handleResponse<Pot | null>(res);
  },

  async acceptPotTerms(potId: string, token: string): Promise<void> {
    await delay(DELAY_MS);
    const res = await fetch(
      buildUrl(`/api/pots/${encodeURIComponent(potId)}/accept-terms`),
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    await handleResponse(res);
  },
  async abandonPot(potId: string, token: string): Promise<void> {
    await delay(DELAY_MS);
    const res = await fetch(
      buildUrl(`/api/pots/${encodeURIComponent(potId)}/abandon`),
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    await handleResponse(res);
  },

  async depositToPot(
    potId: string,
    amount: number,
    token: string
  ): Promise<void> {
    await delay(DELAY_MS);
    const res = await fetch(
      buildUrl(`/api/pots/${encodeURIComponent(potId)}/deposit`),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      }
    );
    await handleResponse(res);
  },

  async sendFundsToPot(
    potId: string,
    amount: number,
    token: string
  ): Promise<void> {
    await delay(DELAY_MS);
    const res = await fetch(
      buildUrl(`/api/pots/${encodeURIComponent(potId)}/send-funds`),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      }
    );
    await handleResponse(res);
  },

  /* -------------------------------------------------------------------- */
  /*                        PAYMENT INSTITUTIONS                          */
  /* -------------------------------------------------------------------- */

  async getPaymentInstitutions(token: string): Promise<PaymentInstitution[]> {
    await delay(DELAY_MS);
    const res = await fetch(buildUrl("/api/data/institutions"), {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    });
    return await handleResponse<PaymentInstitution[]>(res);
  },

  /* -------------------------------------------------------------------- */
  /*                           STATIC DATA                                */
  /* -------------------------------------------------------------------- */

  async getSourceOfFunds(token: string): Promise<SourceOfFunds[]> {
    await delay(DELAY_MS);
    const res = await fetch(buildUrl("/api/data/source-of-funds"), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await handleResponse<SourceOfFunds[]>(res);
  },

  async getEmploymentStatuses(token: string): Promise<EmploymentStatus[]> {
    await delay(DELAY_MS);
    const res = await fetch(buildUrl("/api/data/employment-status"), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await handleResponse<EmploymentStatus[]>(res);
  },

  async getIndustries(token: string): Promise<Industry[]> {
    await delay(DELAY_MS);
    const res = await fetch(buildUrl("/api/data/industries"), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await handleResponse<Industry[]>(res);
  },

  async getOccupations(
    industryId: string,
    token: string
  ): Promise<Occupation[]> {
    await delay(DELAY_MS);
    const res = await fetch(
      buildUrl(
        `/api/data/occupations?industryId=${encodeURIComponent(industryId)}`
      ),
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return await handleResponse<Occupation[]>(res);
  },

  /* -------------------------------------------------------------------- */
  /*                           VERIFICATION                               */
  /* -------------------------------------------------------------------- */

  async startVerification(token: string): Promise<void> {
    await delay(DELAY_MS);
    const res = await fetch(buildUrl(`/api/user/verify`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    await handleResponse(res);
  },

  /* -------------------------------------------------------------------- */
  /*                              ADMIN                                   */
  /* -------------------------------------------------------------------- */

  async getAdminUsers(token: string): Promise<UserDetails[]> {
    await delay(DELAY_MS);
    const res = await fetch(buildUrl("/api/admin/users"), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse<UserDetails[]>(res);
  },

  async getAdminPots(token: string): Promise<Pot[]> {
    await delay(DELAY_MS);
    const res = await fetch(buildUrl("/api/admin/pots"), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse<Pot[]>(res);
  },

  async getAdminCards(token: string): Promise<CardDetails[]> {
    await delay(DELAY_MS);
    const res = await fetch(buildUrl("/api/admin/cards"), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse<CardDetails[]>(res);
  },

  async getAdminPotFactories(token: string): Promise<PotFactoryDetails[]> {
    await delay(DELAY_MS);
    const res = await fetch(buildUrl("/api/admin/potFactories"), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse<PotFactoryDetails[]>(res);
  },

  async getAdminDeposits(token: string): Promise<Deposit[]> {
    await delay(DELAY_MS);
    const res = await fetch(buildUrl("/api/admin/deposits"), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse<Deposit[]>(res);
  },

  async getAdminDepositsByPotFactory(
    potFactoryId: string,
    token: string
  ): Promise<Deposit[]> {
    await delay(DELAY_MS);
    const res = await fetch(
      buildUrl(
        `/api/admin/deposits/potFactory/${encodeURIComponent(potFactoryId)}`
      ),
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return handleResponse<Deposit[]>(res);
  },

  async getAdminDepositsByPot(
    potId: string,
    token: string
  ): Promise<Deposit[]> {
    await delay(DELAY_MS);
    const res = await fetch(
      buildUrl(`/api/admin/deposits/pot/${encodeURIComponent(potId)}`),
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return handleResponse<Deposit[]>(res);
  },

  async activateCard(
    cardId: string,
    externalId: string,
    code: string,
    token: string
  ): Promise<void> {
    await delay(DELAY_MS);
    const res = await fetch(
      buildUrl(`/api/cards/${encodeURIComponent(cardId)}/activate`),
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ externalId, code }),
      }
    );
    await handleResponse(res);
  },

  async getAdminDepositsByUser(
    userId: string,
    token: string
  ): Promise<Deposit[]> {
    await delay(DELAY_MS);
    const res = await fetch(
      buildUrl(`/api/admin/deposits/user/${encodeURIComponent(userId)}`),
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return handleResponse<Deposit[]>(res);
  },
};

export class CoreApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "CoreApiError";
  }
}
