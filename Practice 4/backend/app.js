const express = require('express');
const { nanoid } = require('nanoid');
const cors = require('cors');

// Swagger
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3001' }));

// Начальные данные
let games = [
    { id: nanoid(6), name: 'The Witcher 3: Wild Hunt', category: 'RPG', description: 'Эпическая ролевая игра', price: 1999, stock: 25, rating: 4.9, platform: 'PC, PS5, Xbox' },
    { id: nanoid(6), name: 'Cyberpunk 2077', category: 'Action RPG', description: 'Открытый мир в стиле киберпанк', price: 2499, stock: 30, rating: 4.5, platform: 'PC, PS5' },
    { id: nanoid(6), name: 'Red Dead Redemption 2', category: 'Action Adventure', description: 'Шедевральный вестерн', price: 2999, stock: 15, rating: 5.0, platform: 'PC, Xbox' },
    { id: nanoid(6), name: 'Minecraft', category: 'Sandbox', description: 'Культовая игра про строительство', price: 1499, stock: 50, rating: 4.8, platform: 'PC, Mobile, Console' },
    { id: nanoid(6), name: 'God of War Ragnarök', category: 'Action', description: 'Приключения Кратоса', price: 3499, stock: 10, rating: 5.0, platform: 'PS5' },
    { id: nanoid(6), name: 'Elden Ring', category: 'Souls-like', description: 'Сложная RPG от создателей Dark Souls', price: 2799, stock: 20, rating: 4.9, platform: 'PC, PS5, Xbox' },
    { id: nanoid(6), name: 'FIFA 24', category: 'Sports', description: 'Футбольный симулятор', price: 1999, stock: 40, rating: 4.2, platform: 'PC, Console' },
    { id: nanoid(6), name: 'Starfield', category: 'RPG', description: 'Космическая RPG', price: 3299, stock: 12, rating: 4.6, platform: 'PC, Xbox' },
    { id: nanoid(6), name: 'Hogwarts Legacy', category: 'Action RPG', description: 'Игра во вселенной Гарри Поттера', price: 2999, stock: 18, rating: 4.8, platform: 'PC, PS5, Xbox' },
    { id: nanoid(6), name: 'Counter-Strike 2', category: 'Shooter', description: 'Тактический шутер', price: 0, stock: 1000, rating: 4.7, platform: 'PC' },
    { id: nanoid(6), name: 'Diablo IV', category: 'Action RPG', description: 'Мрачная RPG с лутом', price: 2799, stock: 22, rating: 4.4, platform: 'PC, Console' },
    { id: nanoid(6), name: 'Baldur\'s Gate 3', category: 'RPG', description: 'RPG по мотивам D&D', price: 3199, stock: 14, rating: 5.0, platform: 'PC, PS5' }
];

// Swagger конфигурация
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Game Store API',
            version: '1.0.0',
            description: 'API для управления магазином игр'
        },
        servers: [
            { url: `http://localhost:${port}`, description: 'Локальный сервер' }
        ]
    },
    apis: ['./app.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * components:
 *   schemas:
 *     Game:
 *       type: object
 *       required:
 *         - name
 *         - price
 *       properties:
 *         id:
 *           type: string
 *           description: Уникальный ID игры
 *         name:
 *           type: string
 *           description: Название игры
 *         category:
 *           type: string
 *           description: Категория игры
 *         description:
 *           type: string
 *           description: Описание игры
 *         price:
 *           type: number
 *           description: Цена в рублях
 *         stock:
 *           type: integer
 *           description: Количество на складе
 *         rating:
 *           type: number
 *           description: Рейтинг игры
 *         platform:
 *           type: string
 *           description: Платформы
 */

/**
 * @swagger
 * /api/games:
 *   get:
 *     summary: Получить все игры
 *     tags: [Games]
 *     responses:
 *       200:
 *         description: Список всех игр
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Game'
 */
app.get('/api/games', (req, res) => {
    res.json(games);
});

/**
 * @swagger
 * /api/games/{id}:
 *   get:
 *     summary: Получить игру по ID
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID игры
 *     responses:
 *       200:
 *         description: Данные игры
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       404:
 *         description: Игра не найдена
 */
app.get('/api/games/:id', (req, res) => {
    const game = games.find(g => g.id === req.params.id);
    if (!game) return res.status(404).json({ error: 'Game not found' });
    res.json(game);
});

/**
 * @swagger
 * /api/games:
 *   post:
 *     summary: Создать новую игру
 *     tags: [Games]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               platform:
 *                 type: string
 *     responses:
 *       201:
 *         description: Игра создана
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 */
app.post('/api/games', (req, res) => {
    const { name, category, description, price, stock, platform } = req.body;
    if (!name || !price) {
        return res.status(400).json({ error: 'Name and price are required' });
    }
    const newGame = {
        id: nanoid(6),
        name: name.trim(),
        category: category || '',
        description: description || '',
        price: Number(price),
        stock: stock ? Number(stock) : 0,
        rating: 0,
        platform: platform || 'PC'
    };
    games.push(newGame);
    res.status(201).json(newGame);
});

/**
 * @swagger
 * /api/games/{id}:
 *   patch:
 *     summary: Обновить игру
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               platform:
 *                 type: string
 *     responses:
 *       200:
 *         description: Игра обновлена
 *       404:
 *         description: Игра не найдена
 */
app.patch('/api/games/:id', (req, res) => {
    const game = games.find(g => g.id === req.params.id);
    if (!game) return res.status(404).json({ error: 'Game not found' });
    
    const { name, category, description, price, stock, platform } = req.body;
    if (name !== undefined) game.name = name.trim();
    if (category !== undefined) game.category = category;
    if (description !== undefined) game.description = description;
    if (price !== undefined) game.price = Number(price);
    if (stock !== undefined) game.stock = Number(stock);
    if (platform !== undefined) game.platform = platform;
    
    res.json(game);
});

/**
 * @swagger
 * /api/games/{id}:
 *   delete:
 *     summary: Удалить игру
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Игра удалена
 *       404:
 *         description: Игра не найдена
 */
app.delete('/api/games/:id', (req, res) => {
    const index = games.findIndex(g => g.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Game not found' });
    games.splice(index, 1);
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`✅ Сервер запущен на http://localhost:${port}`);
    console.log(`📚 Swagger UI: http://localhost:${port}/api-docs`);
});