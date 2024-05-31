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