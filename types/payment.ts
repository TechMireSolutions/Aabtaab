export interface PaymentMethod {
  _id: string;
  _type: "paymentMethod";
  title: string;
  icon?: { asset: { _ref: string } };
  accountTitle: string;
  accountNumber: string;
  bankName?: string;
}
