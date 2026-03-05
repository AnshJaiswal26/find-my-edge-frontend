const Brokers = {
  DHAN: { key: "dhan", name: "Dhan", logo: "/Icons/broker/dhan.png" },
  ANGEL_BROKING: {
    key: "angel-broking",
    name: "Angel One",
    logo: "/Icons/broker/angel one.png",
  },
  ZERODHA: {
    key: "zerodha",
    name: "Zerodha Kite",
    logo: "/Icons/broker/zerodha kite.png",
  },
  GROWW: { key: "groww", name: "Groww", logo: "/Icons/broker/groww.png" },
  UPSTOX: { key: "upstox", name: "Upstox", logo: "/Icons/broker/upstox.png" },

  toName(key) {
    const broker = Object.values(this).find((b) => b.key === key);
    return broker ? broker.name : key;
  },

  get(key) {
    return Object.values(this).find((b) => b.key === key);
  },

  getLogo(key) {
    const broker = Object.values(this).find((b) => b.key === key);
    return broker ? broker.logo : null;
  },

  has(key) {
    return Object.values(this).some((b) => b.key === key);
  },
};

const ConnectionStatus = {
  CONNECTED: "CONNECTED",
  NOT_CONNECTED: "NOT_CONNECTED",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  DISCONNECTED: "DISCONNECTED",

  isTokenExpired(status) {
    return status === this.TOKEN_EXPIRED;
  },

  isConnected(status) {
    return status === this.CONNECTED;
  },

  isNotConnected(status) {
    return status === this.NOT_CONNECTED;
  },

  isDisconnected(status) {
    return status === this.DISCONNECTED;
  },
};

export { Brokers, ConnectionStatus };
