import express from 'express';
import db from '../services/db.service';

const router = express.Router();

// Get all reports
router.get('/', (req, res) => {
	const reports = db.query('SELECT * FROM reports');
	res.json(reports);
});

// Get a single report
router.get('/:id', (req, res) => {
	const report = db.query('SELECT * FROM reports WHERE id = :id', {
		id: req.params.id,
	})[0];
	if (report) {
		res.json(report);
	} else {
		res.status(404).json({ message: 'Report not found' });
	}
});

// Create a new report
router.post('/', (req, res) => {
	const { text, project_id } = req.body;
	const result = db.run(
		'INSERT INTO reports (text, project_id) VALUES (:text, :project_id)',
		{ text, project_id },
	);
	res.status(201).json({ id: result.lastInsertRowid, text, project_id });
});

// Update a report
router.put('/:id', (req, res) => {
	const { text, project_id } = req.body;
	const result = db.run(
		'UPDATE reports SET text = :text, project_id = :project_id WHERE id = :id',
		{ id: req.params.id, text, project_id },
	);
	if (result.changes > 0) {
		res.json({ id: req.params.id, text, project_id });
	} else {
		res.status(404).json({ message: 'Report not found' });
	}
});

// Delete a report
router.delete('/:id', (req, res) => {
	const result = db.run('DELETE FROM reports WHERE id = :id', {
		id: req.params.id,
	});
	if (result.changes > 0) {
		res.status(204).send();
	} else {
		res.status(404).json({ message: 'Report not found' });
	}
});

export default router;
