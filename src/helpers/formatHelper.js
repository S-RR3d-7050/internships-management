function getFileName(filePath) {
    // Split the file path by the backslash character
    const parts = filePath.split('\\');
    
    // Return the last part of the split array, which is the file name
    return parts[parts.length - 1];
}

module.exports = {
    getFileName
}