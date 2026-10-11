# ReaderQA — E-Reader Quality Testing Simulator

ReaderQA is an independent beginner-friendly portfolio project for practicing manual software quality assurance. It combines a small sample e-reader with a test management dashboard. It is not affiliated with or endorsed by Amazon.

## Features

### E-reader
- Five-page sample book with previous/next navigation
- Case-insensitive book search with page jump results
- Add/remove bookmarks
- Font size controls from 12px to 28px
- Reading progress indicator
- Reading page, font size, and bookmarks persist using browser `localStorage`

### QA dashboard
- 25 starter test cases covering positive, negative, boundary, persistence, equivalence-partitioning, and regression scenarios
- Test status options: Not Run, Pass, Fail, Blocked
- Editable actual-result and remarks fields
- Search and status filtering
- CSV export of test cases
- Defect form with duplicate Bug ID validation, severity, and status tracking
- Regression run history
- Live summary counts

## Run locally

No build tools or dependencies are required.

1. Download or clone this project.
2. Open `index.html` in a modern browser.

For a local HTTP server (recommended if browser restrictions affect local storage), open a terminal in this folder and run:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Suggested practice workflow

1. Explore the e-reader features.
2. Open **Test cases** and execute each scenario manually.
3. Record what actually happened in **Actual result** and select a status.
4. When you observe a real issue, create a defect in **Defect log** with repeatable steps and expected versus actual behavior.
5. After a change or fix, repeat relevant cases in **Regression** and record the outcome.
6. Export the test cases to CSV when you want a shareable report.

## Testing concepts demonstrated

- Test case design and execution
- Positive and negative testing
- Boundary-value checks
- Equivalence partitioning examples
- Regression testing
- Defect documentation and severity/status tracking
- Expected versus actual results
- Persistence checks
- Test summary reporting

## Important limitations

- Test cases begin as **Not Run**. The application does not automatically claim they passed.
- The dashboard records the results you enter; it does not independently execute the test suite or verify your claims.
- Defects should only be recorded as actual findings after you reproduce them. Use clearly labelled simulated examples for demonstrations.
- Data is stored in the current browser's `localStorage`. It is not synced across devices and may be removed if browser data is cleared.
- This is a learning simulator, not a production e-reader or formal test management system.


## Live automated test runner

Open **Test cases** and click **▶ Run** beside a test to execute a browser-based check against the local ReaderQA demo. Click **▶ Run all tests** to execute the full set. The result panel shows expected and actual behavior, and the recorded status updates the QA dashboard. The runner restores your reader page, font size, and bookmarks after each check.

These are lightweight JavaScript functional checks for this portfolio simulator. They are not Selenium/Playwright tests and do not test a physical Kindle device or Amazon production systems. Use the manual fields when practising test cases that require human observation.
