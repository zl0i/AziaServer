
import { ICondition } from "../middleware/scopes/basicScope"
import HttpError from "../lib/httpError"
import Additions from "../entity/additions.entity"
import AdditionsCategory from "../entity/additions_category.entity"




export default class AdditionsService {

    static async read(icondition: ICondition) {

    }

    static async create(data: any) {
        const category = await AdditionsCategory.findOne({ id: data.id_additions })
        if (category) {
            const item = new Additions()
            item.name = data.name
            item.cost = data.cost
            item.id_category = category.id
            return await item.save()
        } else {
            throw new HttpError(400, 'Additions Category not found')
        }
    }

    static async update(id: number, data: any) {
        const item = await Additions.findOne({ id })
        item.name = data.name || item.name
        item.cost = data.cost || item.cost
        if (data.id_additions) {
            const category = await AdditionsCategory.findOne({ id: data.id_additions })
            if (category) {
                item.id_category = category.id
            } else {
                throw new HttpError(400, 'a')
            }
        }
        return await item.save()
    }

    static async delete(id: number) {
        const result = await Additions.delete({ id })
        if (result.affected == 0)
            throw new HttpError(400, 'Addition not found')

        return result
    }
}