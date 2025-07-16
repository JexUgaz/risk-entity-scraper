import bcrypt from "bcryptjs";

interface User {
    id: string;
    username: string;
    password: string;
}

const plainPasswords = {
    testuser: "123456",
    admin: "admin123",
};

let users: User[] = [];

export async function initializeUsers() {
    users = [];
    for (const [username, plainPassword] of Object.entries(plainPasswords)) {
        const hash = await bcrypt.hash(plainPassword, 10);
        users.push({
            id: (users.length + 1).toString(),
            username,
            password: hash,
        });
    }
}

export function getUsers(): User[] {
    return users;
}
