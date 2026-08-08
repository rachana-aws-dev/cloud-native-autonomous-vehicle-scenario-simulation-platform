import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function Register() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");

    const handleRegister = async (e) => {

        e.preventDefault();

        if (password !== confirmPassword) {

            setError("Passwords do not match");

            return;
        }

        try {

            await api.post("/auth/register", {

                username,
                email,
                password

            });

            alert("Registration Successful");

            navigate("/");

        }

        catch (err) {

            setError(
                err.response?.data?.detail ||
                "Registration Failed"
            );

        }

    };

    return (

        <div style={styles.container}>

            <div style={styles.card}>

                <h2 style={{textAlign:"center"}}>

                    Create Account

                </h2>

                <form onSubmit={handleRegister}>

                    <input
                        placeholder="Username"
                        value={username}
                        onChange={(e)=>setUsername(e.target.value)}
                        style={styles.input}
                    />

                    <input
                        placeholder="Email"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        style={styles.input}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        style={styles.input}
                    />

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e)=>setConfirmPassword(e.target.value)}
                        style={styles.input}
                    />

                    <button style={styles.button}>

                        Create Account

                    </button>

                </form>

                <br/>

                <button
                    style={styles.button}
                    onClick={()=>navigate("/")}
                >

                    Back To Login

                </button>

                <p
                    style={{
                        color:"red",
                        textAlign:"center"
                    }}
                >

                    {error}

                </p>

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

    input:{

        width:"100%",
        padding:"12px",
        marginBottom:"15px",
        boxSizing:"border-box"

    },

    button:{

        width:"100%",
        padding:"12px",
        cursor:"pointer"

    }

};

export default Register;