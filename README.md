# CDKNote

CDKNote is a serverless CRUD Notes API built using AWS CDK in TypeScript. It uses AWS Lambda for business logic, API Gateway for routing, and DynamoDB as a NoSQL backend.

## 🛠️ Tech Stack

- **AWS CDK (TypeScript)** – Infrastructure as Code
- **AWS Lambda** – Serverless compute for CRUD operations
- **Amazon API Gateway** – RESTful API endpoint management
- **Amazon DynamoDB** – Scalable NoSQL database
- **TypeScript** – Language for both infrastructure and function code

## 🚀 Features

- Create a new note
- Read a single note or list all notes
- Update an existing note
- Delete a note


## 🧪 Example Endpoints

- `POST /notes` – Create a note
- `GET /notes` – List all notes
- `GET /notes/{id}` – Get a note by ID
- `PUT /notes/{id}` – Update a note
- `DELETE /notes/{id}` – Delete a note

## 🛠️ Deployment

To deploy the project:

```bash
# Install dependencies
pnpm install

# Bootstrap your environment (only once)
cdk bootstrap

# Deploy the stack
cdk deploy