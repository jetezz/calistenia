/**
 * Test Seeder - Genera datos de prueba predecibles para tests E2E
 *
 * Este seeder crea horarios (time_slots) que siempre serán válidos
 * independientemente del día en que se ejecuten los tests.
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import path from "path";
import { addDays, format, getDay } from "date-fns";

// Cargar variables de entorno de test
config({ path: path.resolve(process.cwd(), ".env.test") });
config({ path: path.resolve(process.cwd(), ".env") });

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const adminEmail = process.env.ADMIN_EMAIL || process.env.VITE_ADMIN_EMAIL;
const adminPassword =
  process.env.ADMIN_PASSWORD || process.env.VITE_ADMIN_PASSWORD;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)",
  );
}

if (!adminEmail || !adminPassword) {
  throw new Error("Missing admin credentials (ADMIN_EMAIL, ADMIN_PASSWORD)");
}

// Desactivar verificación SSL para desarrollo local
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// IDs fijos para los slots de test (UUIDs válidos para poder limpiarlos fácilmente)
// Estos UUIDs están prefijados con "00000000" para identificarlos fácilmente como datos de test
export const TEST_SLOT_IDS = {
  RECURRING: "00000000-0000-0000-0000-000000000001",
  SPECIFIC: "00000000-0000-0000-0000-000000000002",
  BOOK10: "00000000-0000-0000-0000-000000000010", // Two-user booking flow test
};

// Configuración de horarios de test
export const TEST_SLOT_CONFIG = {
  RECURRING: {
    startTime: "10:00:00",
    endTime: "11:00:00",
    capacity: 5,
  },
  SPECIFIC: {
    startTime: "12:00:00",
    endTime: "13:00:00",
    capacity: 5,
  },
  BOOK10: {
    dayOfWeek: 4, // Jueves (Thursday)
    startTime: "14:00:00",
    endTime: "15:00:00",
    capacity: 6,
  },
};

export const TEST_PENDING_USER = {
  email: process.env.TEST_PENDING_USER_EMAIL || "pending.e2e.user@example.com",
  password: process.env.TEST_PENDING_USER_PASSWORD || "Password123!",
  fullName: process.env.TEST_PENDING_USER_FULL_NAME || "Pending E2E User",
};

export const TEST_CLIENT2_USER = {
  email: process.env.CLIENT2_EMAIL || "client2.e2e.test@example.com",
  password: process.env.CLIENT2_PASSWORD || "Password123!",
  fullName: "Client Two E2E",
};

/**
 * Obtiene el día de la semana para una fecha dada (0=Domingo, 6=Sábado)
 */
function getDayOfWeek(date: Date): number {
  return getDay(date); // date-fns getDay returns 0-6 (Sun-Sat)
}

/**
 * Día de la semana para el slot RECURRENTE: Sábado (6)
 * Siempre aparecerá en la siguiente semana porque la semana empieza el lunes
 */
export const RECURRING_DAY_OF_WEEK = 6; // Sábado

/**
 * Calcula el próximo domingo (siguiente semana)
 * Este será el día para el slot ESPECÍFICO
 */
export function getNextSundayDate(): Date {
  const today = new Date();
  const currentDay = getDay(today); // 0=Domingo, 6=Sábado

  // Queremos el domingo de la SIGUIENTE semana.
  // Primero encontramos cuantos días faltan para el domingo de ESTA semana.
  // Si hoy es domingo (0), faltan 0 días para el domingo de esta semana.
  // Si hoy es lunes (1), faltan 6 días.
  const daysUntilCurrentSunday = (7 - currentDay) % 7;

  // Sumamos 7 días adicionales para ir al domingo de la semana siguiente
  return addDays(today, daysUntilCurrentSunday + 7);
}

/**
 * Calcula el día de la semana que tendrá la fecha del slot recurrente
 * Ahora siempre devuelve Sábado (6)
 */
export function getRecurringDayForNextWeek(): number {
  return RECURRING_DAY_OF_WEEK;
}

/**
 * Autentica como admin
 */
async function authenticateAsAdmin(client: SupabaseClient): Promise<string> {
  const { data, error } = await client.auth.signInWithPassword({
    email: adminEmail!,
    password: adminPassword!,
  });

  if (error) {
    throw new Error(`Failed to authenticate as admin: ${error.message}`);
  }

  if (!data.user) {
    throw new Error("Authentication succeeded but no user returned");
  }

  return data.user.id;
}

