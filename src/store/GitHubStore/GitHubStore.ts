import ApiStore from "@apiStore";
import {IGitHubStore, RepoItem, GetOrganizationReposListParams, GetNewRepoParams} from "./types";
import {ApiResponse, HTTPMethod, RequestParams} from "../../shared/store/ApiStore/types";

const baseUrl:string = 'https://api.github.com/';

export default class GitHubStore implements IGitHubStore {
    private readonly apiStore = new ApiStore(baseUrl); // TODO: не забудьте передать baseUrl в конструктор

    // TODO: реализовать интерфейс IGitHubStore

    async getOrganizationReposList({organizationName}: GetOrganizationReposListParams): Promise<ApiResponse<RepoItem[],any>> {
        // TODO: Здесь сделайте вызов из this.apiStore и верните результат
        const params:RequestParams<{}> = {
            method: HTTPMethod.GET,
            endpoint: `orgs/${organizationName}/repos`,
            headers: {
                Accept: 'application/vnd.github.v3+json',
            },
            data: {},
        }
        return await this.apiStore.request(params)
        // Документация github: https://docs.github.com/en/rest/reference/repos#list-organization-repositories
    }

    async createRepoAuthUser({name, isPrivate, authToken}:GetNewRepoParams): Promise<any>{
        const params:RequestParams<{}> = {
            method: HTTPMethod.POST,
            endpoint: `user/repos`,
            headers: {
                Accept: 'application/vnd.github.v3+json',
                Authorization: `Bearer ${authToken}`
            },
            data: {
                "name" : `${name}`,
                "private" : `${isPrivate}`,
                "Authorization" : "token OAUTH-TOKEN"
            },
        }
        return await this.apiStore.request(params)
        // Документация github: https://docs.github.com/en/rest/reference/repos#create-a-repository-for-the-authenticated-user
    }

}
