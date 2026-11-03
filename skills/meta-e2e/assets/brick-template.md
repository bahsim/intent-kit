# Playwright Brick Template

Use only when the project adopts reusable Playwright actions. Place the file according to the
project's existing test layout. Keep one responsibility per brick and pass variable inputs as
parameters.

```ts
import { expect, type Page } from '@playwright/test'

/**
 * @brick openDetails
 * @does Open the details view for one named item.
 * @params page: Page; itemName: string
 * @returns void
 * @verified YYYY-MM-DD (project E2E command | approved browser | unit test)
 */
export async function openDetails(page: Page, itemName: string): Promise<void> {
  await page.getByRole('button', { name: itemName, exact: true }).click()
  await expect(page.getByRole('heading', { name: itemName })).toBeVisible()
}
```

Rules: use stable locators; avoid sleeps; return data instead of asserting when callers need the
value; restore temporary state; and do not include secrets or restricted identifiers. Run the
project's documented index-generation or consistency check if one exists.
