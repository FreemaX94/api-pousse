const request = require('supertest');
const express = require('express');
const path = require('path');
const fs = require('fs');
const upload = require('../../../backend/middlewares/upload');

const app = express();
app.post('/upload', upload.single('file'), (req, res) => {
  res.status(200).json({ filename: req.file.filename });
});

describe('Middleware - upload', () => {

  it('devrait accepter un fichier image/jpeg', async () => {
    const res = await request(app)
      .post('/upload')
      .attach('file', Buffer.from('imagecontent'), {
        filename: 'photo.jpg',
        contentType: 'image/jpeg'
      });

    expect(res.status).toBe(200);
    expect(res.body.filename).toMatch(/photo_\d+\.jpg/);
  });

  it('devrait accepter un fichier PDF', async () => {
    const res = await request(app)
      .post('/upload')
      .attach('file', Buffer.from('%PDF-1.4'), {
        filename: 'document.pdf',
        contentType: 'application/pdf'
      });

    expect(res.status).toBe(200);
    expect(res.body.filename).toMatch(/document_\d+\.pdf/);
  });

  it('devrait rejeter un fichier non autorisé', async () => {
    const res = await request(app)
      .post('/upload')
      .attach('file', Buffer.from('plain text'), {
        filename: 'note.txt',
        contentType: 'text/plain'
      });

    expect(res.status).toBe(415);
  });
});
