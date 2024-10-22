import DeviceInfoModel from '../models/deviceInfo.js'

export const create = async (req, res) => {
    try {
        const {title, description} = req.body
        const deviceId = req.params.id

        const existingDevInf = await DeviceInfoModel.findOne({deviceId, title})

        if(existingDevInf) {
            return res.status(400).json({
                message: 'Подобный параметр уже существует'
            })
        }

        const doc = new DeviceInfoModel({
            title,
            description,
            deviceId
        });

        const deviceInfo = await doc.save()

        res.json(
            deviceInfo
        )
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось добавить информацию о девайсе'
        })
    }
}

export const remove = async (req, res) => {
    try {
        const deviceInfoId = req.params.idDeviceInfo

        console.log(req.params.body)
        

        const deleteDevice = DeviceInfoModel.findByIdAndDelete(deviceInfoId)

        if(!deleteDevice) {
            res.status(404).json({
                message: 'Информация не найдена'
            })
        }

        return res.json({
            message: 'Информация удалена' 
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Информация о девайсе не найдена'
        })
    }
}

export const getAllInfoDevice = async (req, res) => {
    try {
        const deviceId = req.params.idDeviceInfo;
        
        const allInfoDevice = await DeviceInfoModel.find({ deviceId });

        if (allInfoDevice.length === 0) {
            return res.status(404).json({
                message: 'Информация не найдена'
            });
        }

        return res.json(allInfoDevice)
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Не удалось загрузить информацию о девайсе'
        });
    }
};
