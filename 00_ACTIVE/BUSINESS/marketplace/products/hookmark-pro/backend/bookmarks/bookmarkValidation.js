const Joi = require('joi');

/**
 * Validation middleware generator
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }

    req.body = value;
    next();
  };
};

/**
 * Create bookmark validation schema
 */
const createBookmarkSchema = Joi.object({
  url: Joi.string()
    .uri()
    .required()
    .messages({
      'string.uri': 'Please provide a valid URL',
      'any.required': 'URL is required'
    }),

  title: Joi.string()
    .max(500)
    .optional()
    .messages({
      'string.max': 'Title must not exceed 500 characters'
    }),

  rating: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .optional()
    .messages({
      'number.min': 'Rating must be between 1 and 5',
      'number.max': 'Rating must be between 1 and 5'
    }),

  category: Joi.string()
    .max(100)
    .optional(),

  tags: Joi.array()
    .items(Joi.string().max(50))
    .max(20)
    .optional()
    .messages({
      'array.max': 'Maximum 20 tags allowed'
    }),

  notes: Joi.string()
    .max(2000)
    .optional()
    .messages({
      'string.max': 'Notes must not exceed 2000 characters'
    })
});

/**
 * Update bookmark validation schema
 */
const updateBookmarkSchema = Joi.object({
  title: Joi.string()
    .max(500)
    .optional(),

  rating: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .optional(),

  category: Joi.string()
    .max(100)
    .optional(),

  tags: Joi.array()
    .items(Joi.string().max(50))
    .max(20)
    .optional(),

  notes: Joi.string()
    .max(2000)
    .optional()
});

module.exports = {
  validate,
  createBookmarkSchema,
  updateBookmarkSchema
};
