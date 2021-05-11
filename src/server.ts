import express from 'express';

import CategoriesRouter from './routes/categories.routes';
import SpecificationsRouter from './routes/specifications.routes';

const app = express();

app.use(express.json());

app.use('/categories', CategoriesRouter);
app.use('/specifications', SpecificationsRouter);

app.listen(3333, () => console.log('Server started succesfully'));
