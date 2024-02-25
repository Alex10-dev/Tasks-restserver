import 'dotenv/config';
import { get } from 'env-var';

export const envs = {
    port: get('PORT').required().asPortNumber(),
    public_path: get('PUBLIC_PATH').default('public').asString(),
};