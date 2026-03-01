const express = require('express');
const app = express();
const port = 3000;

//Middleware для парсинга джсона
app.use(express.json());

//Начальный массив товаров
let products = [
    { id: 1, name: 'Ноутбук', price: 75000 },
    { id: 2, name: 'Мышь', price: 1500 },
    { id: 3, name: 'Клавиатура', price: 3500 }
];


app.get('/', (req, res) => {
    res.send(`
        <h1>📦 Products API</h1>
        <p>API работает! Используйте:</p>
        <ul>
            <li><a href="/products">GET /products</a> - список товаров</li>
            <li>GET /products/:id - товар по ID</li>
            <li>POST /products - создать товар (JSON в body)</li>
            <li>PATCH /products/:id - обновить товар</li>
            <li>DELETE /products/:id - удалить товар</li>
        </ul>
    `);
});

/*CRUD операции

CREATE (POST) - добавить новый товар*/
app.post('/products', (req, res) => {
    const { name, price } = req.body;

    //Проверка, что поля переданы
    if (!name || !price) {
        return res.status(400).json({ error: 'Поля name и price обязательны' });
    }

    const newProduct = {
        id: Date.now(), //уникальный id на основе времени
        name,
        price
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
});

//READ ALL (GET) - получить все товары
app.get('/products', (req, res) => {
    res.json(products);
});

//READ ONE (GET) - получить товар по id
app.get('/products/:id', (req, res) => {
    const product = products.find(p => p.id == req.params.id);

    if (!product) {
        return res.status(404).json({ error: 'Товар не найден' });
    }

    res.json(product);
});

//UPDATE (PATCH) - обновить товар по id
app.patch('/products/:id', (req, res) => {
    const product = products.find(p => p.id == req.params.id);

    if (!product) {
        return res.status(404).json({ error: 'Товар не найден' });
    }

    const { name, price } = req.body;

    //Обновляем только те поля, которые переданы
    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = price;

    res.json(product);
});

//DELETE (DELETE) - удалить товар по id
app.delete('/products/:id', (req, res) => {
    const productIndex = products.findIndex(p => p.id == req.params.id);

    if (productIndex === -1) {
        return res.status(404).json({ error: 'Товар не найден' });
    }

    products.splice(productIndex, 1);
    res.status(200).json({ message: 'Товар удалён' });
});

//Запуск сервера
app.listen(port, () => {
    console.log(`✅ Сервер запущен на http://localhost:${port}`);
    console.log('📦 Доступные маршруты:');
    console.log('   GET    /products         - все товары');
    console.log('   GET    /products/:id     - товар по id');
    console.log('   POST   /products         - создать товар');
    console.log('   PATCH  /products/:id     - обновить товар');
    console.log('   DELETE /products/:id     - удалить товар');
});