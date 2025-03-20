import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UserTable() {

    const [allTaskCompUsers, setAllTaskCompUsers] = useState([])
    const [usersData, setUsersData] = useState([])

    const validUsers = async () => {
        const data = await axios.get('https://nextjs-boilerplate-five-plum-29.vercel.app/api/tasks')
            .then(res => res.data)
            .catch(err => console.log(err))

        let splittedUsers = {}
        data?.forEach(item => {
            if (splittedUsers[item.userId]) {
                splittedUsers[item.userId].push(item)
            } else {
                splittedUsers[item.userId] = [item]
            }
        })

        let allTasksCompletedUsers = Object.keys(splittedUsers).filter(keyValue => {
            return splittedUsers[keyValue].every(taskStatus => taskStatus.completed === true)
        })
        setAllTaskCompUsers(allTasksCompletedUsers)

    }

    const fetchUsersData = async () => {
        let fetchAllData = await Promise.all(
            allTaskCompUsers?.map(async (user) => {
                return await axios.get(`https://nextjs-boilerplate-five-plum-29.vercel.app/api/users/${user}`)
                    .then(res => res.data)
                    .catch(err => console.log(err))
            })
        )
        setUsersData(fetchAllData)
    }


    useEffect(() => {
        validUsers()
    }, [])

    useEffect(() => {
        if (allTaskCompUsers.length !== 0) fetchUsersData()
    }, [allTaskCompUsers])

    return (
        <div className='users-container'>
            <h1 className='title'>stackblitz</h1>
            <table className='user-table'>
                <tr>
                    <th>Name</th>
                    <th>User ID</th>
                    <th>Email</th>
                </tr>
                {usersData.map((user) => {
                    return (<tr>
                        <td>{user.name}</td>
                        <td>{user.id}</td>
                        <td>{user.email}</td>
                    </tr>)
                })}
            </table>
        </div>
    )


}
export default UserTable;