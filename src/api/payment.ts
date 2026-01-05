import { api, withApiPrefix } from "./api";

export type VnpayResponse = {
  paymentId: number;
  paymentUrl: string;
};

// ✅ PaymentRecord create DTO (thêm status)
type PaymentRecordCreateDto = {
  roomId: string;
  roomName?: string | null;
  price: number;
  paymentMethodId?: string | null;

  status?: number; // ✅ thêm dòng này (Pending = 0)
};

// ✅ POST /api/PaymentRecord -> trả về Guid (string)
async function createPaymentRecord(dto: PaymentRecordCreateDto) {
  const res = await api.post<string>(withApiPrefix("/PaymentRecord"), dto, {
    headers: {
      accept: "*/*",
      "Content-Type": "application/json",
    },
  });
  return res.data;
}

// ✅ tạo link VNPAY (body là 1 số)
export async function createVnpay(amount: number) {
  const res = await api.post<VnpayResponse>(withApiPrefix("/Vnpay"), amount, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
}
