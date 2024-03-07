let activeUser;
let genderPreference = "";
showGenderSelectionAlert();


// Kjører når hele siden er lastet inn
document.addEventListener("DOMContentLoaded", function () {
  fetchAndDisplayUserData(); // Henter og viser brukerdata ved oppstart
});


// Asynkron funksjon som henter brukerdata fra randomuser.me APIet
async function fetchAndDisplayUserData(gender) {
  // Sjekker om brukeren har valgt et foretrukket kjønn
  if (gender && gender !== genderPreference) {
    genderPreference = gender;
  }

  let url = "https://randomuser.me/api/?results=1";
  if (genderPreference) {
    url += `&gender=${genderPreference}`;
  }


  try {
    const response = await fetch(url); // Henter data fra APIet
    const data = await response.json(); // Konverterer responsen til JSON 
    const profileContainer = document.getElementById("user-container"); // Henter ut div'en som skal vise brukerdata
    profileContainer.innerHTML = ""; // Tømmer div'en før vi legger til ny bruker
    displayUserData(data); // Kaller funksjonen som viser brukerdata
  } catch (error) {
    console.error("Får ikke hentet inn brukere:", error); // Logger feilmelding til konsollen om noe går galt med henting av brukerdata
  }
}


// Funksjon som viser brukerdata
function displayUserData(data) {
  const user = data.results[0];
  activeUser = user;
  const profileContainer = document.getElementById("user-container"); // Henter ut div'en som skal vise brukerdata, samme som i fetchAndDisplayUserData
  profileContainer.innerHTML = ""; // Tømmer div'en før vi legger til ny bruker, på samme måte

  const div = document.createElement("div");
  div.className = user.gender === "female" ? "female" : "male"; // Sjekker om det er mann eller dame, i forhold til fargene på kortene
  div.innerHTML = `
    <img src="${user.picture.large}" alt="${user.name.first} ${user.name.last}"> 
    <h1>${user.name.first} ${user.name.last}</h1> 
    <p> Age: ${user.dob.age}</p>
    <p>Mail: ${user.email}</p>
    <p>City: ${user.location.city}</p>
  `;
  profileContainer.appendChild(div);
}

let usersList = JSON.parse(localStorage.getItem("usersList")) || []; // Global variabel. Lagrer brukere som er likt

//Paster inn deduct points function:
function deductPoints() {
  points--;
  checkPoints();
}



function swipeLeft() {
  //paster inn checkPoints:
  checkPoints();
  //Paster inn deduct i funksjonen:
  deductPoints();

  fetchAndDisplayUserData();
}

// Hadde hentet inn APIet to ganger, så jeg endret dette.
function swipeRight() {
  if (activeUser) {
    if (usersList.length >= 10) { // Rettet fra 'lenght' til 'length'
      alert("Din liker-liste er full, slett en eller flere for å legge til nye profiler");
      return; // Avslutter funksjonen for å forhindre ytterligere tillegg
    }
    usersList.push(activeUser);
    localStorage.setItem("usersList", JSON.stringify(usersList));
    displayLikedUsers();
  }

  checkPoints();
  deductPoints();
  fetchAndDisplayUserData();
}



// Funksjon som viser brukere som er likt og lagret i localStorage
function displayLikedUsers() {
  const likedUsersList = document.querySelector("#like-list ul");
  likedUsersList.innerHTML = ""; // Tømmer listen først
  usersList.forEach((user, index) => {
    if (user && user.name) { // Sjekker om brukeren har et navn (for å unngå feil)
      const li = document.createElement("li"); // Lager et nytt listeelement

      const textContent = document.createElement("div"); // Lager en div for teksten
      textContent.className = "text-content";
      textContent.innerHTML = `
        <p>${user.name.first} ${user.name.last}</p> 
        <p>Age: ${user.dob.age}</p>
        <p>Mail: ${user.email}</p>
        <p>City: ${user.location.city}</p>
      `;

      const buttonContent = document.createElement("div");
      buttonContent.className = "button-content";

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Slett";
      deleteBtn.className = "delete-btn";
      deleteBtn.onclick = () => deleteUser(index);

      const editBtn = document.createElement("button");
      editBtn.textContent = "Rediger";
      editBtn.className = "edit-btn";
      editBtn.onclick = () => editUserData(index);

      buttonContent.appendChild(editBtn);
      buttonContent.appendChild(deleteBtn);

      li.appendChild(textContent);
      li.appendChild(buttonContent);
      likedUsersList.appendChild(li);
    }
  });
}

