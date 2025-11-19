import axios from "axios";

export const RunStatus = async (eventId: string) => {

    const result = await axios.get('/api/inngest-run-status?eventId=' + eventId)
    console.log(result.data)
    return result.data;
}