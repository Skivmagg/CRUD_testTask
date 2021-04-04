const path = require('path');
const uuid = require('uuid').v1;
const fs = require('fs-extra').promises;

module.exports = {
    fileDirBuilder: (docName, itemType, itemId, dataBaseName) => {
        const pathWithoutStatic = path.join(`${dataBaseName}`, `${itemId}`, itemType);
        const fileDir = path.join(process.cwd(), 'static', pathWithoutStatic);
        const fileExtension = docName.split('.').pop();
        const fileName = `${uuid()}.${fileExtension}`;
        const finalFilePath = path.join(fileDir, fileName);

        const uploadPath = path.join(pathWithoutStatic, fileName);

        return { finalFilePath, uploadPath, fileDir };
    },

    deleteFile: (filePath = '') => {
    const folder = path.join(process.cwd(), 'static', filePath);

    fs.rmdir(folder, {
        recursive: true,
    });
    }
};
