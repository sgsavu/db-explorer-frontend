export const handleError = (error: Error) => {
    window.alert(error.message)
    console.error(error.stack)
}