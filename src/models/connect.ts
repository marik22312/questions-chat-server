import mongoose from 'mongoose';
import { DB_CONNECTION } from '../config';

mongoose.set('debug', process.env.NODE_ENV !== 'production');

export const connect = () => mongoose.connect(DB_CONNECTION, { useNewUrlParser: true });

