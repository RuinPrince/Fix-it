// ============================================
// Fix It — Swagger/OpenAPI Configuration
// ============================================
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Fix It — Smart Civic Issue Reporting API',
      version: '1.0.0',
      description: `
## Overview
Fix It is a production-ready Smart Civic Issue Reporting & Resolution Platform 
that enables citizens to report civic issues and track their resolution.

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
\`\`\`
Authorization: Bearer <your-jwt-token>
\`\`\`

## Rate Limiting
API requests are rate-limited to 100 requests per 15 minutes per IP address.

## Response Format
All responses follow a consistent format:
\`\`\`json
{
  "success": true/false,
  "message": "Description",
  "data": { ... },
  "timestamp": "ISO 8601"
}
\`\`\`
      `,
      contact: {
        name: 'Fix It Support',
        email: 'support@fixit.gov.in',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      { url: 'http://localhost:5000', description: 'Development' },
      { url: 'https://api.fixit.gov.in', description: 'Production' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Auth', description: 'Authentication & user management' },
      { name: 'Complaints', description: 'Complaint CRUD operations' },
      { name: 'Departments', description: 'Department management' },
      { name: 'Wards', description: 'Ward management' },
      { name: 'Categories', description: 'Complaint categories' },
      { name: 'Chat', description: 'In-app chat system' },
      { name: 'Notifications', description: 'Push & in-app notifications' },
      { name: 'Analytics', description: 'Dashboard analytics & reports' },
      { name: 'Feedback', description: 'Citizen feedback system' },
      { name: 'AI', description: 'AI-powered features' },
      { name: 'Audit', description: 'Audit logging' },
      { name: 'Admin', description: 'Admin operations' },
    ],
  },
  apis: ['./src/routes/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
