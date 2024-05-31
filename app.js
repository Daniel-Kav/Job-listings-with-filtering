// Global variables
const jobs = document.getElementById("jobs");
const filters = document.querySelectorAll(".tags btn");
const clearFiltersBtn = document.getElementById("clear-filter");
let jobData = []; // Store all job data
let filter = []; // Store filters 

// Load filters from local storage
function loadFiltersFromLocalStorage() {
    const storedFilters = localStorage.getItem('filters');
    if (storedFilters) {
        filter = JSON.parse(storedFilters);
        filter.forEach(addFilterWithoutRender);
    }
}

// Save filters to local storage
function saveFiltersToLocalStorage() {
    localStorage.setItem('filters', JSON.stringify(filter));
}

// Events
clearFiltersBtn.addEventListener("click", removeAllFilter);

// Function to load jobs initially
function loadJobs() {
    fetch('./data.json')
    .then((response) => response.json())
    .then((json) => { 
        jobData = json;
        renderJobs();
    });
}

// Function to render filtered jobs
function renderJobs() {
    jobs.innerHTML = "";
    jobData.forEach(job => {
        if (filter.length === 0 || filter.every(f => job.languages.includes(f))) {
            jobs.appendChild(createCardElement(job));
        }
    });
}

// Function to create a job card element
function createCardElement(cardData){
    const card = document.createElement("div");
    card.classList.add("job", "flex-wrap");

    const cardContent = `
      <div class="job__info">
        <div class="job__img">
          <img src=${cardData.logo} alt="" srcset="">
        </div>
        <div class="job__content">
          <div class="job__company | d-flex align-items-center gap-400">
            <a class="job__title" href="#">${cardData.company}</a>
          </div>
          <a class="job__pos" href="#">${cardData.position}</a>
          <hr class="hr d-block-sm">
          <div class="d-flex">
            <p class="job_det">1d ago</p>
            <p class="job_det">Full Time</p>
            <p class="job_det">USA only</p>
          </div>
        </div>
      </div>
      <div class="tags | d-flex gap-400">
      </div>
    `;
    
    card.innerHTML = cardContent;
    const tags = card.querySelector(".tags");
    const company = card.querySelector(".job__company");
    if(cardData.new === true){
        company.insertAdjacentHTML("beforeend",
            `<p class="job__status job__status--featured">New!</p>`
        );
    }
    if(cardData.featured === true){
        company.insertAdjacentHTML("beforeend",
            `<p class="job__status job__status--new">Featured</p>`
        );
        card.classList.add("job--featured");
    }
    // Add event listeners to filter buttons
    for (const key in cardData.languages) {
        tags.insertAdjacentHTML("beforeend",
            `<button class="btn job-lang">${cardData.languages[key]}</button>`
        );
    } 
    tags.querySelectorAll(".btn").forEach(element => {
        element.addEventListener("click", event => {
            addFilter(element.textContent);
        });
    });
    
    return card;
}

// Function to create a filter element
function createFilterElement(filterData){
    const filterHolder = document.createElement("li");
    filterHolder.classList.add("filter-op");

    const filterContent = `
                    <span class="filter__tag">${filterData}</span>
                    <button class="filter__remove" data-lang=${filterData}>
                        <img src="./images/icon-remove.svg" alt="" srcset="">
                    </button>
                    `;
    filterHolder.innerHTML = filterContent;
    const remove  = filterHolder.querySelector(".filter__remove");
    remove.addEventListener("click", event => {
        removeFilter(event.currentTarget.getAttribute("data-lang"));
    });
    
    return filterHolder;
}

// Function to add a filter without rendering jobs (used for initial load)
function addFilterWithoutRender(newFilter) {
    if (!filter.includes(newFilter)){
        const filterSection = document.getElementById("filter-tags");
        filterSection.parentElement.classList.remove("opacity-0");
        filterSection.appendChild(createFilterElement(newFilter));
        filter.push(newFilter);
    }
}

// Function to add a filter
function addFilter(newFilter){
    if (!filter.includes(newFilter)){
        const filterSection = document.getElementById("filter-tags");
        filterSection.parentElement.classList.remove("opacity-0");
        filterSection.appendChild(createFilterElement(newFilter));
        filter.push(newFilter);
        saveFiltersToLocalStorage();
        renderJobs(); // Render filtered jobs
    }
}

// Function to remove a filter
function removeFilter(newFilter){
    const filterSection = document.getElementById("filter-tags");
    const filterElement = filterSection.querySelector('[data-lang="'+newFilter+'"]');
    filterSection.removeChild(filterElement.parentElement);
    const index = filter.indexOf(newFilter);
    if (index !== -1) {
        filter.splice(index, 1);
        if(filter.length === 0){
            filterSection.parentElement.classList.add("opacity-0");
        }
        saveFiltersToLocalStorage();
        renderJobs(); // Render filtered jobs
    }
}

// Function to remove all filters
function removeAllFilter(){
    const filterSection = document.getElementById("filter-tags");
    filterSection.innerHTML="";
    filter = [];
    filterSection.parentElement.classList.add("opacity-0");
    saveFiltersToLocalStorage();
    renderJobs(); // Render filtered jobs
}

// Initialize by loading jobs and filters
loadJobs();
loadFiltersFromLocalStorage();
