"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = exports.PORT = void 0;
const app_1 = require("./app");
exports.PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const createServer = (port) => {
    return new Promise((resolve) => {
        const server = app_1.app.listen(port, () => {
            resolve(server);
        });
    });
};
exports.createServer = createServer;
//# sourceMappingURL=server.js.map