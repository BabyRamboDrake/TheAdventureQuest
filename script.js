

let questInput = document.getElementById("quest-input");
let addQuestBtn = document.getElementById("add-quest");
let pullQuestBtn = document.getElementById("pull-quest");
let selectedQuestDiv = document.getElementById("selected-quest");
let quests = [];

addQuestBtn.addEventListener("click", function addQuest() {
    let quest = questInput.value;
    if (quest) {
        quests.push(quest);
        questInput.value = "";
    }
});

pullQuestBtn.addEventListener("click", function pullQuest() {
    if (quests.length > 0) {
        let randomIndex = Math.floor(Math.random() * quests.length);
        let selectedQuest = quests[randomIndex];
        selectedQuestDiv.innerHTML = selectedQuest;
        quests.splice(randomIndex, 1);
    } else {
        selectedQuestDiv.innerHTML = "Find new Quest";
    }
});

const completeQuestButton = document.querySelector("#complete-quest");

completeQuestButton.addEventListener("click", function completeQuest() {
  const selectedQuest = document.querySelector("#selected-quest");
  if (selectedQuest.textContent) {
    // Award the points
    const currentPoints = parseInt(document.querySelector("#points").textContent);
    document.querySelector("#points").textContent = currentPoints + 10;

    // Remove the selected quest
    selectedQuest.textContent = "";
  }
});