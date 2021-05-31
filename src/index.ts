import http from 'http';
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';
import qs from 'querystring';
import chalk from 'chalk';

const date = () => {
	const d = new Date();
	const year = d.getFullYear();
	const month = (d.getMonth() + 1).toString().padStart(2, '0');
	const day = d.getDate().toString().padStart(2, '0');
	const hour = d.getHours().toString().padStart(2, '0');
	const minute = d.getMinutes().toString().padStart(2, '0');
	const seconds = d.getSeconds().toString().padStart(2, '0');
	const ms = d.getMilliseconds().toString().padStart(2, '0');

	return `${year}/${month}/${day} ${hour}:${minute}:${seconds}.${ms}`;
};

export default (folder: string, port: number = 8080) => {
	const server = http.createServer((req, res) => {
		let p = path.join(folder, qs.unescape(req.url as any));

		if ( fs.existsSync(p) ) {
			const stat = fs.lstatSync(p);
			if ( stat.isDirectory() ) {
				p = path.join(p, 'index.html');
			}
		}

		if ( fs.existsSync(p) ) {
			res.setHeader('Content-Type', mime.lookup(p));
			res.end(fs.readFileSync(p), 'binary', () => {
				console.log(`[${chalk.blue(date())}] ${chalk.green('✔')} GET ${chalk.green('200')} ${qs.unescape(req.url as any)}`);
			});
		} else {
			res.statusCode = 404;
			res.statusMessage = 'Not found';
			res.end(() => {
				console.log(`[${chalk.blue(date())}] ${chalk.red('✖')} GET ${chalk.red('404')} ${req.url}`);
			});
		}
	});

	server.listen(port, () => {
		console.log(chalk.white('======================================================'));
		console.log('');
		console.log(chalk.cyan('  ███████╗████████╗ █████╗ ██████╗  ██████╗  ██████╗'));
		console.log(chalk.cyan('  ██╔════╝╚══██╔══╝██╔══██╗██╔══██╗██╔═══██╗██╔════╝'));
		console.log(chalk.cyan('  ███████╗   ██║   ███████║██║  ██║██║   ██║██║     '));
		console.log(chalk.cyan('  ╚════██║   ██║   ██╔══██║██║  ██║██║   ██║██║     '));
		console.log(chalk.cyan('  ███████║   ██║   ██║  ██║██████╔╝╚██████╔╝╚██████╗'));
		console.log(chalk.cyan('  ╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═════╝  ╚═════╝  ╚═════╝'));
		console.log('');
		console.log(chalk.white('======================================================'));
		console.log('');

		console.log(`  📖 Static directory: ${folder}/`);
		console.log(`  📖 Server listen http://localhost:${port}/`);
		console.log('');
	});
};
