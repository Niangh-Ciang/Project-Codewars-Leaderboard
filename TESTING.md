# Testing

## Automated Testing (`index.test.mjs`)

| Test                     | How tested                                                                                                            |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| Fetch user data          | Unit tests in `index.test.mjs` using `nock` to mock a fetch request and check that the correct user data is returned. |
| Overall ranking          | Unit tests check that users are sorted from highest to lowest overall score.                                          |
| Language ranking         | Unit tests check that users are sorted from highest to lowest score for JavaScript and Python.                        |
| Filter users by language | Unit tests check that only users with a ranking in the selected language are returned.                                |
| Unavailable language     | Unit tests check that an empty array is returned when no users have a ranking in the selected language.               |
| Original array           | Unit tests check that sorting does not change the original array.                                                     |

## Manual Testing

| Test                                  | How tested                                                                                                  |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Comma-separated usernames             | Entered multiple usernames separated by commas and submitted the form.                                      |
| Ranking dropdown                      | Checked that the dropdown displays the available language rankings and the overall ranking.                 |
| Default ranking                       | Checked that the overall ranking is selected by default when the page loads.                                |
| Table display                         | Checked that the table displays the correct username, clan and score.                                       |
| Change ranking                        | Selected different languages from the dropdown and checked that the table updates accordingly.              |
| Highlight top user                    | Checked that the user with the highest score is highlighted in the table.                                   |
| Invalid username                      | Entered an invalid username and checked that an appropriate error message was displayed.                    |
| Multiple usernames with invalid users | Entered a mixture of valid and invalid usernames and checked that the invalid usernames were identified.    |
| API or network errors                 | Tested failed API requests and checked that a useful error message was displayed.                           |
| Accessibility                         | Used Lighthouse in Chrome DevTools in Desktop mode to check that the website achieves 100% accessibility.   |
| No dead code                          | Reviewed the JavaScript to check that unnecessary code was removed and all remaining code was used. |


