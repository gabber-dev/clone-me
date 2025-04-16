"use server"
import axios from "axios";

export const generateUserToken = async () => {

    const response = await axios.post('https://app.gabber.dev/api/v1/usage/token', {
        human_id: crypto.randomUUID(),
        ttl_seconds: 3600
    }, {
        headers: {
            'X-api-key': `${process.env.GABBER_API_KEY}`
        }
    })

  return response.data;
}