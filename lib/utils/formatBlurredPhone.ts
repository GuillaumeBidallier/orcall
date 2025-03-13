export const formatBlurredPhone = (phone: string): string => {
  const cleaned = phone.replace(/\s+/g, "");
  if (cleaned.length === 10) {
    const visiblePart = cleaned.slice(0, 4);
    const formattedVisible =
      visiblePart.match(/.{1,2}/g)?.join(" ") || visiblePart;
    return `${formattedVisible} •• •• ••`;
  }
  return cleaned.replace(/\d/g, "•");
};
