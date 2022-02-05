import {ApiResponse} from "../../shared/store/ApiStore/types";
/** Интерфейс класса для работы с GitHub API
 * названия getOrganizationReposList
 * (а также типов GetOrganizationReposListParams и RepoItem)
 * поменяйте в соответствии с выполняемым запросом.
 * Или не меняйте, если делаете запрос за списком репоизториев для организации)
 * Выберите любой запрос из публичного API GitHub.
 */
export type GetOrganizationReposListParams = {
    organizationName: string
}



export type RepoItem ={
    id: number,
    name: string,
    owner: {
        login:string,
        repos_url: string,
        organizations_url: string
        updated_at: string,
    }
}
export interface IGitHubStore {
    getOrganizationReposList(params: GetOrganizationReposListParams): Promise<ApiResponse<RepoItem[], any>>;
}
