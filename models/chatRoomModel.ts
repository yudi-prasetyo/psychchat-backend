class ChatRoom {
    userId: string;
    psychologistId: string;

    /**
     * Creates a new User instance.
     * @param {string} userId - The unique identifier of the user.
     * @param {string} psychologistId - The unique identifier of the psychologist.
     */
    constructor(
        userId: string,
        psychologistId: string,
    ) {
        this.userId = userId;
        this.psychologistId = psychologistId;
    }
}

export default ChatRoom;