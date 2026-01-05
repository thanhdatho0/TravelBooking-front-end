// src/api/vnpay.ts
import { api, withApiPrefix } from "./api";

export type VnpayCreateResponse = {
  paymentId?: unknown; // số rất lớn -> không dùng ở FE
  paymentUrl: string;
};

export async function createVnpayPayment(amountVnd: number) {
  // Backend của bạn nhận body là 1 số JSON, ví dụ: 2000000
  const amount = Math.round(amountVnd);

  const res = await api.post<VnpayCreateResponse>(
    withApiPrefix("/Vnpay"),
    amount,
    {
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
      },
    }
  );

  return res.data;
}
