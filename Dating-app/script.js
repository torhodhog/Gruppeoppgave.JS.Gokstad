<<<<<<< HEAD
fetch('https://randomuser.me/api/?results=1') 
    .then(response => response.json())
    .then(data => {
        const profileContainer = document.getElementById('user-container');
        data.results.forEach(user => {
            const div = document.createElement('div');
            div.className = user.gender === 'female' ? 'female' : 'male'
            div.innerHTML = `
                <img src="${user.picture.large}" alt="${user.name.first} ${user.name.last}"> 
                <h1>${user.name.first} ${user.name.last}</h1> 
                <p>${user.email}</p>
            `;
            profileContainer.appendChild(div);
        });
    })
    .catch(error => {
        console.error('Det oppstod en feil:', error);
    });


   let usersList = []; // This array will store the names of the users

   function swipeLeft() {
      location.reload(); // This will refresh the page
   }

   function swipeRight() {
      fetch('https://randomuser.me/api/?results=1')
         .then(response => response.json())
         .then(data => {
            const user = data.results[0];
            let usersList = JSON.parse(localStorage.getItem('usersList')) || [];
            usersList.push(`${user.name.first} ${user.name.last}`);
            localStorage.setItem('usersList', JSON.stringify(usersList));
          // Log the updated usersList to the console
            location.reload(); 
         })
         .catch(error => {
            console.error('Det oppstod en feil:', error);
         });
   }

   let genderFilter = ''; // 

   function menBtn() {
      genderFilter = 'male';
   }

   function swipeRight() {
      fetch(`https://randomuser.me/api/?results=1&gender=${genderFilter}`)
         .then(response => response.json())
         .then(data => {
            const user = data.results[0];
            let usersList = JSON.parse(localStorage.getItem('usersList')) || [];
            usersList.push(`${user.name.first} ${user.name.last}`);
            localStorage.setItem('usersList', JSON.stringify(usersList));
            location.reload(); 
         })
         .catch(error => {
            console.error('Det oppstod en feil:', error);
         });
   }
   
=======
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
>>>>>>> Mari
