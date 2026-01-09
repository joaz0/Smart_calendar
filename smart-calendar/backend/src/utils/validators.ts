import { body, param, query, ValidationChain } from 'express-validator';

export const validateEmail = () =>
  body('email').isEmail().normalizeEmail().withMessage('Email inválido');

export const validatePassword = (minLength = 6) =>
  body('password')
    .isLength({ min: minLength })
    .withMessage(`Senha deve ter no mínimo ${minLength} caracteres`)
    .matches(/[A-Z]/)
    .withMessage('Senha deve conter pelo menos uma letra maiúscula')
    .matches(/[0-9]/)
    .withMessage('Senha deve conter pelo menos um número');

export const validateName = () =>
  body('name').trim().isLength({ min: 2 }).withMessage('Nome deve ter pelo mínimo 2 caracteres');

export const validateId = () => param('id').isInt({ min: 1 }).withMessage('ID inválido');

export const validatePagination = () => [
  query('page').optional().isInt({ min: 1 }).withMessage('Página deve ser um número maior que 0'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limite deve estar entre 1 e 100'),
];

export const validateEventCreation = () => [
  body('title').trim().isLength({ min: 1 }).withMessage('Título é obrigatório'),
  body('description').optional().trim(),
  body('startDate').isISO8601().withMessage('Data de início inválida'),
  body('endDate').isISO8601().withMessage('Data de término inválida'),
  body('categoryId').optional().isInt(),
];

export const validateTaskCreation = () => [
  body('title').trim().isLength({ min: 1 }).withMessage('Título é obrigatório'),
  body('description').optional().trim(),
  body('dueDate').optional().isISO8601().withMessage('Data inválida'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Prioridade inválida'),
  body('status')
    .optional()
    .isIn(['pending', 'in_progress', 'completed'])
    .withMessage('Status inválido'),
];

export const validateUpdateProfile = () => [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Nome deve ter mínimo 2 caracteres'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Email inválido'),
  body('timezone').optional().isString().withMessage('Timezone inválido'),
];
