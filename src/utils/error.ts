import {CustomError} from "../interfaces/error";

type generatedError = {
    statusCode: number;
    message: string;
    data?: any;
};

export const generateError = (error: generatedError) => {
    const newError: CustomError = new Error(error.message);
    newError.statusCode = error.statusCode;
    if (error.data) {
        newError.data = error.data;
    }
    throw error;
};