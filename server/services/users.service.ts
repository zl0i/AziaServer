import { Users } from "../entity/user.entity"
import { user_permissions } from "../entity/user_permissions.entity"
import PermissionsBuilder, { UserRoles } from "../lib/permissionsBuilder"
import bcrypt from 'bcryptjs'
import { ICondition } from "../middleware/scopes/basicScope"
import { In } from "typeorm"
import HttpError from "../lib/httpError"


export default class UserService {

    static async read(icondition: ICondition) {
        const condition: object = {}
        if (icondition.value.length > 0) {
            condition[icondition.key] = In(icondition.value)
        }

        const users: any = await Users.find(condition)
        for (const user of users) {
            const permissions = await user_permissions.find({ id_user: user.id })
            user.permissions = new Array()
            user.removePrivateData()
            for (const perm of permissions) {
                user.permissions.push(`${perm.resource}:${perm.action}:${perm.scope}`)
            }
        }
        return users;
    }

    static async create(login: string, password: string) {
        const user = new Users()
        user.login = login
        user.password = bcrypt.hashSync(password, 5)
        await user.save()
        PermissionsBuilder.setUserRolePermissions(user.id, UserRoles.admin)
        return user
    }

    static async update(id: number, data: object) {
        const user = await Users.findOne({ id: id })
        user.name = data['name'] || user.name
        user.lastname = data['lastname'] || user.lastname
        user.login = data['login'] || user.login
        user.age = Number(data['age']) || user.age
        user.birthday = new Date(data['birthday']) || user.birthday
        await user.save()
        return user.removePrivateData()
    }

    static async delete(id: number) {
        const result = await Users.delete({ id })
        if (result.affected == 0)
            throw new HttpError(400, 'User not found')

        return result
    }
}