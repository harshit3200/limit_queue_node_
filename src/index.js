const cluster = require('cluster');
const os = require('os');
const express = require('express');
const taskController = require('./controllers/taskController');

if (cluster.isMaster) {
    const numWorkers = 2;
    console.log(`Master ${process.pid} is running`);

    for (let i = 0; i < numWorkers; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork(); // Replace the dead worker
    });
} else {
    const app = express();
    app.use(express.json());

    app.post('/api/v1/task', taskController.processTask);

    app.listen(3000, () => {
        console.log(`Worker ${process.pid} started`);
    });
}