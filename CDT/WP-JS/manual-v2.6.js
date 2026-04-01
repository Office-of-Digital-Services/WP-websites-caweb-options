/// CDT Custom JS v2.6: (/manual-v2.6.js) March 2026 ///


// Translate jQuery

jQuery("#caweb-gtrans-custom span.ca-gov-icon-globe").after(" Translate");


document.addEventListener('DOMContentLoaded', function() {
  var currentUrl = window.location.href.replace(/\/$/, '');
  

// Side-navigation JS //
  // Handle .side-navigation links
  var sideNavLinks = document.querySelectorAll('.side-navigation a');
  sideNavLinks.forEach(function(link) {
    var fullLinkUrl = new URL(link.href, window.location.origin).href.replace(/\/$/, '');
    link.classList.remove('active');
    
    if (fullLinkUrl === currentUrl) {
      link.classList.add('active');
    }
  });
  
  // Handle accordion-side-nav links
  var accordionNavLinks = document.querySelectorAll('nav[aria-labelledby="accordion-side-nav"] a.sidenav');
  accordionNavLinks.forEach(function(link) {
    var fullLinkUrl = new URL(link.href, window.location.origin).href.replace(/\/$/, '');
    link.classList.remove('active');
    
    if (fullLinkUrl === currentUrl) {
      link.classList.add('active');
    }
  });
  
  // Handle other .sidenav links
  var allSidenavLinks = document.querySelectorAll('a.sidenav');
  var excludeLinks = document.querySelectorAll('nav[aria-labelledby="accordion-side-nav"] a.sidenav, .side-navigation a.sidenav');
  var excludeSet = new Set(excludeLinks);
  
  allSidenavLinks.forEach(function(link) {
    if (!excludeSet.has(link)) {
      var fullLinkUrl = new URL(link.href, window.location.origin).href.replace(/\/$/, '');
      link.classList.remove('active');
      
      if (fullLinkUrl === currentUrl) {
        link.classList.add('active');
      }
    }
  });
});

// Sticky-6 JS: Inject .sticky-6 class CSS into Side-navigation WP column (.et_pb_column)

document.addEventListener('DOMContentLoaded', function() {
    let resizeTimer;
    
    function applyStickyOnDesktop() {
        const sideNavs = document.querySelectorAll('nav.side-navigation, .accordion-ide-nav');
        
        sideNavs.forEach(function(nav) {
            const column = nav.closest('.et_pb_column');
            
            if (column) {
                if (window.innerWidth >= 981) {
                    column.classList.add('sticky-6');
                } else {
                    column.classList.remove('sticky-6');
                }
            }
        });
    }
    
    applyStickyOnDesktop();
    
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(applyStickyOnDesktop, 250);
    });
});

// Add .back Class to First Link When Sibling is Active
document.addEventListener('DOMContentLoaded', function() {
  var currentUrl = window.location.href.replace(/\/$/, '');
  
  // Handle .side-navigation
  var sideNav = document.querySelector('.side-navigation');
  if (sideNav) {
    var sideNavLinks = sideNav.querySelectorAll('a');
    var firstSideNavLink = sideNavLinks[0];
    var activeFound = false;
    
    sideNavLinks.forEach(function(link) {
      var fullLinkUrl = new URL(link.href, window.location.origin).href.replace(/\/$/, '');
      link.classList.remove('active');
      
      if (fullLinkUrl === currentUrl) {
        link.classList.add('active');
        activeFound = true;
      }
    });
    
    if (firstSideNavLink) {
      firstSideNavLink.classList.remove('back');
      if (activeFound && !firstSideNavLink.classList.contains('active')) {
        firstSideNavLink.classList.add('back');
      }
    }
  }
  
  // Handle accordion-side-nav
  var accordionNav = document.querySelector('nav[aria-labelledby="accordion-side-nav"]');
  if (accordionNav) {
    var accordionLinks = accordionNav.querySelectorAll('a.sidenav');
    var firstAccordionLink = accordionLinks[0];
    var accordionActiveFound = false;
    
    accordionLinks.forEach(function(link) {
      var fullLinkUrl = new URL(link.href, window.location.origin).href.replace(/\/$/, '');
      link.classList.remove('active');
      
      if (fullLinkUrl === currentUrl) {
        link.classList.add('active');
        accordionActiveFound = true;
      }
    });
    
    if (firstAccordionLink) {
      firstAccordionLink.classList.remove('back');
      if (accordionActiveFound && !firstAccordionLink.classList.contains('active')) {
        firstAccordionLink.classList.add('back');
      }
    }
  }
});


