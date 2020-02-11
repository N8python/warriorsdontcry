const names = ["People", "Places", "Dates", "Events", "Key_Terms"]
let homeScreen = "";
let currCard;
let currTopic;
names.forEach(name => {
            const id = Math.random().toString().slice(2);
            const list = data[name].map(data => data.name).sort();
            const collapse = name + "collapse";
            if (name !== "Key_Terms" && name !== "Dates") {
                homeScreen += `
    <div class="w3-card">
    <div class="accordion" id="${name}">
  <div class="card">
    <div class="card-header" id="${id}">
      <h2 class="mb-0">
        <button class="btn btn-link" style="color: maroon" type="button" data-toggle="collapse" data-target="#${collapse}" aria-expanded="true" aria-controls="${collapse}">
          ${name.replace(/_/g, " ")}
        </button>
      </h2>
    </div>

    <div id="${collapse}" class="collapse" aria-labelledby="${id}" data-parent="#${name}">
      <div class="card-body">
      ${list.map(name2 => `<button type="button" style="color: maroon" class="btn btn-link" id="${name2.replace(/\s/g, "_")}">${name2}</button>
      `).join("\n")}
      </div>
    </div>
  </div>
  </div>
  </div>
    `
    } else {
      const pairs = data[name];
      homeScreen += `
      <div class="w3-card">
      <div class="accordion" id="${name}">
    <div class="card">
      <div class="card-header" id="${id}">
        <h2 class="mb-0">
          <button class="btn btn-link" type="button" style="color: maroon" data-toggle="collapse" data-target="#${collapse}" aria-expanded="true" aria-controls="${collapse}">
            ${name.replace(/_/g, " ")}
          </button>
        </h2>
      </div>
  
      <div id="${collapse}" class="collapse" aria-labelledby="${id}" data-parent="#${name}">
        <div class="card-body" style="height: 150px; overflow: scroll;">
          ${pairs.map(({name, body}) => `${name} - ${body}`).join("<br>")}
        </div>
      </div>
    </div>
    </div>
    </div>
      `
    }
})
const main = document.getElementById("main")

function home() {
    main.innerHTML = homeScreen;
    names.forEach(name => {
      if (name !== "Dates" && name !== "Key_Terms") {
        const list = data[name].map(data => data.name).sort();
      list.forEach(otherName => {
        const id = otherName.replace(/\s/g, "_");
        document.getElementById(id).addEventListener("click", () => {
          openCard(otherName, 
            name)
        })
      })
      }
    });
    if (currTopic) {
      document.querySelector(`[aria-controls="${currTopic}collapse"]`).click();
    }
}

function linkify(text) {
  names.forEach(topic => {
    if (topic !== "Key_Terms" && topic !== "Dates") {
      data[topic].forEach(thing => {
        let {name} = thing;
        if (name !== currCard) {
          text = text.replace(RegExp(`((?!(")).|^)\\b${thing.name.replace(" ", "\\s")}\\b(?!<\\\/a>|")`, "g"), ` <a href="#" style="color:maroon" onclick='openCard("${thing.name}", "${topic}")'>${thing.name}<\/a>`);
          if (thing.alias) {
            text = text.replace(RegExp(`((?!(")).|^)\\b${thing.alias.replace(" ", "\\s")}\\b(?!<\\\/a>|")`, "g"), ` <a href="#" style="color:maroon" onclick='openCard("${thing.name}", "${topic}")'>${thing.alias}<\/a>`);
          }
        }
      })
    }
  })
  return text;
}
function openCard(thing, topic) {
  currCard = thing;
  currTopic = topic;
  const info = data[topic].find(({name}) => name === thing);
  let result = `<div class="w3-card w3-padding w3-margin w3-round"><br>`;
  result += `<button class="btn btn-danger w3-right" onclick="home()">Back</button>`;
  result += `<h2 class="merriweather">${info.name}</h2>`;
  if (info.quote) {
    result += `<h4 style="font-family:cursive"><em>"${info.quote}"</em></h4>`;
  }
  result += "<br>";
  result += linkify(info.body);
  result += `<br><br><br><p class="w3-small">Word Count: ${info.body.split(" ").length}</p>`;
  result += "</div>"
  main.innerHTML = result;
}
const music = document.getElementById("music");
music.volume = 0.1;
music.addEventListener('ended', function() {
  this.currentTime = 0;
  this.play();
}, false);
let playedOnce = false;
window.onclick = () => {
  if (!playedOnce) {
    music.play();
    playedOnce = true;
  }
}
document.getElementById("pause").onclick = () => {
  if (music.paused) {
    music.play();
  } else {
    music.pause();
  }
}
const search = document.getElementById("search");
const searchResults = document.getElementById("searchres");
search.oninput = () => {
  if (search.value !== "") {
    searchResults.innerHTML = "";
    names.forEach(name => {
      if (name !== "Dates" && name !== "Key_Terms") {
        data[name].forEach(thing => {
          if (thing.name.includes(search.value)) {
            searchResults.innerHTML+= `<div><button class="btn btn-link" style="color: maroon" type="button" onclick="openCard('${thing.name}', '${name}')">
              ${thing.name.replace(/_/g, " ").replace(RegExp(search.value), `<strong>${search.value}</strong>`)}
            </button></div>`;
          }
        })
      }
    })
  } else {
    searchResults.innerHTML = "";
  }
}
home();