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
  apis: ['../**/*.routes.yaml']
}

export default suaggerJDocs(swaggerOptions)

export const swaggerOptionsCss = {
  customCssUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui.css',
  customCss: `
    /* --- General Styles --- */
    body {
      background-color: #0a2729 !important; 
      color: #f0f0f0 !important; 
    }

    a { 
      color: #8c8cfa !important; 
    }

    h1, h2, h3, h4, h5, h6 {
      color: #4d4dfa !important;
    }

    /* --- Top Bar & Scheme --- */
    .swagger-ui .topbar {
      background-color: #0a2729 !important;
      color: #f0f0f0 !important;
    }
    
    .scheme-container {
      background-color: #134b4f !important;
      color: #f0f0f0 !important;
    }

    /* --- Modals / Dialogs --- */
    .swagger-ui .dialog-ux .modal-ux {
      background-color: #0a2729 !important; 
    }

    /* --- Operation Blocks (Paths) --- */
    .opblock-summary-description, 
    .opblock-description-wrapper,
    .opblock-description-wrapper p,
    .response-col_status, 
    .response-col_links,
    .tablinks {
      color: #dedce8 !important;
    }

    .opblock-body {
      color: #b9bcd7 !important;
    }

    /* --- Models / Schemas --- */
    .model-box {
      background-color: #0a2729;
      color: #f0f0f0 !important;
    }

    .swagger-ui .model {
      color: #e2d6d6 !important;
    }
      
    .model-title,
    .model-toggle:after {
      color: #b9bcd7 !important;
    }
  `
}