// Side-nav auto scroll JS: overflow: auto CSS is added w/ a max-height,
// this JS will activate an auto-scroll funtion to scroll to the active page anchor.

(function() {
    let hasScrolled = false;
    
    function scrollToActiveNav() {
        if (hasScrolled) return;
        
        const sideNav = document.querySelector('.side-navigation');
        const activeLink = sideNav?.querySelector('a.active');
        
        if (activeLink && sideNav) {
            hasScrolled = true;
            
            const activeLi = activeLink.closest('li');
            const navRect = sideNav.getBoundingClientRect();
            const activeRect = activeLi.getBoundingClientRect();
            
            const scrollTop = sideNav.scrollTop + activeRect.top - navRect.top - (navRect.height / 2) + (activeRect.height / 2);
            
            sideNav.scrollTo({
                top: scrollTop,
                behavior: 'smooth'
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(scrollToActiveNav, 150);
        });
    } else {
        setTimeout(scrollToActiveNav, 150);
    }
    
    window.addEventListener('load', function() {
        setTimeout(scrollToActiveNav, 200);
    });
    
    if (typeof jQuery !== 'undefined') {
        jQuery(document).ready(function() {
            setTimeout(scrollToActiveNav, 150);
        });
    }
})();


// CA-gov accordion side-nav JS

//@ts-check
window.addEventListener("load", () => {
  /**
   * Accordion web component that collapses and expands content inside itself on click.
   *
   * @element cagov-accordion
   *
   *
   * @fires click - Default events which may be listened to in order to discover most popular accordions
   *
   * @attr {string} open - set on the internal details element
   * If this is true the accordion will be open before any user interaction.
   *
   * @cssprop --primary-700 - Default value of #165ac2, used for all colors of borders and fills
   * @cssprop --primary-900 - Default value of #003588, used for background on hover
   *
   */
  class CaGovAccordion extends HTMLElement {
    connectedCallback() {
      this.summaryEl = this.querySelector("summary");
      // trigger the opening and closing height change animation on summary click
      this.setHeight();
      this.summaryEl.addEventListener("click", this.listen.bind(this));
      
      // Caret loading disabled
      // this.addCaret();
      
      this.detailsEl = this.querySelector("details");
      this.bodyEl = this.querySelector(".accordion-body");
      window.addEventListener(
        "resize",
        this.debounce(this.setHeight).bind(this)
      );
    }
    
    // Caret creation method (currently disabled)
    // addCaret() {
    //   this.summaryEl.insertAdjacentHTML(
    //     "beforeend",
    //     `<div class="cagov-open-indicator" aria-hidden="true" />`
    //   );
    // }
    
    setHeight() {
      window.requestAnimationFrame(() => {
        // delay so the desired height is readable in all browsers
        this.closedHeightInt = this.summaryEl.scrollHeight + 2;
        this.closedHeight = `${this.closedHeightInt}px`;
        // apply initial height
        if (this.detailsEl.hasAttribute("open")) {
          // if open get scrollHeight
          this.detailsEl.style.height = `${
            this.bodyEl.scrollHeight + this.closedHeightInt
          }px`;
        } else {
          // else apply closed height
          this.detailsEl.style.height = this.closedHeight;
        }
      });
    }
    listen() {
      if (this.detailsEl.hasAttribute("open")) {
        // was open, now closing
        this.detailsEl.style.height = this.closedHeight;
      } else {
        // was closed, opening
        window.requestAnimationFrame(() => {
          // delay so the desired height is readable in all browsers
          this.detailsEl.style.height = `${
            this.bodyEl.scrollHeight + this.closedHeightInt
          }px`;
        });
      }
    }
    /**
     * @param {function} func
     */
    debounce(func, timeout = 300) {
      let timer;
      return (/** @type {any} */ ...args) => {
        window.clearTimeout(timer);
        timer = window.setTimeout(() => {
          func.apply(this, args);
        }, timeout);
      };
    }
  }
  window.customElements.define("cagov-accordion", CaGovAccordion);
});

//CA-gov accordion that opens the accordion when linked from in-page or on another page
window.addEventListener('load', function () {
  var hash = window.location.hash;
  
  if (hash) {
    var targetElement = document.querySelector(hash);
    
    if (targetElement) {
      var detailsParent = targetElement.closest('details');
      
      if (detailsParent) {
        // Open the accordion
        detailsParent.setAttribute('open', '');
        
        // Scroll after a brief delay to ensure accordion is expanded
        setTimeout(function() {
          targetElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
          
          setTimeout(function() {
            targetElement.style.backgroundColor = '';
          }, 2000);
        }, 150);
      }
    }
  }
});

/* -----------------------------------------
   TABS -- custom accessible tabs
----------------------------------------- */

document.querySelectorAll('.tabs ul[role="tablist"]').forEach(ul => {
    ul.style.listStyle = 'none';
    ul.style.padding = '0';
    ul.style.margin = '0';
});

window.addEventListener("DOMContentLoaded", () => {
  // Get relevant elements and collections
  const allTabs = document.querySelectorAll(".tabs");
  allTabs.forEach(tabbed => {
    const tablist = tabbed.querySelector("ul");

    if (!tablist) return;

    const tabs = tablist.querySelectorAll("a");
    /** @type {NodeListOf<HTMLElement>} */
    const panels = tabbed.querySelectorAll('[id^="section"]');

    // The tab switching function
    /**
     *
     * @param {Element} oldTab
     * @param {HTMLElement} newTab
     */
    const switchTab = (oldTab, newTab) => {
      newTab.focus();
      // Make the active tab focusable by the user (Tab key)
      newTab.removeAttribute("tabindex");
      // Set the selected state
      newTab.setAttribute("aria-selected", "true");
      oldTab.removeAttribute("aria-selected");
      oldTab.setAttribute("tabindex", "-1");
      // Get the indices of the new and old tabs to find the correct
      // tab panels to show and hide
      const index = Array.prototype.indexOf.call(tabs, newTab);
      const oldIndex = Array.prototype.indexOf.call(tabs, oldTab);
      panels[oldIndex].hidden = true;
      panels[index].hidden = false;
    };

    // Add the tablist role to the first <ul> in the .tabbed container
    tablist.setAttribute("role", "tablist");

    // Add semantics are remove user focusability for each tab

    tabs.forEach((tab, i) => {
      tab.setAttribute("role", "tab");
      tab.setAttribute("tabindex", "-1");
      /** @type {Element} */ (tab.parentNode).setAttribute(
        "role",
        "presentation"
      );

      // Handle clicking of tabs for mouse users
      tab.addEventListener("click", e => {
        e.preventDefault();
        const currentTab = tablist.querySelector("[aria-selected]");
        if (currentTab && e.currentTarget !== currentTab) {
          switchTab(currentTab, /** @type {HTMLElement} */ (e.currentTarget));
        }
      });

      // Handle keydown events for keyboard users
      tab.addEventListener("keydown", e => {
        // Get the index of the current tab in the tabs node list
        const index = Array.prototype.indexOf.call(tabs, e.currentTarget);
        // Work out which key the user is pressing and
        // Calculate the new tab's index where appropriate
        const dir = ["ArrowLeft", "Left"].includes(e.key)
          ? index - 1
          : ["ArrowRight", "Right"].includes(e.key)
          ? index + 1
          : ["ArrowDown", "Down"].includes(e.key)
          ? "down"
          : null;
        if (dir !== null) {
          e.preventDefault();
          // If the down key is pressed, move focus to the open panel,
          // otherwise switch to the adjacent tab
          dir === "down"
            ? panels[i].focus()
            : tabs[dir]
            ? switchTab(/** @type {Element} */ (e.currentTarget), tabs[dir])
            : void 0;
        }
      });
    });

    // Add tab panel semantics and hide them all
    panels.forEach((panel, i) => {
      panel.setAttribute("role", "tabpanel");
      panel.setAttribute("tabindex", "-1");
      panel.setAttribute("aria-label", tabs[i].innerText);
      panel.hidden = true;
    });

    // Initially activate the first tab and reveal the first tab panel
    tabs[0].removeAttribute("tabindex");
    tabs[0].setAttribute("aria-selected", "true");
    panels[0].hidden = false;
  });
});


// Dynamic Table JS

document.addEventListener('DOMContentLoaded', () => {
    const dataContainer = document.getElementById('data-container');
    const jsonUrl = dataContainer.getAttribute('data-json-url');
    const headers = dataContainer.getAttribute('data-headers');
    const headerNamesAttr = dataContainer.getAttribute('data-header-names');

    if (!jsonUrl || !headers) {
        console.error('Missing JSON URL or headers in data-container attributes.');
        dataContainer.textContent = 'Error: Data source missing.';
        return;
    }

    // Define headerArray and headerDisplayNames
    const headerArray = headers.split(',').map(header => header.trim());
    let headerDisplayNames = {};
    
    try {
        if (headerNamesAttr) {
            headerDisplayNames = JSON.parse(headerNamesAttr);
        }
    } catch (error) {
        console.error('Error parsing data-header-names:', error);
    }

    let originalData = []; // Store original unfiltered data
    let filteredData = []; // Store search-filtered data
    let currentPage = 1;
    let pageSize = 10;

    fetch(jsonUrl)
        .then(response => response.json())
        .then(data => {
            originalData = data;
            filteredData = [...originalData]; // Start with full data
            renderTable(filteredData, headerArray);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            dataContainer.textContent = 'Failed to load data.';
        });

    function renderTable(data, headers) {
        dataContainer.innerHTML = '';

        const tableWrapper = document.createElement('div');
        tableWrapper.classList.add('table-responsive');

        const table = document.createElement('table');
        table.classList.add('table', 'table-striped', 'sortable');
        table.setAttribute('id', 'dynamic-table');

        // Table Head
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        headers.forEach(headerText => {
            const th = document.createElement('th');
            const button = document.createElement('button');
            
            // Use custom header name if available, otherwise use original header
            const displayName = headerDisplayNames[headerText] || headerText;
            button.textContent = displayName;
            button.setAttribute('aria-label', `Sort by ${displayName}`);
            button.addEventListener('click', () => sortTable(headers.indexOf(headerText)));

            th.appendChild(button);
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Table Body
        const tbody = document.createElement('tbody');
        table.appendChild(tbody);
        tableWrapper.appendChild(table);
        dataContainer.appendChild(tableWrapper);

        // Pagination UI
        const paginationWrapper = document.createElement('div');
        paginationWrapper.classList.add('d-flex', 'justify-content-between', 'align-items-center', 'mt-3');

        // Entries info text
        const entriesInfo = document.createElement('div');
        entriesInfo.id = 'entries-info';

        // Pagination controls
        const paginationControls = document.createElement('div');
        paginationControls.id = 'pagination-controls';
        paginationControls.classList.add('pagination');

        paginationWrapper.appendChild(entriesInfo);
        paginationWrapper.appendChild(paginationControls);
        dataContainer.appendChild(paginationWrapper);

        setupSearch();
        setupPagination();
        updateTable();
    }

    // 🔹 Search Functionality
    function setupSearch() {
        const searchInput = document.getElementById('dt-search-0');

        searchInput.addEventListener('input', function () {
            const filter = searchInput.value.toLowerCase();

            // Filter data based on search
            filteredData = originalData.filter(item =>
                Object.values(item).some(value =>
                    String(value).toLowerCase().includes(filter)
                )
            );

            // Reset to page 1 after filtering
            currentPage = 1;
            updateTable();
        });
    }

    // 🔹 Pagination Functionality
    function setupPagination() {
        const dropdown = document.getElementById('dt-length-0');
        dropdown.addEventListener('change', function () {
            pageSize = parseInt(dropdown.value);
            currentPage = 1; // Reset to first page
            updateTable();
        });
    }

    function updateTable() {
        const table = document.getElementById('dynamic-table');
        const tbody = table.querySelector('tbody');
        const paginationControls = document.getElementById('pagination-controls');
        const entriesInfo = document.getElementById('entries-info');

        tbody.innerHTML = '';

        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        const paginatedData = filteredData.slice(start, end);

        paginatedData.forEach(item => {
            const row = document.createElement('tr');
            headerArray.forEach(headerKey => {
                const td = document.createElement('td');
                td.textContent = item[headerKey] || 'N/A';
                row.appendChild(td);
            });
            tbody.appendChild(row);
        });

        entriesInfo.textContent = `Showing ${start + 1} to ${Math.min(end, filteredData.length)} of ${filteredData.length} entries`;
        updatePaginationControls();
    }

    function updatePaginationControls() {
        const paginationControls = document.getElementById('pagination-controls');
        paginationControls.innerHTML = '';

        const totalPages = Math.ceil(filteredData.length / pageSize);

        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.classList.add('page-item', 'btn', 'btn-light');
            pageBtn.textContent = i;
            pageBtn.setAttribute('aria-label', `Go to page ${i}`);

            if (i === currentPage) {
                pageBtn.classList.add('active');
                pageBtn.setAttribute('aria-current', 'page');
            }

            pageBtn.addEventListener('click', () => {
                currentPage = i;
                updateTable();
            });

            paginationControls.appendChild(pageBtn);
        }
    }

    // 🔹 Sorting Functionality
    function sortTable(columnIndex) {
        const isAscending = dataContainer.dataset.sortOrder !== 'asc';
        dataContainer.dataset.sortOrder = isAscending ? 'asc' : 'desc';

        filteredData.sort((a, b) => {
            const cellA = a[headerArray[columnIndex]] || "";
            const cellB = b[headerArray[columnIndex]] || "";

            return isAscending
                ? cellA.toString().localeCompare(cellB.toString())
                : cellB.toString().localeCompare(cellA.toString());
        });

        updateTable();
    }
});


// Divi Toggle Module Accessibility: Retrieve all Divi Toggle Modules

jQuery(document).ready(function() {

  var toggle_modules = $('div.et_pb_toggle');

    // Run only if there is a Toggle Module on the current page
    if( toggle_modules.length  ){
        toggle_modules.each(function(index, element) {
            var expanded = $(element).hasClass('et_pb_toggle_open') ?  'true' : 'false' ;
            
            $(element).attr('tabindex', 0);
            $(element).attr('role', 'button');
            $(element).attr('aria-expanded', expanded);
            
            $(element).on('click', function(e){
                // If is IE, apply fix
                if (window.document.documentMode) {   
                    // if is an accordion item
                    if( $(element).hasClass('et_pb_accordion_item') ){

                        // if current accordion is not already opened
                        if( ! $(element).hasClass('et_pb_toggle_open') ){
                            // close all accordions
                            toggle_modules.each(function(i,e){
                                $(e).removeClass('et_pb_toggle_open');
                                $(e).addClass('et_pb_toggle_close');
                                $(e).attr('aria-expanded', 'false');
                                $(e).find('.et_pb_toggle_content').slideUp();
                            })

                            // open selected accordion content
                            $(element).find('.et_pb_toggle_content').slideToggle();
                            $(element).addClass('et_pb_toggle_open');
                            $(element).removeClass('et_pb_toggle_close');
                            $(element).attr('aria-expanded', 'true');
                        }
                    // is a toggle item
                    }else{
                        $(element).find('.et_pb_toggle_content').slideToggle();
                        $(element).toggleClass('et_pb_toggle_open');
                        $(element).toggleClass('et_pb_toggle_close');

                        if( $(element).hasClass('et_pb_toggle_open') ){
                            $(element).attr('aria-expanded', 'true');
                        }else{
                            $(element).attr('aria-expanded', 'false');
                        }
                    }
                }else{
                    setTimeout( function(){ toggleExpansion(element); }, 1000 );
                }
            });
        });      

        function toggleExpansion(ele){
            var expanded = $(ele).hasClass('et_pb_toggle_open') ?  'true' : 'false' ;
            $(ele).attr('aria-expanded', expanded);
        }
    }

});


// Fix for accessibility error: Hidden element has focusable content on a different page
window.addEventListener('load', function() {
  // Select all anchor elements within elements that have both the class and aria-hidden attribute
  var aelements = document.querySelectorAll('.et_pb_main_blurb_image[aria-hidden="true"] a');
  for (let el of aelements) {
    el.setAttribute("tabindex", -1);
    // Remove the href attribute to disable interactivity
    el.removeAttribute("href");
    // Disable pointer events so the link is non-interactive
    el.style.pointerEvents = "none";
  }
});

//@ts-check

/* -----------------------------------------
 MOBILE SIDE NAVIGATION
----------------------------------------- */

(function waitForSideNav() {
  const sidenav = document.querySelector(".side-navigation");
  const siteHeader = document.querySelector("header");
  if (sidenav && siteHeader) {
    // Your side navigation code here
    window.addEventListener("load", () => {
      const siteHeader = document.querySelector("header");
      const sidenavigation = /** @type {HTMLElement} */ (
        document.querySelector(".side-navigation")
      );
      if (!sidenavigation || !siteHeader) return;
      const allSidenavLinks = /** @type {NodeListOf<HTMLElement>} */ (
        sidenavigation.querySelectorAll(".side-navigation a")
      );
      const mainContentSideNavCont = sidenavigation.closest("div");
      sidenavigation.id = "side-navigation";
      const topposition = localStorage.getItem("sidebar-scroll");
      const mobileCntls = document.querySelector(
        ".global-header .mobile-control.toggle-menu"
      );
      if (!mobileCntls) return;
      let mobileControlsDisplay = window.getComputedStyle(mobileCntls).display; // Side nav height vs viewport
      const siteHeaderHeight = siteHeader ? siteHeader.clientHeight : 0;
      const mobileView$3 = () =>
        getComputedStyle(mobileCntls)["display"] !== "none";
      let timeout = 0;
      const delay = 250; // delay between calls
      /** @type {HTMLElement} */
      let mobileSideNavDiv,
        /** @type {HTMLDivElement} */ mobileSideNavCont,
        /** @type {HTMLButtonElement} */ sidenavToggleBtn;

      const createMobileSideNavButton = () => {
        // get first side nav element
        /** @type {HTMLAnchorElement | null} */
        const sidenavTItle = document.querySelector(
          ".side-navigation a, .sidenav"
        );

        if (sidenavTItle) {
          // get text for the button for first side nav element
          let btnText = sidenavTItle.innerText;
          const btnTextSpan =
            sidenavTItle.querySelector("span")?.innerText || ""; // removing the sr-only span and it's content
          btnText = btnText.replace(btnTextSpan, "").trim();
          // create button container
          const sidenavMobile = document.createElement("aside");
          sidenavMobile.className = "sidenav-mobile-btn";
          const sidenavMobileCont = document.createElement("div");
          sidenavMobileCont.className = "container";
          sidenavMobile.append(sidenavMobileCont);
          // create button
          sidenavToggleBtn = document.createElement("button");
          sidenavToggleBtn.type = "button";
          sidenavToggleBtn.className = "sidenav-toggle";
          sidenavToggleBtn.ariaExpanded = "false";
          sidenavToggleBtn.setAttribute("aria-controls", "side-navigation");
          sidenavToggleBtn.innerText = btnText;
          // create icon
          const arrowIcon = document.createElement("span");
          arrowIcon.ariaHidden = "true";
          arrowIcon.className = "ca-gov-icon-caret-down";
          sidenavToggleBtn.append(arrowIcon);
          // append button into the header
          sidenavMobileCont.append(sidenavToggleBtn);
          siteHeader.after(sidenavMobile);
          // add click event
          sidenavToggleBtn.addEventListener("click", toggleSideNav);
        }
      };

      const createmobileSideNavDiv = () => {
        mobileSideNavDiv = document.createElement("aside");
        mobileSideNavDiv.className = "mobile-sidenav";
        mobileSideNavCont = document.createElement("div");
        mobileSideNavCont.className = "container";
        mobileSideNavDiv.append(mobileSideNavCont);
        siteHeader.after(mobileSideNavDiv);
      };

      // MOBILE Side nav
      const moveSideNavToHeader = () => {
        if (mobileSideNavCont) {
          mobileSideNavCont.append(sidenavigation);
        }

        sidenavigation.ariaHidden = "true";
        allSidenavLinks?.forEach(el => {
          el.tabIndex = -1;
        });
      };

      // DESKTOP Side nav
      const moveSideNavToMainContent = () => {
        if (sidenavigation === mainContentSideNavCont) return; //Prevents an error if sidenav is not set up correctly

        mainContentSideNavCont?.append(sidenavigation);
        sidenavigation.removeAttribute("aria-hidden");
        allSidenavLinks?.forEach(el => {
          el.removeAttribute("tabindex");
        });
      };

      // Mobile Side Nav Button click function
      const toggleSideNav = () => {
        mobileSideNavDiv.classList.toggle("visible");
        // Open
        if (mobileSideNavDiv.classList.contains("visible")) {
          sidenavigation.removeAttribute("aria-hidden");
          sidenavToggleBtn.ariaExpanded = "true";
          allSidenavLinks?.forEach(el => {
            el.removeAttribute("tabindex");
          });

          // Closed
        } else {
          sidenavToggleBtn.ariaExpanded = "false";
          sidenavigation.ariaHidden = "true";
          allSidenavLinks?.forEach(el => {
            el.tabIndex = -1;
          });
        }
      };

      /**
       * Set active class on nav-heading links
       */
      function addActiveClass() {
        /** @type {NodeListOf<HTMLAnchorElement>} */
        const active_link = document.querySelectorAll("a.nav-heading"),
          len = active_link.length,
          full_path = location.href.split("#")[0]; //Ignore hashes? // Loop through each link.
        for (let i = 0; i < len; i++)
          if (active_link[i].href.split("#")[0] == full_path)
            active_link[i].className += " active";
      }

      const sidenavOverflow = () => {
        if (!mobileView$3()) {
          const viewportheight = document.documentElement.clientHeight;
          const viewportMinusHeader = viewportheight - siteHeaderHeight - 100;

          if (
            viewportMinusHeader <=
            (document.querySelector(".side-navigation")?.clientHeight || 0)
          ) {
            sidenavigation.classList.add("overflow-auto"); // sidenavigation.setAttribute("style", "max-height:" + viewportMinusHeader + "px")
          } else {
            sidenavigation.classList.remove("overflow-auto");
            sidenavigation.removeAttribute("style");
          }

          if ([...sidenavigation.classList].includes("overflow-auto")) {
            sidenavigation.setAttribute(
              "style",
              'max-height:${viewportMinusHeader}px'
            );
          }
        } else {
          sidenavigation.classList.remove("overflow-auto");
          sidenavigation.removeAttribute("style");
        } // Remebemering scrolling position
        if (topposition !== null) {
          sidenavigation.scrollTop = parseInt(topposition, 10);
        }
        window.addEventListener("beforeunload", () => {
          localStorage.setItem(
            "sidebar-scroll",
            sidenavigation.scrollTop.toString()
          );
        });
      };

      // ONLOAD
      addActiveClass();
      createmobileSideNavDiv();
      createMobileSideNavButton();

      if (mobileControlsDisplay !== "none") {
        moveSideNavToHeader();
      }
      // on resize
      window.addEventListener("resize", () => {
        mobileControlsDisplay = getComputedStyle(mobileCntls).display; // clear the timeout

        window.clearTimeout(timeout); // start timing for event "completion"
        timeout = window.setTimeout(sidenavOverflow, delay); // if mobile
        if (mobileControlsDisplay !== "none") {
          moveSideNavToHeader(); // if mobile
        } else {
          moveSideNavToMainContent();
        }
      });
      sidenavOverflow();
    });
  } else {
    setTimeout(waitForSideNav, 100); // Try again in 100ms
  }
})();

