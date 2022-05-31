import http from "../http-common";
import IResult from "../types/IResult";
import IUser from "../types/IUser";


const getAll = () => {
    return http.get<Array<IUser>>("/listUsers")
};

const get = (id: string) => {
    return http.get<IUser>(`/tutorials/${id}`)
}

const getContentAll = () => {
    return http.get<IResult>('/results');
}

const getContentAll2 = () => {
    return http.get<IResult>('/results2');
}

const getFileName = (name: string) => {
    return http.get<IResult>(`/file/:${name}`)
}



const  ContentService = {
    getAll,
    get,
    getContentAll,
    getContentAll2,
    getFileName
};

export default ContentService;
