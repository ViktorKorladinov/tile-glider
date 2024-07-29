export function getColorFromGradient(index, length) {
    const normalizedIndex = index / (length - 1);
    const red = Math.round(255 * (1 - normalizedIndex));
    const blue = Math.round(255 * normalizedIndex);
    const green = 0;
    const opacity = 1-normalizedIndex
    return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
}