import axios from "axios";
import { API_URL } from "../_env";

export const subscribe = (email:string) => {
    return axios.post(
        `${API_URL}/api/subscribe?email=${email}`
    );        
}

export const translate = (lang:string, arabic_text:string, english_text:string) => {
    return lang == 'en' ? english_text : arabic_text
}