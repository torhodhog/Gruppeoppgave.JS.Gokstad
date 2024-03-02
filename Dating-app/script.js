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
  const profileContainer = document.getElementById("user-container");
  const div = document.createElement("div");
  div.className = user.gender === "female" ? "female" : "male";
  div.innerHTML = `
    <img src="${user.picture.large}" alt="${user.name.first} ${user.name.last}"> 
    <h1>${user.name.first} ${user.name.last}</h1> 
    <p>${user.email}</p>
  `;
  profileContainer.appendChild(div);
}

let usersList = []; // Her lagres brukerne

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
  //caller på hent og vis:
  fetchAndDisplayUserData();
}

function swipeRight() {
  fetch("https://randomuser.me/api/?results=1")
    .then((response) => response.json())
    .then((data) => {
      const user = data.results[0];
      let usersList = JSON.parse(localStorage.getItem("usersList")) || [];
      usersList.push(`${user.name.first} ${user.name.last}`);
      localStorage.setItem("usersList", JSON.stringify(usersList));

      //paster inn checkPoints:
      checkPoints();
      //paster inn deduct:
      deductPoints();
      //caller på hent og vis:
      fetchAndDisplayUserData();
    })
    .catch((error) => {
      console.error("Det oppstod en feil:", error);
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

fetchAndDisplayUserData();

//vis meg de valgte brukerne fra det lokale arrayet:
function showSavedUsersList() {
  console.log("lagrede brukere");
  usersList = JSON.parse(localStorage.getItem("usersList")) || [];
  savedUsersListContainer.innerHTML = ""; //need to call this something that is actually defined
  localStorage.forEach((users, index) => {
    const savedUsersListCard = document.createElement("div");

    //funksjon for knapper når du sveiper til høyre:
    usersList.forEach((swipeRight, index) => {
      //Delete button:
      const deleteBtn = document.createElement("button");
      deleteBtn.innerHTML = "slett";
      deleteBtn.addEventListener("click", function () {
        deleteUsersList(index); //make this function
      });

      //Edit button:
      const editBtn = document.createElement("button");
      editBtn.innerHTML = "rediger";
      editBtn.addEventListener("click", function () {
        editUsersList(index); //make this function
      });
    });

    //remember to append the buttons to the usercards!
  });
}

//editUserList function:
function editUsersList(index) {
  const ranomUserRightEdit =
    JSON.parse(localStorage.getItem("usersList")) || []; //might have to call this constant something else
}
//deleteUserList function:
function deleteUsersList(index) {
  const randomUserRightDelete =
    JSON.parse(localStorage.getItem("usersList")) || []; //might have to call this constant something else

  usersList.splice(index, 1);
  localStorage.setItem("usersList", JSON.stringify(x));
  showSavedUsersList(); //need to make this  function
}
