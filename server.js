#!/usr/bin/env node

/**
 * JSON API Mock Server
 * A simple, fast mock API server for development and testing
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

class MockAPIServer {
    constructor(port = 3000, dataFile = 'mock-data.json') {
        this.port = port;
        this.dataFile = dataFile;
        this.data = this.loadData();
        this.routes = new Map();
        this.setupRoutes();
    }

    loadData() {
        try {
            if (fs.existsSync(this.dataFile)) {
                const content = fs.readFileSync(this.dataFile, 'utf8');
                return JSON.parse(content);
            }
        } catch (error) {
            console.warn(`Warning: Could not load ${this.dataFile}, using defaults`);
        }
        
        // Default mock data
        return {
            users: [
                { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'admin' },
                { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'user' },
                { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'user' }
            ],
            posts: [
                { id: 1, userId: 1, title: 'First Post', content: 'Hello World!', likes: 42 },
                { id: 2, userId: 2, title: 'Second Post', content: 'Mock APIs are great!', likes: 15 }
            ],
            products: [
                { id: 1, name: 'Laptop', price: 999.99, stock: 50 },
                { id: 2, name: 'Mouse', price: 29.99, stock: 200 },
                { id: 3, name: 'Keyboard', price: 79.99, stock: 100 }
            ]
        };
    }

    setupRoutes() {
        // GET all items from a collection
        this.routes.set('GET', (url, res) => {
            const collection = url.split('/')[1];
            if (this.data[collection]) {
                this.sendJSON(res, 200, this.data[collection]);
            } else {
                this.sendJSON(res, 404, { error: 'Collection not found' });
            }
        });

        // POST new item to collection
        this.routes.set('POST', (url, res, body) => {
            const collection = url.split('/')[1];
            if (this.data[collection]) {
                const newItem = { id: Date.now(), ...body };
                this.data[collection].push(newItem);
                this.saveData();
                this.sendJSON(res, 201, newItem);
            } else {
                this.sendJSON(res, 404, { error: 'Collection not found' });
            }
        });

        // PUT/PATCH update item
        this.routes.set('PUT', (url, res, body) => {
            const parts = url.split('/');
            const collection = parts[1];
            const id = parseInt(parts[2]);
            
            if (this.data[collection]) {
                const index = this.data[collection].findIndex(item => item.id === id);
                if (index !== -1) {
                    this.data[collection][index] = { ...this.data[collection][index], ...body };
                    this.saveData();
                    this.sendJSON(res, 200, this.data[collection][index]);
                } else {
                    this.sendJSON(res, 404, { error: 'Item not found' });
                }
            } else {
                this.sendJSON(res, 404, { error: 'Collection not found' });
            }
        });

        // DELETE item
        this.routes.set('DELETE', (url, res) => {
            const parts = url.split('/');
            const collection = parts[1];
            const id = parseInt(parts[2]);
            
            if (this.data[collection]) {
                const index = this.data[collection].findIndex(item => item.id === id);
                if (index !== -1) {
                    this.data[collection].splice(index, 1);
                    this.saveData();
                    this.sendJSON(res, 204, null);
                } else {
                    this.sendJSON(res, 404, { error: 'Item not found' });
                }
            } else {
                this.sendJSON(res, 404, { error: 'Collection not found' });
            }
        });
    }

    saveData() {
        try {
            fs.writeFileSync(this.dataFile, JSON.stringify(this.data, null, 2));
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }

    sendJSON(res, status, data) {
        res.writeHead(status, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        if (data !== null) {
            res.end(JSON.stringify(data, null, 2));
        } else {
            res.end();
        }
    }

    handleRequest(req, res) {
        const { method, url } = req;
        
        console.log(`${new Date().toISOString()} - ${method} ${url}`);

        // Handle CORS preflight
        if (method === 'OPTIONS') {
            this.sendJSON(res, 200, null);
            return;
        }

        // Handle root route
        if (url === '/') {
            this.sendJSON(res, 200, {
                message: 'JSON API Mock Server',
                available_collections: Object.keys(this.data),
                endpoints: {
                    'GET /collection': 'Get all items',
                    'GET /collection/:id': 'Get single item',
                    'POST /collection': 'Create item',
                    'PUT /collection/:id': 'Update item',
                    'DELETE /collection/:id': 'Delete item'
                }
            });
            return;
        }

        // Collect request body for POST/PUT
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const parsedBody = body ? JSON.parse(body) : {};
                const handler = this.routes.get(method) || this.routes.get('GET');
                handler(url, res, parsedBody);
            } catch (error) {
                this.sendJSON(res, 400, { error: 'Invalid JSON' });
            }
        });
    }

    start() {
        const server = http.createServer((req, res) => this.handleRequest(req, res));
        
        server.listen(this.port, () => {
            console.log(`\n🚀 JSON API Mock Server running!`);
            console.log(`📍 Server: http://localhost:${this.port}`);
            console.log(`📁 Data file: ${this.dataFile}`);
            console.log(`\n📚 Available collections:`);
            Object.keys(this.data).forEach(collection => {
                console.log(`   - http://localhost:${this.port}/${collection}`);
            });
            console.log(`\n Press Ctrl+C to stop\n`);
        });
    }
}

// CLI
const args = process.argv.slice(2);
const port = args[0] ? parseInt(args[0]) : 3000;
const dataFile = args[1] || 'mock-data.json';

const server = new MockAPIServer(port, dataFile);
server.start();
