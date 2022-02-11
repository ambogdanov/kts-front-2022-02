// Перечисление методов HTTP-запроса
export enum HTTPMethod {
    GET='GET',
    POST='POST'
}

// Параметры запроса
export type RequestParams<ReqT> = {
    method: HTTPMethod; // Метод запроса, GET или POST
    endpoint: string; // API-endpoint, на который делается запрос
    headers: Record<string, string>; // Объект с передаваемыми HTTP-заголовками
    data: ReqT;
}

// Перечисление статусов ответа
export enum StatusHTTP {
    OK = 200,
    Created = 201,
    MultipleChoices = 300,
    BadRequest = 400,
    NotFound = 404,
    Unauthorized = 401,
    UnprocessableEntity = 422,
    InternalServerError = 500,
    InvalidSSLCertificate = 526,
}

// Ответ API
export type ApiResponse<SuccessT, ErrorT> =
    | {
    success: true;
    data: SuccessT;
    status: StatusHTTP;
}
    | {
    success: false;
    data: ErrorT | any;
    status: StatusHTTP;

};



// Интерфейс для класса, с помощью которого можно делать запросы к API
export interface IApiStore {
    // базовый url для выполнения запросов.
    readonly baseUrl: string;

    // Метод, с помощью которого делается запрос.
    request<SuccessT, ErrorT = any, ReqT = {}>(params: RequestParams<ReqT>): Promise<ApiResponse<SuccessT, ErrorT>>
}