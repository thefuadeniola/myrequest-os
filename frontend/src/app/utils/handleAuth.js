import axios from "axios";

export const handleLogin = async() => {
    try {
        const { data } = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/user/login`, 
            { withCredentials: true }
        )
        if (data) {
            console.log(data)
            window.location.reload()
        }
    } catch (err) {
        setError(
            err.response?.data?.message || "Login failed. Please check your credentials and try again."
        );
        setLoading(false);
    }
}