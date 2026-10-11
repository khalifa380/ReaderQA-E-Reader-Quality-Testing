
# ReaderQA – E-Reader Quality Testing Simulator

ReaderQA is a web-based QA testing simulator built with HTML, CSS, and JavaScript to practise software testing in a realistic, interactive environment. It combines a sample e-reader application with a QA workspace where users can execute automated functional checks, record test results, track defects, and review regression testing outcomes.

The project is designed to build hands-on understanding of software QA workflows, including test case execution, expected-versus-actual result validation, defect reporting, and test progress monitoring.

## Features

* **Interactive E-Reader:** Navigate a sample book containing five pages using Previous Page and Next Page controls.
* **Search Functionality:** Search book content, view matching results, and navigate to relevant pages.
* **Bookmarks and Font Controls:** Add or remove bookmarks, adjust font size, and practise testing saved preferences.
* **Test Case Management:** Review test scenarios, expected results, execution steps, and test statuses.
* **Automated Functional Checks:** Run individual test cases or the complete test suite and view automatically evaluated Pass/Fail results.
* **QA Dashboard:** Monitor test execution status and review testing progress.
* **Defect Tracking:** Record defects with details such as expected behavior, actual behavior, severity, and status.
* **Regression Testing:** Rerun selected checks to verify that existing functionality continues to work.
* **Test Result Export:** Export test case records to CSV for further review.
* **Local Data Persistence:** Retain supported test records and application preferences in the browser using local storage.

## Tech Stack

* **HTML5** – Application structure
* **CSS3** – Styling and responsive layout
* **JavaScript** – Application functionality, test execution, and result handling
* **Browser Local Storage** – Saving supported application data

## How to Run the Project

1. Download or clone this repository.
2. Open the project folder.
3. Locate `index.html`.
4. Open `index.html` in a modern web browser.
5. Navigate through the e-reader and use the sidebar to access the QA Dashboard, Test Cases, Defect Log, and Regression sections.

No additional installation is required for the basic local setup.

## How to Execute Tests

1. Open the **Test Cases** section.
2. Select an individual test and click **Run**, or choose **Run All Tests**.
3. Review the expected result, actual result, and automatically evaluated status.
4. Use the QA Dashboard to review updated test statuses.
5. Record defects when unexpected behavior is observed and use the Regression section to practise rerunning checks.

The project also supports manual recording of test results for scenarios that require user observation.

## QA Concepts Practised

* Functional testing
* Positive, negative, and boundary testing
* Test case design and execution
* Expected-versus-actual result validation
* Pass/Fail reporting
* Defect logging and severity classification
* Regression testing
* Test execution tracking and reporting

## Project Structure

```text
ReaderQA/
├── index.html
├── styles.css
├── app.js
├── README.md
└── assets/
```

## Learning Outcomes

This project provides practical exposure to how QA testers organise test cases, validate application behavior, document defects, monitor execution results, and perform regression checks. It is intended as a learning and portfolio project for demonstrating foundational software testing concepts.

## Scope and Limitations

ReaderQA is an independent testing simulator. Its automated checks validate functionality within this local demo application; they do not test physical Kindle devices, Amazon production systems, or real customer data. The project uses lightweight JavaScript-based checks rather than a dedicated automation framework such as Selenium or Playwright.

## Future Improvements

* Integrate Selenium or Playwright for browser automation.
* Add screenshots and evidence attachments to defect reports.
* Generate detailed test execution reports.
* Add additional test scenarios and reusable test suites.
* Integrate continuous testing into a CI/CD pipeline.

---

**Author:** Khalifa Shaik

**Purpose:** Portfolio project for practising software quality assurance and functional testing.

