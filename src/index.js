document.addEventListener("DOMContentLoaded", () => {
    const row = document.querySelector(".row")
    //be careful with log in div - maybe retitle later?
    const logInDiv = document.getElementById("login")
    const timeouts = []

    function chooseYourMonster() {
        row.innerHTML = ``

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
        let {happiness, hunger_level, power} = pet;
        let backgroundCollection = {
            "Cute":"background-image: url('https://cdn.pixabay.com/photo/2016/02/11/14/59/fruits-1193727__340.png')",
            "Scary":"background-image: url('https://i.pinimg.com/originals/9d/64/66/9d6466259f2199fe0d15f7bcb1562910.jpg')",
            "Cool":"background-image: url('./cool_city.jpg')" 
        };

        let background = backgroundCollection[monsterTemplate.monster_theme] || "background: purple"
        timeouts.forEach(clearTimeout)
        timeouts.length = 0

        row.innerHTML = `
        <div data-id=${pet.id} class="card" style="width: 45rem;">
            <img src=${monsterTemplate.image_url} class="card-img-top" style="${background};background-repeat: no-repeat;  background-size: cover;" alt="...">
            <div class="card-body">
             <h5 class="card-title">Name: ${pet.name}</h5>
            <p class="card-text">${pet.name}${monsterTemplate.message}</p>
            <button type="button" class="btn btn-info">Feed</button><br><br>
                <div class="progress">
                    <div class="progress-bar progress-bar-striped bg-info" data-name="hunger" role="progressbar" style="width: ${hunger_level}%" aria-valuenow="${hunger_level}" aria-valuemin="0" aria-valuemax="100">HUNGER</div>
                </div><br><br>
    

                <div id="petgif" style="display: none"> 
                    <img src="https://s3.amazonaws.com/barkpost-assets/50+GIFs/39.gif"><br><br><br>
                </div>
                
                <div id="punishgif" style="display: none"> 
                    <img src="https://i.makeagif.com/media/5-01-2017/AypVNk.gif"><br><br><br>
                </div>
                

                <button type="button" class="btn btn-warning">Punish 😿</button>
                <button type="button" class="btn btn-warning">Pet 😸</button><br><br>
                
                <div class="progress">
                    <div class="progress-bar progress-bar-striped bg-warning" data-name="happiness" role="progressbar" style="width: ${happiness}%; color:black" aria-valuenow="${happiness}" aria-valuemin="0" aria-valuemax="100">HAPPINESS</div>
                </div><br><br>    
                
    
                <button type="button" class="btn btn-success">Jog</button>
                <button type="button" class="btn btn-success">Speed Training</button><br><br>
                <div class="progress">
                    <div class="progress-bar progress-bar-striped bg-success" data-name="power" role="progressbar" style="width: ${power}%" aria-valuenow="${power}" aria-valuemin="0" aria-valuemax="100">POWER</div>
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
                row.innerHTML = `
                <div class="fling-minislide">
                    <img src="./cool_monster.png" alt="Slide 3" />
                    <img src="https://www.snesmaps.com/maps/ChronoTrigger/sprites/enemies/bosses/Lavos.png" alt="Slide 2" />
                    <img src="https://cdn1.iconfinder.com/data/icons/monster-8-1/512/MonsterV1-92-512.png" alt="Slide 1" />
                </div>
                `
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
                const petGifDiv = document.getElementById("petgif")
                petGifDiv.style.display = "block"

                setTimeout(function(){
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

                }, 2000)
                
                
            }
            else if(e.target.textContent === "Punish 😿") {
                const petGifDiv = document.getElementById("punishgif")
                petGifDiv.style.display = "block"

                setTimeout(function(){
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
                }, 2000)
                
            }
            else if(e.target.textContent === "Jog") {
                const userMonsterId = e.target.closest(".card").dataset.id
                const progressBar = e.target.parentElement.querySelector("[data-name='power']")
                
                timeouts.forEach(clearTimeout)
                timeouts.length = 0

                let currentStat = parseInt(progressBar.ariaValueNow)
                currentStat+=1
                
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

                const userMonsterId = e.target.closest(".card").dataset.id
                const progressBar = e.target.parentElement.querySelector("[data-name='power']")
                
                timeouts.forEach(clearTimeout)
                timeouts.length = 0
                let currentStat = parseInt(progressBar.ariaValueNow)
                speedGame(e.target.closest(".card").querySelector("img").src,currentStat,userMonsterId )
            }

           
       })
    }




    function speedGame(imgSRC, stat,id){
        const row = document.querySelector(".row")
        
       
        row.innerHTML = '<canvas id ="myCanvas" width="800" height="600"></canvas>'
        const canvas = document.getElementById("myCanvas")
        canvas.style = "border: solid thick black;"
        const ctx = canvas.getContext("2d");
        
        
        //pipeWidth determine the width of the pipe
        let pipeWidth = 100,
        //height goes from tells the pipe height rom top to bottom
        pipeHeight = 200,
        //x determines where the pipe is initially  drawn, from start to finish
        x = canvas.width,
        //y determines the starting position of the pipe from top to bottom
        y = 0,
        dx = -5,
        health = 100,    
        spriteWidth = 125,
        spriteHeight = 125,
        birdX = 0 + spriteWidth,
        birdY = canvas.height/2,
        time = 15000,
        refresh = 10;
        let upPressed = false;
        let downPressed = false;
        let img =  document.createElement("img"),
        background = document.createElement("img"),
        pipe = document.createElement("img");
        img.src = imgSRC
        background.src = "https://i.ytimg.com/vi/jJQ5DWSGRw4/maxresdefault.jpg"
        pipe.src = "https://cdnb.artstation.com/p/assets/images/images/011/210/507/large/kim-shein-wall-sprite.jpg?1528384411"
        
    
    
        const gameStart = setInterval(draw,refresh)
        setTimeout(gameOver,time)
    
        document.addEventListener("keydown", keyDownHandler)
        document.addEventListener("keyup", keyUpHandler)
    
    
    
    
    
        function keyDownHandler(button){
            if (button.key === "ArrowUp"){
                upPressed = true;
            } else 
            if(button.key === "ArrowDown"){
                downPressed = true;
            }
            
        }
    
        function keyUpHandler(button){
            if (button.key === "ArrowUp"){
                upPressed = false;
            } else 
            if(button.key === "ArrowDown"){
                downPressed = false;
            }
            
        }
    
    
    
    
    
    
    
    
    
    
    
    
    function drawPipe(){
        
    
        ctx.beginPath();
       let pipe1 = ctx.rect(x, 0, pipeWidth, pipeHeight-y);
       ctx.drawImage(pipe,x, 0, pipeWidth, pipeHeight-y);
      
        ctx.closePath()
        let pipe2 =ctx.beginPath();
        ctx.drawImage(pipe,x, canvas.height-y-pipeHeight, pipeWidth, canvas.height-y);
        ctx.closePath()
      
        
    }
    
    
    function draw(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.drawImage(background,0,0,window.innerWidth,window.innerHeight)
        //this is the variable we are using for the rate of change on x and y axis
        let dy = -6;
        drawPipe();
        drawBird();
        drawScore();
        if (birdY < canvas.height-spriteHeight){ birdY += 1} 
    
    
        if ((birdY >= 0 && birdY <= pipeHeight-y && birdX === x) || (( birdY >= canvas.height-y-pipeHeight-spriteHeight) && birdY <= canvas.height-spriteHeight && birdX === x)){
            health -=50
        } else  if  (birdX === x)
        { health += 50}
       
        
        
        
        
        if (x+dx > canvas.width-pipeWidth || x+dx < 0){
            x = canvas.width-pipeWidth
            // dx =  -Math.floor((Math.random() * 4) + 3)
            y= Math.floor((Math.random() * 300) - 200)
            
            
        }
        
        
        x += dx
        
        if(upPressed){
            birdY += dy
            if (birdY <0){
                birdY = 0} 
        } else 
        if (downPressed){
            birdY -= dy
            if( birdY  > canvas.height-spriteHeight)
                {
                    birdY = canvas.height -spriteHeight
                }
        }
    
        time -= refresh
        timerDisplay.textContent = `You Currently Have ${time/1000} seconds left `
    
        //collision test
    }
    
    function drawBird() {
    
    
        ctx.beginPath();
        ctx.drawImage(img,birdX,birdY,spriteWidth,spriteHeight);
        ctx.closePath();
    }
    
    function drawScore() {
        ctx.font = "20px Arial bold";
        ctx.fillStyle = "white";
        ctx.fillText("Health:" + health, canvas.width-125, 20);
    }
    
    
    function gameOver(){
     clearInterval(gameStart)
    
     stat+=(health/50)
                    
                    const newStatObj = {
                        power: stat
                    }
                    
                    timerDisplay.style = "color: red; font-weight: bold;font-size: .75vw"
                    timerDisplay.textContent = `GAME OVER. Your final score is ${health}. Your monster is catching its breath, but seems ready for more.`
    
                    setTimeout(patchMonster, 4000, id, newStatObj)
                    
    }
    
    
    
    
    
    
    
    
    
    
    let instructions = document.createElement("p")
    instructions.innerHTML = "<h2> Game Instructions</h2><br> Use the <kbd>&#8593</kbd> and <kbd>&#8595</kbd> keys to move your monster through the obstacles <br><br> <p id='timer'></p>"
    
    instructions.style= "display: inline-block; width: 10%;"
    row.appendChild(instructions)
    const timerDisplay = document.getElementById("timer");
                    
                   
    
                    
                   
    
    
    //end of function
    }
    
    
    
    
    
    
    
    
    
    







   
    clickHandler()
    submitHandler()




    



})




