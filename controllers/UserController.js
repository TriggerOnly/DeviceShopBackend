import UserModel from '../models/user.js'
import jwt from 'jsonwebtoken'

export const auth = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId)
        
        if(!user) {
            return res.status(403).json({
                message: 'Пользователь не найден'
            })
        }

        const userData = user._doc

        res.json(userData)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Ошибка регистрации' 
        })
    }
}

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });

        if (!user) {
            return res.status(403).json({
                message: 'Не удалось войти'
            });
        }

        const { password: _, ...userData } = user._doc;

        const token = jwt.sign(
            { _id: user._id },
            'secrettoken', 
            { expiresIn: '7d' }
        );

        res.json({ ...userData, token });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось войти'
        });
    }
};


export const register = async (req, res) => {
    try {
        const { email, password, fullName } = req.body;

        const emailInBD = await UserModel.findOne({ email });

        if (emailInBD) {
            return res.status(400).json({
                message: 'Данная почта уже зарегистрирована'
            });
        }

        const doc = new UserModel({
            email,
            password, 
            fullName
        });

        const user = await doc.save();

        const token = jwt.sign(
            { _id: user._id },
            'secrettoken',  
            { expiresIn: '7d' }
        );

        const { password: _, ...userData } = user._doc;

        res.json({
            ...userData,
            token
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось зарегистрироваться'
        });
    }
};