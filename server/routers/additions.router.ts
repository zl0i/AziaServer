import express from 'express';
import allow from '../middleware/permissionVaildator'
import { body } from '../middleware/schemaChecker';
import { cache } from '../middleware/cacheMiddleware';
import DataProvider from '../lib/DataProvider';
import { Resources, Actions } from '../lib/permissionsBuilder';
import AdditionsService from '../services/additions.service';
import HttpErrorHandler from '../lib/httpErrorHandler';

const router = express.Router();

router.get('/',
    [
        cache(180)
    ],
    async (req: express.Request, res: express.Response) => {
        try {
            const provider = new DataProvider('Additions')
            res.json(await provider.index(req))
        } catch (error) {
            HttpErrorHandler.handle(error, res)
        }
    });

router.post('/',
    [
        body({ name: String, cost: Number, id_additions: Number }),
        allow(Resources.menu, Actions.create)
    ],
    async (req: express.Request, res: express.Response) => {
        try {
            const item = await AdditionsService.create(req.body)
            res.json(item)
        } catch (error) {
            HttpErrorHandler.handle(error, res)
        }
    })

router.patch('/:id',
    [
        allow(Resources.menu, Actions.update)
    ],
    async (req: express.Request, res: express.Response) => {
        try {
            const item = await AdditionsService.update(Number(req.params.id), req.body)
            res.json(item)
        } catch (error) {
            HttpErrorHandler.handle(error, res)
        }
    })

router.delete('/:id',
    [
        allow(Resources.menu, Actions.delete)
    ],
    async (req: express.Request, res: express.Response) => {
        try {
            await AdditionsService.delete(Number(req.params.id))
            res.json({
                result: 'ok'
            })
        } catch (error) {
            HttpErrorHandler.handle(error, res)
        }
    })

export default router;