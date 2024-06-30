import { Roles } from "../helper/enums";

class ChatMessage {
    chatRoomId: string;
    message: string;
    postedBy: Roles.PSYCHOLOGIST | Roles.USER;
    userId: string;

    /**
     * Creates a new User instance.
     * @param {string} userId - The unique identifier of the user.
     * @param {string} psychologistId - The unique identifier of the psychologist.
     */
    constructor(
        chatRoomId: string,
        message: string,
        postedBy: Roles.PSYCHOLOGIST | Roles.USER = Roles.USER,
        userId: string,
    ) {
        this.chatRoomId = userId;
        this.message = message;
        this.postedBy = postedBy;
        this.userId = userId;
    }
}

export default ChatMessage;