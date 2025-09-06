export const sortData = (data, key, order) => {
  return [...data].sort((a, b) => {
    const valA = a[key] ?? "";
    const valB = b[key] ?? "";
    if (valA < valB) return order === "asc" ? -1 : 1;
    if (valA > valB) return order === "asc" ? 1 : -1;
    return 0;
  });
};
