/**
 * Función para validar la extensión de un archivo subido por el usuario
 * por defecto, permite extensiones comunes de imágenes, documentos, comprimidos, texto, datos, videos y audio
 * @return  {[type]}  [Devuelve una promesa que se resuelve en true o false]
 */
export const validateFileExtension = (
    nameFile,
    allowedExtensions = [
        "png", "jpg", "jpeg", "gif", // imágenes
        "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", // documentos
        "zip", "rar", "7z", "tar", // comprimidos
        "txt", "csv", "json", // texto y datos
        "mp4", "mov", "avi", "mkv", // videos
        "mp3", "wav" // audio
    ]
) => {
    return new Promise((resolve) => {
        if (!nameFile?.name) {
            resolve(false);
            return;
        }

        // Obtener la extensión del archivo
        const extensionArr = nameFile.name.split(".");
        const extension = extensionArr.pop().toLowerCase();

        // Validar si la extensión está permitida
        const isAccepted = allowedExtensions.includes(extension);
        resolve(isAccepted);
    });
};
