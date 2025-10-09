export function downloadBlob(blob, filename = "export.xlsx") {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function parseFilenameFromDisposition(disposition) {
  if (!disposition) return null;
  const star = disposition.match(/filename\*=(?:UTF-8'')?([^;]+)/i);
  if (star?.[1]) return decodeURIComponent(star[1].replace(/^["']|["']$/g, ""));
  const plain = disposition.match(/filename="?([^"]+)"?/i);
  if (plain?.[1]) return plain[1];
  return null;
}
