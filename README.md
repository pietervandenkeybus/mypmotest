# MyPMO — Tablet-first self-service portal (HTML prototype)

A clickable, front-end-only prototype of **MyPMO**, a self-service portal optimized for
iPad / tablet web. Built with vanilla **HTML, CSS, and JavaScript** — no backend, no build
step, no authentication. All data is mocked in `app.js`.

## Run it

Just open `index.html` in any modern browser. No server required.

```
mypmo/
├── index.html   # all screens, modals and the side panel
├── styles.css   # navy header, blue actions, white cards on light grey
├── app.js       # mock data, navigation, flows, filters, tabs, modals
└── README.md
```

For the most realistic experience, open it on an iPad (portrait or landscape) or use the
device toolbar in your browser's dev tools set to an iPad viewport.

## Sample user

- **Marie Peeters** — Pensioner
- marie.peeters@gmail.com · +32 343 43 32 23

## Navigation

A dark-navy top header (app name, search, notifications, profile avatar) plus a persistent
tablet bottom bar:

- **Requests**
- **Assignments** — intentionally disabled in this prototype
- **New request** (central + button)
- **Documents**
- **Support**

The profile avatar (top-right) opens the **Profile** screen.

## Screens & functionality

1. **Home / Dashboard** — welcome message, an orange *attention* card, a recent-activity
   list (status chips + MyHealth/MyRights category chips + status dots), and three quick-action cards.
2. **Requests** — collapsible **Urgent / Drafts / Requests** sections, category pill filters,
   and a **filter side panel** (Status, Category, Sort + Apply / Reset). Tapping a card opens a
   **detail page**. Empty states show when filters match nothing.
3. **New request** — "What would you like to do today?" with search, **Favorites** and
   **All actions** tabs. "Request medical reimbursement" launches a 4-step flow:
   1. **Define** — beneficiary + reimbursement-type dropdowns, delegation checkbox
   2. **Upload** — three upload zones (Expense / Supporting / Other), each with an *add files*
      modal and a *scan* camera mock; plus a **Scan receipt** button
   3. **Input** — AI-supported automatic fill (the only enabled option) vs. manual (disabled)
   4. **Review** — summary with editable rows and linked documents → **Submit**
   On submit, a success screen appears and the new request is **added to the home activity list
   with status "Submitted"**.
4. **Documents** — **Documents / Cards / Certificates** tabs with category pill filtering.
   Certificates show PDF/QR type and active/deactivated status. The Cards tab shows an empty state.
5. **Profile** — Marie's details plus My Family, Payment Info, Medical Direct Billing,
   Medical External Insurance, and Medical Record cards (with non-functional *More* links).
6. **Support** — searchable FAQ accordion, documentation tiles, contact details, and a
   (non-functional) *Log a ticket* button.

## Status chip colors

| Status | Color |
|---|---|
| New / Submitted | blue / pale blue |
| Validated | green |
| Declined | red |
| Draft | grey |
| Urgent / Needs info | orange |

## Notes / prototype limitations

- Disabled by design: Assignments, *Save as draft*, manual data entry, editing review fields,
  *Log a ticket*, document opening, and the *Declare serious illness* / *Declare bank account* flows.
  These surface a small toast explaining they aren't part of the prototype.
- File uploads, document scanning, and receipt scanning are simulated with mock modals.
- No data is persisted; reloading the page resets all state.
