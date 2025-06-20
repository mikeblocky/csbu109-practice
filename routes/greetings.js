const express = require('express');
const router = express.Router();
const { readData, writeData } = require('../utils/dataUtils');
const { AppError } = require('../middleware/errorHandler');

router.get('/', async (req, res, next) => {
    try {
        let greetings = await readData();

        if (req.query.language) {
            const langQuery = req.query.language.toLowerCase();
            greetings = greetings.filter(g => 
                g.language.toLowerCase().includes(langQuery)
            );
        }

        if (req.query.formal !== undefined) {
            const isFormal = req.query.formal === 'true';
            greetings = greetings.filter(g => g.formal === isFormal);
        }

        res.json({
            success: true,
            count: greetings.length,
            data: greetings
        });
    } catch (error) {
        next(error);
    }
});


router.get('/:id', async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            throw new AppError('Invalid ID format', 400);
        }

        const greetings = await readData();
        const greeting = greetings.find(g => g.id === id);

        if (!greeting) {
            throw new AppError('Greeting not found', 404);
        }

        res.json({ success: true, data: greeting });
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const { language, greeting, formal } = req.body;
        if (!language || !greeting) {
            throw new AppError('Language and greeting are required', 400);
        }

        const greetings = await readData();
        const existingGreeting = greetings.find(g => g.language.toLowerCase() === language.toLowerCase());

        if (existingGreeting) {
            throw new AppError('Greeting already exists for this language', 409);
        }

        const newId = greetings.length > 0 ? Math.max(...greetings.map(g => g.id)) + 1 : 1;
        const newGreeting = {
            id: newId,
            language: language.trim(),
            greeting: greeting.trim(),
            formal: formal !== undefined ? Boolean(formal) : false
        };

        greetings.push(newGreeting);
        await writeData(greetings);

        res.status(201).json({
            success: true,
            message: 'Greeting added successfully',
            data: newGreeting
        });
    } catch (error) {
        next(error);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            throw new AppError('Invalid ID format', 400);
        }

        const { language, greeting, formal } = req.body;
        if (!language || !greeting) {
            throw new AppError('Language and greeting are required', 400);
        }

        const greetings = await readData();
        const index = greetings.findIndex(g => g.id === id);

        if (index === -1) {
            throw new AppError('Greeting not found', 404);
        }

        const existingGreeting = greetings.find(g => g.language.toLowerCase() === language.toLowerCase() && g.id !== id);
        if (existingGreeting) {
            throw new AppError('Greeting already exists for this language', 409);
        }

        greetings[index] = {
            id,
            language: language.trim(),
            greeting: greeting.trim(),
            formal: formal !== undefined ? Boolean(formal) : greetings[index].formal
        };

        await writeData(greetings);

        res.json({
            success: true,
            message: 'Greeting updated successfully',
            data: greetings[index]
        });
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            throw new AppError('Invalid ID format', 400);
        }

        const greetings = await readData();
        const index = greetings.findIndex(g => g.id === id);

        if (index === -1) {
            throw new AppError('Greeting not found', 404);
        }

        const [deletedGreeting] = greetings.splice(index, 1);
        await writeData(greetings);

        res.json({
            success: true,
            message: 'Greeting deleted successfully',
            data: deletedGreeting
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;