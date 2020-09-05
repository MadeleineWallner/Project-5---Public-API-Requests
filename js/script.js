const gallery = document.getElementById('gallery');



//function to fetch the random users
async function fetchUsers () {
    try {
        const response = await fetch("https://randomuser.me/api/?results=12&nat=us");
        const json = await response.json();
        generateHTML(json.results)
    } catch (error){
        alert(error)
    }
}

fetchUsers()


//creating the html for the gallery
const generateHTML = (users) => {
    users.forEach(user => {
        const div = document.createElement('div');
        div.classList.add('card')
        gallery.appendChild(div);
    div.innerHTML = `
        <div class="card-img-container">
        <img class="card-img" src="${user.picture.large}" alt="profile picture">
    </div>
    <div class="card-info-container">
        <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
        <p class="card-text">${user.email}</p>
        <p class="card-text cap">${user.location.city} ${user.location.state}</p>
    </div>
    ` 

//Eventlistener to open the modal window when a user is clicked
    div.addEventListener('click', () => {
        modal(user)
        })  
    })
};


//creating the html for the modal window
const modal = (user) => {   
        const modalContainer = document.createElement('div')
        modalContainer.classList.add('modal-container')
        gallery.appendChild(modalContainer);
        modalContainer.innerHTML = `
        <div class="modal">
                    <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                    <div class="modal-info-container">
                        <img class="modal-img" src="${user.picture.large}" alt="profile picture">
                        <h3 id="name" class="modal-name cap">${user.name.first} ${user.name.last}</h3>
                        <p class="modal-text">${user.email}</p>
                        <p class="modal-text cap">${user.location.city}</p>
                        <hr>
                        <p class="modal-text">${phoneRegex(user.phone)}</p>
                        <p class="modal-text">${user.location.street.name} ${user.location.street.number} <br> ${user.location.postcode} ${user.location.country}</p>
                        <p class="modal-text">${dob(user.dob.date)}</p>
                    </div>
                    <div class="modal-btn-container">
                    <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                    <button type="button" id="modal-next" class="modal-next btn">Next</button>
                    </div>
        `

        //Eventlistener to close the modal window
        document.getElementById("modal-close-btn").addEventListener('click', () => {
            modalContainer.remove();
        });
        
        //added the option to click outside the modal window to close it
        modalContainer.addEventListener('click', (e) => {
            if(e.target === modalContainer){
                modalContainer.remove();
            }
        })   

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
const searchBar = `<form action="#" method="get">
                            <input type="search" id="search-input" class="search-input" placeholder="Search...">
                            <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
                        </form>`
const searchContainer = document.querySelector(".search-container");
searchContainer.innerHTML = searchBar;




function search () {
    let matches = [];
    const input = document.querySelector('.search-input');
    const names = document.querySelectorAll('#name')
    const cards = document.querySelectorAll('.card')

//show the employees whos names matches the search, hide the others. 
    for (let i = 0; i < cards.length; i++){
        if(names[i].innerText.toLowerCase().includes(input.value.toLowerCase())){
            matches.push(cards[i]) 
            cards[i].style.display = "flex" 
        } else {
            cards[i].style.display ="none"
        }
    }

// If there is no match/if the "matches" array is empty - print out "No Results!"
    if(matches.length === 0){
        gallery.innerHTML = `
        <h3>No Results!</h3>
        `
    }
}

//call the search function when the search button is clicked
document.querySelector('.search-submit').addEventListener('click', () => {
        search()
  });