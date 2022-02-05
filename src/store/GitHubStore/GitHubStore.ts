import ApiStore from "../../shared/store/ApiStore";
import {IGitHubStore, RepoItem, GetOrganizationReposListParams} from "./types";
import {ApiResponse, HTTPMethod, RequestParams} from "../../shared/store/ApiStore/types";

const baseUrl:string = 'https://api.github.com/';

export default class GitHubStore implements IGitHubStore {
    private readonly apiStore = new ApiStore(baseUrl); // TODO: не забудьте передать baseUrl в конструктор

    // TODO: реализовать интерфейс IGitHubStore

    async getOrganizationReposList({organizationName}: GetOrganizationReposListParams): Promise<ApiResponse<RepoItem[],any>> {
        // TODO: Здесь сделайте вызов из this.apiStore и верните результат
        const params:RequestParams<{}> = {
            method: HTTPMethod.GET, // Метод запроса, GET или POST
            endpoint: `orgs/${organizationName}/repos`, // API-endpoint, на который делается запрос
            headers: {Accept: 'application/vnd.github.v3+json'}, // Объект с передаваемыми HTTP-заголовками
            data: {},
        }
        return await this.apiStore.request(params)
        // Документация github: https://docs.github.com/en/rest/reference/repos#list-organization-repositories
    }
}
