import { NextFunction, Request, Response } from 'express'
import { constants } from 'http2'
import sharp from 'sharp'
import BadRequestError from '../errors/bad-request-error'
import { MIN_FILE_SIZE } from '../middlewares/file'

export const uploadFile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.file) {
        return next(new BadRequestError('Файл не загружен'))
    }

    try {
        if (req.file.size < MIN_FILE_SIZE) {
            return next(new BadRequestError('Файл слишком маленький'))
        }

        const metadata = await sharp(req.file.path).metadata()

        if (!metadata.width || !metadata.height) {
            return next(new BadRequestError('Некорректный файл изображения'))
        }

        const fileName = process.env.UPLOAD_PATH
            ? `/${process.env.UPLOAD_PATH}/${req.file.filename}`
            : `/${req.file.filename}`

        return res.status(constants.HTTP_STATUS_CREATED).send({
            fileName,
            originalName: req.file.originalname,
        })
    } catch (error) {
        return next(new BadRequestError('Некорректный файл изображения'))
    }
}

export default {}
