export function getUsersWithLanguage(users, selectedLanguage) {
  if (selectedLanguage === "overall") {
    return [...users].sort(
      (a, b) => (b.ranks.overall?.score ?? 0) - (a.ranks.overall?.score ?? 0),
    );
  }

  const filteredUsers = users.filter(
    (user) => user.ranks?.languages?.[selectedLanguage],
  );

  return [...filteredUsers].sort(
    (a, b) =>
      (b.ranks.languages[selectedLanguage]?.score ?? 0) -
      (a.ranks.languages[selectedLanguage]?.score ?? 0),
  );
}
