export function round2(value: number | string) {
  if (typeof value === "number") return Math.round(value * 100) / 100;
  if (typeof value === "string" && value.trim() !== "" && !isNaN(Number(value))) {
    const n = Number(value);
    return Math.round(n * 100) / 100;
  }
  return value;
}

export function lower_bound(arr: number[], value: number) {
  let low = 0;
  let high = arr.length;
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (arr[mid] < value) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  return low;
}
