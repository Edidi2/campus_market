export function createPageUrl(pageName: string) {
    return '/' + pageName.replace(/ /g, '-');
}

export function formatBirr(amount: number | undefined | null): string {
    return `${(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Br`;
}

export function getExpiryInfo(createdDate: string | undefined | null) {
  if (!createdDate) return { daysLeft: 30, expired: false, posted: "", expiry: "" };
  const created = new Date(createdDate);
  const ms30 = 30 * 24 * 60 * 60 * 1000;
  const expiry = new Date(created.getTime() + ms30);
  const daysLeft = Math.ceil((expiry.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
  return {
    daysLeft,
    expired: daysLeft <= 0,
    posted: created.toLocaleDateString(),
    expiry: expiry.toLocaleDateString(),
  };
}