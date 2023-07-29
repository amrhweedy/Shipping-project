export enum OrderState {
  New = 0,
  Delayed = 1,
  Waiting = 2,
  Rejected = 3,
  Delivered = 4,
}

export enum ShippingType {
  Normal = 0,
  Express24H = 1,
  Express15D = 2,
}

export enum PaymentType {
  Cash = 0,
  Visa = 1,
  PackageForPackage = 2,
}

export interface Order {
  orderId: number;
  state: OrderState;
  paymentMethod: PaymentType;
  orderDate: string;
  extraWeightCost: number;
  companyBranch: string;
  defaultCost: number;
  customerId: number;
  customerName: string;
  city: string;
  government: string;
  phone: string;
  shipping_type: ShippingType;
  traderId: number;
  salesRepresentativeId: number;
  deliverToVillageCost: number;
}
