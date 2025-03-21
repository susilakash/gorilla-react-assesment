import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from './Table';
import LoadingCircle from '../utils/LoadingCircle';


function UserTable() {

    const [allTaskCompUsers, setAllTaskCompUsers] = useState([])
    const [usersData, setUsersData] = useState([])
    const [errorMessages, setErrorMessages] = useState({ usersNotFound: '', apiError: '' })
    const [isAPILoading, setIsAPILoading] = useState({ tasksAPI: true, usersAPI: true })

    const validUsers = async () => {
        let tasksData = await axios.get('https://nextjs-boilerplate-five-plum-29.vercel.app/api/tasks')
            .then(res => {
                setIsAPILoading(prev => ({ ...prev, tasksAPI: false }))
                return res.data
            })
            .catch(err => {
                setIsAPILoading(prev => ({ ...prev, tasksAPI: false }))
                setErrorMessages(prev => ({ ...prev, apiError: 'Error on fetching Tasks Data' }))
                console.log(err)
            })

        let splittedUsers = {}
        tasksData?.forEach(item => {
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
                    .then(res => {
                        setIsAPILoading(prev => ({ ...prev, usersAPI: false }))
                        return res.data
                    })
                    .catch(err => {
                        setIsAPILoading(prev => ({ ...prev, usersAPI: false }))
                        setErrorMessages(prev => ({ ...prev, apiError: "Error on Fetching Users Data" }))
                        console.log(err)
                    })
            })
        )

        setUsersData(fetchAllData.filter(data => data !== undefined))
    }


    useEffect(() => {
        validUsers()
    }, [])

    useEffect(() => {
        if (allTaskCompUsers.length !== 0) fetchUsersData()
        else setErrorMessages(prev => ({ ...prev, usersNotFound: 'Users Not Found' }))
    }, [allTaskCompUsers])

    const apiErrorMessage = errorMessages.apiError ? errorMessages.apiError : usersData?.length > 0 || isAPILoading.usersAPI ? '' : errorMessages.usersNotFound

    return (
        <div className='users-container'>
            <h1 className='title'>stackblitz</h1>

            {isAPILoading.usersAPI && isAPILoading.tasksAPI ? <LoadingCircle /> :
                apiErrorMessage ? <h3>{apiErrorMessage}</h3> : usersData?.length > 0 && <Table usersData={usersData} />
            }
        </div>
    )


}
export default UserTable;