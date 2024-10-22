import BasketModel from '../models/basket.js'

export default async (req, res, next) => {
    try {
        const { basketId } = req.params; 

        const basket = await BasketModel.findById(basketId);

        if (!basket) {
            return res.status(404).json({
                message: "Корзина не найдена"
            });
        }

        req.basket = basket;
        next();
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Ошибка при проверке корзины"
        });
    }
};