async function ensurePendingTestUser(): Promise<{
  email: string;
  password: string;
  fullName: string;
  userId: string;
}> {
  console.log("👤 Ensuring pending test user...");

  await authenticateAsAdmin(supabase);

  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", TEST_PENDING_USER.email)
    .maybeSingle();

  let userId = existingProfile?.id as string | undefined;

  if (!userId) {
    const { data: createdUserId, error: createError } = await supabase.rpc(
      "admin_create_user",
      {
        p_email: TEST_PENDING_USER.email,
        p_password: TEST_PENDING_USER.password,
        p_full_name: TEST_PENDING_USER.fullName,
      },
    );

    if (createError || !createdUserId) {
      throw new Error(
        `Failed to create pending test user: ${createError?.message || "unknown error"}`,
      );
    }

    userId = createdUserId;
  }

  const { error: normalizeError } = await supabase
    .from("profiles")
    .update({
      approval_status: "pending",
      role: "user",
      full_name: TEST_PENDING_USER.fullName,
      credits: 0,
      payment_status: "none",
    })
    .eq("id", userId);

  if (normalizeError) {
    throw new Error(
      `Failed to normalize pending test user profile: ${normalizeError.message}`,
    );
  }

  await supabase.auth.signOut();
  console.log(`✅ Pending test user ready: ${TEST_PENDING_USER.email}`);

  return {
    email: TEST_PENDING_USER.email,
    password: TEST_PENDING_USER.password,
    fullName: TEST_PENDING_USER.fullName,
    userId,
  };
}

