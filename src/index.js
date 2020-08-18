document.addEventListener("DOMContentLoaded", () => {
    const row = document.querySelector(".row")
    //be careful with log in div - maybe retitle later?
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
                        <form class="form-inline" id="createmonster">
                            <div class="form-group">
                                <label class="sr-only" for="name">Enter monster Name</label>
                                <input type="text" class="form-control" id="monstername" placeholder="Choose Monster Name">
                            </div><br><br>
                            <button type="submit" class="btn btn-primary">Adopt Monster</button>
                        </form>
                    </div>
                </div>
            </div>
        `
        
        newCard.dataset.id = monsterObj.id
        row.append(newCard)
    }
    //will erase sign in and account and create "log out button"
    function createLogOut() {
        const createAccountFormForDelete = document.getElementById("create-account")
        const signInFormForDelete = document.getElementById("sign-in")
        signInFormForDelete.remove()
        createAccountFormForDelete.remove()
        const logOutButton = document.createElement("button")
        logOutButton.class = "btn btn-primary"
        logOutButton.id = "logout"
        logOutButton.textContent = "Log Out"
        logInDiv.append(logOutButton)
    }

    function renderLoginUserMonster(userObj) {
        // get attributes off user_monster and fill here
        let {happiness, hunger_level, power} = userObj.stats

        row.innerHTML = `
        <div data-id=${userObj.stats.id} class="card" style="width: 45rem;">
            <img src=${userObj.monster.image_url} class="card-img-top" alt="...">
            <div class="card-body">
             <h5 class="card-title">Name: ${userObj.stats.name}</h5>
            <p class="card-text">${userObj.stats.name} loves long walks on the beach</p>
            <button type="button" class="btn btn-info">Feed</button><br><br>
                <div class="progress">
                    <div class="progress-bar progress-bar-striped bg-info" data-name="hunger" role="progressbar" style="width: ${hunger_level}%" aria-valuenow="${hunger_level}" aria-valuemin="0" aria-valuemax="100"></div>
                </div><br><br>

                <button type="button" class="btn btn-warning">Pet 😸</button>
                <button type="button" class="btn btn-warning">Punish 😿</button><br><br>
                <div class="progress">
                    <div class="progress-bar progress-bar-striped bg-warning" data-name="happiness" role="progressbar" style="width: ${happiness}%" aria-valuenow="${happiness}" aria-valuemin="0" aria-valuemax="100"></div>
                </div><br><br>    


                <button type="button" class="btn btn-danger">Train</button><br><br>
                <div class="progress">
                    <div class="progress-bar progress-bar-striped bg-danger" data-name="power" role="progressbar" style="width: ${power}%" aria-valuenow="${power}" aria-valuemin="0" aria-valuemax="100"></div>
                </div><br><br>
            </div>
        </div>
        `
    }

    function renderCreatedUserMonster(userMonsterObj){
        row.innerHTML = `
        <div data-id=${userMonsterObj.id} class="card" style="width: 45rem;">
            <img src=${userMonsterObj.monster.image_url} class="card-img-top" alt="...">
            <div class="card-body">
             <h5 class="card-title">Name: ${userMonsterObj.name}</h5>
            <p class="card-text">${userMonsterObj.name} loves long walks on the beach</p>
            
            <button type="button" class="btn btn-info">Feed</button><br><br>
                <div class="progress">
                    <div class="progress-bar progress-bar-striped bg-info" data-name="hunger" role="progressbar" style="width: ${userMonsterObj.hunger_level}%" aria-valuenow="${userMonsterObj.hunger_level}" aria-valuemin="0" aria-valuemax="100"></div>
                </div><br><br>

                <button type="button" class="btn btn-warning">Pet 😸</button>
                <button type="button" class="btn btn-warning">Punish 😿</button><br><br>
                <div class="progress">
                    <div class="progress-bar progress-bar-striped bg-warning" data-name="happiness" role="progressbar" style="width: ${userMonsterObj.happiness}%" aria-valuenow="${userMonsterObj.happiness}" aria-valuemin="0" aria-valuemax="100"></div>
                </div><br><br>    


                <button type="button" class="btn btn-danger">Train</button><br><br>
                <div class="progress">
                    <div class="progress-bar progress-bar-striped bg-danger" data-name="power" role="progressbar" style="width: ${userMonsterObj.power}%" aria-valuenow="${userMonsterObj.power}" aria-valuemin="0" aria-valuemax="100"></div>
                </div><br><br>


            </div>
        </div>
        `
    }

    function submitHandler() {
        document.addEventListener("submit", function(e){
            const createAccountForm = document.getElementById("create-account")
            const signInForm = document.getElementById("sign-in")
            const greetingHeader = document.getElementById("greeting")
            if(e.target === signInForm){
                e.preventDefault()
                
                const options = {
                    method: "POST",
                    headers: {
                        "Content-Type":"application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        name: signInForm.name.value
                    })
                }

                fetch("http://localhost:3000/login", options)
                    .then(response => response.json())
                    .then(userObj => {
                    
                        if(userObj.status){
                        alert("Account doesn't exist. Please enter valid name or create an account")
                    }
                    else{
                        greetingHeader.dataset.id = userObj.id
                        greetingHeader.textContent = `Welcome ${userObj.name}!!!!!!`
                        
                        if(userObj.monster) {
                            renderLoginUserMonster(userObj)
                        } else {
                            chooseYourMonster()
                        }
                        
                        createLogOut()
                    }
                    })
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
                        createLogOut()
                    })
            } else if (e.target.id === "createmonster") {
                monsterId = parseInt(e.target.closest(".col-md-4").dataset.id)
                userId = parseInt(document.getElementById("greeting").dataset.id)
                let monsterName

                if (e.target.monstername.value.length > 0) {
                    monsterName = e.target.monstername.value
                } else {
                    monsterName = "Fluffy Wuffy Bear"
                }

                const options = {
                    method: "POST",
                    headers: {
                        "Content-Type":"application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        user_id: userId,
                        monster_id: monsterId,
                        name: monsterName,
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

    function patchMonster(userMonsterId, attrObject) {
        const options = {
            method: "PATCH",
            headers: {
                "Content-Type":"application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(
                attrObject
            )
        }

        fetch(`http://localhost:3000/user_monsters/${userMonsterId}`, options)
            .then(response => response.json())
            .then(updatedUserMonster => {renderCreatedUserMonster(updatedUserMonster)})

    }

   function clickHandler() {
       document.addEventListener("click", function(e){
            if (e.target.textContent === "Log Out") {
                row.innerHTML = ``
                //logOutButton.remove()
                logInDiv.innerHTML = `
                <h3 id="greeting"></h3>
                <form class="form-inline" id="sign-in">
                    <div class="form-group">
                        <label class="sr-only" for="name">Username</label>
                        <input type="text" class="form-control" id="name" placeholder="Username">
                    </div>
                <button type="submit" class="btn btn-primary">Sign in</button>
                    </form><br>
                    <form class="form-inline" id="create-account">
                <div class="form-group">
                    <label class="sr-only" for="name">Enter Username</label>
                    <input type="text" class="form-control" id="name" placeholder="Username">
                </div>
                <button type="submit" class="btn btn-primary">Create Account</button>
                    </form>
                
                
                `
            } else if(e.target.textContent === "Feed") {
                const userMonsterId = e.target.closest(".card").dataset.id
                const progressBar = e.target.parentElement.querySelector("[data-name='hunger']")
                
                let currentStat = parseInt(progressBar.ariaValueNow)
                currentStat+=5
                
                const newStatObj = {
                    hunger_level: currentStat
                }

                patchMonster(userMonsterId, newStatObj)
            }
           
       })
   }

   
    clickHandler()
    submitHandler()





    



})

