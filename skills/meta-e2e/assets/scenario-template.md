# Playwright Scenario Template

Use only when the project uses Playwright. Follow the project's own support imports, fixture
conventions, file layout, and test command.

```ts
import { test } from '@playwright/test'
import { openDetails } from '../bricks/details'

// Keep inputs frozen and expectations independently specified for local fixtures.
const cases = [
  { id: 'S-01', itemName: 'fixture-item-a' },
  { id: 'S-02', itemName: 'fixture-item-b' },
]

test.describe('<user-visible behavior>', () => {
  for (const { id, itemName } of cases) {
    test(`${id}: opens details for ${itemName}`, async ({ page }) => {
      // Relative navigation requires `use.baseURL` in the project's Playwright config.
      await page.goto('/')
      // The brick asserts that the details heading is visible; add assertions for what this
      // scenario proves beyond that step.
      await openDetails(page, itemName)
    })
  }
})
```

Use the project's own tags if it distinguishes smoke and regression checks. Run the focused
scenario with the command recorded in project context and link it from the related plan or testing
record.
