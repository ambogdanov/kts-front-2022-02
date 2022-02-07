import React, {useEffect} from 'react';
import GitHubStore from "@gitHubStore";
function App() {
  const gitHubStore = new GitHubStore();
  const EXAMPLE_ORGANIZATION:string = 'ktsstudio';
  const authToken:string = 'PASTE_YOUR_TOKEN_HERE';
  const repoName:string = 'testRepo';
  const repoIsPrivate:boolean = true;



  useEffect(() => {
    gitHubStore.getOrganizationReposList({
      organizationName: EXAMPLE_ORGANIZATION
    }).then(result => {
      console.log(result); // в консоли появится список репозиториев в ktsstudio
    })
    gitHubStore.createRepoAuthUser({name:repoName, isPrivate:repoIsPrivate, authToken: authToken}).then(result => {
      console.log(result); // в консоли появятся параметры нового репозитория
    })
  })

  return (
    <div className="App">
    </div>
  );
}

export default App;
