import React, {useEffect} from 'react';
import GitHubStore from "./store/GitHubStore";
function App() {
  const gitHubStore = new GitHubStore();

  const EXAMPLE_ORGANIZATION = 'ktsstudio';

  useEffect(() => {
    gitHubStore.getOrganizationReposList({
      organizationName: EXAMPLE_ORGANIZATION
    }).then(result => {
      console.log(result); // в консоли появится список репозиториев в ktsstudio
    })
  })

  return (
    <div className="App">
    </div>
  );
}

export default App;
