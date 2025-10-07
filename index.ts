import * as readline from "readline";

// --- Tipos y Constantes ---
type EstadoType = { code: string; label: string };
type DificultadType = { code: number; label: string; stars: string };
type TareaType = {
  titulo: string;
  descripcion: string | null;
  estado: EstadoType;
  creacion: Date;
  ultimaEdicion: Date;
  vencimiento: Date | null;
  dificultad: DificultadType;
};

const Estado = Object.freeze({
  PENDIENTE: { code: "P", label: "Pendiente" },
  EN_CURSO: { code: "E", label: "En curso" },
  TERMINADA: { code: "T", label: "Terminada" },
  CANCELADA: { code: "C", label: "Cancelada" },
});

function EstadoDesdeEntrada(value: string): EstadoType | null {
  if (!value) return null;
  const v = value.trim().toUpperCase();
  if (v === "P" || v === "PENDIENTE") return Estado.PENDIENTE;
  if (v === "E" || v === "EN CURSO" || v === "EN_CURSO") return Estado.EN_CURSO;
  if (v === "T" || v === "TERMINADA") return Estado.TERMINADA;
  if (v === "C" || v === "CANCELADA") return Estado.CANCELADA;
  return null;
}

const Dificultad = Object.freeze({
  FACIL: { code: 1, label: "Fácil", stars: "★☆☆" },
  MEDIO: { code: 2, label: "Medio", stars: "★★☆" },
  DIFICIL: { code: 3, label: "Difícil", stars: "★★★" },
});

function DificultadDesdeEntrada(value: string): DificultadType | null {
  if (!value) return null;
  const v = value.toString().trim().toUpperCase();
  if (v === "1" || v === "F" || v === "FACIL" || v === "FÁCIL") return Dificultad.FACIL;
  if (v === "2" || v === "M" || v === "MEDIO") return Dificultad.MEDIO;
  if (v === "3" || v === "D" || v === "DIFICIL" || v === "DIFÍCIL") return Dificultad.DIFICIL;
  return null;
}

// --- IO ---
function crearConsoleIO() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return {
    ask: (question: string) =>
      new Promise<string>((resolve) => rl.question(question, (answer) => resolve(answer))),
    close: () => rl.close(),
//   }
}

// --- Repositorio ---
type TareaRepoType = { tareas: TareaType[] };

function crearTareaRepo(): TareaRepoType {
  return { tareas: [] };
}

function repoAdd(repo: TareaRepoType, tarea: TareaType) {
  repo.tareas.push(tarea);
}

function repoGetAll(repo: TareaRepoType): TareaType[] {
  return [...repo.tareas];
}

function repoFilterByEstado(repo: TareaRepoType, estado: EstadoType): TareaType[] {
  return repo.tareas.filter((t) => t.estado === estado);
}

function repoSearchByTitle(repo: TareaRepoType, substr: string): TareaType[] {
  const q = substr.trim().toLowerCase();
  return repo.tareas.filter((t) => t.titulo.toLowerCase().includes(q));
}

// --- Utilidades de Fecha ---
function parseFecha(input: string): Date | null {
  if (!input) return null;
  const s = input.trim();
  const isoCandidate = s.match(/^\d{4}-\d{2}-\d{2}(?:[ T]\d{2}:\d{2})?$/);
  if (isoCandidate) {
    const normalized = s.replace(" ", "T");
    const d = new Date(normalized);
    if (!isNaN(d.getTime())) return d;
  }
  const dmy = s.match(/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?$/);
  if (dmy) {
    const day = parseInt(dmy[1], 10);
    const month = parseInt(dmy[2], 10) - 1;
    const year = parseInt(dmy[3], 10);
    const hours = dmy[4] ? parseInt(dmy[4], 10) : 0;
    const minutes = dmy[5] ? parseInt(dmy[5], 10) : 0;
    const d = new Date(year, month, day, hours, minutes);
    if (!isNaN(d.getTime())) return d;
  }
  const fallback = new Date(s);
  if (!isNaN(fallback.getTime())) return fallback;
  return null;
}

