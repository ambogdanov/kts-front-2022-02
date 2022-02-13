import {ApiResponse} from "@shared/store/ApiStore/types";
export type GetOrganizationReposListParams = {
    organizationName: string
}
export type GetNewRepoParams = {
    name:string,
    isPrivate: true,
    authToken: string
}

type Owner = {
    login:string,
    repos_url: string,
    html_url: string
    avatar_url: string,
}

export type RepoItem ={
    id: number,
    name: string,
    owner: Owner,
    updated_at: string,
    stargazers_count: number,
}

export type RepoDetails = {
    default_branch: string,
    full_name: string,
    html_url: string,
    name:string
    owner: Owner,

}
export interface IGitHubStore {
    getOrganizationReposList(params: GetOrganizationReposListParams): Promise<ApiResponse<RepoItem[], any>>;
    createRepoAuthUser(params:GetNewRepoParams):Promise<ApiResponse<RepoDetails, any>>;
}
