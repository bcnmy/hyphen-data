const asc = arr => arr.sort((a, b) => a - b);
const quantile = (arr, q) => {
    const sorted = asc(arr);
    console.log(sorted);
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sorted[base + 1] !== undefined) {
        return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    } else {
        return sorted[base];
    }
};

export {
    quantile
}