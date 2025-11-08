import * as Joi from '@hapi/joi';

interface EnvVars {
  NODE_ENV: 'development' | 'production' | 'test';
  APP_PORT: number;
  APP_HOST: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
}

export const envValidationSchema = Joi.object({
  // Server Configuration
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  APP_PORT: Joi.number().default(3000),
  APP_HOST: Joi.string().default('localhost'),

  // Database Configuration
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),

  // JWT Configuration (if needed)
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().required(),
});

export const validateEnv = (config: Record<string, unknown>): EnvVars => {
  const { error, value } = envValidationSchema.validate(config, {
    allowUnknown: true,
    stripUnknown: true,
    convert: true,
  }) as { error: Joi.ValidationError | undefined; value: EnvVars };

  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }

  return value;
};
