import BrandModel from '../models/brand.js'

export const create = async (req, res) => {
    try {
        const doc = new BrandModel({
            brandName: req.body.brandName
        })

        const brand = await doc.save()

        res.json(brand)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось создать бренд'
        })
    }
}

export const getAll = async (req, res) => {
    try {
        const brands = await BrandModel.find({});

        if (brands.length === 0) {
            return res.status(404).json({
                message: 'Бренды не найдены'
            });
        }

        res.json(brands);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить все бренды'
        });
    }
}


export const remove = async (req, res) => {
    try {
        const brandId = req.params.id

        const Delete = await BrandModel.findOneAndDelete({_id: brandId})

        if(!Delete) {
            return res.status(404).json({
                message: 'Бренд не найден'
            })
        }

        res.json({
            message: 'Бренд удалён'
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось удалить бренд'
        })
    }
}