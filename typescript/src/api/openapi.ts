/**
 * OpenAPI 3.0 specification for the Time Deposits API.
 */
export const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Time Deposits API',
    version: '1.0.0',
    description: 'API for managing time deposit accounts and updating balances.',
  },
  paths: {
    '/time-deposits': {
      get: {
        summary: 'List all time deposits',
        description: 'Returns all time deposit accounts with their balances and withdrawals.',
        operationId: 'getTimeDeposits',
        tags: ['Time Deposits'],
        responses: {
          '200': {
            description: 'List of time deposits',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/TimeDeposit' },
                },
              },
            },
          },
        },
      },
    },
    '/time-deposits/update-balances': {
      post: {
        summary: 'Update all deposit balances',
        description:
          'Retrieves all deposits, applies interest (via calculator), and persists updated balances. No request body.',
        operationId: 'updateTimeDepositBalances',
        tags: ['Time Deposits'],
        responses: {
          '204': {
            description: 'Balances updated successfully. No content returned.',
          },
        },
      },
    },
  },
  components: {
    schemas: {
      TimeDeposit: {
        type: 'object',
        required: ['id', 'planType', 'balance', 'days', 'withdrawals'],
        properties: {
          id: { type: 'integer', example: 1 },
          planType: {
            type: 'string',
            enum: ['basic', 'student', 'premium'],
            example: 'basic',
          },
          balance: { type: 'number', example: 1000.5 },
          days: { type: 'integer', example: 45 },
          withdrawals: {
            type: 'array',
            items: { $ref: '#/components/schemas/Withdrawal' },
          },
        },
      },
      Withdrawal: {
        type: 'object',
        required: ['id', 'timeDepositId', 'amount', 'date'],
        properties: {
          id: { type: 'integer', example: 1 },
          timeDepositId: { type: 'integer', example: 1 },
          amount: { type: 'number', example: 100 },
          date: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
} as const
