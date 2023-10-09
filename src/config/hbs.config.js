import { create } from 'express-handlebars';
import fileDirName from '../utils/fileDirName.js';
import handlebars from 'handlebars';
import handlebarsHelpers from 'handlebars-helpers';
const { __dirname } = fileDirName(import.meta);
import * as path from 'path';
export default function configureHandlebars(app) {
    const hbs = create({
        partialsDir: [path.join(__dirname, '..','/views/partials')],
    });
    handlebarsHelpers({ handlebars });
    app.engine('handlebars', hbs.engine);
    app.set('views', path.join(__dirname, '..','/views'));
    app.set('view engine', 'handlebars');
}