function formatFecha(d: Date | null): string {
  if (!d) return "Sin datos";
  const pad = (n: number) => (n < 10 ? "0" + n : n);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function mostrarDificultad(d: DificultadType | null): string {
  if (!d) return "Sin datos";
  return `${d.label} (${d.stars})`;
}

// --- Tarea ---
function crearTarea(params: {
  titulo: string;
  descripcion?: string | null;
  estado?: EstadoType;
  vencimiento?: Date | null;
  dificultad?: DificultadType;
}): TareaType {
  const { titulo, descripcion = null, estado = Estado.PENDIENTE, vencimiento = null, dificultad = Dificultad.FACIL } = params;
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

function actualizarTarea(tarea: TareaType, cambios: {
  descripcion?: string;
  estado?: string;
  dificultad?: string;
  vencimiento?: string;
}) {
  if (cambios.descripcion !== undefined) {
    if (cambios.descripcion === "") {
      // mantener
    } else if (cambios.descripcion === " ") {
      tarea.descripcion = null;
    } else {
      if (cambios.descripcion.length > 500) throw new Error("Descripción inválida: hasta 500 caracteres.");
      tarea.descripcion = cambios.descripcion.trim();
    }
  }
  if (cambios.estado !== undefined) {
    if (cambios.estado === "") {
      // mantener
    } else {
      const e = EstadoDesdeEntrada(cambios.estado);
      if (!e) throw new Error("Estado inválido. Use P/E/T/C o su nombre.");
      tarea.estado = e;
    }
  }
  if (cambios.dificultad !== undefined) {
    if (cambios.dificultad === "") {
      // mantener
    } else {
      const d = DificultadDesdeEntrada(cambios.dificultad);
      if (!d) throw new Error("Dificultad inválida. Use 1/2/3 o F/M/D.");
      tarea.dificultad = d;
    }
  }
  if (cambios.vencimiento !== undefined) {
    if (cambios.vencimiento === "") {
      // mantener
    } else if (cambios.vencimiento === " ") {
      tarea.vencimiento = null;
    } else {
      const fecha = parseFecha(cambios.vencimiento);
      if (!fecha) throw new Error("Fecha de vencimiento inválida.");
      tarea.vencimiento = fecha;
    }
  }
  tarea.ultimaEdicion = new Date();
}

// --- App principal ---
async function main() {
  const io = crearConsoleIO();
  const repo = crearTareaRepo();
  await seedDemo(repo);

  let salir = false;
  while (!salir) {
    console.clear();
    console.log("¡Hola Usuario!\n");
    console.log("¿Qué desea hacer?\n");
    console.log("[1] Ver mis tareas");
    console.log("[2] Buscar una tarea");
    console.log("[3] Agregar una tarea");
    console.log("[0] Salir\n");
    const op = (await io.ask("> ")).trim();
    switch (op) {
      case "1":
        await menuVerMisTareas(io, repo);
        break;
      case "2":
        await menuBuscarTarea(io, repo);
        break;
      case "3":
        await menuAgregarTarea(io, repo);
        break;
      case "0":
        salir = true;
        break;
      default:
        await pauseMsg(io, "Opción inválida. Intente nuevamente.");
    }
  }
  io.close();
  console.log("¡Hasta luego!");
}

async function menuVerMisTareas(io: ReturnType<typeof crearConsoleIO>, repo: TareaRepoType) {
  let volver = false;
  while (!volver) {
    console.clear();
    console.log("¿Qué tarea desea ver?\n");
    console.log("[1] Todas");
    console.log("[2] Pendientes");
    console.log("[3] En curso");
    console.log("[4] Terminadas");
    console.log("[0] Volver\n");
    const op = (await io.ask("> ")).trim();
    switch (op) {
      case "1":
        await listadoTareas(io, repoGetAll(repo), "Todas tus tareas");
        break;
      case "2":
        await listadoTareas(io, repoFilterByEstado(repo, Estado.PENDIENTE), "Tareas Pendientes");
        break;
      case "3":
        await listadoTareas(io, repoFilterByEstado(repo, Estado.EN_CURSO), "Tareas En curso");
        break;
      case "4":
        await listadoTareas(io, repoFilterByEstado(repo, Estado.TERMINADA), "Tareas Terminadas");
        break;
      case "0":
        volver = true;
        break;
      default:
        await pauseMsg(io, "Opción inválida. Intente nuevamente.");
    }
  }
}

async function listadoTareas(io: ReturnType<typeof crearConsoleIO>, tareas: TareaType[], titulo: string) {
  const ordenadas = [...tareas].sort((a, b) => a.titulo.localeCompare(b.titulo, undefined, { sensitivity: "base" }));
  while (true) {
    console.clear();
    console.log(`${titulo}.\n`);
    if (ordenadas.length === 0) {
      console.log("(No hay tareas para mostrar)\n");
      await pauseMsg(io, "Presiona Enter para volver...");
      return;
    }
    ordenadas.forEach((t, i) => {
      console.log(`[${i + 1}] ${t.titulo}`);
    });
    console.log("\n¿Deseas ver los detalles de alguna?");
    console.log("Introduce el número para verla o 0 para volver.");
    const op = (await io.ask("> ")).trim();
    if (op === "0") return;
    const idx = Number.parseInt(op, 10);
    if (Number.isNaN(idx) || idx < 1 || idx > ordenadas.length) {
      await pauseMsg(io, "Opción inválida. Intente nuevamente.");
      continue;
    }
    const tarea = ordenadas[idx - 1];
    await menuDetallesTarea(io, tarea);
  }
}

async function menuDetallesTarea(io: ReturnType<typeof crearConsoleIO>, tarea: TareaType) {
  while (true) {
    console.clear();
    console.log("Esta es la tarea que elegiste.\n");
    console.log(`\t${tarea.titulo}`);
    console.log(`\t${tarea.descripcion ? tarea.descripcion : "(Sin descripción)"}`);
    console.log(`\tEstado: ${tarea.estado.label}`);
    console.log(`\tDificultad: ${mostrarDificultad(tarea.dificultad)}`);
    console.log(`\tVencimiento: ${tarea.vencimiento ? formatFecha(tarea.vencimiento) : "Sin datos"}`);
    console.log(`\tCreación: ${formatFecha(tarea.creacion)}`);
    console.log(`\tÚltima edición: ${formatFecha(tarea.ultimaEdicion)}\n`);
    console.log("Si deseas editarla selecciona E, si no 0 para volver");
    const op = (await io.ask("> ")).trim().toUpperCase();
    if (op === "0") return;
    if (op === "E") {
      await menuEdicionTarea(io, tarea);
    } else {
      await pauseMsg(io, "Opción inválida. Intente nuevamente.");
    }
  }
}

async function menuEdicionTarea(io: ReturnType<typeof crearConsoleIO>, tarea: TareaType) {
  while (true) {
    console.clear();
    console.log(`Estas editando la tarea: ${tarea.titulo}`);
    console.log(" - Si deseas mantener los valores de un atributo simplemente dejalo en blanco");
    console.log(" - Si deseas dejar en blanco un atributo, escribe un espacio");
    console.log("");
    const nuevaDesc = await io.ask("1. Ingresa la descripción: ");
    const nuevoEstado = await io.ask("2. Estado([P]endiente/[E]n curso/[T]erminada/[C]ancelada): ");
    const nuevaDific = await io.ask("3. Dificultad([1]/[2]/[3]): ");
    const nuevoVenc = await io.ask("4. Vencimiento (YYYY-MM-DD o DD/MM/YYYY opcional HH:mm): ");
    try {
      actualizarTarea(tarea, { descripcion: nuevaDesc, estado: nuevoEstado, dificultad: nuevaDific, vencimiento: nuevoVenc });
      console.log("\n¡Datos guardados!");
      await pauseMsg(io, "Presiona Enter para continuar...");
      return;
    } catch (e: any) {
      console.log(`\nError: ${e.message}`);
      const retry = (await io.ask("¿Deseas reintentar? (S/N): ")).trim().toUpperCase();
      if (retry !== "S") return;
    }
  }
}

async function menuBuscarTarea(io: ReturnType<typeof crearConsoleIO>, repo: TareaRepoType) {
  while (true) {
    console.clear();
    console.log("Introduce el título de una tarea para buscarla");
    const q = await io.ask("> ");
    const query = q.trim();
    if (query.length === 0) {
      const back = (await io.ask("Búsqueda vacía. ¿Volver? (S/N): ")).trim().toUpperCase();
      if (back === "S") return;
      continue;
    }
    const resultados = repoSearchByTitle(repo, query);
    if (resultados.length === 0) {
      console.log("\nNo hay tareas relacionadas con la búsqueda.\n");
      await pauseMsg(io, "Presiona Enter para continuar...");
      return;
    }
    await listadoTareas(io, resultados, "Estas son las tareas relacionadas");
    return;
  }
}

async function menuAgregarTarea(io: ReturnType<typeof crearConsoleIO>, repo: TareaRepoType) {
  while (true) {
    console.clear();
    console.log("Estas creando una nueva tarea.\n");
    const titulo = (await io.ask("1. Ingresa el título: ")).trim();
    const descripcion = await io.ask("2. Ingresa la descripción: ");
    const estadoIn = await io.ask("3. Estado ([P]endiente/[E]n curso/[T]erminada/[C]ancelada) [Enter para P]: ");
    const dificIn = await io.ask("4. Dificultad ([1]/[2]/[3]) [Enter para 1]: ");
    const vencIn = await io.ask("5. Vencimiento (YYYY-MM-DD o DD/MM/YYYY opcional HH:mm) [opcional]: ");
    try {
      if (!titulo || titulo.length === 0 || titulo.length > 100) {
        throw new Error("Título inválido: obligatorio, 1..100 caracteres.");
      }
      let estado = estadoIn.trim() === "" ? Estado.PENDIENTE : EstadoDesdeEntrada(estadoIn);
      if (!estado) throw new Error("Estado inválido. Use P/E/T/C o su nombre.");
      let dificultad = dificIn.trim() === "" ? Dificultad.FACIL : DificultadDesdeEntrada(dificIn);
      if (!dificultad) throw new Error("Dificultad inválida. Use 1/2/3 o F/M/D.");
      let vencimiento = null;
      if (vencIn && vencIn.trim() !== "") {
        const f = parseFecha(vencIn);
        if (!f) throw new Error("Fecha de vencimiento inválida.");
        vencimiento = f;
      }
      const tarea = crearTarea({ titulo, descripcion, estado, dificultad, vencimiento });
      repoAdd(repo, tarea);
      console.log("\n¡Datos guardados!");
      await pauseMsg(io, "Presiona Enter para continuar...");
      return;
    } catch (e: any) {
      console.log(`\nError: ${e.message}`);
      const retry = (await io.ask("¿Deseas reintentar? (S/N): ")).trim().toUpperCase();
      if (retry !== "S") return;
    }
  }
}

async function pauseMsg(io: ReturnType<typeof crearConsoleIO>, msg: string) {
  await io.ask(`\n${msg}`);
}

async function seedDemo(repo: TareaRepoType) {
  if (repoGetAll(repo).length > 0) return;
  repoAdd(repo, crearTarea({ titulo: "Comprar Huevos", descripcion: "Ir al súper y comprar una docena", estado: Estado.PENDIENTE, dificultad: Dificultad.FACIL }));
  repoAdd(repo, crearTarea({ titulo: "Pasear al perro", descripcion: "Ejercitar 30 minutos", estado: Estado.EN_CURSO, dificultad: Dificultad.MEDIO, vencimiento: parseFecha("2025-12-01 18:00") }));
  repoAdd(repo, crearTarea({ titulo: "Terminar práctico de BD", descripcion: null, estado: Estado.TERMINADA, dificultad: Dificultad.DIFICIL }));
}

// --- Main ---
main();
