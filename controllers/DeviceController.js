import DeviceModel from '../models/device.js'
 
export const create = async (req, res) => {
    try {
        let imageUrlArray = [];
        if (typeof req.body.imageUrl === 'string') {
            imageUrlArray = req.body.imageUrl.split(',');
        } else if (Array.isArray(req.body.imageUrl)) {
            imageUrlArray = req.body.imageUrl;
        }

        const doc = new DeviceModel({
            title: req.body.title,
            price: req.body.price,
            text: req.body.text,
            imageUrl: imageUrlArray,
            typeId: req.body.typeId,
            brandId: req.body.brandId  
        }) 
        
        const device = await doc.save()

        res.json(
            device
        )
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось добавить девайс'
        })
    }
}

export const remove = async (req, res) => {
    try {
        const deviceId = req.params.deviceId

        const deleteDevice = DeviceModel.findByIdAndDelete({_id: deviceId})

        if (!deleteDevice) {
            res.status(404).json({
                message: 'Девайс не найден'
            })
        }

        res.json({
            message: 'Девайс удалён'
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось удалить девайс' 
        })
    }
}

export const getAll = async (req, res) => {
    try {
        const devices = await DeviceModel.find({})

        res.json(
            devices
        )
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Девайсы не найдены'
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const devicesId = req.params.id

        console.log(devicesId);
        

        const device = await DeviceModel.findOneAndUpdate(
            {_id: devicesId},
            {returnDocument: 'after'}
        )

        res.json(
            device
        )
    } catch (err) {
        console.log(err)
        req.status.json({
            message: 'Девайс не найден'
        })
    }
}

