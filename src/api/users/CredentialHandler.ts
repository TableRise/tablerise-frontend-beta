import { AxiosError } from 'axios';
import AxiosInstance from 'src/api/users/AxiosInstance';
import { CredentialHandlerContract } from 'src/types/app/api/CredentialHandler';

export default async function CredentialHandler({ email, password }: CredentialHandlerContract) {
    try {
        return await AxiosInstance.post('/login', { email, password }, { withCredentials: true });
    } catch (error) {
        const err = error as  AxiosError;
        return { status: err.response?.status, data: '' };
    }
}
