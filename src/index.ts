import express, { Express } from 'express';
import dotenv from 'dotenv';
import db from './services/db.service';
import projectRoutes from './routes/projects';
import reportRoutes from './routes/reports';
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/projects', projectRoutes);
app.use('/reports', reportRoutes);

const authenticateToken = (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction,
) => {
	const token = req.headers['authorization'];
	if (token !== 'Password123') {
		return res.status(401).json({ message: 'Unauthorized' });
	}
	next();
};

app.use(authenticateToken);

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});

app.get('/', (req, res) => {
	res.json({ message: 'Hello, World!' });
});

app.get('/test-db', (req, res) => {
	const result = db.query('SELECT * FROM sqlite_master');
	res.json(result);
});
