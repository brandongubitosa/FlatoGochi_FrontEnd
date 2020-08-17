document.addEventListener("DOMContentLoaded", () => {
    const row = document.querySelector(".row")
    const logInDiv = document.getElementById("login")


    function chooseYourMonster() {
        fetch("http://localhost:3000/monsters")
            .then(response => response.json())
            .then(monsters => {
                monsters.forEach(displayMonster)

            })
    }

    function displayMonster(monsterObj) {
        const newCard = document.createElement("div")
        newCard.className = "col-md-4"
        newCard.innerHTML = `
            <div class="card mb-4 shadow-sm">
                <img class="bd-placeholder-img card-img-top" width="100%" height="225" src=${monsterObj.image_url} preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: Thumbnail"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595C"/></img>
                <div class="card-body">
                <p class="card-text">${monsterObj.monster_theme} Monster</p>
                <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group">
                <button type="button" class="btn btn-sm btn-outline-secondary">Choose Monster</button>
            </div>
        `
        
        newCard.dataset.id = monsterObj.id
        row.append(newCard)
    }

    function renderLoginUserMonster(userObj) {
        row.innerHTML = `
        <div data-id=${userObj.monster.id} class="card" style="width: 45rem;">
            <img src=${userObj.monster.image_url} class="card-img-top" alt="...">
            <div class="card-body">
             <h5 class="card-title">Name: ${userObj.stats.name}</h5>
            <p class="card-text">${userObj.stats.name} loves long walks on the beach</p>
            <a href="#" class="btn btn-primary">Feed</a>
            <a href="#" class="btn btn-primary">Pet/Punish</a>
            <a href="#" class="btn btn-primary">Train</a>
            </div>
        </div>
        `
    }

    function renderCreatedUserMonster(userMonsterObj){
        //row.innerHTML = ``
        row.innerHTML = `
        <div data-id=${userMonsterObj.monster.id} class="card" style="width: 45rem;">
            <img src=${userMonsterObj.monster.image_url} class="card-img-top" alt="...">
            <div class="card-body">
             <h5 class="card-title">Name: ${userMonsterObj.name}</h5>
            <p class="card-text">${userMonsterObj.name} loves long walks on the beach</p>
            <a href="#" class="btn btn-primary">Feed</a>
            <a href="#" class="btn btn-primary">Pet/Punish</a>
            <a href="#" class="btn btn-primary">Train</a>
            </div>
        </div>
        `
    }



   function clickHandler() {
       document.addEventListener("click", function(e){
            if(e.target.textContent === "Choose Monster") {
                monsterId = parseInt(e.target.closest(".col-md-4").dataset.id)
                userId = parseInt(document.getElementById("greeting").dataset.id)

                const options = {
                    method: "POST",
                    headers: {
                        "Content-Type":"application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        user_id: userId,
                        monster_id: monsterId,
                        name: "Fluffy",
                        hunger_level: 0,
                        happiness: 0,
                        power: 0
                    })
                }

                fetch("http://localhost:3000/user_monsters", options)
                    .then(response => response.json())
                    .then(userMonsterObj => {
                        renderCreatedUserMonster(userMonsterObj)

                    })
                    
            }
           
       })
   }
//choose your monster only gets called when "create account button" is clicked
    //chooseYourMonster()
    clickHandler()


    renderLoginUserMonster({
        "id": 1,
        "name": "Michael",
        "created_at": "2020-08-17T20:42:56.042Z",
        "updated_at": "2020-08-17T20:42:56.042Z",
        "monster": {
          "id": 1,
          "monster_theme": "Cute",
          "image_url": "https://cdn1.iconfinder.com/data/icons/monster-8-1/512/MonsterV1-92-512.png",
          "created_at": "2020-08-17T20:42:56.076Z",
          "updated_at": "2020-08-17T20:42:56.076Z"
        },
        "stats": {
          "id": 1,
          "hunger_level": 100,
          "happiness": 78,
          "power": 59,
          "user_id": 1,
          "monster_id": 1,
          "name": "Shaggy",
          "created_at": "2020-08-17T20:42:56.093Z",
          "updated_at": "2020-08-17T20:42:56.093Z"
        }
      })
})



// <div class="album py-5 bg-light">
//   <div class="container">
//     <div class="row">

//       <div class="col-md-4">
//         <div class="card mb-4 shadow-sm">
//           <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: Thumbnail"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595C"/><text x="50%" y="50%" fill="#ECEEEF" dy=".3em">Thumbnail</text></svg>
//           <div class="card-body">
//             <p class="card-text">Cute monster</p>
//             <div class="d-flex justify-content-between align-items-center">
//               <div class="btn-group">
//                 <button type="button" class="btn btn-sm btn-outline-secondary">Choose Monster</button>
//               </div>
// //             </div>

// //           </div>
// //         </div>
//       </div>
//       <div class="col-md-4">
//         <div class="card mb-4 shadow-sm">
//           <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: Thumbnail"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595C"/><text x="50%" y="50%" fill="#ECEEEF" dy=".3em">Thumbnail</text></svg>
//           <div class="card-body">
//             <p class="card-text">Scary Monster</p>
//             <div class="d-flex justify-content-between align-items-center">
//               <div class="btn-group">
//                 <button type="button" class="btn btn-sm btn-outline-secondary">Choose Monster</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div class="col-md-4">
//         <div class="card mb-4 shadow-sm">
//           <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: Thumbnail"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595C"/><text x="50%" y="50%" fill="#ECEEEF" dy=".3em">Thumbnail</text></svg>
//           <div class="card-body">
//             <p class="card-text">Cool Monster</p>
//             <div class="d-flex justify-content-between align-items-center">
//               <div class="btn-group">
//                 <button type="button" class="btn btn-sm btn-outline-secondary">Choose Monster</button>
//               </div>
              
//             </div>
//           </div>
//         </div>
//       </div>