document.addEventListener("DOMContentLoaded", () => {
    const row = document.querySelector(".row")
    //be careful with log in div - maybe retitle later?
    const logInDiv = document.getElementById("login")
    const timeouts = []

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
    function createLogOutAndUpdate() {
        //creates log out button:
        const createAccountFormForDelete = document.getElementById("create-account")
        const signInFormForDelete = document.getElementById("sign-in")
        signInFormForDelete.remove()
        createAccountFormForDelete.remove()
        const logOutButton = document.createElement("button")
        logOutButton.class = "btn btn-primary"
        logOutButton.id = "logout"
        logOutButton.textContent = "Log Out"
        logInDiv.append(logOutButton)
     
        //creates change name button:
        const updateUserButton = document.createElement("button")
        updateUserButton.class = "btn btn-primary"
        updateUserButton.id = "updateName"
        updateUserButton.textContent = "Update Username"
        logInDiv.append(updateUserButton)
    }

    function submitHandler() {
        document.addEventListener("submit", function(e){
            const createAccountForm = document.getElementById("create-account")
            const signInForm = document.getElementById("sign-in")
            const greetingHeader = document.getElementById("greeting")
            timeouts.forEach(clearTimeout)
            timeouts.length = 0

            if(e.target === signInForm){
                e.preventDefault()
    
                const options = {
                    method: "POST",
                    headers: {
                        "Content-Type":"application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        email: signInForm.email.value
            
                    })
                }

                fetch("http://localhost:3000/login", options)
                    .then(response => response.json())
                    .then(userObj => {
                        if(userObj.status){
                        alert("Account doesn't exist. Please enter valid email or create an account.")
                        e.target.reset()
                    }
                    else{
                        greetingHeader.dataset.id = userObj.id
                        greetingHeader.textContent = `Welcome ${userObj.name}!!!!!!`
                        
                        if(userObj.monster) {
                            renderChosenMonster(userObj.stats,userObj.monster)
                        } else {
                            chooseYourMonster()
                        }
                        
                        createLogOutAndUpdate()
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
                        name: createAccountForm.name.value,
                        email: createAccountForm.email.value
                    })
                }

                fetch("http://localhost:3000/users", options)
                    .then(response => response.json())
                    .then(userObj => {
                        if(userObj.status){
                            alert("Email already taken. Please enter new email.")
                            e.target.reset()
                        } else {
                        greetingHeader.dataset.id = userObj.id
                        greetingHeader.textContent = `Welcome ${userObj.name}!!!!!!`

                        chooseYourMonster()
                        createLogOutAndUpdate()
                        }
                    })
            } else if (e.target.id === "createmonster") {
                e.preventDefault()
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
                    .then(userMonsterObj => {renderChosenMonster(userMonsterObj,userMonsterObj.monster)})
                    
            } else if(e.target.id === "updatenameform") {
                
                e.preventDefault()
                
                const userId = parseInt(document.getElementById("greeting").dataset.id)
                const updatedName = {
                    name: e.target.updatedname.value
                }
                patchUser(userId, updatedName)
                
                //const logOutButton = document.createElement("button")
                e.target.remove()                    
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
            .then(updatedUserMonster => {renderChosenMonster(updatedUserMonster,updatedUserMonster.monster)})
           

    }



    function patchUser(userId, attrObject) {
        
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

        fetch(`http://localhost:3000/users/${userId}`, options)
            .then(response => response.json())
            .then(updatedUser => {
                document.getElementById("greeting").textContent = `Welcome ${updatedUser.name}!!!!!!`

            })
           

    }

    function renderChosenMonster(pet,monsterTemplate) {
        let {happiness, hunger_level, power} = pet
        
        row.innerHTML = `
        <div data-id=${pet.id} class="card" style="width: 45rem;">
            <img src=${monsterTemplate.image_url} class="card-img-top" alt="...">
            <div class="card-body">
             <h5 class="card-title">Name: ${pet.name}</h5>
            <p class="card-text">${pet.name} loves long walks on the beach</p>
            <button type="button" class="btn btn-info">Feed</button><br><br>
                <div class="progress">
                    <div class="progress-bar progress-bar-striped bg-info" data-name="hunger" role="progressbar" style="width: ${hunger_level}%" aria-valuenow="${hunger_level}" aria-valuemin="0" aria-valuemax="100">HUNGER</div>
                </div><br><br>
    
                <button type="button" class="btn btn-warning">Punish 😿</button>
                <button type="button" class="btn btn-warning">Pet 😸</button><br><br>
                
                <div class="progress">
                    <div class="progress-bar progress-bar-striped bg-warning" data-name="happiness" role="progressbar" style="width: ${happiness}%; color:black" aria-valuenow="${happiness}" aria-valuemin="0" aria-valuemax="100">HAPPINESS</div>
                </div><br><br>    
    
    
                <button type="button" class="btn btn-success">Train</button>
                <button type="button" class="btn btn-success">Speed Training</button><br><br>
                <div class="progress">
                    <div class="progress-bar progress-bar-striped bg-success" data-name="power" role="progressbar" style="width: ${power}%" aria-valuenow="${power}" aria-valuemin="0" aria-valuemax="100"></div>
                </div><br><br>
    


                <button type="button" class="btn btn-danger">Release Monster</button><br><br>
            </div>
        </div>
        `
    

        timeouts.push(setTimeout(function(){   
        let currentTimerStat = parseInt(hunger_level)
            currentTimerStat-=10
                
        const newTimerStatObj = {
            hunger_level: currentTimerStat
            }

        patchMonster(pet.id, newTimerStatObj)
            }, 15000)   
        )


    }

   function clickHandler() {
       document.addEventListener("click", function(e){
            
            if (e.target.textContent === "Log Out") {
                timeouts.forEach(clearTimeout)
                timeouts.length = 0
                row.innerHTML = ``
                logInDiv.innerHTML = `
                <h3 id="greeting"></h3>
                <form class="form-inline" id="sign-in">
                    <div class="form-group">
                        <label class="sr-only" for="name">Email</label>
                        <input type="text" class="form-control" id="email" placeholder="Email">
                    </div>
                    <button type="submit" class="btn btn-primary">Sign in</button>
                </form><br>
                <form class="form-inline" id="create-account">
                    <div class="form-group">
                        <label class="sr-only" for="email">Enter Email</label>
                        <input type="text" class="form-control" id="email" placeholder="Email">
                        <label class="sr-only" for="name">Enter Name</label>
                        <input type="text" class="form-control" id="name" placeholder="Name">
                    </div>
                    <button type="submit" class="btn btn-primary">Create Account</button>
                </form>            
                `
            } else if(e.target.textContent === "Feed") {
                const userMonsterId = e.target.closest(".card").dataset.id
                const progressBar = e.target.parentElement.querySelector("[data-name='hunger']")

                timeouts.forEach(clearTimeout)
                timeouts.length = 0

                let currentStat = parseInt(progressBar.ariaValueNow)
                currentStat+=5
                
                const newStatObj = {
                    hunger_level: currentStat
                }

                patchMonster(userMonsterId, newStatObj)
            }
            else if(e.target.textContent === "Pet 😸") {
                const userMonsterId = e.target.closest(".card").dataset.id
                const progressBar = e.target.parentElement.querySelector("[data-name='happiness']")
                
                timeouts.forEach(clearTimeout)
                timeouts.length = 0

                let currentStat = parseInt(progressBar.ariaValueNow)
                currentStat+=5
                
                const newStatObj = {
                    happiness: currentStat
                }

                patchMonster(userMonsterId, newStatObj)
            }
            else if(e.target.textContent === "Punish 😿") {
                const userMonsterId = e.target.closest(".card").dataset.id
                const progressBar = e.target.parentElement.querySelector("[data-name='happiness']")
                
                timeouts.forEach(clearTimeout)
                timeouts.length = 0

                let currentStat = parseInt(progressBar.ariaValueNow)
                currentStat-=5
                
                const newStatObj = {
                    happiness: currentStat
                }

                patchMonster(userMonsterId, newStatObj)
            }
            else if(e.target.textContent === "Train") {
                const userMonsterId = e.target.closest(".card").dataset.id
                const progressBar = e.target.parentElement.querySelector("[data-name='power']")
                
                timeouts.forEach(clearTimeout)
                timeouts.length = 0

                let currentStat = parseInt(progressBar.ariaValueNow)
                currentStat+=5
                
                const newStatObj = {
                    power: currentStat
                }

                patchMonster(userMonsterId, newStatObj)

            } else if (e.target.textContent === "Update Username") {
                const nameForm = document.createElement("form")
                nameForm.id = "updatenameform"
                nameForm.innerHTML = `
                    <div class="form-group">
                        <label class="sr-only" for="name">Update Name</label>
                        <input type="text" class="form-control" id="updatedname" placeholder="Enter New Username">
                    </div>
                    <button type="submit" class="btn btn-primary">Update Name</button>
                `
                logInDiv.append(nameForm)
               
            } else if (e.target.textContent === "Release Monster") {
                timeouts.forEach(clearTimeout)
                timeouts.length = 0
                
                const userMonsterId = e.target.closest(".card").dataset.id
                
                const deleteObj = {
                    method: 'DELETE',
                  }

                fetch(`http://localhost:3000/user_monsters/${userMonsterId}`, deleteObj)
                .then(response => response.json())
                .then(emptyObj => {
                    if(emptyObj.status) {
                        alert("Delete did not work, please refresh page.")
                    } else {
                        row.innerHTML = ``
                        chooseYourMonster()
                    }

                })
                
            } else if(e.target.textContent === "Speed Training"){
                timeouts.forEach(clearTimeout)
                timeouts.length = 0
                speedGame(e.target.closest(".card").querySelector("img").src)
            }

           
       })
    }

   
    clickHandler()
    submitHandler()




    



})




