import express from 'express';
import scopeValidator from '../middleware/scopeVaildator'
import Menu from '../entity/menu';
import { body } from '../middleware/schemaChecker';
import MenuCategory from '../entity/menu_category';
import { cache } from '../middleware/cacheMiddleware';
import ObjectStorage from '../src/storage'
import { UploadedFile } from 'express-fileupload';
import DataProvider from '../lib/DataProvider';
import { Actions, Resources } from '../lib/permissions';

const router = express.Router();

router.get('/',
    [scopeValidator(Resources.menu, Actions.read), cache(600)],
    async (req: express.Request, res: express.Response) => {
        try {
            const provider = new DataProvider('MenuCategory')
            await provider.index(req, res)
        } catch (e) {
            console.log(e)
            res.status(500).json({
                message: e.message
            })
        }
    });

router.post('/',
    [
        body({ name: String, description: String, id_point: String }),
        scopeValidator(Resources.menu, Actions.create)
    ],
    async (req: express.Request, res: express.Response) => {
        try {
            const category = new MenuCategory()
            category.name = req.body.name
            category.id_point = Number(req.body.id_point)
            category.description = req.body.description
            await category.save()
            if (!!req.files?.icon) {
                const file = req.files.icon as UploadedFile
                category.icon = await ObjectStorage.uploadImage(file, category.id) as string
                await category.save()
            }
            res.json(category)
        } catch (e) {
            console.log(e)
            res.status(500).json({
                message: e.message
            })
        }
    }
)

router.patch('/:id',
    [scopeValidator(Resources.menu, Actions.update)],
    async (req: express.Request, res: express.Response) => {
        try {
            const category = await MenuCategory.findOne({ id: Number(req.params.id) })
            category.name = req.body.name || category.name
            category.description = req.body.description || category.description
            if (!!req.files?.icon) {
                const file = req.files.icon as UploadedFile
                category.icon = await ObjectStorage.replaceImage(category.icon, file, category.id) as string
            }
            await category.save()
            res.json(category)
        } catch (e) {
            console.log(e)
            res.status(500).json({
                message: e.message
            })
        }
    }
)

router.delete('/:id',
    [scopeValidator(Resources.menu, Actions.delete)],
    async (req: express.Request, res: express.Response) => {
        try {
            const menu = await Menu.find({ id_category: Number(req.params.id) })
            if (menu.length > 0) {
                res.status(400).json({
                    result: 'error',
                    message: 'Category isn\'t empty'
                })
                return
            }

            const category = await MenuCategory.findOne({ id: Number(req.params.id) })
            await ObjectStorage.deleteImage(category.icon)
            await category.remove()
            res.json({
                result: 'ok'
            })
        } catch (e) {
            console.log(e)
            res.status(500).json({
                message: e.message
            })
        }
    })

export default router;