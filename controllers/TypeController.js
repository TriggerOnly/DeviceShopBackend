import TypeModel from '../models/type.js'

export const create = async (req, res) => {
    try {
        const doc = new TypeModel({
            typeName: req.body.typeName
        })

        const type = await doc.save()

        res.json(type)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось создать бренд'
        })
    }
}

export const getAll = async (req, res) => {
    try {
        const Types = await TypeModel.find({})

        if(!Types) {
            return res.json({
                message: 'Список типов девайсов пуст'
            })
        }

        res.json(Types)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить список типов девайсов'
        })
    }
}

export const remove = async (req, res) => {
    try {
        const typeId = req.params.id

        const Delete = await TypeModel.findOneAndDelete({_id: typeId})

        if(!Delete) {
            return res.status(404).json({
                message: 'Тип не найден'
            })
        }

        res.json({
            message: 'Тип удалён'
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось удалить бренд'
        })
    }
}