//Paster inn poeng her:
let points = 10;

//paster inn checkPointsfunksjonen her:
function checkPoints() {
  console.log("inne i checkPoints function");
  console.log("Points:", points);
  if (points <= 0) {
    console.log("poeng er 0");
    const response = prompt("Vil du swipe mer? ja/nei");
    console.log("Prompt response:", response);
    if (response && response.toLowerCase() === "ja") {
      console.log("10 nye poeng");
      points = 10;
    } else {
      points = 0;
      console.log("Poeng = 0");
      checkPoints();
    }
  }
  document.querySelector(".point-counter").textContent = points;
}

function deleteUser(index) {
  usersList.splice(index, 1); // Sletter brukeren fra listen
  localStorage.setItem("usersList", JSON.stringify(usersList)); // Oppdaterer localStorage
  displayLikedUsers(); // Oppdaterer listen som vises
}
//oppdatert edit funksjon fra Torgeir:
function editUserData(index) {
  const user = usersList[index];
  const li = document.querySelector(`#like-list ul li:nth-child(${index + 1})`);
  const textContent = li.querySelector(".text-content");

  const nameInput = document.createElement("input");
  nameInput.value = `${user.name.first} ${user.name.last}`;
  const ageInput = document.createElement("input");
  ageInput.value = `Age: ${user.dob.age}`;
  const emailInput = document.createElement("input");
  emailInput.value = `Mail: ${user.email}`;
  const cityInput = document.createElement("input");
  cityInput.value = `City: ${user.location.city}`;

  textContent.innerHTML = "";
  textContent.appendChild(nameInput);
  textContent.appendChild(ageInput);
  textContent.appendChild(emailInput);
  textContent.appendChild(cityInput);

  const saveBtn = document.createElement("button");
  saveBtn.textContent = "Lagre";
  saveBtn.onclick = () => {
    const [firstName, lastName] = nameInput.value.split(" ");
    user.name.first = firstName;
    user.name.last = lastName;
    user.dob.age = ageInput.value.replace("Age: ", "");
    user.email = emailInput.value.replace("Mail: ", "");
    user.location.city = cityInput.value.replace("City: ", "");
    localStorage.setItem("usersList", JSON.stringify(usersList));
    displayLikedUsers();
  };

  const buttonContent = li.querySelector(".button-content");
  buttonContent.innerHTML = "";
  buttonContent.appendChild(saveBtn);
}

function menBtn() {
  fetchAndDisplayUserData("male");
  document.getElementById("gender-preference").innerHTML =
    "Foretrukket kjønn: Mann";
}

function womenBtn() {
  fetchAndDisplayUserData("female");
  document.getElementById("gender-preference").innerHTML =
    "Foretrukket kjønn: Kvinne";
}

function bothBtn() {
  genderPreference = "";
  fetchAndDisplayUserData();
  document.getElementById("gender-preference").innerHTML =
    "Foretrukket kjønn: Begge";
}

document.getElementById("menBtn").addEventListener("click", menBtn);
document.getElementById("womenBtn").addEventListener("click", womenBtn);
document.getElementById("bothBtn").addEventListener("click", bothBtn);

function showGenderSelectionAlert() {
  alert(
    "venligst velg foretrukket kjønn til din datingprofil ved hjelp av kjønnssymbolene"
  );
}

fetchAndDisplayUserData();
