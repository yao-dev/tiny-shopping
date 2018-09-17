/** @format */

import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

const adapter = new FileSync('db.json');
const instance = low(adapter);

export default instance;
