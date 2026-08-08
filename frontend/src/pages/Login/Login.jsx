import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function Login() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {

    e.preventDefault();

    try {

        const response = await api.post(

            "/auth/login",

            {

                username,

                password

            }

        );

        localStorage.setItem(

            "username",

            response.data.username

        );

        navigate("/ScenarioManagement");

    }

    catch (err) {

        setError(

            err.response?.data?.detail ||

            "Login Failed"

        );

    }

};

    return (

        <div style={styles.container}>

            <div style={styles.card}>

                <h1 style={styles.title}>
                    Cloud Native Autonomous Vehicle
                </h1>

                <h2 style={styles.subtitle}>
                    Scenario Simulation Platform
                </h2>

                <h3 style={styles.loginHeading}>
                    Login
                </h3>

                <form onSubmit={handleLogin}>

                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e)=>setUsername(e.target.value)}
                        style={styles.input}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        style={styles.input}
                    />

                    <button style={styles.loginButton}>
                        Login
                    </button>

                </form>

                {

                    error &&

                    <p style={styles.error}>
                        {error}
                    </p>

                }

                <hr/>

                <p style={styles.text}>

                    Don't have an account?

                </p>

                <button
                    style={styles.registerButton}
                    onClick={()=>navigate("/register")}
                >

                    Register

                </button>

            </div>

        </div>

    );

}

const styles = {

    container:{

        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        height:"100vh",
        background:"#f3f4f6"

    },

    card:{

        background:"white",
        width:"430px",
        padding:"40px",
        borderRadius:"10px",
        boxShadow:"0px 4px 15px rgba(0,0,0,0.15)"

    },

    title:{

        textAlign:"center",
        marginBottom:"5px"

    },

    subtitle:{

        textAlign:"center",
        marginBottom:"30px"

    },

    loginHeading:{

        textAlign:"center",
        marginBottom:"20px"

    },

    input:{

        width:"100%",
        padding:"12px",
        marginBottom:"15px",
        fontSize:"16px",
        boxSizing:"border-box"

    },

    loginButton:{

        width:"100%",
        padding:"12px",
        fontSize:"16px",
        cursor:"pointer"

    },

    registerButton:{

        width:"100%",
        padding:"12px",
        fontSize:"16px",
        cursor:"pointer"

    },

    text:{

        textAlign:"center"

    },

    error:{

        color:"red",
        textAlign:"center"

    }

};

export default Login;