const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Post = require('../models/Post');

const app = express();
app.use(express.json());

const postRouter = require('./post');
app.use('/api/posts', postRouter);

describe('GET /:id', () => {

    it('should return the correct post when given a valid ID', async () => {
        const mockPost = { _id: '123', title: 'Test Post', content: 'Test Content' };
        jest.spyOn(Post, 'findById').mockResolvedValue(mockPost);

        const req = { params: { id: '123' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await postRouter.get["/:id"](req, res);

        expect(Post.findById).toHaveBeenCalledWith('123');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockPost);

    it('should handle and return a 500 status for database connection errors', async () => {
        const mockError = new Error('Database connection error');
        jest.spyOn(Post, 'findById').mockRejectedValue(mockError);

        const req = { params: { id: '123' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await postRouter.get["/:id"](req, res);

        expect(Post.findById).toHaveBeenCalledWith('123');
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(mockError);
    });
});
});
