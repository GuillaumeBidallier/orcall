export const getTradeColor = (trade: string) => {
  switch (trade.toLowerCase()) {
    case "peintre":
      return "bg-orange-500";
    case "plombier":
      return "bg-blue-500";
    case "maçon":
      return "bg-amber-600";
    case "électricien":
      return "bg-yellow-500";
    case "menuisier":
      return "bg-brown-500";
    case "carreleur":
      return "bg-teal-500";
    default:
      return "bg-orange-500";
  }
};

export const getTradeTextColor = (trade: string) => {
  switch (trade.toLowerCase()) {
    case "peintre":
      return "text-white";
    case "plombier":
      return "text-white";
    case "maçon":
      return "text-white";
    case "électricien":
      return "text-gray-800";
    case "menuisier":
      return "text-white";
    case "carreleur":
      return "text-white";
    default:
      return "text-white";
  }
};
