const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

// --- SETTINGS ---
// Files stay inside the project folder now
// Change these lines in your index.js:
const WORKING_DIR = path.join(process.cwd(), '.tmp_airlock_env');
const FINAL_STORAGE_DIR = path.join(process.cwd(), 'airlock_cargo');
const UPLOAD_TARGET = path.join(WORKING_DIR, 'upload-dir');

function setup() {
    console.log('🛡️  Engaging AirLock isolation...');
    
    if (!fs.existsSync(FINAL_STORAGE_DIR)) fs.mkdirSync(FINAL_STORAGE_DIR, { recursive: true });
    if (!fs.existsSync(UPLOAD_TARGET)) fs.mkdirSync(UPLOAD_TARGET, { recursive: true });

    const venvPath = path.join(WORKING_DIR, 'venv');
    if (!fs.existsSync(venvPath)) {
        console.log('📦 Setting up isolated Python venv (first-time only)...');
        execSync('python3 -m venv venv', { cwd: WORKING_DIR });
        execSync('./venv/bin/pip install --quiet uploadserver', { cwd: WORKING_DIR });
    }
    
    try { execSync('sudo ufw allow 8000/tcp', { stdio: 'ignore' }); } catch (e) {}
}

function startServer() {
    const pythonBin = path.join(WORKING_DIR, 'venv/bin/python3');
    const server = spawn(pythonBin, ['-m', 'uploadserver', '8000', '-d', UPLOAD_TARGET], { 
        cwd: WORKING_DIR,
        stdio: 'inherit' 
    });

    console.log('\n================================================');
    console.log('✅ AIRLOCK ACTIVE: http://' + getIPAddress() + ':8000');
    console.log('================================================');
    console.log('Press CTRL+C to cycle the airlock and retrieve cargo.');

    process.on('SIGINT', () => {
        console.log('\n\n🛑 Stopping server...');
        server.kill('SIGTERM'); 
        setTimeout(() => {
            cleanup();
            process.exit();
        }, 1500);
    });
}

function cleanup() {
    if (fs.existsSync(UPLOAD_TARGET)) {
        const files = fs.readdirSync(UPLOAD_TARGET);
        if (files.length > 0) {
            try {
                // Move from hidden temp folder to visible project folder
                execSync(`mv "${UPLOAD_TARGET}"/* "${FINAL_STORAGE_DIR}/"`);
                console.log(`✅ Success! Files are in: ${FINAL_STORAGE_DIR}`);
            } catch (err) {
                console.log('❌ Move failed. Check .tmp_mobile_transfer/upload-dir');
            }
        }
    }
    try { execSync('sudo ufw deny 8000/tcp', { stdio: 'ignore' }); } catch (e) {}
    console.log('🛡️  Port 8000 closed. Environment preserved.');
}

function getIPAddress() {
    const interfaces = os.networkInterfaces();
    for (const devName in interfaces) {
        const iface = interfaces[devName];
        for (const alias of iface) {
            if (alias.family === 'IPv4' && !alias.internal) return alias.address;
        }
    }
    return 'localhost';
}

setup();
startServer();