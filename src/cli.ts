#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import stadoc from '.';

const options = {
	port: 8080,
	folder: '',
};

const printHelp = (str: string) => {
	console.error(str + '\n');
	console.error(`Usage: ${process.argv[1]} [options] <static dir>`);
	console.error('');
	console.error('Options:');
	console.error('    -p --port          Http server port');
	process.exit(1);
};

const parsingArgv = (argv: string[]) => {
	let i = 0;
	const len = argv.length;
	for (i=0;i < len;i++) {
		if ( argv[i][0] === '-' ) {
			if ( argv[i][1] && argv[i][1] === '-' ) {
				// --[option]

				if ( argv[i].match(/--port=/) ) {
					options.port = parseInt(argv[i].replace(/--port=/, ''), 10);
				} else {
					switch ( argv[i] ) {
						//case '--port': options.port = argv[++i]; break;
						default: printHelp('Invalid Options');
					}
				}

			} else {
				// -[options]
				for (let idx = 1;idx < len;idx++) {
					switch ( argv[i][idx] ) {
						case 'p': options.port = parseInt(argv[++i], 10); break;
						default: printHelp('Invalid Options');
					}
				}
			}
		} else {
			options.folder = path.resolve(process.cwd(), argv[i]);
		}
	}
};
parsingArgv(process.argv.splice(2));

if ( !fs.existsSync(options.folder) ) {
	printHelp(`${options.folder} is not directory.`);
}

stadoc(options.folder, options.port);
