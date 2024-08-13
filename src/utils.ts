export const generateShortId = () => Math.random().toString(36).substring(2, 10)

export const findArrayDiff = <T>(arr1: T[], arr2: T[]): T[] => {
    const set1 = new Set(arr1);
    const set2 = new Set(arr2);

    const diff1 = arr1.filter(item => !set2.has(item));
    const diff2 = arr2.filter(item => !set1.has(item));

    return [...diff1, ...diff2];
}

export const handleError = (error: Error) => {
    window.alert(error.message)
    console.error(error.stack)
} 