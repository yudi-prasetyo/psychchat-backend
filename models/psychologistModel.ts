import { Roles } from "../helper/enums";

class Psychologist {
    userId: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    address: string | null;

    /**
     * Creates a new User instance.
     * @param {string} userId - The unique identifier of the user.
     * @param {string} email - The email address of the user.
     * @param {string} firstName - The first name of the user.
     * @param {string} lastName - The last name of the user.
     * @param {string} address - The address of the user.
     */
    constructor(
        userId: string,
        email: string,
        firstName: string | null = null,
        lastName: string | null = null,
        address: string | null = null,
    ) {
        this.userId = userId;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.address = address;
    }
}

export default Psychologist;