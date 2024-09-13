export type User = {
    user_id: number,
    email: string,
    password: string,
    firstname: string,
    lastname: string,
    role: number
}

export function isUser(obj: any) {
    return  typeof obj.user_id === 'number' &&
            typeof obj.email === 'string' &&
            typeof obj.password === 'string' &&
            typeof obj.firstname === 'string' &&
            typeof obj.lastname === 'string' &&
            typeof obj.role === 'number'
}