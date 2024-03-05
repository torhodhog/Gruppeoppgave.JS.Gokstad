function fetchAndDisplayUserData() {
  fetch("https://randomuser.me/api/?results=1")
    .then((response) => response.json())
    .then((data) => {
      const profileContainer = document.getElementById("user-container");
      profileContainer.innerHTML = "";
      displayUserData(data);
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
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
                <p>${user.email}</p>
                <p>Location: ${user.location.city}, ${user.location.country}</p>
                <p>Age: ${user.dob.age}</p>
  `;
  profileContainer.appendChild(div);
}

let usersList = JSON.parse(localStorage.getItem("usersList")) || []; //lagrer likte brukere

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
  //caller på fetcAndDisplayUserdata:
  fetchAndDisplayUserData();
}

function swipeRight() {
  if (activeUser) {
    usersList.push(`${activeUser.name.first} ${activeUser.name.last}`);
    localStorage.setItem("usersList", JSON.stringify(usersList));
    displayLikedUsers();
  }

  checkPoints();
  deductPoints();
  fetchAndDisplayUserData();
}

//this list saves more than just my liked profiles...
function displayLikedUsers() {
  const likedUsersList = document.querySelector("#like-list ul");
  likedUsersList.innerHTML = ""; // Tømmer listen først
  usersList.forEach((user, index) => {
    const li = document.createElement("li");
    li.textContent = user;
    likedUsersList.appendChild(li);

    //Edit button:
    const editBtn = document.createElement("button");
    editBtn.innerHTML = "Rediger";
    editBtn.className = "edit-btn";
    editBtn.addEventListener("click", function () {
      editUserData(index);
    });

    //Prøver å lage knapp for å slette en like
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Slett";
    deleteBtn.className = "delete-btn";
    deleteBtn.onclick = () => deleteUser(index);

    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    likedUsersList.appendChild(li);
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
}

//editUserList function:
function editUserData(index) {
  console.log("inne i editfunskjonen");
  const newName = prompt("Skriv inn nytt navn");
  const newLocation = prompt("Skriv in nytt område");
  const newAge = promt("Skriv inn ny alder");

  if (newName !== null) {
    console.log("newName", newName);
    usersList[index] = newName;
    if (newLocation !== null) {
      usersList[index] += ", " + newLocation;
    }
    if (newAge !== null) {
      usersList[index] += ", " + newAge;
    }
  }
}

function deleteUser(index) {
  usersList.splice(index, 1); // Sletter brukeren fra listen
  localStorage.setItem("usersList", JSON.stringify(usersList)); // Oppdaterer localStorage
  displayLikedUsers(); // Oppdaterer listen som vises
}

fetchAndDisplayUserData();
displayLikedUsers();
