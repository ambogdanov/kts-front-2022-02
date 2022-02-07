import GitHubStore from '../store/GitHubStore/GitHubStore';

const gitHubStore = new GitHubStore();
const EXAMPLE_ORGANIZATION: string = 'ktsstudio';
const authToken: string = 'PASTE_YOUR_TOKEN_HERE';
const repoName: string = 'testRepo';
const repoIsPrivate: boolean = true;

gitHubStore
    .getOrganizationReposList({
        organizationName: EXAMPLE_ORGANIZATION,
    })
    .then((result) => {
        console.log(result); // в консоли появится список репозиториев в ktsstudio
    });
gitHubStore
    .createRepoAuthUser({
        name: repoName,
        isPrivate: repoIsPrivate,
        authToken: authToken,
    })
    .then((result) => {
        console.log(result); // в консоли появятся параметры нового репозитория
    });
