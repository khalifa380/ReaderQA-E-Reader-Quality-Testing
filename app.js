(() => {
  "use strict";
  const STORAGE_KEY = "readerqa-state-v1";
  const pages = [
    {chapter:"CHAPTER 01",title:"Learning to Observe",paragraphs:[
      "Careful observation begins with patience. A reader, a researcher, or a tester learns to notice small details before drawing a conclusion. A useful note describes what happened, when it happened, and what evidence supports the observation.",
      "On an early morning walk, the same path can appear different from one day to the next. Light changes, leaves move, and the sound of birds shifts with the weather. Recording these details makes comparison possible."
    ]},
    {chapter:"CHAPTER 02",title:"Patterns in the Field",paragraphs:[
      "A pattern becomes easier to recognize when observations are recorded consistently. The shape of a leaf, the direction of a shadow, or the arrival time of a bird can be compared across several days.",
      "Good records separate facts from assumptions. Instead of writing that a plant looks unhealthy, describe the yellow edges, dry soil, and the date when the change was first noticed."
    ]},
    {chapter:"CHAPTER 03",title:"Questions and Evidence",paragraphs:[
      "Questions turn observations into a small investigation. A useful question is specific enough to explore and open enough to reveal something unexpected. Evidence helps us decide whether an explanation fits what we can see.",
      "When a result differs from expectation, it is not a reason to hide the result. It is a reason to look again, repeat the observation, and record the conditions that might explain the difference."
    ]},
    {chapter:"CHAPTER 04",title:"Small Experiments",paragraphs:[
      "An experiment works best when its steps are clear. Change one factor at a time when possible, keep the other conditions steady, and record the outcome. Another person should be able to follow the same steps.",
      "Repeating an experiment helps reveal whether an outcome is consistent. If two attempts disagree, preserve both results and investigate the difference instead of choosing only the more convenient answer."
    ]},
    {chapter:"CHAPTER 05",title:"A Record Worth Keeping",paragraphs:[
      "A field notebook is valuable because it preserves the path from question to conclusion. Dates, steps, observations, and open questions make the work easier to review later.",
      "The habit of careful recording applies far beyond nature study. In software testing, the same discipline helps teams reproduce a problem, compare expected and actual behavior, and understand what changed."
    ]}
  ];
  const initialTests = [
    ["TC-001","Navigation","Open the reader","Open the E-reader section.","Reader view is displayed.","Positive"],
    ["TC-002","Navigation","Move to the next page","Click Next Page from page 1.","Page 2 appears and counter updates.","Positive"],
    ["TC-003","Navigation","Move to the previous page","Go to page 2, then click Previous Page.","Page 1 appears.","Positive"],
    ["TC-004","Navigation","Previous on first page","Navigate to page 1 and click Previous Page.","Reader remains on page 1; no invalid page.","Boundary"],
    ["TC-005","Navigation","Next on final page","Navigate to page 5 and click Next Page.","Reader remains on page 5; no invalid page.","Boundary"],
    ["TC-006","Progress","Progress indicator updates","Navigate from page 1 to page 3.","Progress shows 60% and page 3 of 5.","Positive"],
    ["TC-007","Progress","Restore saved page","Go to page 4 and refresh the browser.","Page 4 is restored.","Persistence"],
    ["TC-008","Search","Search for an existing word","Search for 'observation'.","Matching page results appear.","Positive"],
    ["TC-009","Search","Search is case-insensitive","Search for 'PATTERNS'.","Matching text is found regardless of case.","Positive"],
    ["TC-010","Search","Search for absent text","Search for 'xylophonezz'.","Clear no-results message appears.","Negative"],
    ["TC-011","Search","Submit an empty search","Clear the search field.","Helpful prompt appears; no false result.","Negative"],
    ["TC-012","Search","Jump to a search result","Search for a word and click a result.","Reader navigates to the correct page.","Positive"],
    ["TC-013","Search","Clear search results","Search for a word, then click clear.","Query and result panel are cleared.","Positive"],
    ["TC-014","Bookmark","Add a bookmark","Click Add bookmark on page 1.","Page 1 is marked as bookmarked.","Positive"],
    ["TC-015","Bookmark","Remove a bookmark","On a bookmarked page, click Remove bookmark.","Bookmark indicator is removed.","Positive"],
    ["TC-016","Bookmark","Bookmark count updates","Add bookmarks on two different pages.","Unique bookmark count reflects saved pages.","Positive"],
    ["TC-017","Bookmark","Restore bookmarks after refresh","Bookmark a page and refresh the browser.","Bookmark remains saved.","Persistence"],
    ["TC-018","Font size","Increase font size","Click the + font control once.","Text size increases by one supported step.","Positive"],
    ["TC-019","Font size","Decrease font size","Click the − font control once.","Text size decreases by one supported step.","Positive"],
    ["TC-020","Font size","Test minimum font boundary","Repeatedly decrease font size to its minimum, then click −.","Font size does not go below the minimum.","Boundary"],
    ["TC-021","Font size","Test maximum font boundary","Repeatedly increase font size to its maximum, then click +.","Font size does not exceed the maximum.","Boundary"],
    ["TC-022","Font size","Equivalence partition: valid value","Set or reach a font size inside the allowed range.","A valid font size is displayed and applied.","Equivalence partitioning"],
    ["TC-023","Font size","Equivalence partition: below minimum","Attempt a font size below the supported minimum if test controls permit.","Invalid value is rejected or clamped to minimum.","Equivalence partitioning"],
    ["TC-024","Font size","Equivalence partition: above maximum","Attempt a font size above the supported maximum if test controls permit.","Invalid value is rejected or clamped to maximum.","Equivalence partitioning"],
    ["TC-025","Regression","Reader controls after page change","Navigate pages, search, bookmark, and change font size.","Existing reader features still work together.","Regression"]
  ].map(([id,feature,scenario,steps,expected,tag])=>({id,feature,scenario,steps,expected,actual:"",status:"Not Run",remarks:tag,tag}));

  const $ = id => document.getElementById(id);
  const safe = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const defaultState = () => ({page:0,fontSize:18,bookmarks:[],tests:initialTests.map(t=>({...t})),defects:[],regressions:[]});
  let state = loadState();
  let toastTimer;
  function loadState(){
    try{
      const raw=localStorage.getItem(STORAGE_KEY);
      if(!raw) return defaultState();
      const parsed=JSON.parse(raw), base=defaultState();
      return {...base,...parsed,tests:Array.isArray(parsed.tests)&&parsed.tests.length?base.tests.map(bt=>({...bt,...(parsed.tests.find(pt=>pt.id===bt.id)||{})})):base.tests,defects:Array.isArray(parsed.defects)?parsed.defects:[],regressions:Array.isArray(parsed.regressions)?parsed.regressions:[],bookmarks:Array.isArray(parsed.bookmarks)?parsed.bookmarks:[]};
    }catch(e){return defaultState();}
  }
  function saveState(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}catch(e){showToast("Unable to save locally. Check browser storage settings.");}}
  function showToast(message){const el=$("toast");el.textContent=message;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2600);}
  function switchView(view){
    document.querySelectorAll(".view").forEach(el=>el.classList.toggle("active",el.id===`view-${view}`));
    document.querySelectorAll(".nav-item").forEach(el=>el.classList.toggle("active",el.dataset.view===view));
    const labels={reader:["E-reader application","Explore the sample reader, then verify its behavior with your test suite."],dashboard:["QA dashboard","Review recorded outcomes and follow your testing workflow."],tests:["Test cases","Execute the cases yourself and record the observed result."],defects:["Defect log","Record reproducible issues found during your testing."],regression:["Regression testing","Repeat relevant tests after a change and record the new result."]};
    $("page-title").textContent=labels[view][0];$("page-subtitle").textContent=labels[view][1];
    if(view==="dashboard")renderDashboard();if(view==="tests")renderTests();if(view==="defects")renderDefects();if(view==="regression")renderRegressions();
  }
  document.querySelectorAll(".nav-item").forEach(btn=>btn.addEventListener("click",()=>switchView(btn.dataset.view)));
  document.querySelectorAll("[data-go]").forEach(btn=>btn.addEventListener("click",()=>switchView(btn.dataset.go)));
  function renderReader(){
    const page=pages[state.page];
    $("chapter-label").textContent=page.chapter;
    $("book-content").style.fontSize=`${state.fontSize}px`;
    $("book-content").innerHTML=`<h2>${safe(page.title)}</h2>${page.paragraphs.map(p=>`<p>${safe(p)}</p>`).join("")}`;
    $("page-counter").textContent=`Page ${state.page+1} of ${pages.length}`;
    $("aside-current-page").textContent=`${state.page+1} / ${pages.length}`;
    $("font-label").textContent=`${state.fontSize}px`;$("aside-font").textContent=`${state.fontSize} px`;
    const percent=Math.round((state.page+1)/pages.length*100);$("progress-percent").textContent=`${percent}%`;$("progress-bar").style.width=`${percent}%`;
    const marked=state.bookmarks.includes(state.page);
    $("bookmark-indicator").textContent=marked?"♥ Bookmarked":"♡ Not bookmarked";
    $("bookmark-indicator").style.color=marked?"#b95769":"";
    $("toggle-bookmark").textContent=marked?"♥ Remove bookmark":"♡ Add bookmark";
    $("bookmark-count").textContent=state.bookmarks.length;
    $("prev-page").disabled=state.page===0;$("next-page").disabled=state.page===pages.length-1;
    $("prev-page").style.opacity=state.page===0?".5":"1";$("next-page").style.opacity=state.page===pages.length-1?".5":"1";
  }
  $("prev-page").addEventListener("click",()=>{if(state.page===0){showToast("You are already on the first page.");return;}state.page--;saveState();renderReader();});
  $("next-page").addEventListener("click",()=>{if(state.page===pages.length-1){showToast("You are already on the last page.");return;}state.page++;saveState();renderReader();});
  $("font-down").addEventListener("click",()=>{if(state.fontSize<=12){showToast("Minimum font size is 12 px.");return;}state.fontSize=Math.max(12,state.fontSize-2);saveState();renderReader();});
  $("font-up").addEventListener("click",()=>{if(state.fontSize>=28){showToast("Maximum font size is 28 px.");return;}state.fontSize=Math.min(28,state.fontSize+2);saveState();renderReader();});
  $("toggle-bookmark").addEventListener("click",()=>{if(state.bookmarks.includes(state.page)){state.bookmarks=state.bookmarks.filter(p=>p!==state.page);showToast("Bookmark removed.");}else{state.bookmarks.push(state.page);state.bookmarks.sort((a,b)=>a-b);showToast("Bookmark saved.");}saveState();renderReader();});
  function doSearch(){
    const q=$("book-search").value.trim(), message=$("search-message"), results=$("search-results");
    results.innerHTML="";results.classList.add("hidden");message.classList.remove("hidden");
    if(!q){message.textContent="Enter a word or phrase to search the book.";return;}
    const matches=[];
    pages.forEach((p,i)=>{const text=[p.title,...p.paragraphs].join(" ");if(text.toLowerCase().includes(q.toLowerCase()))matches.push({index:i,title:p.title,excerpt:text.slice(Math.max(0,text.toLowerCase().indexOf(q.toLowerCase())-35),text.toLowerCase().indexOf(q.toLowerCase())+q.length+55)});});
    if(!matches.length){message.textContent=`No matches found for “${q}”. Try another search term.`;return;}
    message.textContent=`Found ${matches.length} page${matches.length===1?"":"s"} containing “${q}”.`;
    results.classList.remove("hidden");results.innerHTML=matches.map(m=>`<div class="search-result"><div><strong>Page ${m.index+1}: ${safe(m.title)}</strong><div>${safe(m.excerpt)}…</div></div><button data-jump="${m.index}">Open page →</button></div>`).join("");
    results.querySelectorAll("[data-jump]").forEach(btn=>btn.addEventListener("click",()=>{state.page=Number(btn.dataset.jump);saveState();renderReader();showToast("Opened matching page.");}));
  }
  $("book-search").addEventListener("input",doSearch);
  $("clear-search").addEventListener("click",()=>{$("book-search").value="";$("search-message").classList.add("hidden");$("search-results").classList.add("hidden");$("book-search").focus();});
  function statusClass(status){return "status-"+status.replace(/\s+/g,"-");}
  function statusSelect(test){return `<select class="status-select ${statusClass(test.status)}" data-test-status="${safe(test.id)}" aria-label="Status for ${safe(test.id)}">${["Not Run","Pass","Fail","Blocked"].map(s=>`<option ${s===test.status?"selected":""}>${s}</option>`).join("")}</select>`;}
  function renderTests(){
    const q=$("test-search").value.trim().toLowerCase(), filter=$("test-status-filter").value;
    const rows=state.tests.filter(t=>(filter==="All"||t.status===filter)&&[t.id,t.feature,t.scenario,t.steps,t.expected,t.actual,t.remarks].join(" ").toLowerCase().includes(q));
    $("test-count").textContent=`${rows.length} of ${state.tests.length} test cases`;
    $("test-table-body").innerHTML=rows.length?rows.map(t=>`<tr><td>${safe(t.id)}</td><td>${safe(t.feature)}</td><td><strong>${safe(t.scenario)}</strong><br><span class="muted">${safe(t.tag||"")}</span></td><td>${safe(t.steps)}</td><td>${safe(t.expected)}</td><td><textarea class="inline-edit" rows="2" data-test-field="actual" data-test-id="${safe(t.id)}" placeholder="Run test or record manual result…">${safe(t.actual)}</textarea></td><td>${statusSelect(t)}</td><td><button class="small-action run-one-button" data-run-test="${safe(t.id)}">▶ Run</button></td><td><textarea class="inline-edit" rows="2" data-test-field="remarks" data-test-id="${safe(t.id)}" placeholder="Notes / evidence…">${safe(t.remarks)}</textarea></td></tr>`).join(""):`<tr><td colspan="9" class="empty-table">No test cases match your filters.</td></tr>`;
    $("test-table-body").querySelectorAll("[data-test-status]").forEach(el=>el.addEventListener("change",()=>{const test=state.tests.find(t=>t.id===el.dataset.testStatus);if(test){test.status=el.value;saveState();renderTests();renderDashboard();showToast(`${test.id} status saved as ${test.status}.`);}}));
    $("test-table-body").querySelectorAll("[data-test-field]").forEach(el=>el.addEventListener("change",()=>{const test=state.tests.find(t=>t.id===el.dataset.testId);if(test){test[el.dataset.testField]=el.value;saveState();renderDashboard();showToast("Test case details saved.");}}));
    $("test-table-body").querySelectorAll("[data-run-test]").forEach(el=>el.addEventListener("click",()=>runAutomatedTest(el.dataset.runTest)));
  }
  $("test-search").addEventListener("input",renderTests);$("test-status-filter").addEventListener("change",renderTests);

  function runAutomatedTest(testId){
    const test=state.tests.find(t=>t.id===testId);
    if(!test)return;
    const original={page:state.page,fontSize:state.fontSize,bookmarks:[...state.bookmarks]};
    let actual="",passed=false;
    const check=(condition,message)=>{if(!condition)throw new Error(message);};
    const click=id=>$(id).click();
    const search=q=>{$("book-search").value=q;$("book-search").dispatchEvent(new Event("input",{bubbles:true}));};
    try{
      switch(testId){
        case "TC-001":
          switchView("reader");
          check($("view-reader").classList.contains("active"),"Reader view did not become active.");
          actual="E-reader view is visible and active."; passed=true; break;
        case "TC-002":
          state.page=0;renderReader();click("next-page");
          check(state.page===1 && $("page-counter").textContent==="Page 2 of 5","Next Page did not navigate to page 2.");
          actual=`Displayed ${$("page-counter").textContent}.`; passed=true; break;
        case "TC-003":
          state.page=1;renderReader();click("prev-page");
          check(state.page===0 && $("page-counter").textContent==="Page 1 of 5","Previous Page did not return to page 1.");
          actual=`Displayed ${$("page-counter").textContent}.`; passed=true; break;
        case "TC-004":
          state.page=0;renderReader();click("prev-page");
          check(state.page===0 && $("prev-page").disabled,"Previous Page boundary was not enforced.");
          actual="Stayed on page 1; Previous Page is disabled."; passed=true; break;
        case "TC-005":
          state.page=4;renderReader();click("next-page");
          check(state.page===4 && $("next-page").disabled,"Next Page boundary was not enforced.");
          actual="Stayed on page 5; Next Page is disabled."; passed=true; break;
        case "TC-006":
          state.page=2;renderReader();
          check($("progress-percent").textContent==="60%" && $("page-counter").textContent==="Page 3 of 5","Progress display did not match page 3 of 5.");
          actual="Page 3 of 5 displayed with 60% progress."; passed=true; break;
        case "TC-007":
          state.page=3;saveState();
          check(loadState().page===3,"Saved page was not restored from local storage.");
          actual="Page 4 was found in the saved browser state."; passed=true; break;
        case "TC-008":
          switchView("reader");search("observation");
          check(!$("search-results").classList.contains("hidden") && $("search-results").textContent.toLowerCase().includes("page"),"Search did not return a matching result.");
          actual=$("search-message").textContent;passed=true;break;
        case "TC-009":
          switchView("reader");search("PATTERNS");
          check(!$("search-results").classList.contains("hidden") && $("search-results").textContent.includes("Page 2"),"Case-insensitive search did not find PATTERNS.");
          actual="Uppercase query found the matching page.";passed=true;break;
        case "TC-010":
          switchView("reader");search("xylophonezz");
          check($("search-results").classList.contains("hidden") && $("search-message").textContent.includes("No matches"),"Search did not show the no-results message.");
          actual=$("search-message").textContent;passed=true;break;
        case "TC-011":
          switchView("reader");search("");
          check($("search-message").textContent.includes("Enter a word"),"Empty search did not show a helpful prompt.");
          actual=$("search-message").textContent;passed=true;break;
        case "TC-012":
          switchView("reader");search("PATTERNS");
          const jump=$("search-results").querySelector("[data-jump]");
          check(!!jump,"No search result button was available.");
          jump.click();
          check(state.page===1,"Selecting a search result did not navigate to its page.");
          actual=`Search result opened page ${state.page+1}.`;passed=true;break;
        case "TC-013":
          switchView("reader");search("observation");click("clear-search");
          check($("book-search").value==="" && $("search-results").classList.contains("hidden"),"Clear search did not clear the query/results.");
          actual="Search field and results panel cleared.";passed=true;break;
        case "TC-014":
          state.page=0;state.bookmarks=[];renderReader();click("toggle-bookmark");
          check(state.bookmarks.includes(0) && $("bookmark-indicator").textContent.includes("Bookmarked"),"Bookmark was not added.");
          actual="Page 1 bookmark was added and shown.";passed=true;break;
        case "TC-015":
          state.page=0;state.bookmarks=[0];renderReader();click("toggle-bookmark");
          check(!state.bookmarks.includes(0) && $("bookmark-indicator").textContent.includes("Not bookmarked"),"Bookmark was not removed.");
          actual="Page 1 bookmark was removed.";passed=true;break;
        case "TC-016":
          state.bookmarks=[];state.page=0;renderReader();click("toggle-bookmark");state.page=1;renderReader();click("toggle-bookmark");
          check(state.bookmarks.length===2 && $("bookmark-count").textContent==="2","Bookmark count did not reach two unique pages.");
          actual="Two unique bookmarks were counted.";passed=true;break;
        case "TC-017":
          state.bookmarks=[2];saveState();
          check(loadState().bookmarks.includes(2),"Bookmark was not restored from browser storage.");
          actual="Bookmark for page 3 exists in saved browser state.";passed=true;break;
        case "TC-018":
          state.fontSize=18;renderReader();click("font-up");
          check(state.fontSize===20 && $("book-content").style.fontSize==="20px","Font size did not increase by 2 px.");
          actual="Font increased from 18 px to 20 px.";passed=true;break;
        case "TC-019":
          state.fontSize=18;renderReader();click("font-down");
          check(state.fontSize===16 && $("book-content").style.fontSize==="16px","Font size did not decrease by 2 px.");
          actual="Font decreased from 18 px to 16 px.";passed=true;break;
        case "TC-020":
          state.fontSize=12;renderReader();click("font-down");
          check(state.fontSize===12,"Font size went below 12 px.");
          actual="Font stayed at the 12 px minimum.";passed=true;break;
        case "TC-021":
          state.fontSize=28;renderReader();click("font-up");
          check(state.fontSize===28,"Font size exceeded 28 px.");
          actual="Font stayed at the 28 px maximum.";passed=true;break;
        case "TC-022":
          state.fontSize=18;renderReader();
          check(state.fontSize>=12 && state.fontSize<=28 && $("book-content").style.fontSize==="18px","Valid font size was not applied.");
          actual="Valid 18 px font size was applied.";passed=true;break;
        case "TC-023":
          state.fontSize=12;renderReader();click("font-down");
          check(state.fontSize>=12,"Font size was allowed below the minimum.");
          actual="Attempt below minimum was clamped at 12 px.";passed=true;break;
        case "TC-024":
          state.fontSize=28;renderReader();click("font-up");
          check(state.fontSize<=28,"Font size was allowed above the maximum.");
          actual="Attempt above maximum was clamped at 28 px.";passed=true;break;
        case "TC-025":
          state.page=0;state.fontSize=18;state.bookmarks=[];renderReader();
          click("next-page");click("toggle-bookmark");click("font-up");search("PATTERNS");
          check(state.page===1 && state.bookmarks.includes(1) && state.fontSize===20 && !$("search-results").classList.contains("hidden"),"One or more reader controls failed during the combined regression check.");
          actual="Navigation, bookmark, font control, and search worked in one combined run.";passed=true;break;
        default: throw new Error("No automated check is available for this test case.");
      }
    }catch(error){
      actual=`Assertion failed: ${error.message}`;
      passed=false;
    }finally{
      state.page=original.page;state.fontSize=original.fontSize;state.bookmarks=[...original.bookmarks];
      saveState();renderReader();
      // Clear temporary search artifacts left by search-related checks.
      $("book-search").value="";$("search-message").classList.add("hidden");$("search-results").classList.add("hidden");
    }
    test.actual=actual;
    test.status=passed?"Pass":"Fail";
    test.remarks=`Automated check ${passed?"passed":"failed"} · ${new Date().toLocaleString()}`;
    saveState();renderTests();renderDashboard();
    const summary=$("live-test-summary");
    summary.className=`live-test-summary ${passed?"result-pass":"result-fail"}`;
    summary.innerHTML=`<strong>${safe(test.id)} — ${passed?"PASS":"FAIL"}</strong><span><b>Expected:</b> ${safe(test.expected)}</span><span><b>Actual:</b> ${safe(actual)}</span><small>Automated check executed in the local ReaderQA demo at ${safe(new Date().toLocaleTimeString())}. Verify failures and record evidence before reporting a defect.</small>`;
    showToast(`${test.id}: ${passed?"Pass":"Fail"} — live check completed.`);
    return passed;
  }
  $("run-all-tests").addEventListener("click",()=>{
    const summary=$("live-test-summary");
    let passed=0,failed=0;
    state.tests.forEach(test=>{if(runAutomatedTest(test.id))passed++;else failed++;});
    summary.className=`live-test-summary ${failed===0?"result-pass":"result-fail"}`;
    summary.innerHTML=`<strong>Test run complete: ${passed} passed, ${failed} failed</strong><span>${state.tests.length} automated checks were executed against the ReaderQA demo.</span><small>These are demo-level functional checks. They do not test a physical e-reader or Amazon systems.</small>`;
    renderTests();renderDashboard();
  });
  function renderDashboard(){
    const tests=state.tests,total=tests.length,pass=tests.filter(t=>t.status==="Pass").length,fail=tests.filter(t=>t.status==="Fail").length,blocked=tests.filter(t=>t.status==="Blocked").length,executed=pass+fail,open=state.defects.filter(d=>!["Resolved","Closed"].includes(d.status)).length,notRun=tests.filter(t=>t.status==="Not Run").length;
    $("stat-total").textContent=total;$("stat-executed").textContent=executed;$("stat-pass").textContent=pass;$("stat-fail").textContent=fail;$("stat-blocked").textContent=blocked;$("stat-defects").textContent=open;
    const denominator=total||1;$("status-chart").innerHTML=`<span class="chart-not-run" style="width:${notRun/denominator*100}%"></span><span class="chart-pass" style="width:${pass/denominator*100}%"></span><span class="chart-fail" style="width:${fail/denominator*100}%"></span><span class="chart-blocked" style="width:${blocked/denominator*100}%"></span>`;
    $("status-legend").innerHTML=[["#cbd2df",`Not Run (${notRun})`],["#31ad85",`Pass (${pass})`],["#dd6973",`Fail (${fail})`],["#e9b75a",`Blocked (${blocked})`]].map(([c,l])=>`<span class="legend-item"><span class="legend-dot" style="background:${c}"></span>${l}</span>`).join("");
    $("recent-tests").innerHTML=tests.slice(0,5).map(t=>`<tr><td><strong>${safe(t.id)}</strong></td><td>${safe(t.feature)}</td><td>${safe(t.scenario)}</td><td>${statusSelect(t)}</td></tr>`).join("");
    $("recent-tests").querySelectorAll("[data-test-status]").forEach(el=>el.addEventListener("change",()=>{const t=state.tests.find(t=>t.id===el.dataset.testStatus);if(t){t.status=el.value;saveState();renderDashboard();showToast(`${t.id} status saved.`);}}));
  }
  function openDefectForm(){ $("defect-form-panel").classList.remove("hidden");$("bug-id").focus();}
  $("show-defect-form").addEventListener("click",openDefectForm);$("hide-defect-form").addEventListener("click",()=>$("defect-form-panel").classList.add("hidden"));$("cancel-defect").addEventListener("click",()=>$("defect-form-panel").classList.add("hidden"));
  document.querySelectorAll("[data-show-defect]").forEach(btn=>btn.addEventListener("click",openDefectForm));
  $("defect-form").addEventListener("submit",e=>{
    e.preventDefault();const id=$("bug-id").value.trim(),title=$("bug-title").value.trim(),steps=$("bug-steps").value.trim(),expected=$("bug-expected").value.trim(),actual=$("bug-actual").value.trim();
    if(!id||!title||!steps||!expected||!actual){$("defect-error").textContent="Please complete all required fields.";return;}
    if(state.defects.some(d=>d.id.toLowerCase()===id.toLowerCase())){$("defect-error").textContent="That Bug ID already exists. Use a unique ID.";return;}
    state.defects.unshift({id,title,steps,expected,actual,severity:$("bug-severity").value,status:$("bug-status").value,created:new Date().toISOString()});saveState();$("defect-form").reset();$("defect-form-panel").classList.add("hidden");$("defect-error").textContent="";renderDefects();renderDashboard();showToast("Defect report saved.");
  });
  function renderDefects(){
    const filter=$("defect-filter").value;
    const list=state.defects.filter(d=>filter==="All"||(filter==="Open"? !["Resolved","Closed"].includes(d.status):d.status===filter));
    $("defect-subtitle").textContent=`${state.defects.length} total defect${state.defects.length===1?"":"s"} recorded`;
    $("defect-empty").classList.toggle("hidden",list.length>0);
    $("defect-table-body").innerHTML=list.map(d=>`<tr><td><strong>${safe(d.id)}</strong><br><span class="muted">${d.created?new Date(d.created).toLocaleDateString():""}</span></td><td><strong>${safe(d.title)}</strong></td><td><span class="severity ${safe(d.severity)}">${safe(d.severity)}</span></td><td>${safe(d.steps)}</td><td><strong>Expected:</strong> ${safe(d.expected)}<br><strong>Actual:</strong> ${safe(d.actual)}</td><td><select class="defect-table-status" data-defect-status="${safe(d.id)}">${["New","In Progress","Resolved","Closed"].map(s=>`<option ${s===d.status?"selected":""}>${s}</option>`).join("")}</select></td><td><button class="small-action" data-delete-defect="${safe(d.id)}">Delete</button></td></tr>`).join("");
    $("defect-table-body").querySelectorAll("[data-defect-status]").forEach(el=>el.addEventListener("change",()=>{const d=state.defects.find(d=>d.id===el.dataset.defectStatus);if(d){d.status=el.value;saveState();renderDefects();renderDashboard();showToast("Defect status updated.");}}));
    $("defect-table-body").querySelectorAll("[data-delete-defect]").forEach(el=>el.addEventListener("click",()=>{if(confirm(`Delete defect ${el.dataset.deleteDefect}?`)){state.defects=state.defects.filter(d=>d.id!==el.dataset.deleteDefect);saveState();renderDefects();renderDashboard();showToast("Defect deleted.");}}));
  }
  $("defect-filter").addEventListener("change",renderDefects);
  function renderRegressions(){
    $("reg-test-select").innerHTML=state.tests.map(t=>`<option value="${safe(t.id)}">${safe(t.id)} — ${safe(t.scenario)}</option>`).join("");
    $("regression-count").textContent=`${state.regressions.length} run${state.regressions.length===1?"":"s"}`;
    $("regression-empty").classList.toggle("hidden",state.regressions.length>0);
    $("regression-table-body").innerHTML=[...state.regressions].reverse().map(r=>{const t=state.tests.find(t=>t.id===r.testId);return `<tr><td>${safe(r.runId)}</td><td><strong>${safe(r.testId)}</strong></td><td>${safe(t?t.scenario:"Test case no longer available")}</td><td>${safe(r.actual)}</td><td>${statusBadge(r.status)}</td><td>${safe(new Date(r.date).toLocaleString())}</td></tr>`;}).join("");
  }
  function statusBadge(s){const c=s==="Pass"?"green":s==="Fail"?"red":s==="Blocked"?"amber":"neutral";return `<span class="pill ${c}">${safe(s)}</span>`;}
  $("start-regression").addEventListener("click",()=>{$("reg-test-select").focus();showToast("Select a test case, execute it again, then record the result.");});
  $("save-regression").addEventListener("click",()=>{
    const testId=$("reg-test-select").value,actual=$("reg-actual").value.trim(),status=$("reg-status").value;
    if(!testId){showToast("Choose a test case.");return;}if(!actual){showToast("Enter the actual result from your retest.");$("reg-actual").focus();return;}if(status==="Not Run"){showToast("Choose Pass, Fail, or Blocked after executing the test.");return;}
    state.regressions.push({runId:`RUN-${String(state.regressions.length+1).padStart(3,"0")}`,testId,actual,status,date:new Date().toISOString()});
    const test=state.tests.find(t=>t.id===testId);if(test){test.status=status;test.actual=actual;test.remarks=`Regression retest recorded ${new Date().toLocaleDateString()}`;}
    saveState();$("reg-actual").value="";$("reg-status").value="Not Run";renderRegressions();renderDashboard();showToast("Regression result saved.");
  });
  function exportCSV(){
    const headers=["Test ID","Feature","Test Scenario","Test Steps","Expected Result","Actual Result","Status","Remarks"];
    const csvCell=v=>`"${String(v??"").replace(/"/g,'""')}"`;
    const csv=[headers,...state.tests.map(t=>[t.id,t.feature,t.scenario,t.steps,t.expected,t.actual,t.status,t.remarks])].map(row=>row.map(csvCell).join(",")).join("\r\n");
    const blob=new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8;"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="ReaderQA-Test-Cases.csv";document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);showToast("Test cases exported as CSV.");
  }
  $("export-tests").addEventListener("click",exportCSV);
  $("reset-demo").addEventListener("click",()=>{if(confirm("Reset ReaderQA local data? This will remove recorded test results, defects, regression runs, bookmarks, and reading progress.")){state=defaultState();saveState();$("book-search").value="";$("search-message").classList.add("hidden");$("search-results").classList.add("hidden");$("test-search").value="";$("test-status-filter").value="All";$("defect-filter").value="All";renderReader();renderTests();renderDefects();renderRegressions();renderDashboard();showToast("Demo data reset. Test cases are back to Not Run.");}});
  // Initial render
  renderReader();renderDashboard();renderTests();renderDefects();renderRegressions();
})();