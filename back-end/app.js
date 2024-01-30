"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors = require('cors');
const user_1 = __importDefault(require("./src/routes/user"));
const empresa_1 = __importDefault(require("./src/routes/empresa"));
const token_1 = __importDefault(require("./src/routes/token"));
const prisma_1 = __importDefault(require("./src/services/prisma"));
const login_1 = __importDefault(require("./src/routes/login"));
const menu_1 = __importDefault(require("./src/routes/menu"));
const menuUser_1 = __importDefault(require("./src/routes/menuUser"));
const bodyParser = require('body-parser');
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST || "localhost";
app.use(cors());
app.use(express_1.default.json());
app.use(bodyParser.json());
app.use(empresa_1.default);
app.use(menu_1.default);
app.use(menuUser_1.default);
;
app.use(user_1.default);
app.use(login_1.default);
app.use(token_1.default);
app.listen(port, host, () => {
    console.log(`Server is running at http://${host}:${port}`);
});
process.on("SIGINT", () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma_1.default.$disconnect();
        process.exit(0);
    }
    catch (error) {
        console.error("Error while disconnecting Prisma:", error);
    }
}));
