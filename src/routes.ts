import express from 'express';
const routes = express.Router();


routes.get('/', async (req, res) => {
    const tst = async () => {
        return 'hi'
    }
    await tst();
    return res.status(200).json({ message: process.env.HTTP_PORT });
})

export default routes;