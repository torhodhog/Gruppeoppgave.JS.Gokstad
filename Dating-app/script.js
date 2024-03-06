let activeUser;
let genderPreference = null;

function fetchAndDisplayUserData(gender) {
  if (gender && gender !== genderPreference) {
    genderPreference = gender;
  }
  let url = "https://randomuser.me/api/?results=1";
  if (genderPreference) {
    url += `&gender=${genderPreference}`;
  }

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const profileContainer = document.getElementById("user-container");
      profileContainer.innerHTML = "";
      displayUserData(data);
    })
    .catch((error) => {
      console.error("Får ikke hentet inn brukere:", error);
    });
}

function displayUserData(data) {
  const user = data.results[0];
  activeUser = user;
  const profileContainer = document.getElementById("user-container");
  const div = document.createElement("div");
  div.className = user.gender === "female" ? "female" : "male";
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
    usersList.push(activeUser);
    localStorage.setItem("usersList", JSON.stringify(usersList));
    displayLikedUsers();
  }

  checkPoints();
  deductPoints();
  fetchAndDisplayUserData();
}

function displayLikedUsers() {
  const likedUsersList = document.querySelector("#like-list ul");
  likedUsersList.innerHTML = ""; // Tømmer listen først
  usersList.forEach((user, index) => {
    if (user && user.name) {
      const li = document.createElement("li");

      const textContent = document.createElement("div");
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
}

function womenBtn() {
  fetchAndDisplayUserData("female");
}

function bothBtn() {
  fetchAndDisplayUserData();
}
document.getElementById("menBTN").addEventListener("click", menBtn);
document.getElementById("womenBtn").addEventListener("click", womenBtn);
document.getElementById("bothBtn").addEventListener("click", bothBtn);

fetchAndDisplayUserData();
displayLikedUsers();