async function cleanupPendingTestUser(): Promise<void> {
  console.log("🧹 Cleaning pending test user...");

  await authenticateAsAdmin(supabase);

  const { data: pendingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", TEST_PENDING_USER.email)
    .maybeSingle();

  if (pendingProfile?.id) {
    const { error: deleteError } = await supabase.rpc("admin_delete_user", {
      p_user_id: pendingProfile.id,
    });

    if (deleteError) {
      console.warn(
        "⚠️  Warning cleaning pending test user:",
        deleteError.message,
      );
    }
  }

  await supabase.auth.signOut();
  console.log("✅ Pending test user cleaned");
}

/**
 * Crea o normaliza el segundo usuario cliente de test (usado en BOOK-10)
 */
export async function ensureClient2User(): Promise<{
  email: string;
  password: string;
  fullName: string;
  userId: string;
}> {
  console.log("👤 Ensuring client2 test user...");

  await authenticateAsAdmin(supabase);

  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", TEST_CLIENT2_USER.email)
    .maybeSingle();

  let userId = existingProfile?.id as string | undefined;

  if (!userId) {
    const { data: createdUserId, error: createError } = await supabase.rpc(
      "admin_create_user",
      {
        p_email: TEST_CLIENT2_USER.email,
        p_password: TEST_CLIENT2_USER.password,
        p_full_name: TEST_CLIENT2_USER.fullName,
      },
    );

    if (createError || !createdUserId) {
      throw new Error(
        `Failed to create client2 test user: ${createError?.message || "unknown error"}`,
      );
    }

    userId = createdUserId;
  }

  // Ensure client2 is approved with credits
  const { error: normalizeError } = await supabase
    .from("profiles")
    .update({
      approval_status: "approved",
      role: "user",
      full_name: TEST_CLIENT2_USER.fullName,
      credits: 10,
      payment_status: "paid",
    })
    .eq("id", userId);

  if (normalizeError) {
    throw new Error(
      `Failed to normalize client2 test user profile: ${normalizeError.message}`,
    );
  }

  await supabase.auth.signOut();
  console.log(`✅ Client2 test user ready: ${TEST_CLIENT2_USER.email}`);

  return {
    email: TEST_CLIENT2_USER.email,
    password: TEST_CLIENT2_USER.password,
    fullName: TEST_CLIENT2_USER.fullName,
    userId: userId!,
  };
}

/**
 * Limpia el usuario cliente2 de test
 */
export async function cleanupClient2User(): Promise<void> {
  console.log("🧹 Cleaning client2 test user...");

  await authenticateAsAdmin(supabase);

  const { data: client2Profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", TEST_CLIENT2_USER.email)
    .maybeSingle();

  if (client2Profile?.id) {
    const { error: deleteError } = await supabase.rpc("admin_delete_user", {
      p_user_id: client2Profile.id,
    });

    if (deleteError) {
      console.warn(
        "⚠️  Warning cleaning client2 test user:",
        deleteError.message,
      );
    }
  }

  await supabase.auth.signOut();
  console.log("✅ Client2 test user cleaned");
}

/**
 * Limpia los slots de test existentes
 */
export async function cleanTestSlots(): Promise<void> {
  console.log("🧹 Cleaning test slots...");

  await authenticateAsAdmin(supabase);

  // Eliminar bookings asociados a los slots de test
  const { error: bookingsError } = await supabase
    .from("bookings")
    .delete()
    .in("time_slot_id", Object.values(TEST_SLOT_IDS));

  if (bookingsError) {
    console.warn("⚠️  Warning cleaning test bookings:", bookingsError.message);
  }

  // Eliminar los slots de test
  const { error: slotsError } = await supabase
    .from("time_slots")
    .delete()
    .in("id", Object.values(TEST_SLOT_IDS));

  if (slotsError) {
    console.warn("⚠️  Warning cleaning test slots:", slotsError.message);
  }

  // También limpiar slots que puedan tener los mismos horarios de test
  // (creados manualmente durante tests anteriores)
  const { error: oldSlotsError } = await supabase
    .from("time_slots")
    .delete()
    .or(
      `start_time.eq.${TEST_SLOT_CONFIG.RECURRING.startTime},start_time.eq.${TEST_SLOT_CONFIG.SPECIFIC.startTime}`,
    );

  if (oldSlotsError) {
    console.warn("⚠️  Warning cleaning old test slots:", oldSlotsError.message);
  }

  await supabase.auth.signOut();
  console.log("✅ Test slots cleaned");
}

/**
 * Crea los slots de test necesarios
 * - Slot RECURRENTE: Sábado (día 6)
 * - Slot ESPECÍFICO: Próximo domingo (fecha específica)
 * - Slot BOOK10: Jueves (día 4) - para test de flujo de reservas de dos usuarios
 */
export async function seedTestSlots(): Promise<{
  recurringSlotId: string;
  specificSlotId: string;
  book10SlotId: string;
  specificDate: string;
  recurringDay: number;
  specificDay: number;
}> {
  console.log("🌱 Seeding test slots...");

  const adminId = await authenticateAsAdmin(supabase);

  // Calcular fechas
  const recurringDay = RECURRING_DAY_OF_WEEK; // Sábado (6)
  const nextSunday = getNextSundayDate(); // Próximo domingo
  const specificDateStr = format(nextSunday, "yyyy-MM-dd");
  const specificDay = getDayOfWeek(nextSunday); // Siempre 0 (Domingo)

  console.log(`📅 Recurring slot: Sábado (día ${recurringDay})`);
  console.log(
    `📅 Specific slot: ${specificDateStr} (Domingo, día ${specificDay})`,
  );

  // 1. Crear slot RECURRENTE para SÁBADO
  // Este slot será visible en el sábado de cualquier semana
  const { data: recurringSlot, error: recurringError } = await supabase
    .from("time_slots")
    .upsert(
      {
        id: TEST_SLOT_IDS.RECURRING,
        day_of_week: recurringDay, // Sábado (6)
        start_time: TEST_SLOT_CONFIG.RECURRING.startTime,
        end_time: TEST_SLOT_CONFIG.RECURRING.endTime,
        capacity: TEST_SLOT_CONFIG.RECURRING.capacity,
        is_active: true,
        slot_type: "recurring",
        specific_date: null,
        created_by: adminId,
      },
      { onConflict: "id" },
    )
    .select()
    .single();

  if (recurringError) {
    throw new Error(
      `Failed to create recurring slot: ${recurringError.message}`,
    );
  }

  console.log(
    `✅ Created recurring slot for Sábado (día ${recurringDay}): ${TEST_SLOT_CONFIG.RECURRING.startTime} - ${TEST_SLOT_CONFIG.RECURRING.endTime}`,
  );

  // 2. Crear slot ESPECÍFICO para el próximo DOMINGO
  const { data: specificSlot, error: specificError } = await supabase
    .from("time_slots")
    .upsert(
      {
        id: TEST_SLOT_IDS.SPECIFIC,
        day_of_week: specificDay, // Domingo (0)
        start_time: TEST_SLOT_CONFIG.SPECIFIC.startTime,
        end_time: TEST_SLOT_CONFIG.SPECIFIC.endTime,
        capacity: TEST_SLOT_CONFIG.SPECIFIC.capacity,
        is_active: true,
        slot_type: "specific_date",
        specific_date: specificDateStr,
        created_by: adminId,
      },
      { onConflict: "id" },
    )
    .select()
    .single();

  if (specificError) {
    throw new Error(`Failed to create specific slot: ${specificError.message}`);
  }

  console.log(
    `✅ Created specific slot for ${specificDateStr} (Domingo): ${TEST_SLOT_CONFIG.SPECIFIC.startTime} - ${TEST_SLOT_CONFIG.SPECIFIC.endTime}`,
  );

  // 3. Crear slot BOOK10 para JUEVES (día 4) a las 19:00-20:00
  // Usado para el test BOOK-10: flujo de reserva con dos usuarios
  const { data: book10Slot, error: book10Error } = await supabase
    .from("time_slots")
    .upsert(
      {
        id: TEST_SLOT_IDS.BOOK10,
        day_of_week: TEST_SLOT_CONFIG.BOOK10.dayOfWeek, // Jueves (4)
        start_time: TEST_SLOT_CONFIG.BOOK10.startTime,
        end_time: TEST_SLOT_CONFIG.BOOK10.endTime,
        capacity: TEST_SLOT_CONFIG.BOOK10.capacity,
        is_active: true,
        slot_type: "recurring",
        specific_date: null,
        created_by: adminId,
      },
      { onConflict: "id" },
    )
    .select()
    .single();

  if (book10Error) {
    throw new Error(`Failed to create BOOK10 slot: ${book10Error.message}`);
  }

  console.log(
    `✅ Created BOOK10 slot for Jueves (día ${TEST_SLOT_CONFIG.BOOK10.dayOfWeek}): ${TEST_SLOT_CONFIG.BOOK10.startTime} - ${TEST_SLOT_CONFIG.BOOK10.endTime}`,
  );

  await supabase.auth.signOut();

  return {
    recurringSlotId: recurringSlot.id,
    specificSlotId: specificSlot.id,
    book10SlotId: book10Slot.id,
    specificDate: specificDateStr,
    recurringDay,
    specificDay,
  };
}

/**
 * Setup completo: limpia y crea los slots de test
 */
export async function setupTestData(): Promise<{
  recurringSlotId: string;
  specificSlotId: string;
  book10SlotId: string;
  specificDate: string;
  recurringDay: number;
  specificDay: number;
  pendingUserEmail: string;
  pendingUserPassword: string;
  pendingUserFullName: string;
  client2Email: string;
  client2Password: string;
}> {
  console.log("\n🚀 Setting up test data...\n");

  await cleanTestSlots();
  const pendingUser = await ensurePendingTestUser();
  const client2User = await ensureClient2User();
  const result = await seedTestSlots();

  console.log("\n✨ Test data setup complete!\n");
  console.log("📋 Summary:");
  console.log(
    `   - Recurring slot: Sábado (día ${result.recurringDay}) at ${TEST_SLOT_CONFIG.RECURRING.startTime}`,
  );
  console.log(
    `   - Specific slot: ${result.specificDate} (Domingo, día ${result.specificDay}) at ${TEST_SLOT_CONFIG.SPECIFIC.startTime}`,
  );
  console.log("");

  return {
    ...result,
    pendingUserEmail: pendingUser.email,
    pendingUserPassword: pendingUser.password,
    pendingUserFullName: pendingUser.fullName,
    client2Email: client2User.email,
    client2Password: client2User.password,
  };
}

/**
 * Limpia solo las reservas del slot BOOK10 (sin eliminar el slot)
 * Usado en beforeEach de BOOK-10 para empezar desde cero
 */
export async function cleanBook10Bookings(): Promise<void> {
  await authenticateAsAdmin(supabase);

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("time_slot_id", TEST_SLOT_IDS.BOOK10);

  if (error) {
    console.warn("⚠️  Warning cleaning BOOK10 bookings:", error.message);
  }

  await supabase.auth.signOut();
}

/**
 * Teardown: limpia los datos de test
 */
export async function teardownTestData(): Promise<void> {  console.log("\n🧹 Tearing down test data...\n");
  await cleanTestSlots();
  await cleanupPendingTestUser();
  await cleanupClient2User();
  console.log("✅ Teardown complete!\n");
}

// Si se ejecuta directamente
if (import.meta.url === `file://${process.argv[1].replace(/\\/g, "/")}`) {
  setupTestData()
    .then(() => {
      console.log("✅ Seeder executed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Seeder failed:", error);
      process.exit(1);
    });
}
