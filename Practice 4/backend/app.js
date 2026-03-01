const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid');

const app = express();
const port = 3000;

// Начальные данные (10+ игр)
let games = [
    { 
        id: nanoid(6), 
        name: 'The Witcher 3: Wild Hunt', 
        category: 'RPG', 
        description: 'Эпическая ролевая игра в открытом мире, где вы играете за ведьмака Геральта из Ривии',
        price: 1999, 
        stock: 25,
        rating: 4.9,
        platform: 'PC, PS5, Xbox',
        image: '/images/witcher3.jpg'
    },
    { 
        id: nanoid(6), 
        name: 'Cyberpunk 2077', 
        category: 'Action RPG', 
        description: 'Открытый мир в стиле киберпанк от создателей Ведьмака',
        price: 2499, 
        stock: 30,
        rating: 4.5,
        platform: 'PC, PS5',
        image: '/images/cyberpunk.jpg'
    },
    { 
        id: nanoid(6), 
        name: 'Red Dead Redemption 2', 
        category: 'Action Adventure', 
        description: 'Шедевральный вестерн с потрясающим открытым миром',
        price: 2999, 
        stock: 15,
        rating: 5.0,
        platform: 'PC, Xbox',
        image: '/images/rdr2.jpg'
    },
    { 
        id: nanoid(6), 
        name: 'Minecraft', 
        category: 'Sandbox', 
        description: 'Культовая игра про выживание и строительство из блоков',
        price: 1499, 
        stock: 50,
        rating: 4.8,
        platform: 'PC, Mobile, Console',
        image: '/images/minecraft.jpg'
    },
    { 
        id: nanoid(6), 
        name: 'God of War Ragnarök', 
        category: 'Action', 
        description: 'Продолжение приключений Кратоса в мире скандинавской мифологии',
        price: 3499, 
        stock: 10,
        rating: 5.0,
        platform: 'PS5',
        image: '/images/gow.jpg'
    },
    { 
        id: nanoid(6), 
        name: 'Elden Ring', 
        category: 'Souls-like', 
        description: 'Сложная RPG в открытом мире от создателей Dark Souls и Джорджа Мартина',
        price: 2799, 
        stock: 20,
        rating: 4.9,
        platform: 'PC, PS5, Xbox',
        image: '/images/eldenring.jpg'
    },
    { 
        id: nanoid(6), 
        name: 'FIFA 24', 
        category: 'Sports', 
        description: 'Очередная часть популярного футбольного симулятора',
        price: 1999, 
        stock: 40,
        rating: 4.2,
        platform: 'PC, Console',
        image: '/images/fifa24.jpg'
    },
    { 
        id: nanoid(6), 
        name: 'Starfield', 
        category: 'RPG', 
        description: 'Космическая RPG от создателей The Elder Scrolls',
        price: 3299, 
        stock: 12,
        rating: 4.6,
        platform: 'PC, Xbox',
        image: '/images/starfield.jpg'
    },
    { 
        id: nanoid(6), 
        name: 'Hogwarts Legacy', 
        category: 'Action RPG', 
        description: 'Игра во вселенной Гарри Поттера',
        price: 2999, 
        stock: 18,
        rating: 4.8,
        platform: 'PC, PS5, Xbox',
        image: '/images/hogwarts.jpg'
    },
    { 
        id: nanoid(6), 
        name: 'Counter-Strike 2', 
        category: 'Shooter', 
        description: 'Легендарный тактический шутер на движке Source 2',
        price: 0, 
        stock: 1000,
        rating: 4.7,
        platform: 'PC',
        image: '/images/cs2.jpg'
    },
    { 
        id: nanoid(6), 
        name: 'Diablo IV', 
        category: 'Action RPG', 
        description: 'Мрачная RPG с видом сверху, полная демонов и лута',
        price: 2799, 
        stock: 22,
        rating: 4.4,
        platform: 'PC, Console',
        image: '/images/diablo4.jpg'
    },
    { 
        id: nanoid(6), 
        name: 'Baldur\'s Gate 3', 
        category: 'RPG', 
        description: 'Грандиозная RPG по мотивам Dungeons & Dragons',
        price: 3199, 
        stock: 14,
        rating: 5.0,
        platform: 'PC, PS5',
        image: '/images/bg3.jpg'
    }
];

// Middleware
app.use(express.json());

// CORS настройки (разрешаем запросы с фронтенда)
app.use(cors({ 
    origin: 'http://localhost:3001', 
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware для логирования запросов
app.use((req, res, next) => {
    res.on('finish', () => {
        console.log(`[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`);
        if (req.method === 'POST' || req.method === 'PATCH') {
            console.log('Body:', req.body);
        }
    });
    next();
});

// Функция-помощник для поиска игры
function findGameOr404(id, res) {
    const game = games.find(g => g.id === id);
    if (!game) {
        res.status(404).json({ error: 'Игра не найдена' });
        return null;
    }
    return game;
}

// ============= CRUD операции =============

// GET все игры
app.get('/api/games', (req, res) => {
    res.json(games);
});

// GET игра по ID
app.get('/api/games/:id', (req, res) => {
    const game = findGameOr404(req.params.id, res);
    if (!game) return;
    res.json(game);
});

// POST создать новую игру
app.post('/api/games', (req, res) => {
    const { name, category, description, price, stock, platform, rating, image } = req.body;
    
    // Проверка обязательных полей
    if (!name || !category || !price) {
        return res.status(400).json({ error: 'Поля name, category и price обязательны' });
    }
    
    const newGame = {
        id: nanoid(6),
        name: name.trim(),
        category,
        description: description || '',
        price: Number(price),
        stock: stock ? Number(stock) : 0,
        platform: platform || 'PC',
        rating: rating ? Number(rating) : 0,
        image: image || '/images/default.jpg'
    };
    
    games.push(newGame);
    res.status(201).json(newGame);
});

// PATCH обновить игру
app.patch('/api/games/:id', (req, res) => {
    const game = findGameOr404(req.params.id, res);
    if (!game) return;
    
    // Проверка, что есть что обновлять
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Нет данных для обновления' });
    }
    
    const { name, category, description, price, stock, platform, rating, image } = req.body;
    
    if (name !== undefined) game.name = name.trim();
    if (category !== undefined) game.category = category;
    if (description !== undefined) game.description = description;
    if (price !== undefined) game.price = Number(price);
    if (stock !== undefined) game.stock = Number(stock);
    if (platform !== undefined) game.platform = platform;
    if (rating !== undefined) game.rating = Number(rating);
    if (image !== undefined) game.image = image;
    
    res.json(game);
});

// DELETE удалить игру
app.delete('/api/games/:id', (req, res) => {
    const exists = games.some(g => g.id === req.params.id);
    if (!exists) {
        return res.status(404).json({ error: 'Игра не найдена' });
    }
    
    games = games.filter(g => g.id !== req.params.id);
    res.status(204).send(); // 204 - успешно, без тела ответа
});

// 404 для всех остальных маршрутов
app.use((req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
    console.error('Необработанная ошибка:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

// Запуск сервера
app.listen(port, () => {
    console.log(`✅ Сервер запущен на http://localhost:${port}`);
    console.log('📦 Доступные маршруты:');
    console.log('   GET    /api/games         - все игры');
    console.log('   GET    /api/games/:id     - игра по ID');
    console.log('   POST   /api/games         - создать игру');
    console.log('   PATCH  /api/games/:id     - обновить игру');
    console.log('   DELETE /api/games/:id     - удалить игру');
});