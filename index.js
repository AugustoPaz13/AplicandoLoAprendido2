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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var readline = require("readline");
var Estado = Object.freeze({
    PENDIENTE: { code: "P", label: "Pendiente" },
    EN_CURSO: { code: "E", label: "En curso" },
    TERMINADA: { code: "T", label: "Terminada" },
    CANCELADA: { code: "C", label: "Cancelada" },
});
function EstadoDesdeEntrada(value) {
    if (!value)
        return null;
    var v = value.trim().toUpperCase();
    if (v === "P" || v === "PENDIENTE")
        return Estado.PENDIENTE;
    if (v === "E" || v === "EN CURSO" || v === "EN_CURSO")
        return Estado.EN_CURSO;
    if (v === "T" || v === "TERMINADA")
        return Estado.TERMINADA;
    if (v === "C" || v === "CANCELADA")
        return Estado.CANCELADA;
    return null;
}
var Dificultad = Object.freeze({
    FACIL: { code: 1, label: "Fácil", stars: "★☆☆" },
    MEDIO: { code: 2, label: "Medio", stars: "★★☆" },
    DIFICIL: { code: 3, label: "Difícil", stars: "★★★" },
});
function DificultadDesdeEntrada(value) {
    if (!value)
        return null;
    var v = value.toString().trim().toUpperCase();
    if (v === "1" || v === "F" || v === "FACIL" || v === "FÁCIL")
        return Dificultad.FACIL;
    if (v === "2" || v === "M" || v === "MEDIO")
        return Dificultad.MEDIO;
    if (v === "3" || v === "D" || v === "DIFICIL" || v === "DIFÍCIL")
        return Dificultad.DIFICIL;
    return null;
}
// --- IO ---
function crearConsoleIO() {
    var rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return {
        ask: function (question) {
            return new Promise(function (resolve) { return rl.question(question, function (answer) { return resolve(answer); }); });
        },
        close: function () { return rl.close(); },
    };
}
function crearTareaRepo() {
    return { tareas: [] };
}
function repoAdd(repo, tarea) {
    repo.tareas.push(tarea);
}
function repoGetAll(repo) {
    return __spreadArray([], repo.tareas, true);
}
function repoFilterByEstado(repo, estado) {
    return repo.tareas.filter(function (t) { return t.estado === estado; });
}
function repoSearchByTitle(repo, substr) {
    var q = substr.trim().toLowerCase();
    return repo.tareas.filter(function (t) { return t.titulo.toLowerCase().includes(q); });
}
// --- Utilidades de Fecha ---
function parseFecha(input) {
    if (!input)
        return null;
    var s = input.trim();
    var isoCandidate = s.match(/^\d{4}-\d{2}-\d{2}(?:[ T]\d{2}:\d{2})?$/);
    if (isoCandidate) {
        var normalized = s.replace(" ", "T");
        var d = new Date(normalized);
        if (!isNaN(d.getTime()))
            return d;
    }
    var dmy = s.match(/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?$/);
    if (dmy) {
        var day = parseInt(dmy[1], 10);
        var month = parseInt(dmy[2], 10) - 1;
        var year = parseInt(dmy[3], 10);
        var hours = dmy[4] ? parseInt(dmy[4], 10) : 0;
        var minutes = dmy[5] ? parseInt(dmy[5], 10) : 0;
        var d = new Date(year, month, day, hours, minutes);
        if (!isNaN(d.getTime()))
            return d;
    }
    var fallback = new Date(s);
    if (!isNaN(fallback.getTime()))
        return fallback;
    return null;
}
function formatFecha(d) {
    if (!d)
        return "Sin datos";
    var pad = function (n) { return (n < 10 ? "0" + n : n); };
    return "".concat(d.getFullYear(), "-").concat(pad(d.getMonth() + 1), "-").concat(pad(d.getDate()), " ").concat(pad(d.getHours()), ":").concat(pad(d.getMinutes()));
}
function mostrarDificultad(d) {
    if (!d)
        return "Sin datos";
    return "".concat(d.label, " (").concat(d.stars, ")");
}
// --- Tarea ---
function crearTarea(params) {
    var titulo = params.titulo, _a = params.descripcion, descripcion = _a === void 0 ? null : _a, _b = params.estado, estado = _b === void 0 ? Estado.PENDIENTE : _b, _c = params.vencimiento, vencimiento = _c === void 0 ? null : _c, _d = params.dificultad, dificultad = _d === void 0 ? Dificultad.FACIL : _d;
    if (!titulo || titulo.trim().length === 0 || titulo.trim().length > 100) {
        throw new Error("Título inválido: obligatorio, 1..100 caracteres.");
    }
    if (descripcion !== null && descripcion !== undefined) {
        if (typeof descripcion !== "string" || descripcion.length > 500) {
            throw new Error("Descripción inválida: hasta 500 caracteres.");
        }
    }
    return {
        titulo: titulo.trim(),
        descripcion: descripcion && descripcion.trim().length > 0 ? descripcion.trim() : null,
        estado: estado || Estado.PENDIENTE,
        creacion: new Date(),
        ultimaEdicion: new Date(),
        vencimiento: vencimiento instanceof Date ? vencimiento : null,
        dificultad: dificultad || Dificultad.FACIL,
    };
}
function actualizarTarea(tarea, cambios) {
    if (cambios.descripcion !== undefined) {
        if (cambios.descripcion === "") {
            // mantener
        }
        else if (cambios.descripcion === " ") {
            tarea.descripcion = null;
        }
        else {
            if (cambios.descripcion.length > 500)
                throw new Error("Descripción inválida: hasta 500 caracteres.");
            tarea.descripcion = cambios.descripcion.trim();
        }
    }
    if (cambios.estado !== undefined) {
        if (cambios.estado === "") {
            // mantener
        }
        else {
            var e = EstadoDesdeEntrada(cambios.estado);
            if (!e)
                throw new Error("Estado inválido. Use P/E/T/C o su nombre.");
            tarea.estado = e;
        }
    }
    if (cambios.dificultad !== undefined) {
        if (cambios.dificultad === "") {
            // mantener
        }
        else {
            var d = DificultadDesdeEntrada(cambios.dificultad);
            if (!d)
                throw new Error("Dificultad inválida. Use 1/2/3 o F/M/D.");
            tarea.dificultad = d;
        }
    }
    if (cambios.vencimiento !== undefined) {
        if (cambios.vencimiento === "") {
            // mantener
        }
        else if (cambios.vencimiento === " ") {
            tarea.vencimiento = null;
        }
        else {
            var fecha = parseFecha(cambios.vencimiento);
            if (!fecha)
                throw new Error("Fecha de vencimiento inválida.");
            tarea.vencimiento = fecha;
        }
    }
    tarea.ultimaEdicion = new Date();
}
// --- App principal ---
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var io, repo, salir, op, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    io = crearConsoleIO();
                    repo = crearTareaRepo();
                    return [4 /*yield*/, seedDemo(repo)];
                case 1:
                    _b.sent();
                    salir = false;
                    _b.label = 2;
                case 2:
                    if (!!salir) return [3 /*break*/, 14];
                    console.clear();
                    console.log("¡Hola Usuario!\n");
                    console.log("¿Qué desea hacer?\n");
                    console.log("[1] Ver mis tareas");
                    console.log("[2] Buscar una tarea");
                    console.log("[3] Agregar una tarea");
                    console.log("[0] Salir\n");
                    return [4 /*yield*/, io.ask("> ")];
                case 3:
                    op = (_b.sent()).trim();
                    _a = op;
                    switch (_a) {
                        case "1": return [3 /*break*/, 4];
                        case "2": return [3 /*break*/, 6];
                        case "3": return [3 /*break*/, 8];
                        case "0": return [3 /*break*/, 10];
                    }
                    return [3 /*break*/, 11];
                case 4: return [4 /*yield*/, menuVerMisTareas(io, repo)];
                case 5:
                    _b.sent();
                    return [3 /*break*/, 13];
                case 6: return [4 /*yield*/, menuBuscarTarea(io, repo)];
                case 7:
                    _b.sent();
                    return [3 /*break*/, 13];
                case 8: return [4 /*yield*/, menuAgregarTarea(io, repo)];
                case 9:
                    _b.sent();
                    return [3 /*break*/, 13];
                case 10:
                    salir = true;
                    return [3 /*break*/, 13];
                case 11: return [4 /*yield*/, pauseMsg(io, "Opción inválida. Intente nuevamente.")];
                case 12:
                    _b.sent();
                    _b.label = 13;
                case 13: return [3 /*break*/, 2];
                case 14:
                    io.close();
                    console.log("¡Hasta luego!");
                    return [2 /*return*/];
            }
        });
    });
}
function menuVerMisTareas(io, repo) {
    return __awaiter(this, void 0, void 0, function () {
        var volver, op, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    volver = false;
                    _b.label = 1;
                case 1:
                    if (!!volver) return [3 /*break*/, 15];
                    console.clear();
                    console.log("¿Qué tarea desea ver?\n");
                    console.log("[1] Todas");
                    console.log("[2] Pendientes");
                    console.log("[3] En curso");
                    console.log("[4] Terminadas");
                    console.log("[0] Volver\n");
                    return [4 /*yield*/, io.ask("> ")];
                case 2:
                    op = (_b.sent()).trim();
                    _a = op;
                    switch (_a) {
                        case "1": return [3 /*break*/, 3];
                        case "2": return [3 /*break*/, 5];
                        case "3": return [3 /*break*/, 7];
                        case "4": return [3 /*break*/, 9];
                        case "0": return [3 /*break*/, 11];
                    }
                    return [3 /*break*/, 12];
                case 3: return [4 /*yield*/, listadoTareas(io, repoGetAll(repo), "Todas tus tareas")];
                case 4:
                    _b.sent();
                    return [3 /*break*/, 14];
                case 5: return [4 /*yield*/, listadoTareas(io, repoFilterByEstado(repo, Estado.PENDIENTE), "Tareas Pendientes")];
                case 6:
                    _b.sent();
                    return [3 /*break*/, 14];
                case 7: return [4 /*yield*/, listadoTareas(io, repoFilterByEstado(repo, Estado.EN_CURSO), "Tareas En curso")];
                case 8:
                    _b.sent();
                    return [3 /*break*/, 14];
                case 9: return [4 /*yield*/, listadoTareas(io, repoFilterByEstado(repo, Estado.TERMINADA), "Tareas Terminadas")];
                case 10:
                    _b.sent();
                    return [3 /*break*/, 14];
                case 11:
                    volver = true;
                    return [3 /*break*/, 14];
                case 12: return [4 /*yield*/, pauseMsg(io, "Opción inválida. Intente nuevamente.")];
                case 13:
                    _b.sent();
                    _b.label = 14;
                case 14: return [3 /*break*/, 1];
                case 15: return [2 /*return*/];
            }
        });
    });
}
function listadoTareas(io, tareas, titulo) {
    return __awaiter(this, void 0, void 0, function () {
        var ordenadas, op, idx, tarea;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ordenadas = __spreadArray([], tareas, true).sort(function (a, b) { return a.titulo.localeCompare(b.titulo, undefined, { sensitivity: "base" }); });
                    _a.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 8];
                    console.clear();
                    console.log("".concat(titulo, ".\n"));
                    if (!(ordenadas.length === 0)) return [3 /*break*/, 3];
                    console.log("(No hay tareas para mostrar)\n");
                    return [4 /*yield*/, pauseMsg(io, "Presiona Enter para volver...")];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
                case 3:
                    ordenadas.forEach(function (t, i) {
                        console.log("[".concat(i + 1, "] ").concat(t.titulo));
                    });
                    console.log("\n¿Deseas ver los detalles de alguna?");
                    console.log("Introduce el número para verla o 0 para volver.");
                    return [4 /*yield*/, io.ask("> ")];
                case 4:
                    op = (_a.sent()).trim();
                    if (op === "0")
                        return [2 /*return*/];
                    idx = Number.parseInt(op, 10);
                    if (!(Number.isNaN(idx) || idx < 1 || idx > ordenadas.length)) return [3 /*break*/, 6];
                    return [4 /*yield*/, pauseMsg(io, "Opción inválida. Intente nuevamente.")];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 1];
                case 6:
                    tarea = ordenadas[idx - 1];
                    return [4 /*yield*/, menuDetallesTarea(io, tarea)];
                case 7:
                    _a.sent();
                    return [3 /*break*/, 1];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function menuDetallesTarea(io, tarea) {
    return __awaiter(this, void 0, void 0, function () {
        var op;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!true) return [3 /*break*/, 6];
                    console.clear();
                    console.log("Esta es la tarea que elegiste.\n");
                    console.log("\t".concat(tarea.titulo));
                    console.log("\t".concat(tarea.descripcion ? tarea.descripcion : "(Sin descripción)"));
                    console.log("\tEstado: ".concat(tarea.estado.label));
                    console.log("\tDificultad: ".concat(mostrarDificultad(tarea.dificultad)));
                    console.log("\tVencimiento: ".concat(tarea.vencimiento ? formatFecha(tarea.vencimiento) : "Sin datos"));
                    console.log("\tCreaci\u00F3n: ".concat(formatFecha(tarea.creacion)));
                    console.log("\t\u00DAltima edici\u00F3n: ".concat(formatFecha(tarea.ultimaEdicion), "\n"));
                    console.log("Si deseas editarla selecciona E, si no 0 para volver");
                    return [4 /*yield*/, io.ask("> ")];
                case 1:
                    op = (_a.sent()).trim().toUpperCase();
                    if (op === "0")
                        return [2 /*return*/];
                    if (!(op === "E")) return [3 /*break*/, 3];
                    return [4 /*yield*/, menuEdicionTarea(io, tarea)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, pauseMsg(io, "Opción inválida. Intente nuevamente.")];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [3 /*break*/, 0];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function menuEdicionTarea(io, tarea) {
    return __awaiter(this, void 0, void 0, function () {
        var nuevaDesc, nuevoEstado, nuevaDific, nuevoVenc, e_1, retry;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!true) return [3 /*break*/, 10];
                    console.clear();
                    console.log("Estas editando la tarea: ".concat(tarea.titulo));
                    console.log(" - Si deseas mantener los valores de un atributo simplemente dejalo en blanco");
                    console.log(" - Si deseas dejar en blanco un atributo, escribe un espacio");
                    console.log("");
                    return [4 /*yield*/, io.ask("1. Ingresa la descripción: ")];
                case 1:
                    nuevaDesc = _a.sent();
                    return [4 /*yield*/, io.ask("2. Estado([P]endiente/[E]n curso/[T]erminada/[C]ancelada): ")];
                case 2:
                    nuevoEstado = _a.sent();
                    return [4 /*yield*/, io.ask("3. Dificultad([1]/[2]/[3]): ")];
                case 3:
                    nuevaDific = _a.sent();
                    return [4 /*yield*/, io.ask("4. Vencimiento (YYYY-MM-DD o DD/MM/YYYY opcional HH:mm): ")];
                case 4:
                    nuevoVenc = _a.sent();
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 7, , 9]);
                    actualizarTarea(tarea, { descripcion: nuevaDesc, estado: nuevoEstado, dificultad: nuevaDific, vencimiento: nuevoVenc });
                    console.log("\n¡Datos guardados!");
                    return [4 /*yield*/, pauseMsg(io, "Presiona Enter para continuar...")];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
                case 7:
                    e_1 = _a.sent();
                    console.log("\nError: ".concat(e_1.message));
                    return [4 /*yield*/, io.ask("¿Deseas reintentar? (S/N): ")];
                case 8:
                    retry = (_a.sent()).trim().toUpperCase();
                    if (retry !== "S")
                        return [2 /*return*/];
                    return [3 /*break*/, 9];
                case 9: return [3 /*break*/, 0];
                case 10: return [2 /*return*/];
            }
        });
    });
}
function menuBuscarTarea(io, repo) {
    return __awaiter(this, void 0, void 0, function () {
        var q, query, back, resultados;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!true) return [3 /*break*/, 7];
                    console.clear();
                    console.log("Introduce el título de una tarea para buscarla");
                    return [4 /*yield*/, io.ask("> ")];
                case 1:
                    q = _a.sent();
                    query = q.trim();
                    if (!(query.length === 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, io.ask("Búsqueda vacía. ¿Volver? (S/N): ")];
                case 2:
                    back = (_a.sent()).trim().toUpperCase();
                    if (back === "S")
                        return [2 /*return*/];
                    return [3 /*break*/, 0];
                case 3:
                    resultados = repoSearchByTitle(repo, query);
                    if (!(resultados.length === 0)) return [3 /*break*/, 5];
                    console.log("\nNo hay tareas relacionadas con la búsqueda.\n");
                    return [4 /*yield*/, pauseMsg(io, "Presiona Enter para continuar...")];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
                case 5: return [4 /*yield*/, listadoTareas(io, resultados, "Estas son las tareas relacionadas")];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function menuAgregarTarea(io, repo) {
    return __awaiter(this, void 0, void 0, function () {
        var titulo, descripcion, estadoIn, dificIn, vencIn, estado, dificultad, vencimiento, f, tarea, e_2, retry;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!true) return [3 /*break*/, 11];
                    console.clear();
                    console.log("Estas creando una nueva tarea.\n");
                    return [4 /*yield*/, io.ask("1. Ingresa el título: ")];
                case 1:
                    titulo = (_a.sent()).trim();
                    return [4 /*yield*/, io.ask("2. Ingresa la descripción: ")];
                case 2:
                    descripcion = _a.sent();
                    return [4 /*yield*/, io.ask("3. Estado ([P]endiente/[E]n curso/[T]erminada/[C]ancelada) [Enter para P]: ")];
                case 3:
                    estadoIn = _a.sent();
                    return [4 /*yield*/, io.ask("4. Dificultad ([1]/[2]/[3]) [Enter para 1]: ")];
                case 4:
                    dificIn = _a.sent();
                    return [4 /*yield*/, io.ask("5. Vencimiento (YYYY-MM-DD o DD/MM/YYYY opcional HH:mm) [opcional]: ")];
                case 5:
                    vencIn = _a.sent();
                    _a.label = 6;
                case 6:
                    _a.trys.push([6, 8, , 10]);
                    if (!titulo || titulo.length === 0 || titulo.length > 100) {
                        throw new Error("Título inválido: obligatorio, 1..100 caracteres.");
                    }
                    estado = estadoIn.trim() === "" ? Estado.PENDIENTE : EstadoDesdeEntrada(estadoIn);
                    if (!estado)
                        throw new Error("Estado inválido. Use P/E/T/C o su nombre.");
                    dificultad = dificIn.trim() === "" ? Dificultad.FACIL : DificultadDesdeEntrada(dificIn);
                    if (!dificultad)
                        throw new Error("Dificultad inválida. Use 1/2/3 o F/M/D.");
                    vencimiento = null;
                    if (vencIn && vencIn.trim() !== "") {
                        f = parseFecha(vencIn);
                        if (!f)
                            throw new Error("Fecha de vencimiento inválida.");
                        vencimiento = f;
                    }
                    tarea = crearTarea({ titulo: titulo, descripcion: descripcion, estado: estado, dificultad: dificultad, vencimiento: vencimiento });
                    repoAdd(repo, tarea);
                    console.log("\n¡Datos guardados!");
                    return [4 /*yield*/, pauseMsg(io, "Presiona Enter para continuar...")];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
                case 8:
                    e_2 = _a.sent();
                    console.log("\nError: ".concat(e_2.message));
                    return [4 /*yield*/, io.ask("¿Deseas reintentar? (S/N): ")];
                case 9:
                    retry = (_a.sent()).trim().toUpperCase();
                    if (retry !== "S")
                        return [2 /*return*/];
                    return [3 /*break*/, 10];
                case 10: return [3 /*break*/, 0];
                case 11: return [2 /*return*/];
            }
        });
    });
}
function pauseMsg(io, msg) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, io.ask("\n".concat(msg))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function seedDemo(repo) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (repoGetAll(repo).length > 0)
                return [2 /*return*/];
            repoAdd(repo, crearTarea({ titulo: "Comprar Huevos", descripcion: "Ir al súper y comprar una docena", estado: Estado.PENDIENTE, dificultad: Dificultad.FACIL }));
            repoAdd(repo, crearTarea({ titulo: "Pasear al perro", descripcion: "Ejercitar 30 minutos", estado: Estado.EN_CURSO, dificultad: Dificultad.MEDIO, vencimiento: parseFecha("2025-12-01 18:00") }));
            repoAdd(repo, crearTarea({ titulo: "Terminar práctico de BD", descripcion: null, estado: Estado.TERMINADA, dificultad: Dificultad.DIFICIL }));
            return [2 /*return*/];
        });
    });
}
// --- Main ---
main();
