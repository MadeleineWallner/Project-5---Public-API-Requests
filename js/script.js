
let matches = [];
let results;

//function to fetch the random users
async function fetchUsers () {
    try {
        const response = await fetch("https://randomuser.me/api/?results=12&nat=us");
        const json = await response.json();
        results = json.results
        matches.push(results)
        generateHTML(json.results)
        openModal(json.results);
    } catch (error){
        alert(error)
    }
}
fetchUsers();


//creating the html for the gallery
async function generateHTML (user){
    for(let i = 0; i < matches[0].length; i++){
        const card = document.createElement("div")
        card.classList.add("card", "visible-card")
        const gallery = document.getElementById("gallery");
        gallery.appendChild(card)
    card.innerHTML = `
        <div class="card-img-container">
        <img class="card-img" src="${user[i].picture.large}" alt="profile picture">
    </div>
    <div class="card-info-container">
        <h3 id="name" class="card-name cap">${user[i].name.first} ${user[i].name.last}</h3>
        <p class="card-text">${user[i].email}</p>
        <p class="card-text cap">${user[i].location.city} ${user[i].location.state}</p>
    </div>
    ` 
    }     
};


//Function to open the modal window when a user is clicked
async function openModal (user) {
    const visibleCards = document.querySelectorAll(".visible-card")
    for(let j = 0; j < visibleCards.length; j++){
        visibleCards[j].addEventListener('click', () => {
            const index = matches[0].indexOf(user[j])
            modal(matches[0], index)
        })
    }
}

//creating the html for the modal window
async function modal (user, number){  
        const modalContainer = document.createElement('div')
        modalContainer.classList.add("modal-container")
        const gallery = document.getElementById('gallery');
        gallery.appendChild(modalContainer);
        modalContainer.innerHTML = `
                <div class="modal">
                    <button type="button" id="modal-close-btn" class="modal-close-btn">X</button>
                    <div class="modal-info-container">
                        <img class="modal-img" src="${user[number].picture.large}" alt="profile picture">
                        <h3 id="name" class="modal-name cap">${user[number].name.first} ${user[number].name.last}</h3>
                        <p class="modal-text">${user[number].email}</p>
                        <p class="modal-text cap">${user[number].location.city}</p>
                        <hr>
                        <p class="modal-text">${phoneRegex(user[number].phone)}</p>
                        <p class="modal-text">${user[number].location.street.name} ${user[number].location.street.number} <br> ${user[number].location.postcode} ${user[number].location.country}</p>
                        <p class="modal-text">${dob(user[number].dob.date)}</p>
                    </div>
                    <div class="modal-btn-container">
                    <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                    <button type="button" id="modal-next" class="modal-next btn">Next</button>
                </div>
        `
        
        const prev = document.querySelector(".modal-prev");
        const next = document.querySelector(".modal-next");

        //if there's only one match - remove the modal-btn-container div
        if (matches[0].length === 1){
            document.querySelector(".modal-btn-container").remove()

        //remove the "previous" button when the first employee is displayed
        } else if(number === 0){
            prev.remove();
        
        //remove the "next" button when the last employee is displayed
        } else if (number === matches[0].length -1){
            next.remove();
        }

        //eventlisteners for the next and prev buttons  
            next.addEventListener('click', () => {
                modalContainer.remove()
                modal(user, number+1)
            });
            
            prev.addEventListener('click', () => {
                modalContainer.remove()
                modal(user, number-1)
            });   
            
            //Eventlistener to close the modal window. Added the option to click outside the modal to close it.
        document.addEventListener('click', (e) => {
            if(e.target.className === "modal-close-btn" || e.target === modalContainer){
                modalContainer.remove();
            }
        });

        //The user can also close the modal by pressing the Escape button
        document.addEventListener('keydown', (e) => {
            if(e.keyCode === 27){
                modalContainer.remove();
            }
        });
};


//Function to make all phone numbers in the (123) 456-7890 format
const phoneRegex = (phone) => {
    const cleaned = phone.replace(/\D+/g, '')
    const fixed = cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    return fixed;
};


//Function to make the birthdays in the mm/dd/yyyy format
const dob = (bday) => {
    const year = bday.substring(0,4)
    const month = bday.substring(5, 7)
    const date = bday.substring(8, 10)
    const dateofbirth = month + "/" + date + "/" + year
    return dateofbirth;
};


//creating the search field and appending it to the search container
const searchContainer = document.querySelector(".search-container");
searchContainer.innerHTML = `
        <form action="#" method="get">
            <input type="search" id="search-input" class="search-input" placeholder="Search...">
            <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
        </form>`



function search () {
    const input = document.querySelector('.search-input');
    const cards = document.querySelectorAll('.card')
    for(let j = 0; j < cards.length; j++){
        cards[j].classList.add("card", "visible-card")
    }
    

//show the employees whos names matches the search, hide the others. 
matches = []
let searchResults = []
const search = input.value.toLowerCase();

    for (let i = 0; i < cards.length; i++){
        if(results[i].name.first.toLowerCase().includes(search) || results[i].name.last.toLowerCase().includes(search)){
            cards[i].style.display = "flex"
            searchResults.push(results[i]) 
        } else {
            cards[i].style.display ="none"
            cards[i].classList.remove("visible-card")
        }
    }
    matches.push(searchResults)

// If there is no match/if the "matches" array is empty - print out "No Results!"
        if(searchResults.length === 0){
        noMatches.style.display = ""
    } else {
        noMatches.style.display = "none"
    }
}

//"No Results" message for the search function 
const noMatches = document.createElement("h3")
noMatches.innerHTML = "No Results!"
noMatches.style.display = "none"
gallery.appendChild(noMatches)



//call the search function when the search button is clicked
document.querySelector('.search-submit').addEventListener('click', () => {
        search();

});

document.querySelector('.search-input').addEventListener('keyup', () => {
        search();
})