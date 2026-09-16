import { env } from '../../config/env.js';

export interface PaymentInit { redirectUrl: string; gatewayTxnId: string; }
export interface IPaymentProvider {
  init(opts: { purchaseId: string; amountBdt: number; description: string }): Promise<PaymentInit>;
  verify(payload: any): Promise<{ ok: boolean; gatewayTxnId?: string }>;
}

class MockProvider implements IPaymentProvider {
  async init({ purchaseId }: { purchaseId: string }) {
    return {
      redirectUrl: `${env.appUrl}/payments/mock-callback?purchaseId=${purchaseId}`,
      gatewayTxnId: `mock_${purchaseId}_${Date.now()}`,
    };
  }
  async verify(_payload: any) {
    return { ok: true, gatewayTxnId: `mock_verified_${Date.now()}` };
  }
}

export function getPaymentProvider(_method: string): IPaymentProvider {
  return new MockProvider();
}
