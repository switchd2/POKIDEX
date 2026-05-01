const { spawn } = require('child_process');
const path = require('path');

function run(command, dir, name, color) {
    const [cmd, ...args] = command.split(' ');
    const child = spawn(cmd, args, { 
        cwd: path.resolve(__dirname, dir), 
        shell: true,
        stdio: 'pipe'
    });

    child.stdout.on('data', (data) => {
        const lines = data.toString().split('\n');
        lines.forEach(line => {
            if (line.trim()) console.log(`${color}[${name}]${'\x1b[0m'} ${line.trim()}`);
        });
    });

    child.stderr.on('data', (data) => {
        const lines = data.toString().split('\n');
        lines.forEach(line => {
            if (line.trim()) console.error(`${'\x1b[31m'}[${name}]${'\x1b[0m'} ${line.trim()}`);
        });
    });

    return child;
}

console.log('\x1b[36m%s\x1b[0m', '🚀 Starting PokéWiki Full Stack Dev Environment...');

const backend = run('npm run dev', './backend', 'BACKEND', '\x1b[32m');
const frontend = run('npm run dev', './frontend', 'FRONTEND', '\x1b[34m');

process.on('SIGINT', () => {
    console.log('\nStopping all processes...');
    backend.kill();
    frontend.kill();
    process.exit();
});
