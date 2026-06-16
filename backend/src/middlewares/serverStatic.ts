import { NextFunction, Request, Response } from 'express'
import fs from 'fs'
import path from 'path'

export default function serveStatic(baseDir: string) {
    const resolvedBase = path.resolve(baseDir)

    return (req: Request, res: Response, next: NextFunction) => {
        const filePath = path.resolve(path.join(resolvedBase, req.path))

        if (!filePath.startsWith(resolvedBase)) {
            return next()
        }

        fs.access(filePath, fs.constants.F_OK, (accessError) => {
            if (accessError) {
                return next()
            }

            return res.sendFile(filePath, (sendError) => {
                if (sendError) {
                    next(sendError)
                }
            })
        })
    }
}
