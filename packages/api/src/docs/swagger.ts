import suaggerJDocs, {
  type OAS3Definition,
  type OAS3Options
} from 'swagger-jsdoc'

const { API_HOST, PORT } = process.env

const host = API_HOST || 'localhost'
const port = PORT || '3001'

const swaggerDefinition: OAS3Definition = {
  openapi: '3.0.1',
  info: {
    title: 'SGCv2 Api',
    information: 'Api for Management and Control System version 2',
    version: '1.0.0'
  },
  servers: [{ url: `http://${host}:${port}/docs` }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer' }
    }
  }
}

const swaggerOptions: OAS3Options = {
  swaggerDefinition,
  apis: ['../**/*.routes.*']
}

export default suaggerJDocs(swaggerOptions)
