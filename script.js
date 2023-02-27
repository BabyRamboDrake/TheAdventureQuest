
let questInput = document.getElementById("quest-input");
let addQuestBtn = document.getElementById("add-quest");
let pullQuestBtn = document.getElementById("pull-quest");
let selectedQuestDiv = document.getElementById("selected-quest");
let quests = JSON.parse(localStorage.getItem("quests")) || [];
let experiencePoints = 0;
let level = JSON.parse(localStorage.getItem("level")) || 1;

addQuestBtn.addEventListener("click", function addQuest() {
    let quest = questInput.value;
    if (quest) {
        quests.push(quest);
        questInput.value = "";
        localStorage.setItem("quests", JSON.stringify(quests));
    }
});

questInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
      addQuestBtn.click();
  }
});

pullQuestBtn.addEventListener("click", function pullQuest() {
    if (quests.length > 0) {
        let randomIndex = Math.floor(Math.random() * quests.length);
        let selectedQuest = quests[randomIndex];
        selectedQuestDiv.innerHTML = selectedQuest;
        quests.splice(randomIndex, 1);
        localStorage.setItem("quests", JSON.stringify(quests));
    } else {
        selectedQuestDiv.innerHTML = "Add new Quest";
    }
});

const completeQuestButton = document.querySelector("#complete-quest");

completeQuestButton.addEventListener("click", function completeQuest() {
  const selectedQuest = document.querySelector("#selected-quest");
  if (selectedQuest.textContent) {
    experiencePoints += 25;
    let experienceBar = document.getElementById("experience-points");
    experienceBar.style.width = experiencePoints + "%";

    let levelDisplay = document.getElementById("level");
    let levelThreshold = 100;
    if (experiencePoints >= levelThreshold) {
      level++;
      levelDisplay.innerHTML = level;
      experiencePoints = 0;
      experienceBar.style.width = experiencePoints + "%"
      localStorage.setItem("level", JSON.stringify(level));
      localStorage.setItem("quests", JSON.stringify([]));
    } else {
      experienceBar.style.width = experiencePoints + "%";
    }
  }

  // Remove the selected quest
  selectedQuest.textContent = "";
});

// Initialize the level and quests from localStorage
let levelDisplay = document.getElementById("level");
levelDisplay.innerHTML = level;
let experienceBar = document.getElementById("experience-points");
experienceBar.style.width = experiencePoints + "%";


