import {body} from 'express-validator';
export const registerValidation = [
    body('email', 'Не верный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум из 6-ти символов').isLength({min: 6}),
    body('fullName', 'Укажите имя').isLength({min: 3}),
    body('avatarUrl', 'Укажите ссылку на аватарку').optional().isURL()
]