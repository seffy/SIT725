const request = require('supertest');
const mongoose = require('mongoose');
const { app, server } = require('../server');
const Message = require('../models/Message');

const mongooseUri = process.env.NODE_ENV === 'test' ? 'mongodb+srv://admin:admin13@cluster0.y0r9q.mongodb.net/mymind-test?retryWrites=true&w=majority' : 'mongodb+srv://admin:admin13@cluster0.y0r9q.mongodb.net/mymind?retryWrites=true&w=majority';

beforeAll(async () => {
    await mongoose.connect(mongooseUri);
});

afterAll(async () => {
    await mongoose.connection.close();
    server.close();
});

beforeEach(async () => {
    await Message.deleteMany({});
});

describe('GET /messages', () => {
    it('should return an empty list of messages', async () => {
        const response = await request(app).get('/messages');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    it('should return a list of messages', async () => {
        const messages = [
            { text: 'Hello world!' },
            { text: 'This is a test message.' },
        ];
        await Message.insertMany(messages);

        const response = await request(app).get('/messages');
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2);
        expect(response.body[0].text).toBe('Hello world!');
        expect(response.body[1].text).toBe('This is a test message.');
    });
});

describe('POST /messages', () => {
    it('should create a new message', async () => {
        const newMessage = { text: 'This is a test message' };
        const response = await request(app)
            .post('/messages')
            .send(newMessage)
            .set('Accept', 'application/json');

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch(/json/); // Correct way to check Content-Type
        expect(response.body).toHaveProperty('_id');
        expect(response.body.text).toBe(newMessage.text);

        const savedMessage = await Message.findById(response.body._id);
        expect(savedMessage).not.toBeNull();
        expect(savedMessage.text).toBe(newMessage.text);
    });

    it('should return an error for missing text', async () => {
        const response = await request(app)
            .post('/messages')
            .send({})
            .set('Accept', 'application/json');

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error');
    });
});

describe('DELETE /messages/:id', () => {
    it('should delete a message', async () => {
        const newMessage = await Message.create({ text: 'Delete me' });

        await request(app).delete(`/messages/${newMessage._id}`).expect(200);

        const deletedMessage = await Message.findById(newMessage._id);
        expect(deletedMessage).toBeNull();
    });

    it('should return an error for invalid message id', async () => {
        const response = await request(app).delete('/messages/invalid-id');
        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error');
    });
});