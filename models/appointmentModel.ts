class Appointment {
    userId: string;
    psychologistId: string;
    dateTime: Date;

    /**
     * Creates a new Appointment instance.
     * 
     * @param {string} userId - The unique identifier of the user.
     * @param {string} psychologistId - The unique identifier of the psychologist.
     * @param {Date} dateTime - The date and time of the appointment.
     */
    constructor(
        userId: string,
        psychologistId: string,
        dateTime: Date = new Date(),
    ) {
        this.userId = userId;
        this.psychologistId = psychologistId;
        this.dateTime = dateTime;
    }
}

export default Appointment;