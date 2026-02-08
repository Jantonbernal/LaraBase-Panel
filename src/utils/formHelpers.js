export const prepareFormData = (data, mode = "create") => {
    const formData = new FormData()

    Object.keys(data).forEach(key => {
        const value = data[key]
        if (value !== null && value !== undefined) {
            if (Array.isArray(value)) {
                value.forEach(val => formData.append(`${key}[]`, val))
            } else {
                formData.append(key, value)
            }
        }
    })

    if (mode !== "create") {
        formData.append('_method', 'PUT')
    }

    return formData
}