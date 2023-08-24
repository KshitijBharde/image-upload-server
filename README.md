# Cat Image Upload Server

Welcome to the Cat Image Upload Server repository! This repository hosts a NestJS server that provides APIs to manage and interact with a collection of adorable cat images. You can easily deploy this server using Docker for a hassle-free setup.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Running Locally](#running-locally)
  - [Docker Deployment](#docker-deployment)
- [API Documentation](#api-documentation)
  - [Add a New Cat](#add-a-new-cat)
  - [Add New Images to a Cat](#add-new-images-to-a-cat)
  - [Delete a Cat](#delete-a-cat)
  - [Delete a Cat Image](#delete-a-cat-image)
  - [Update a Cat](#update-a-cat)
  - [Update a Cat Image](#update-a-cat-image)
  - [List Cat Images](#list-cat-images)
  - [List Cats](#list-cats)
  - [Download Cat Image](#download-cat-image)

## Prerequisites

- Node.js (version >= 16.X.X)
- npm (version >= 9.X.X)
- Docker (version >= 24.X.X)
- Docker Compose (version >= 1.29.1)

Before running the server, create a `.env` file in the root directory based on the provided `.env.example` file. This file contains configuration options for the server, including the port to use. Modify the values in the `.env` file to match your preferences.

## Getting Started

### Running Locally

1. Clone this repository:

```bash
git clone https://github.com/KshitijBharde/image-upload-server.git
cd image-upload-server
```

2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
npm run start:dev
```

The server will be accessible at `http://localhost:[SERVER_PORT]`.

### Docker Deployment

2. Run a container with Docker Compose:

```bash
docker-compose -f docker-compose.yml up -d
```

The server will be accessible at `http://localhost:[SERVER_PORT]`.

## API Documentation

### Add a New Cat

Endpoint: `POST /cats/addNewCat`

**Request:**

- Headers:
  - Content-Type: multipart/form-data
- Body:
  - name: string (required)
  - age: number
  - files: array of image files

**Response:**

- Status: 200 OK
- Status: 400 Bad Request (for invalid requests)

### Add New Images to a Cat

Endpoint: `POST /cats/addNewCatImages/:catId`

**Request:**

- Headers:
  - Content-Type: multipart/form-data
- Params:
  - catId: number (required)
- Body:
  - files: array of image files

**Response:**

- Status: 200 OK
- Status: 400 Bad Request (for invalid requests)

### Delete a Cat

Endpoint: `DELETE /cats/deleteCatById/:catId`

**Request:**

- Params:
  - catId: number (required)

**Response:**

- Status: 200 OK
- Status: 400 Bad Request (for invalid requests)

### Delete a Cat Image

Endpoint: `DELETE /cats/deleteCatImageById/:catImageId`

**Request:**

- Params:
  - catImageId: number (required)

**Response:**

- Status: 200 OK
- Status: 400 Bad Request (for invalid requests)

### Update a Cat

Endpoint: `PUT /cats/updateCat`

**Request:**

- Body:
  - id: number (required)
  - name: string
  - age: number

**Response:**

- Status: 200 OK
- Status: 400 Bad Request (for invalid requests)

### Update a Cat Image

Endpoint: `PUT /cats/updateCatImageById/:catImageId`

**Request:**

- Headers:
  - Content-Type: multipart/form-data
- Params:
  - catImageId: number (required)
- Body:
  - file: image file

**Response:**

- Status: 200 OK
- Status: 400 Bad Request (for invalid requests)

### List Cat Images

Endpoint: `GET /cats/listCatImages`

**Request:**

- Params:
  - limit: number (optional)
  - offset: number (optional)

**Response:**

- Status: 200 OK
- Status: 400 Bad Request (for invalid requests)

### List Cats

Endpoint: `GET /cats/listCats`

**Request:**

- Params:
  - limit: number (optional)
  - offset: number (optional)

**Response:**

- Status: 200 OK
- Status: 400 Bad Request (for invalid requests)

### Download Cat Image

Endpoint: `GET /cats/downloadCatImageById/:catImageId`

**Request:**

- Params:
  - catImageId: number (required)

**Response:**

- Image download response
