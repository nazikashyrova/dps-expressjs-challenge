import express from 'express';
import db from '../services/db.service';

const router = express.Router();

// Get all projects
router.get('/', (req, res) => {
	const projects = db.query('SELECT * FROM projects');
	res.json(projects);
});

// Get a single project
router.get('/:id', (req, res) => {
	const project = db.query('SELECT * FROM projects WHERE id = :id', {
		id: req.params.id,
	})[0];
	if (project) {
		res.json(project);
	} else {
		res.status(404).json({ message: 'Project not found' });
	}
});

// Create a new project
router.post('/', (req, res) => {
	const { name, description } = req.body;
	const result = db.run(
		'INSERT INTO projects (name, description) VALUES (:name, :description)',
		{ name, description },
	);
	res.status(201).json({ id: result.lastInsertRowid, name, description });
});

// Update a project
router.put('/:id', (req, res) => {
	const { name, description } = req.body;
	const result = db.run(
		'UPDATE projects SET name = :name, description = :description WHERE id = :id',
		{ id: req.params.id, name, description },
	);
	if (result.changes > 0) {
		res.json({ id: req.params.id, name, description });
	} else {
		res.status(404).json({ message: 'Project not found' });
	}
});

// Delete a project
router.delete('/:id', (req, res) => {
	const result = db.run('DELETE FROM projects WHERE id = :id', {
		id: req.params.id,
	});
	if (result.changes > 0) {
		res.status(204).send();
	} else {
		res.status(404).json({ message: 'Project not found' });
	}
});

export default router;
