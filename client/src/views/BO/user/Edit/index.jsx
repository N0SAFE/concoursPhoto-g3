import { useState, useEffect } from 'react';

export default function UserEdit() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch(new URL(import.meta.env.VITE_API_URL + "/api/users").href, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(res => res.json())
            .then(data => {
                if (data.code === 401) {
                    throw new Error(data.message)
                }
                setUsers(data);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    const handleEdit = (id) => {
        fetch(new URL(import.meta.env.VITE_API_URL + "/api/user/" + id).href, {
            method: "UPDATE",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(res => res.json())
            .then(data => {
                if (data.code === 401) {
                    throw new Error(data.message)
                }
                setUsers(data);
            })
            .catch(error => {
                    console.error(error);
                }
            );
    }

    return (
        <div>
            <h1>Editer</h1>
            <form>
                <label>
                    Email
                    <input name="email" type="email" placeholder="Email" />
                </label>
            </form>
        </div>
    )
}
