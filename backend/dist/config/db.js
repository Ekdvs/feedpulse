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
const mongoose_1 = __importDefault(require("mongoose"));
//connect to database
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!process.env.MONGO_URL) {
        throw new Error("please defind MONGO_URl variabel inside the .env file");
    }
    try {
        yield mongoose_1.default.connect(process.env.MONGO_URL);
        console.log("Database Connected Successfully");
    }
    catch (error) {
        console.error("Database Connection failed", error);
        throw new Error("Failed to connect to database");
    }
});
exports.default = connectDB;
