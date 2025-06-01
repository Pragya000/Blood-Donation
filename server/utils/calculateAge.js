export const calculateAge = (dob) => {
    const dateOfBirth = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - dateOfBirth.getFullYear()
    const month = today.getMonth() - dateOfBirth.getMonth()
    if (month < 0 || (month === 0 && today.getDate() < dateOfBirth.getDate())) {
        age--
    }
    return age
}