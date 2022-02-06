import React, {useEffect} from 'react';
import GitHubStore from "./store/GitHubStore";
function App() {
  const gitHubStore = new GitHubStore();
  const EXAMPLE_ORGANIZATION = 'ktsstudio';
  const authToken = 'PASTE_YOUR_TOKEN_HERE'



  useEffect(() => {
    gitHubStore.getOrganizationReposList({
      organizationName: EXAMPLE_ORGANIZATION
    }).then(result => {
      console.log(result); // в консоли появится список репозиториев в ktsstudio
    })
    gitHubStore.createRepoAuthUser({name:"test3", isPrivate:true, authToken: authToken}).then(result => {
      console.log(result); // в консоли появятся параметры нового репозитория
    })
  })

  return (
    <div className="App">
    </div>
  );
}

export default App;
