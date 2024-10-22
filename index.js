import mongoose from 'mongoose'
import express from 'express'
import * as BrandController from './controllers/BrandController.js'
import * as TypeController from './controllers/TypeController.js'
import * as DeviceInfoController from './controllers/DeviceInfoController.js'
import * as DeviceController from './controllers/DeviceController.js' 
import * as UserController from './controllers/UserController.js'
import * as BasketController from './controllers/BasketController.js'
import { registerValidation, loginValidation } from './validations/AuthValidation.js'
import CheckAuth from './utils/CheckAuth.js'
import CheckBasket from './utils/CheckBasket.js'
import cors from 'cors'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = 4000;

mongoose
    .connect('mongodb+srv://Trigger:TheTrigger1911@deviceshop.dagt7.mongodb.net/')
    .then(() => console.log('Connected'))
    .catch((err) => console.log("Error with database", err));

const app = express();
app.use(express.json());
app.use(cors({
    origin: '*'
}));
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));

dotenv.config();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname); // получаем расширение файла
        cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension); // сохраняем имя с расширением
    }
});

const uploads = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, 
});

//user
app.post('/register', registerValidation, UserController.register);
app.post("/login", loginValidation, UserController.login);
app.get('/login/me', CheckAuth, UserController.auth);

//device
app.get('/device', DeviceController.getAll);
app.get('/device/:id', DeviceController.getOne);
app.post('/device', CheckAuth, DeviceController.create);
app.delete('/device/:id', CheckAuth, DeviceController.remove);

//deviceInfo
app.get('/deviceInfo/:idDeviceInfo', DeviceInfoController.getAllInfoDevice);
app.post('/deviceInfo/:id', DeviceInfoController.create);
app.delete('/deviceInfo/:id/:idDeviceInfo', DeviceInfoController.remove);

//basket
app.get('/basket', CheckAuth, BasketController.getBasket)
app.post('/basket', BasketController.createBasket);
app.get('/basketDevices', /* CheckBasket, */ CheckAuth, BasketController.getDevicesInBasket)
app.post('/addDeviceToBasket/:id', /* CheckBasket, */ CheckAuth, BasketController.addDeviceToBasket);
app.delete('/deleteDeviceFromBasket/:id', /* CheckBasket, */ CheckAuth, BasketController.removeDeviceFromBasket);

//Brand 
app.post('/brand', BrandController.create);
app.get('/brands/All', BrandController.getAll);
app.delete("/brand/:id", BrandController.remove);

//Type
app.post('/type', TypeController.create);
app.get('/types/All', TypeController.getAll); 
app.delete("/type/:id", TypeController.remove);

app.post('/uploads', uploads.single('file'), (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).send('Файл не загружен');
        }

        res.json({ fileName: file.filename });
    } catch (error) {
        res.status(500).send('Ошибка при загрузке файла');
    }
});

app.listen( 
    PORT, (err) => { 
        console.log('Server started');
        if (err) {
            console.log(err);
        }
    }
);
