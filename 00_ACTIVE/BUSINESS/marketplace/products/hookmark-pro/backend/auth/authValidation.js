const Joi = require('joi');

/**
 * Validation middleware generator
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Return all errors
      stripUnknown: true // Remove unknown fields
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

    // Replace req.body with validated value
    req.body = value;
    next();
  };
};

/**
 * Signup validation schema
 */
const signupSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),

  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.max': 'Password must not exceed 128 characters',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      'any.required': 'Password is required'
    }),

  firstName: Joi.string()
    .min(1)
    .max(100)
    .optional()
    .messages({
      'string.max': 'First name must not exceed 100 characters'
    }),

  lastName: Joi.string()
    .min(1)
    .max(100)
    .optional()
    .messages({
      'string.max': 'Last name must not exceed 100 characters'
    })
});

/**
 * Login validation schema
 */
const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),

  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required'
    })
});

/**
 * Google login validation schema
 */
const googleLoginSchema = Joi.object({
  googleId: Joi.string()
    .required()
    .messages({
      'any.required': 'Google ID is required'
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),

  firstName: Joi.string()
    .max(100)
    .optional(),

  lastName: Joi.string()
    .max(100)
    .optional()
});

module.exports = {
  validate,
  signupSchema,
  loginSchema,
  googleLoginSchema
};
