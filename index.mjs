import { getUsersWithLanguage, makeFetchRequest } from "./ranking.mjs";

const state = {
  users: [],
  selectedLanguage: "overall",
  loadErrors: [],
};

const elements = {};

window.onload = function () {
  elements.usernameInput = document.getElementById("username");
  elements.loadButton = document.getElementById("load-btn");
  elements.rankingSelect = document.getElementById("ranking-type");
  elements.tableBody = document.querySelector("#leaderboard tbody");
  elements.message = document.getElementById("message");

  elements.loadButton.addEventListener("click", handleLoadLeaderboard);
  elements.rankingSelect.addEventListener("change", handleLanguageChange);
};

async function handleLoadLeaderboard() {
  const usernames = [
    ...new Set(
      elements.usernameInput.value
        .split(",")
        .map((username) => username.trim())
        .filter((username) => username !== ""),
    ),
  ];

  if (usernames.length === 0) {
    state.users = [];
    state.loadErrors = [];
    state.selectedLanguage = "overall";
    render();
    elements.message.textContent =
      "Please enter at least one Codewars username.";
    return;
  }

  elements.loadButton.disabled = true;
  elements.message.textContent = "Loading leaderboard...";
  state.loadErrors = [];

  try {
    const results = await Promise.allSettled(
      usernames.map((username) => fetchUser(username)),
    );

    state.users = results
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value);

    const failedResults = results.filter(
      (result) => result.status === "rejected",
    );

    const invalidUsers = failedResults
      .filter((result) => result.reason.message.includes("was not found"))
      .map((result) => result.reason.message.match(/"([^"]+)"/)[1]);

    const otherErrors = [
      ...new Set(
        failedResults
          .filter((result) => !result.reason.message.includes("was not found"))
          .map((result) => result.reason.message),
      ),
    ];

    if (invalidUsers.length === 1) {
      state.loadErrors.push(`User "${invalidUsers[0]}" was not found.`);
    } else if (invalidUsers.length > 1) {
      state.loadErrors.push(
        `Users ${invalidUsers.map((user) => `"${user}"`).join(", ")} were not found.`,
      );
    }

    state.loadErrors.push(...otherErrors);

    render();
  } finally {
    elements.loadButton.disabled = false;
  }
}

async function fetchUser(username) {
  let response;

  try {
    response = await makeFetchRequest(username);
  } catch {
    throw new Error(
      "Could not connect to Codewars while looking up user information. Check your internet connection and try again.",
    );
  }

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`User "${username}" was not found.`);
    }

    throw new Error(
      `The Codewars request for "${username}" failed (HTTP ${response.status}). Please try again later.`,
    );
  }

  try {
    return await response.json();
  } catch {
    throw new Error(
      `Codewars returned an invalid response for "${username}". Please try again.`,
    );
  }
}

function renderLanguageOptions() {
  elements.rankingSelect.replaceChildren();

  if (state.users.length === 0) {
    return;
  }

  const languages = [];

  state.users.forEach((user) => {
    languages.push(...Object.keys(user.ranks?.languages || {}));
  });

  const rankings = [...new Set(languages)].sort();
  rankings.unshift("overall");

  rankings.forEach((ranking) => {
    const option = document.createElement("option");

    option.value = ranking;
    option.textContent = ranking === "overall" ? "Overall" : ranking;

    elements.rankingSelect.appendChild(option);
  });

  elements.rankingSelect.value = state.selectedLanguage;
}

function handleLanguageChange() {
  state.selectedLanguage = elements.rankingSelect.value;
  renderTable();
  updateMessage();
}

function renderTable() {
  elements.tableBody.replaceChildren();

  const usersWithLanguage = getUsersWithLanguage(
    state.users,
    state.selectedLanguage,
  );

  usersWithLanguage.forEach((user, index) => {
    const row = document.createElement("tr");

    const rankCell = document.createElement("td");
    rankCell.textContent = index + 1;

    const usernameCell = document.createElement("td");
    usernameCell.textContent = user.username;

    if (index === 0) {
      row.classList.add("top-scorer");
    }

    const clanCell = document.createElement("td");
    clanCell.textContent = user.clan || "-";

    const scoreCell = document.createElement("td");
    if (state.selectedLanguage === "overall") {
      scoreCell.textContent = user.ranks?.overall?.score ?? 0;
    } else {
      scoreCell.textContent =
        user.ranks?.languages?.[state.selectedLanguage]?.score ?? 0;
    }
    row.append(rankCell, usernameCell, clanCell, scoreCell);
    elements.tableBody.appendChild(row);
  });
}

function updateMessage() {
  elements.message.textContent = state.loadErrors.join(" ");
}

function render() {
  renderLanguageOptions();
  renderTable();
  updateMessage();
}
