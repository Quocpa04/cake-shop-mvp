export const ORDER_STATUS = Object.freeze({
  PENDING_PAYMENT: 'PENDING_PAYMENT',
  CONFIRMED: 'CONFIRMED',
  IN_PRODUCTION: 'IN_PRODUCTION',
  READY: 'READY',
  CANCELLED: 'CANCELLED',
});

export const ORDER_TRANSITIONS = Object.freeze({
  PENDING_PAYMENT: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['IN_PRODUCTION', 'CANCELLED'],
  IN_PRODUCTION: ['READY'],
  READY: [],
  CANCELLED: [],
});

export function canTransitionOrder(from, to) {
  return ORDER_TRANSITIONS[from]?.includes(to) ?? false;
}

export const CAKE_MESSAGE_MAX_LENGTH = 40;
export const DEFAULT_READY_CAKE_LEAD_TIME_MINUTES = 120;
export const DEFAULT_PREORDER_LEAD_TIME_MINUTES = 1440;
