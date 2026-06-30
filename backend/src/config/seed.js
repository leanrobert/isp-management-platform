const bcrypt = require("bcryptjs");
const pool = require("./database");

// ─── Datos de clientes ────────────────────────────────────────────────────────

const CLIENTS = [
  // Activos — plan Básico (plan_id=1)
  { full_name: "Carlos Mendoza", email: "c.mendoza@gmail.com", phone: "1145678901", address: "Av. Corrientes 2345, CABA", plan_id: 1, status: "active" },
  { full_name: "Ana Gómez", email: "ana.gomez@outlook.com", phone: "1167890123", address: "Calle 9 N°123, La Plata", plan_id: 1, status: "active" },
  { full_name: "Roberto Fernández", email: "rfernandez@yahoo.com", phone: "2914561234", address: "San Martín 800, Bahía Blanca", plan_id: 1, status: "suspended" },

  // Activos — plan Estándar (plan_id=2)
  { full_name: "Lucía Torres", email: "lucia.torres@gmail.com", phone: "1150001234", address: "Av. Santa Fe 4100, CABA", plan_id: 2, status: "active" },
  { full_name: "Martín López", email: "mlopez@hotmail.com", phone: "3514783920", address: "Bv. Chacabuco 260, Córdoba", plan_id: 2, status: "active" },
  { full_name: "Sofía Ramírez", email: "sofia.ramirez@gmail.com", phone: "3414223344", address: "Pellegrini 1500, Rosario", plan_id: 2, status: "active" },
  { full_name: "Diego Suárez", email: "dsuarez@gmail.com", phone: "2614501234", address: "Av. España 150, Mendoza", plan_id: 2, status: "active" },
  { full_name: "Valentina Herrera", email: "v.herrera@gmail.com", phone: "3814667788", address: "Las Heras 220, Tucumán", plan_id: 2, status: "suspended" },
  { full_name: "Nicolás Moreno", email: "nmoreno@icloud.com", phone: "2604321567", address: "Rivadavia 900, San Juan", plan_id: 2, status: "active" },

  // Activos — plan Premium (plan_id=3)
  { full_name: "Camila Rojas", email: "camila.rojas@gmail.com", phone: "1133445566", address: "Av. del Libertador 5200, CABA", plan_id: 3, status: "active" },
  { full_name: "Javier Díaz", email: "javier.diaz@gmail.com", phone: "3434112233", address: "Alberdi 750, Paraná", plan_id: 3, status: "active" },
  { full_name: "María Paz Gutiérrez", email: "mpaz.gutierrez@gmail.com", phone: "2944510002", address: "Mitre 340, Neuquén", plan_id: 3, status: "active" },
  { full_name: "Fernando Castro", email: "fcastro@outlook.com", phone: "2616789900", address: "Rawson 1200, Mendoza", plan_id: 3, status: "cancelled" },
  { full_name: "Laura Jiménez", email: "laura.jimenez@gmail.com", phone: "3834450099", address: "Tucumán 560, Salta", plan_id: 3, status: "active" },

  // Activos — plan Empresa (plan_id=4)
  { full_name: "Grupo Inversiones SA", email: "admin@grupoinversiones.com.ar", phone: "1143218765", address: "Maipú 1300, CABA", plan_id: 4, status: "active" },
  { full_name: "Comercial del Sur SRL", email: "sistemas@comercialdelsur.com.ar", phone: "2914449900", address: "Drago 80, Bahía Blanca", plan_id: 4, status: "active" },
  { full_name: "TechSolutions Córdoba", email: "it@techsolutionscba.com.ar", phone: "3514900123", address: "Rafael Núñez 4800, Córdoba", plan_id: 4, status: "active" },
  { full_name: "Distribuidora Norte SA", email: "soporte@distnorte.com.ar", phone: "3884120034", address: "Jujuy 200, Jujuy", plan_id: 4, status: "active" },
  { full_name: "Agencia Web Rosario", email: "dev@agenciawebrosario.com.ar", phone: "3416001199", address: "Córdoba 1080, Rosario", plan_id: 4, status: "suspended" },
  { full_name: "Constructora Andina", email: "oficina@constructoraandina.com.ar", phone: "2614775544", address: "Godoy Cruz 3300, Mendoza", plan_id: 4, status: "cancelled" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slug(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .join(".");
}

function randomIp(index) {
  const third = Math.floor(index / 254) + 10;
  const fourth = (index % 254) + 1;
  return `10.0.${third}.${fourth}`;
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Genera una fecha aleatoria dentro del mes indicado
function randomDateInMonth(year, month) {
  const day = randomBetween(1, 28);
  const hour = randomBetween(0, 23);
  const minute = randomBetween(0, 59);
  // month is 1-based
  return new Date(year, month - 1, day, hour, minute, 0);
}

// ─── Seeder principal ─────────────────────────────────────────────────────────

async function seed() {
  const conn = await pool.getConnection();
  try {
    console.log("Iniciando seeder...");

    // Verificar si ya hay clientes para evitar duplicados
    const [existing] = await conn.execute("SELECT COUNT(*) AS cnt FROM clients");
    if (existing[0].cnt > 0) {
      console.log(`Ya existen ${existing[0].cnt} clientes. Abortando para evitar duplicados.`);
      console.log("Ejecutá 'npm run migrate' para limpiar y reiniciar la base.");
      process.exit(0);
    }

    // Hash de contraseña compartida para todos los usuarios de prueba
    console.log("Generando hash de contraseña...");
    const passwordHash = await bcrypt.hash("isp1234", 10);

    // ── 1. Insertar clientes ──────────────────────────────────────────────────
    console.log(`Insertando ${CLIENTS.length} clientes...`);
    const clientIds = [];
    for (const c of CLIENTS) {
      const [res] = await conn.execute(
        `INSERT INTO clients (full_name, email, phone, address, plan_id, status)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [c.full_name, c.email, c.phone, c.address, c.plan_id, c.status]
      );
      clientIds.push({ id: res.insertId, ...c });
    }

    // ── 2. Insertar usuarios PPPoE ────────────────────────────────────────────
    console.log("Insertando usuarios PPPoE...");
    const pppoeIds = [];
    for (let i = 0; i < clientIds.length; i++) {
      const client = clientIds[i];
      const username = `${slug(client.full_name)}${String(i + 1).padStart(3, "0")}`;
      const ip = randomIp(i);
      const pppoeStatus = client.status === "active" ? "active" : "inactive";

      // last_connected: null para suspended/cancelled, reciente para activos
      let lastConnected = null;
      if (pppoeStatus === "active") {
        const hoursAgo = randomBetween(1, 72);
        lastConnected = new Date(Date.now() - hoursAgo * 3600 * 1000);
      }

      const [res] = await conn.execute(
        `INSERT INTO pppoe_users (client_id, username, password_hash, ip_address, last_connected, status)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [client.id, username, passwordHash, ip, lastConnected, pppoeStatus]
      );
      pppoeIds.push({ id: res.insertId, clientId: client.id, clientStatus: client.status });
    }

    // ── 3. Insertar sesiones de accounting (últimos 3 meses) ─────────────────
    console.log("Insertando sesiones de accounting...");
    const now = new Date();
    const months = [];
    for (let m = 2; m >= 0; m--) {
      const d = new Date(now.getFullYear(), now.getMonth() - m, 1);
      months.push({ year: d.getFullYear(), month: d.getMonth() + 1 });
    }

    for (const pppoe of pppoeIds) {
      if (pppoe.clientStatus === "cancelled") continue; // sin sesiones para cancelados

      for (const { year, month } of months) {
        const sessionCount = randomBetween(3, 8);
        for (let s = 0; s < sessionCount; s++) {
          const start = randomDateInMonth(year, month);
          const durationSec = randomBetween(1800, 28800); // 30 min – 8 horas
          const end = new Date(start.getTime() + durationSec * 1000);
          const bytesIn = randomBetween(50, 5000) * 1024 * 1024; // 50MB–5GB
          const bytesOut = randomBetween(10, 500) * 1024 * 1024; // 10MB–500MB

          await conn.execute(
            `INSERT INTO accounting_sessions
               (pppoe_user_id, session_start, session_end, bytes_in, bytes_out, duration_seconds)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [pppoe.id, start, end, bytesIn, bytesOut, durationSec]
          );
        }
      }
    }

    // ── 4. Insertar quota_usage (últimos 3 meses) ─────────────────────────────
    console.log("Insertando registros de quota_usage...");

    // Obtener planes para saber el límite en bytes
    const [plans] = await conn.execute("SELECT id, quota_gb FROM plans");
    const planMap = Object.fromEntries(plans.map((p) => [p.id, p.quota_gb]));

    for (const client of clientIds) {
      if (client.status === "cancelled") continue;

      const quotaGb = planMap[client.plan_id] || 500;
      const quotaBytes = quotaGb * 1024 * 1024 * 1024;

      for (const { year, month } of months) {
        // Consumo aleatorio: la mayoría bajo el límite, algunos lo superan
        const exceedChance = Math.random();
        let bytesConsumed;
        if (exceedChance < 0.15) {
          // ~15% supera la cuota
          bytesConsumed = Math.floor(quotaBytes * (1 + Math.random() * 0.5));
        } else {
          bytesConsumed = Math.floor(quotaBytes * Math.random() * 0.9);
        }
        const exceeded = bytesConsumed >= quotaBytes;

        await conn.execute(
          `INSERT IGNORE INTO quota_usage
             (client_id, period_year, period_month, bytes_consumed, quota_exceeded)
           VALUES (?, ?, ?, ?, ?)`,
          [client.id, year, month, bytesConsumed, exceeded]
        );
      }
    }

    console.log("✔ Seeder completado exitosamente.");
    console.log(`  • ${clientIds.length} clientes`);
    console.log(`  • ${pppoeIds.length} usuarios PPPoE  (contraseña: isp1234)`);
    console.log(`  • Sesiones de accounting para los últimos 3 meses`);
    console.log(`  • Registros de quota_usage para los últimos 3 meses`);
  } catch (err) {
    console.error("Seeder falló:", err);
    process.exit(1);
  } finally {
    conn.release();
    process.exit(0);
  }
}

seed();
