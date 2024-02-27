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
   