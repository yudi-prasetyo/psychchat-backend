import { Roles } from "../helper/enums";

class User {
    userId: string;
    role: Roles;

    /**
     * Creates a new post instance.
     * @param {string} userId - The user ID of the post.
     */
    constructor(
        userId: string,
        role: Roles,
    ) {
        this.userId = userId;
        this.role = role
    }
}

export default User;