const { errorCodesEnum } = require('../constant');
const {
    constants: {
        PHOTOS_MIMETYPES,
        PHOTO_MAX_SIZE
    }
} = require('../constant');
const ErrorHandler = require('../error/ErrorHandler');
const { errorMessage } = require('../message');

module.exports = {
    checkFileMiddleware: (req, res, next) => {
        try {
            const { files } = req;
            const photos = [];

            if (!files) {
                return next();
            }

            const allFiles = Object.values(files);
            for (let i = 0; i < allFiles.length; i++) {
                const { name, size, mimetype } = allFiles[i];

                if (PHOTOS_MIMETYPES.includes(mimetype)) {
                    if (PHOTO_MAX_SIZE < size) {
                        throw new ErrorHandler(errorCodesEnum.BAD_REQUEST,
                            errorMessage.FILE_TOO_BIG.customCode,
                            `file ${name} is too big`);
                    }
                    photos.push(allFiles[i]);
                } else {
                    throw new ErrorHandler(errorCodesEnum.BAD_REQUEST,
                        errorMessage.NOT_VALID_FILE.customCode,
                        `file ${name} is too big`);
                }
            }

            req.photos = photos;

            next();
        } catch (e) {
            next(e);
        }
    },

    checkAvatar: (req, res, next) => {
        try {
            if (req.photos) {
                if (req.photos.length > 1) {
                    throw new ErrorHandler(errorCodesEnum.BAD_REQUEST,
                        errorMessage.WRONG_FILE_COUNT.customCode,
                        'You can upload only 1 file');
                }
                [req.avatar] = req.photos;
            }

            next();
        } catch (e) {
            next(e);
        }
    }
};
