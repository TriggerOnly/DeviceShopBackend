import jwt from 'jsonwebtoken';
import BasketModel from '../models/basket.js';
import BasketDeviceModel from '../models/basketDevice.js';
import basketDevice from '../models/basketDevice.js';
import DeviceModel from '../models/device.js'

const getUserIdFromToken = (req) => {
    const token = req.headers.authorization.split(' ')[1]; 
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    //console.log(decoded._id);
    
    return decoded._id;
};

export const getBasket = async (req, res) => {
    try {
        const userId = getUserIdFromToken(req)

        const basket = await BasketModel.findOne({ user: userId });

        if(!basket) {
            return res.status(400).json({
                message: "Корзина не найдена"
            })
        }

        return res.json({
            basket
        })
    } catch (err) {
        console.log(err);
        return res.status(403).json({
            message: 'Не удалось загрузить корзину'
        })
    }
}

export const createBasket = async (req, res) => {
    try {
        const userId = getUserIdFromToken(req); 
        
        const basketInBD = await BasketModel.findOne({ user: userId });

        if (basketInBD) {
            return res.status(400).json({
                message: 'У пользователя уже есть созданная корзина'
            });
        }

        const basket = new BasketModel({ user: userId });

        const basketSave = await basket.save();

        return res.json({
            basket: basketSave, 
            message: 'Корзина успешно создана'
        }); 
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Не удалось создать корзину'
        });
    }
};

export const addDeviceToBasket = async (req, res) => {
    try {
        const userId = getUserIdFromToken(req);
        const device = req.params.id;

        if (!device) {
            return res.status(400).json({ message: 'Убедитесь, что device передан корректно.' });
        }

        const basket = await BasketModel.findOne({ user: userId });

        if (!basket) {
            return res.status(404).json({ message: 'Корзина не найдена.' });
        }

        const existingDevice = await BasketDeviceModel.findOne({ basket: basket._id, device: device });

        if (existingDevice) {
            existingDevice.count += 1;
            await existingDevice.save();
            return res.json({ message: 'Количество устройства в корзине увеличено', device: existingDevice });
        } else {
            const newDevice = new BasketDeviceModel({
                basket: basket._id,
                device: device,
                count: 1
            });

            const newDeviceSaved = await newDevice.save();

            return res.json({ message: 'Устройство добавлено в корзину', device: newDeviceSaved });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось добавить девайс в корзину'
        });
    }
};

export const getDevicesInBasket = async (req, res) => {
    try {
        const userId = getUserIdFromToken(req);

        const basket = await BasketModel.findOne({ user: userId });

        if (!basket) {
            return res.status(404).json({ message: 'Корзина не найдена.' });
        }

        const devicesInBasket = await BasketDeviceModel.find({ basket: basket._id });

        if (!devicesInBasket.length) {
            return res.status(404).json({ message: 'В корзине нет устройств.' });
        }

        const deviceIds = devicesInBasket.map(device => device.device);

        const devices = await DeviceModel.find({ _id: { $in: deviceIds } });
        
        return res.status(200).json({
            devices: devices,
            devicesInBasket: devicesInBasket
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Не удалось загрузить корзину с девайсами."
        });
    }
}

export const removeDeviceFromBasket = async (req, res) => {
    try {
        const userId = getUserIdFromToken(req);
        const deviceId = req.params.id;

        if (!deviceId) {
            return res.status(400).json({ message: 'Убедитесь, что device передан корректно.' });
        }

        const basket = await BasketModel.findOne({ user: userId });

        if (!basket) {
            return res.status(404).json({ message: 'Корзина не найдена.' });
        }

        const existingDevice = await BasketDeviceModel.findOne({ basket: basket._id, device: deviceId });

        if (existingDevice) {
            existingDevice.count -= 1;
            await existingDevice.save();
            return res.json({ message: 'Количество устройства в корзине уменьшено', device: existingDevice });
        } else {
            const deviceDelete = BasketDeviceModel.findOneAndDelete({device: device})

            return res.json({ 
                message: 'Устройство добавлено в корзину',
                deviceDelete
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось удалить девайс из корзины'
        });
    }
};
