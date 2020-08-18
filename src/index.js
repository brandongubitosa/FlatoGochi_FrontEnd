document.addEventListener("DOMContentLoaded", () => {
    const row = document.querySelector(".row")
    //be careful with log in div - maybe retitle later?
    const logInDiv = document.getElementById("login")
    const signInForm = document.getElementById("sign-in")
    const createAccountForm = document.getElementById("create-account")
    const greetingHeader = document.getElementById("greeting")

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
        // get attributes off user_monster and fill here
        let {happiness, hunger_level, power} = userObj.stats

        row.innerHTML = `
        <div data-id=${userObj.monster.id} class="card" style="width: 45rem;">
            <img src=${userObj.monster.image_url} class="card-img-top" alt="...">
            <div class="card-body">
             <h5 class="card-title">Name: ${userObj.stats.name}</h5>
            <p class="card-text">${userObj.stats.name} loves long walks on the beach</p>
            <button type="button" class="btn btn-info">Feed</button><br><br>
                <div class="progress">
                    <div class="progress-bar progress-bar-striped bg-info" role="progressbar" style="width: ${hunger_level}%" aria-valuenow="${hunger_level}" aria-valuemin="0" aria-valuemax="100"></div>
                </div><br><br>

                <button type="button" class="btn btn-warning">Pet</button><br><br>
                <button type="button" class="btn btn-warning">Punish</button><br><br>
                <div class="progress">
                    <div class="progress-bar progress-bar-striped bg-warning" role="progressbar" style="width: ${happiness}%" aria-valuenow="${happiness}" aria-valuemin="0" aria-valuemax="100"></div>
                </div><br><br>    


                <button type="button" class="btn btn-danger">Train</button><br><br>
                <div class="progress">
                    <div class="progress-bar progress-bar-striped bg-danger" role="progressbar" style="width: ${power}%" aria-valuenow="${power}" aria-valuemin="0" aria-valuemax="100"></div>
                </div><br><br>
            </div>
        </div>
        `
    }

    function renderCreatedUserMonster(userMonsterObj){
        row.innerHTML = `
        <div data-id=${userMonsterObj.monster.id} class="card" style="width: 45rem;">
            <img src=${userMonsterObj.monster.image_url} class="card-img-top" alt="...">
            <div class="card-body">
             <h5 class="card-title">Name: ${userMonsterObj.name}</h5>
            <p class="card-text">${userMonsterObj.name} loves long walks on the beach</p>
            
            <button type="button" class="btn btn-info">Feed</button><br><br>
                <div class="progress">
                    <div class="progress-bar progress-bar-striped bg-info" role="progressbar" style="width: ${userMonsterObj.hunger_level}%" aria-valuenow="${userMonsterObj.hunger_level}" aria-valuemin="0" aria-valuemax="100"></div>
                </div><br><br>

                <button type="button" class="btn btn-warning">Pet</button><br><br>
                <button type="button" class="btn btn-warning">Punish</button><br><br>
                <div class="progress">
                    <div class="progress-bar progress-bar-striped bg-warning" role="progressbar" style="width: ${userMonsterObj.happiness}%" aria-valuenow="${userMonsterObj.happiness}" aria-valuemin="0" aria-valuemax="100"></div>
                </div><br><br>    


                <button type="button" class="btn btn-danger">Train</button><br><br>
                <div class="progress">
                    <div class="progress-bar progress-bar-striped bg-danger" role="progressbar" style="width: ${userMonsterObj.power}%" aria-valuenow="${userMonsterObj.power}" aria-valuemin="0" aria-valuemax="100"></div>
                </div><br><br>


            </div>
        </div>
        `
    }

    function submitHandler() {
        document.addEventListener("submit", function(e){
            if(e.target === signInForm){
                console.log(e.target, "sign in")
            } else if (e.target === createAccountForm) {
                e.preventDefault()
                

                const options = {
                    method: "POST",
                    headers: {
                        "Content-Type":"application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        name: createAccountForm.name.value
                    })
                }

                fetch("http://localhost:3000/users", options)
                    .then(response => response.json())
                    .then(userObj => {
                        greetingHeader.dataset.id = userObj.id
                        greetingHeader.textContent = `Welcome ${userObj.name}!!!!!!`
                        
                        chooseYourMonster()

                    })







            }

        })

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

    clickHandler()
    submitHandler()


    // this is hard coded as if someone clicked a monster:
    // renderLoginUserMonster({
    //     "id": 1,
    //     "name": "Michael",
    //     "created_at": "2020-08-17T20:42:56.042Z",
    //     "updated_at": "2020-08-17T20:42:56.042Z",
    //     "monster": {
    //       "id": 1,
    //       "monster_theme": "Cute",
    //       "image_url": "https://cdn1.iconfinder.com/data/icons/monster-8-1/512/MonsterV1-92-512.png",
    //       "created_at": "2020-08-17T20:42:56.076Z",
    //       "updated_at": "2020-08-17T20:42:56.076Z"
    //     },
    //     "stats": {
    //       "id": 1,
    //       "hunger_level": 10,
    //       "happiness": 30,
    //       "power": 20,
    //       "user_id": 1,
    //       "monster_id": 1,
    //       "name": "Shaggy",
    //       "created_at": "2020-08-17T20:42:56.093Z",
    //       "updated_at": "2020-08-17T20:42:56.093Z"
    //     }
    //   })


})

