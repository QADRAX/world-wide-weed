export function equalSet<T>(
    xs: Set<T>,
    ys: Set<T>
): boolean {
    const sameSize = xs.size === ys.size;
    const sameSet = [...xs].every((x) => ys.has(x));
    return sameSet && sameSize;
}

export function setHasSomeKey<T>(
    xs: Set<T>,
    ys: Set<T>
): boolean {
    let result = false;
    const yS = [...ys];
    for(const ysT of yS){
        const isIncluded = xs.has(ysT);
        if(isIncluded){
            result = true;
            break;
        }
    }

    return result;
}
