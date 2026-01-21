import { test, expect } from "@playwright/test";
import { loginAs, logout } from "../fixtures/auth.fixtures";
import {
  waitForPageLoad,
  waitForLoadingComplete,
  navigateToAdminSection,
} from "../helpers/test-helpers";

test.describe.serial("Flujo de Registro Completo", () => {
  let userEmail: string;
  const userPassword = "Password123!";
  const userFullName = "Test User Auto";

  test.beforeAll(() => {
    // Generar email único para evitar colisiones
    const timestamp = Date.now();
    userEmail = `test.user.${timestamp}@example.com`;
    console.log(`Test User Email: ${userEmail}`);
  });

  test("1. Registro de nuevo usuario", async ({ page }) => {
    await page.goto("/login");
    await waitForPageLoad(page);

    // Cambiar a modo registro
    await page.click('button:has-text("Registrate")');

    // Rellenar formulario
    await page.fill("#fullName", userFullName);
    await page.fill("#email", userEmail);
    await page.fill("#password", userPassword);

    // Enviar formulario
    await page.click('button:has-text("Crear cuenta")');

    // Manejar el comportamiento post-registro
    // Si la app no redirige automáticamente (según análisis del código),
    // verificamos el toast y luego intentamos login si es necesario.
    // El usuario "Quiero realizar un nuevo test de registro. Para ello quiero que analices la db... 1- hacer un registro ver que entra a /pending-approval"

    // Esperar posible redirección o toast
    await page.waitForTimeout(2000);

    // Si seguimos en /login (no hubo auto-login), procedemos a loguearnos manualmente
    const url = page.url();
    if (url.includes("/login")) {
      // Si el formulario se reseteó a login, usamos las credenciales
      // Verificamos si estamos en login mode (buscando botón "Entrar")
      const loginBtn = page.locator('button:has-text("Entrar")');
      if (await loginBtn.isVisible()) {
        await page.fill("#email", userEmail);
        await page.fill("#password", userPassword);
        await loginBtn.click();
      }
    }

    // ATECIÓN: El guard redirige a /pending-approval si el estado es pending
    await expect(page).toHaveURL(/.*pending-approval/, { timeout: 15000 });

    // Verificar contenido de pending approval
    await expect(page.locator("text=Pendiente de Aprobación")).toBeVisible({
      timeout: 10000,
    });

    // Logout para el siguiente paso
    // En página pending-approval debería haber botón de logout?
    // Si no, forzamos navegación o limpiamos cookies, pero lo ideal es usar el botón de salir.
    // Buscamos un botón de "Cerrar sesión" o "Salir" en la página de pending.
    const logoutBtn = page.locator(
      'button:has-text("Cerrar"), button:has-text("Salir")',
    );
    if (await logoutBtn.isVisible()) {
      await logoutBtn.click();
    } else {
      // Fallback: ir a login directamente (limpia estado en algunos casos) o usar logout helper
      await logout(page);
    }
  });

  test("2. Admin aprueba al usuario", async ({ page }) => {
    // Login como admin
    await loginAs(page, "admin");

    // Ir a sección de usuarios
    await navigateToAdminSection(page, "users");

    // Buscar la fila del usuario
    // Asumimos que hay una tabla o lista. Buscamos el contenedor que tiene el email.
    // Esperamos a que cargue la lista
    await waitForLoadingComplete(page);

    // Playwright locator chaining: encontrar elemento (fila/card) que tenga el email
    // Ajustar selector según estructura real (table row o card divs)
    // En users.spec.ts vimos: .locator("table").or(page.locator('[class*="user"]')).or(page.locator('[class*="card"]'))

    // Intentamos buscar un contenedor genérico con el texto del email
    const userRow = page
      .locator('tr, div[class*="card"], div[class*="item"]', {
        hasText: userEmail,
      })
      .first();
    await expect(userRow).toBeVisible({ timeout: 10000 });

    // Dentro de ese contenedor, buscar el botón para expandir (es un botón con icono Chevron)
    // Buscamos cualquier botón que no tenga texto (solo icono) o el botón de la derecha
    // O mejor, buscamos por el svg chevron
    const toggleBtn = userRow.locator(
      "button:has(svg.lucide-chevron-down), button:has(svg.lucide-chevron-up)",
    );

    if (await toggleBtn.isVisible()) {
      await toggleBtn.click();
      await page.waitForTimeout(500); // Esperar animación de expansión
    }

    // Ahora buscar el botón Aprobar
    const approveBtn = userRow.locator('button:has-text("Aprobar")');

    // Si existe el botón, click
    if (await approveBtn.isVisible()) {
      await approveBtn.click();
      // Esperar feedback (toast o cambio de estado)
      await page.waitForTimeout(2000);

      // Verificar que el estado cambió a "Aprobado"
      // El badge debería decir "Aprobado"
      await expect(userRow.locator("text=Aprobado")).toBeVisible();
    } else {
      // Log para debug
      console.log("No se encontró botón Aprobar después de expandir");
      // Verificar si ya estaba aprobado
      if (await userRow.locator("text=Aprobado").isVisible()) {
        console.log("El usuario ya estaba aprobado");
      } else {
        // Intentar entrar al detalle (aunque UserCard tiene acciones inline)
        const viewLink = userRow.locator('a:has-text("Ver detalle")');
        if (await viewLink.isVisible()) {
          await viewLink.click();
          await page.waitForTimeout(1000);
          const detailApproveBtn = page.locator('button:has-text("Aprobar")');
          if (await detailApproveBtn.isVisible()) {
            await detailApproveBtn.click();
            await page.waitForTimeout(2000);
          }
        }
      }
    }

    await logout(page);
  });

  test("3. Login con usuario aprobado", async ({ page }) => {
    await page.goto("/login");
    await waitForPageLoad(page);

    await page.fill("#email", userEmail);
    await page.fill("#password", userPassword);
    await page.click('button:has-text("Entrar")');

    // Ahora debería ir al dashboard (/app) NO a pending-approval
    await expect(page).toHaveURL(/\/app($|\/)/, { timeout: 15000 });
    // Esperar a que termine de cargar (AuthGuard puede mostrar loading)
    await waitForLoadingComplete(page);

    // Verificar que NO estamos en loading state persistente
    await expect(page.locator("text=Cargando perfil...")).not.toBeVisible({
      timeout: 10000,
    });

    await expect(page.locator("main").first()).toBeVisible({ timeout: 10000 });

    // Verificar que NO estamos en pending
    const url = page.url();
    expect(url).not.toContain("pending-approval");

    await logout(page);
  });

  test("4. Admin elimina al usuario", async ({ page }) => {
    await loginAs(page, "admin");
    await navigateToAdminSection(page, "users");

    await waitForLoadingComplete(page);

    // Buscar usuario
    const userRow = page
      .locator('tr, div[class*="card"], div[class*="item"]', {
        hasText: userEmail,
      })
      .first();
    await expect(userRow).toBeVisible();

    // Buscar botón de eliminar/borrar
    // Puede ser un icono de basura o texto "Eliminar"
    // A veces está dentro de un menú "..."

    // Intentamos buscar botón eliminar directo en la fila del admin row
    // PRIMERO: Expandir la tarjeta si es necesario
    const toggleBtn = userRow.locator(
      "button:has(svg.lucide-chevron-down), button:has(svg.lucide-chevron-up)",
    );
    if (await toggleBtn.isVisible()) {
      await toggleBtn.click();
      await page.waitForTimeout(500);
    }

    const deleteBtn = userRow.locator(
      'button:has-text("Eliminar"), button[aria-label*="Eliminar"]',
    );

    if (await deleteBtn.isVisible()) {
      // Click y manejar confirmación
      await deleteBtn.click();

      // Confirmación en modal
      const confirmBtn = page.locator('button:has-text("Eliminar")').last(); // El modal suele tener otro botón eliminar
      await expect(confirmBtn).toBeVisible();
      await confirmBtn.click();

      await page.waitForTimeout(2000); // Esperar a que se procese

      // Verificar que ya no aparece en la lista
      await expect(userRow).not.toBeVisible({ timeout: 10000 });
    } else {
      throw new Error("No se encontró el botón de eliminar usuario");
    }
  });
});
