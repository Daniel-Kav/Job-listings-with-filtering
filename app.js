// Global variables
const jobs = document.getElementById("jobs");
const filters = document.querySelectorAll(".tags btn");
const clearFiltersBtn = document.getElementById("clear-filter");
let jobData = []; // Store all job data
var filter = []; // Store filters 

// events
clearFiltersBtn.addEventListener("click",removeAllFilter);

// Function to load jobs initially
function loadJobs() {
    fetch('./data.json')
    .then((response) => response.json())
    .then((json) => { 
        jobData = json;
        renderJobs();
    });
}

// Function to create a job card element
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
